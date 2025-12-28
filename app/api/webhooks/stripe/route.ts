import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe, formatAmountFromStripe } from '@/lib/stripe'
import { createOrder, getUserByEmail, createUser } from '@/lib/db-queries'
import { sendEmail, orderConfirmationEmail, adminNewOrderEmail, ADMIN_EMAIL } from '@/lib/email'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

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

// Disable body parsing for webhook (we need raw body for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
}
