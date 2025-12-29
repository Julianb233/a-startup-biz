import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe, formatAmountFromStripe } from '@/lib/stripe'
import {
  createOrder,
  getUserByEmail,
  createUser,
  getPartnerByStripeAccountId,
  updatePartnerStripeStatus,
  updatePartnerTransferStatus,
  updatePartnerPayoutStatus,
  isConnectEventProcessed,
  logConnectEvent,
} from '@/lib/db-queries'
import { sendEmail, orderConfirmationEmail, adminNewOrderEmail, ADMIN_EMAIL } from '@/lib/email'
import { isEventProcessed, markEventProcessed } from '@/lib/webhook-idempotency'
import type { StripeAccountStatus } from '@/lib/types/stripe-connect'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
const connectWebhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature || !webhookSecret) {
    console.error('Missing signature or webhook secret')
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // SECURITY: Check for duplicate events (idempotency)
  const alreadyProcessed = await isEventProcessed(event.id, 'stripe')
  if (alreadyProcessed) {
    console.log(`Stripe event ${event.id} already processed, acknowledging`)
    return NextResponse.json({ received: true, duplicate: true })
  }

  // Mark event as processed before handling to prevent race conditions
  await markEventProcessed(event.id, 'stripe')

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Extract data from session
        const customerEmail = session.customer_details?.email
        const customerName = session.customer_details?.name
        const customerPhone = session.customer_details?.phone
        const amountTotal = session.amount_total ? formatAmountFromStripe(session.amount_total) : 0
        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id

        // Get items from metadata
        let items: Array<{ slug: string; name: string; price: number; quantity: number }> = []
        if (session.metadata?.items) {
          try {
            items = JSON.parse(session.metadata.items)
          } catch {
            console.log('Could not parse items from metadata')
          }
        }

        // Get or create user
        let userId: string | null = null
        if (customerEmail) {
          const existingUser = await getUserByEmail(customerEmail)
          if (existingUser) {
            userId = existingUser.id
          } else {
            // Create new user
            const newUser = await createUser({
              email: customerEmail,
              name: customerName || undefined,
            })
            userId = newUser?.id || null
          }
        }

        // Create order in database
        const order = await createOrder({
          userId: userId || undefined,
          items: items.length > 0 ? items : [{
            name: 'Order',
            price: amountTotal,
            quantity: 1
          }],
          subtotal: amountTotal,
          total: amountTotal,
          paymentIntentId: paymentIntentId,
          paymentMethod: session.payment_method_types?.[0] || 'card',
          status: 'paid',
          customerEmail,
          customerName,
          customerPhone,
        })

        console.log(`Order created for ${customerEmail}, total: $${amountTotal}`)

        // Send order confirmation email
        if (customerEmail && order) {
          const emailContent = orderConfirmationEmail({
            customerName: customerName || 'Valued Customer',
            orderId: order.id,
            items: items.length > 0 ? items : [{ name: 'Order', price: amountTotal, quantity: 1 }],
            total: amountTotal,
          })

          await sendEmail({
            to: customerEmail,
            subject: emailContent.subject,
            html: emailContent.html,
          })

          console.log(`Confirmation email sent to ${customerEmail}`)

          // Send admin notification
          try {
            const adminEmailContent = adminNewOrderEmail({
              orderId: order.id,
              customerName: customerName || 'Unknown Customer',
              customerEmail: customerEmail,
              customerPhone: customerPhone || undefined,
              items: items.length > 0 ? items : [{ name: 'Order', price: amountTotal, quantity: 1 }],
              total: amountTotal,
            })

            await sendEmail({
              to: ADMIN_EMAIL,
              subject: adminEmailContent.subject,
              html: adminEmailContent.html,
              replyTo: customerEmail,
            })

            console.log(`Admin notification sent for order ${order.id}`)
          } catch (adminEmailError) {
            console.error('Failed to send admin order notification:', adminEmailError)
          }
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent ${paymentIntent.id} failed: ${paymentIntent.last_payment_error?.message}`)
        break
      }

      // ============================================
      // STRIPE CONNECT EVENTS
      // ============================================

      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        console.log(`Processing account.updated for ${account.id}`)

        // Check idempotency for Connect events
        const alreadyProcessedConnect = await isConnectEventProcessed(event.id)
        if (alreadyProcessedConnect) {
          console.log(`Connect event ${event.id} already processed`)
          break
        }

        try {
          // Find partner by Stripe account ID
          const partner = await getPartnerByStripeAccountId(account.id)

          if (partner) {
            // Determine account status
            let status: StripeAccountStatus = 'pending'

            if (!account.details_submitted) {
              status = 'pending'
            } else if (account.charges_enabled && account.payouts_enabled) {
              status = 'active'
            } else if (account.requirements?.disabled_reason) {
              status = 'disabled'
            } else if (account.requirements?.currently_due && account.requirements.currently_due.length > 0) {
              status = 'restricted'
            } else {
              status = 'pending'
            }

            // Update partner Stripe status
            await updatePartnerStripeStatus(account.id, {
              status,
              payoutsEnabled: account.payouts_enabled || false,
              chargesEnabled: account.charges_enabled || false,
              detailsSubmitted: account.details_submitted || false,
              onboardingComplete: account.details_submitted && account.payouts_enabled ? true : false,
            })

            // Log the event
            await logConnectEvent({
              eventId: event.id,
              eventType: event.type,
              stripeAccountId: account.id,
              partnerId: partner.id,
              eventData: {
                status,
                payoutsEnabled: account.payouts_enabled,
                chargesEnabled: account.charges_enabled,
                detailsSubmitted: account.details_submitted,
              },
              processed: true,
            })

            console.log(`Updated partner ${partner.id} Stripe status to ${status}`)
          } else {
            console.log(`No partner found for Stripe account ${account.id}`)
            await logConnectEvent({
              eventId: event.id,
              eventType: event.type,
              stripeAccountId: account.id,
              eventData: { accountId: account.id },
              processed: true,
              errorMessage: 'Partner not found',
            })
          }
        } catch (error) {
          console.error('Error processing account.updated:', error)
          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            stripeAccountId: account.id,
            eventData: { accountId: account.id },
            processed: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          throw error
        }
        break
      }

      case 'account.application.deauthorized': {
        const application = event.data.object as any // Stripe.Application doesn't expose account property directly
        const accountId = event.account // Account ID is in the event.account field for connected account events
        console.log(`Processing account.application.deauthorized for ${accountId}`)

        const alreadyProcessedConnect = await isConnectEventProcessed(event.id)
        if (alreadyProcessedConnect) {
          console.log(`Connect event ${event.id} already processed`)
          break
        }

        try {
          if (accountId) {
            const partner = await getPartnerByStripeAccountId(accountId)

            if (partner) {
              // Mark account as disabled
              await updatePartnerStripeStatus(accountId, {
                status: 'disabled',
                payoutsEnabled: false,
                chargesEnabled: false,
                detailsSubmitted: false,
                onboardingComplete: false,
              })

              await logConnectEvent({
                eventId: event.id,
                eventType: event.type,
                stripeAccountId: accountId,
                partnerId: partner.id,
                eventData: { deauthorized: true },
                processed: true,
              })

              console.log(`Deauthorized Stripe account for partner ${partner.id}`)
            }
          }
        } catch (error) {
          console.error('Error processing account.application.deauthorized:', error)
          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            stripeAccountId: accountId || undefined,
            eventData: { accountId },
            processed: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          throw error
        }
        break
      }

      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer
        console.log(`Processing transfer.created: ${transfer.id}`)

        const alreadyProcessedConnect = await isConnectEventProcessed(event.id)
        if (alreadyProcessedConnect) {
          console.log(`Connect event ${event.id} already processed`)
          break
        }

        try {
          // Transfer status is initially 'pending' or 'paid'
          const status = transfer.reversed ? 'reversed' : 'paid'

          await updatePartnerTransferStatus(transfer.id, status)

          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: {
              transferId: transfer.id,
              amount: transfer.amount,
              status,
              destination: transfer.destination,
            },
            processed: true,
          })

          console.log(`Transfer ${transfer.id} created with status ${status}`)
        } catch (error) {
          console.error('Error processing transfer.created:', error)
          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: { transferId: transfer.id },
            processed: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          // Don't throw - transfer might not be in our DB yet
        }
        break
      }

      case 'transfer.updated': {
        const transfer = event.data.object as Stripe.Transfer
        console.log(`Processing transfer.updated: ${transfer.id}`)

        const alreadyProcessedConnect = await isConnectEventProcessed(event.id)
        if (alreadyProcessedConnect) {
          console.log(`Connect event ${event.id} already processed`)
          break
        }

        try {
          // Determine status from transfer state
          let status: 'pending' | 'processing' | 'paid' | 'failed' | 'reversed' = 'pending'

          if (transfer.reversed) {
            status = 'reversed'
          } else {
            // Transfers are typically 'paid' immediately in Stripe
            status = 'paid'
          }

          await updatePartnerTransferStatus(transfer.id, status)

          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: {
              transferId: transfer.id,
              amount: transfer.amount,
              status,
              reversed: transfer.reversed,
            },
            processed: true,
          })

          console.log(`Transfer ${transfer.id} updated to status ${status}`)
        } catch (error) {
          console.error('Error processing transfer.updated:', error)
          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: { transferId: transfer.id },
            processed: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          // Don't throw
        }
        break
      }

      case 'payout.created': {
        const payout = event.data.object as Stripe.Payout
        console.log(`Processing payout.created: ${payout.id}`)

        const alreadyProcessedConnect = await isConnectEventProcessed(event.id)
        if (alreadyProcessedConnect) {
          console.log(`Connect event ${event.id} already processed`)
          break
        }

        try {
          // Payout starts as 'pending' or 'in_transit'
          const status = payout.status === 'in_transit' ? 'in_transit' : 'pending'
          const arrivalDate = payout.arrival_date ? new Date(payout.arrival_date * 1000) : undefined

          await updatePartnerPayoutStatus(payout.id, status, {
            arrivalDate,
            destinationType: payout.destination ? 'bank_account' : undefined,
          })

          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: {
              payoutId: payout.id,
              amount: payout.amount,
              status: payout.status,
              arrivalDate: arrivalDate?.toISOString(),
            },
            processed: true,
          })

          console.log(`Payout ${payout.id} created with status ${status}`)
        } catch (error) {
          console.error('Error processing payout.created:', error)
          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: { payoutId: payout.id },
            processed: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          // Don't throw
        }
        break
      }

      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout
        console.log(`Processing payout.paid: ${payout.id}`)

        const alreadyProcessedConnect = await isConnectEventProcessed(event.id)
        if (alreadyProcessedConnect) {
          console.log(`Connect event ${event.id} already processed`)
          break
        }

        try {
          const arrivalDate = payout.arrival_date ? new Date(payout.arrival_date * 1000) : undefined

          await updatePartnerPayoutStatus(payout.id, 'paid', {
            arrivalDate,
          })

          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: {
              payoutId: payout.id,
              amount: payout.amount,
              status: payout.status,
              arrivalDate: arrivalDate?.toISOString(),
            },
            processed: true,
          })

          console.log(`Payout ${payout.id} marked as paid`)
        } catch (error) {
          console.error('Error processing payout.paid:', error)
          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: { payoutId: payout.id },
            processed: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          // Don't throw
        }
        break
      }

      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout
        console.log(`Processing payout.failed: ${payout.id}`)

        const alreadyProcessedConnect = await isConnectEventProcessed(event.id)
        if (alreadyProcessedConnect) {
          console.log(`Connect event ${event.id} already processed`)
          break
        }

        try {
          await updatePartnerPayoutStatus(payout.id, 'failed', {
            failureCode: payout.failure_code || undefined,
            failureMessage: payout.failure_message || undefined,
          })

          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: {
              payoutId: payout.id,
              amount: payout.amount,
              status: payout.status,
              failureCode: payout.failure_code,
              failureMessage: payout.failure_message,
            },
            processed: true,
          })

          console.log(`Payout ${payout.id} failed: ${payout.failure_message}`)
        } catch (error) {
          console.error('Error processing payout.failed:', error)
          await logConnectEvent({
            eventId: event.id,
            eventType: event.type,
            eventData: { payoutId: payout.id },
            processed: false,
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          // Don't throw
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// App Router uses request.text() for raw body - no config needed
// Route Segment Config for Next.js App Router
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
