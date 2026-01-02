import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import {
  getPartnerByStripeAccountId,
  updatePartnerStripeStatus,
  updatePartnerPayoutStatus,
  updatePartnerTransferStatus,
  isConnectEventProcessed,
  logConnectEvent,
} from '@/lib/db-queries'
import { getAccountStatus } from '@/lib/stripe-connect'
import type { StripeAccountStatus } from '@/lib/types/stripe-connect'

const webhookSecret = process.env.STRIPE_CONNECT_WEBHOOK_SECRET

/**
 * POST /api/webhooks/stripe-connect
 *
 * Handle Stripe Connect webhook events
 */
export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature || !webhookSecret) {
    console.error('Missing signature or webhook secret for Connect webhook')
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Connect webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Check for duplicate event (idempotency)
  const alreadyProcessed = await isConnectEventProcessed(event.id)
  if (alreadyProcessed) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  // Get the connected account ID from the event
  const accountId = event.account

  try {
    switch (event.type) {
      // ============================================
      // ACCOUNT EVENTS
      // ============================================
      case 'account.updated': {
        const account = event.data.object as Stripe.Account

        if (!accountId) {
          break
        }

        // Determine account status
        let status: StripeAccountStatus = 'pending'

        if (!account.details_submitted) {
          status = 'pending'
        } else if (account.requirements?.disabled_reason) {
          status = 'disabled'
        } else if (
          account.requirements?.currently_due &&
          account.requirements.currently_due.length > 0
        ) {
          status = 'restricted'
        } else if (account.payouts_enabled && account.charges_enabled) {
          status = 'active'
        } else if (account.details_submitted) {
          status = 'restricted'
        }

        const onboardingComplete =
          account.details_submitted === true &&
          account.payouts_enabled === true &&
          (!account.requirements?.currently_due ||
            account.requirements.currently_due.length === 0)

        // Update partner record
        await updatePartnerStripeStatus(accountId, {
          status,
          payoutsEnabled: account.payouts_enabled || false,
          chargesEnabled: account.charges_enabled || false,
          detailsSubmitted: account.details_submitted || false,
          onboardingComplete,
        })

        // Get partner for logging
        const partner = await getPartnerByStripeAccountId(accountId)

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId,
          partnerId: partner?.id,
          eventData: {
            status,
            payoutsEnabled: account.payouts_enabled,
            chargesEnabled: account.charges_enabled,
            detailsSubmitted: account.details_submitted,
          },
          processed: true,
        })

        break
      }

      case 'account.application.deauthorized': {
        if (!accountId) break

        // Partner disconnected their Stripe account
        await updatePartnerStripeStatus(accountId, {
          status: 'disabled',
          payoutsEnabled: false,
          chargesEnabled: false,
          detailsSubmitted: false,
          onboardingComplete: false,
        })

        const partner = await getPartnerByStripeAccountId(accountId)
        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId,
          partnerId: partner?.id,
          eventData: { deauthorized: true },
          processed: true,
        })

        break
      }

      // ============================================
      // TRANSFER EVENTS
      // ============================================
      case 'transfer.created': {
        const transfer = event.data.object as Stripe.Transfer

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: {
            transferId: transfer.id,
            amount: transfer.amount,
            destination: transfer.destination,
          },
          processed: true,
        })

        break
      }

      case 'transfer.reversed': {
        const transfer = event.data.object as Stripe.Transfer

        await updatePartnerTransferStatus(transfer.id, 'reversed')

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: { transferId: transfer.id, reversed: true },
          processed: true,
        })

        break
      }

      // ============================================
      // PAYOUT EVENTS
      // ============================================
      case 'payout.created': {
        const payout = event.data.object as Stripe.Payout

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: {
            payoutId: payout.id,
            amount: payout.amount,
            status: payout.status,
          },
          processed: true,
        })

        break
      }

      case 'payout.updated': {
        const payout = event.data.object as Stripe.Payout

        // Map Stripe status to our status
        let status: 'pending' | 'in_transit' | 'paid' | 'failed' | 'canceled' =
          'pending'
        switch (payout.status) {
          case 'pending':
            status = 'pending'
            break
          case 'in_transit':
            status = 'in_transit'
            break
          case 'paid':
            status = 'paid'
            break
          case 'failed':
            status = 'failed'
            break
          case 'canceled':
            status = 'canceled'
            break
        }

        await updatePartnerPayoutStatus(payout.id, status, {
          arrivalDate: payout.arrival_date
            ? new Date(payout.arrival_date * 1000)
            : undefined,
        })

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: { payoutId: payout.id, status },
          processed: true,
        })

        break
      }

      case 'payout.paid': {
        const payout = event.data.object as Stripe.Payout

        await updatePartnerPayoutStatus(payout.id, 'paid', {
          destinationType:
            typeof payout.destination === 'object'
              ? payout.destination?.object
              : undefined,
          destinationLast4:
            typeof payout.destination === 'object' &&
            'last4' in (payout.destination || {})
              ? (payout.destination as any).last4
              : undefined,
        })

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: { payoutId: payout.id, paid: true },
          processed: true,
        })

        break
      }

      case 'payout.failed': {
        const payout = event.data.object as Stripe.Payout

        await updatePartnerPayoutStatus(payout.id, 'failed', {
          failureCode: payout.failure_code || undefined,
          failureMessage: payout.failure_message || undefined,
        })

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: {
            payoutId: payout.id,
            failureCode: payout.failure_code,
            failureMessage: payout.failure_message,
          },
          processed: true,
        })

        break
      }

      case 'payout.canceled': {
        const payout = event.data.object as Stripe.Payout

        await updatePartnerPayoutStatus(payout.id, 'canceled')

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: { payoutId: payout.id, canceled: true },
          processed: true,
        })

        break
      }

      // ============================================
      // CAPABILITY EVENTS
      // ============================================
      case 'capability.updated': {
        const capability = event.data.object as Stripe.Capability

        if (accountId && capability.status) {
          // Refresh full account status
          try {
            const accountStatus = await getAccountStatus(accountId)
            await updatePartnerStripeStatus(accountId, {
              status: accountStatus.status,
              payoutsEnabled: accountStatus.payoutsEnabled,
              chargesEnabled: accountStatus.chargesEnabled,
              detailsSubmitted: accountStatus.detailsSubmitted,
              onboardingComplete: accountStatus.onboardingComplete,
            })
          } catch (error) {
            console.error('Error refreshing account status:', error)
          }
        }

        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: {
            capability: capability.id,
            status: capability.status,
          },
          processed: true,
        })

        break
      }

      default:
        // Unhandled event type - log for record keeping
        await logConnectEvent({
          eventId: event.id,
          eventType: event.type,
          stripeAccountId: accountId || undefined,
          eventData: {},
          processed: true,
        })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Connect webhook processing error:', error)

    // Log the failed event
    try {
      await logConnectEvent({
        eventId: event.id,
        eventType: event.type,
        stripeAccountId: accountId || undefined,
        eventData: {},
        processed: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      })
    } catch {
      // Ignore logging errors
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
