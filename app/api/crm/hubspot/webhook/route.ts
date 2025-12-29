/**
 * HubSpot Webhook Handler
 *
 * Receives and processes webhook events from HubSpot.
 * Handles contact and deal lifecycle events.
 *
 * Webhook URL: POST /api/crm/hubspot/webhook
 *
 * Required Headers:
 * - X-HubSpot-Signature-v3: HMAC signature for verification
 * - X-HubSpot-Request-Timestamp: Request timestamp
 */

import { NextRequest, NextResponse } from 'next/server'
import { isEventProcessed, markEventProcessed } from '@/lib/webhook-idempotency'
import {
  verifyWebhookSignature,
  verifyWebhookSignatureV2,
  parseWebhookEvents,
  getEventCategory,
  isCreationEvent,
  isDeletionEvent,
  isPropertyChangeEvent,
} from '@/lib/hubspot/webhook'
import { getHubSpotClient } from '@/lib/hubspot/client'
import {
  updateContactStatus,
  getContactSubmissionByEmail,
  updateOrderStatus,
  getOrderById,
} from '@/lib/db-queries'
import type { HubSpotWebhookEvent } from '@/lib/hubspot/types'

// Environment variables
const HUBSPOT_WEBHOOK_SECRET = process.env.HUBSPOT_WEBHOOK_SECRET
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET

/**
 * Handle incoming HubSpot webhook events
 */
export async function POST(request: NextRequest) {
  const body = await request.text()

  // Log for debugging (remove in production)
  console.log('[HubSpot Webhook] Received webhook request')

  // Get signature headers
  const signatureV3 = request.headers.get('x-hubspot-signature-v3')
  const signatureV2 = request.headers.get('x-hubspot-signature')
  const timestamp = request.headers.get('x-hubspot-request-timestamp')

  // Determine which secret to use
  const clientSecret = HUBSPOT_WEBHOOK_SECRET || HUBSPOT_CLIENT_SECRET

  // Verify signature if we have a secret configured
  if (clientSecret) {
    let isValid = false

    // Try v3 signature first (preferred)
    if (signatureV3 && timestamp) {
      const requestUri = new URL(request.url).pathname
      isValid = verifyWebhookSignature(
        'POST',
        requestUri,
        body,
        signatureV3,
        timestamp,
        clientSecret
      )
    }
    // Fall back to v2 signature
    else if (signatureV2) {
      isValid = verifyWebhookSignatureV2(body, signatureV2, clientSecret)
    }

    if (!isValid) {
      console.error('[HubSpot Webhook] Signature verification failed')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }
  } else {
    console.warn('[HubSpot Webhook] No webhook secret configured, skipping signature verification')
  }

  // Parse webhook events
  const events = parseWebhookEvents(body)

  if (events.length === 0) {
    console.warn('[HubSpot Webhook] No valid events in payload')
    return NextResponse.json({ received: true, processed: 0 })
  }

  console.log(`[HubSpot Webhook] Processing ${events.length} event(s)`)

  // Process each event
  const results = await Promise.all(
    events.map(event => processWebhookEvent(event))
  )

  const processed = results.filter(r => r.processed).length
  const skipped = results.filter(r => r.skipped).length
  const failed = results.filter(r => r.error).length

  console.log(`[HubSpot Webhook] Results: ${processed} processed, ${skipped} skipped, ${failed} failed`)

  return NextResponse.json({
    received: true,
    processed,
    skipped,
    failed,
  })
}

/**
 * Process a single webhook event
 */
async function processWebhookEvent(
  event: HubSpotWebhookEvent
): Promise<{ processed: boolean; skipped: boolean; error?: string }> {
  const eventId = `hubspot-${event.eventId}`

  // Check for duplicate processing
  const alreadyProcessed = await isEventProcessed(eventId, 'hubspot')
  if (alreadyProcessed) {
    console.log(`[HubSpot Webhook] Event ${event.eventId} already processed, skipping`)
    return { processed: false, skipped: true }
  }

  // Mark as processed before handling
  await markEventProcessed(eventId, 'hubspot')

  try {
    const category = getEventCategory(event.subscriptionType as any)

    switch (category) {
      case 'contact':
        await handleContactEvent(event)
        break
      case 'deal':
        await handleDealEvent(event)
        break
      default:
        console.log(`[HubSpot Webhook] Unknown event type: ${event.subscriptionType}`)
    }

    return { processed: true, skipped: false }
  } catch (error) {
    console.error(`[HubSpot Webhook] Error processing event ${event.eventId}:`, error)
    return {
      processed: false,
      skipped: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Handle contact-related webhook events
 */
async function handleContactEvent(event: HubSpotWebhookEvent): Promise<void> {
  const { subscriptionType, objectId, propertyName, propertyValue } = event

  console.log(`[HubSpot Webhook] Contact event: ${subscriptionType} for contact ${objectId}`)

  if (isCreationEvent(subscriptionType)) {
    // A new contact was created in HubSpot
    // You might want to sync this to your local database
    console.log(`[HubSpot Webhook] Contact created: ${objectId}`)
    // TODO: Implement local database sync if needed
  } else if (isDeletionEvent(subscriptionType)) {
    // A contact was deleted in HubSpot
    console.log(`[HubSpot Webhook] Contact deleted: ${objectId}`)
    // TODO: Handle deletion in local database if needed
  } else if (isPropertyChangeEvent(subscriptionType)) {
    // A contact property was changed
    console.log(
      `[HubSpot Webhook] Contact ${objectId} property changed: ${propertyName} = ${propertyValue}`
    )

    // Handle specific property changes
    if (propertyName === 'lifecyclestage') {
      console.log(`[HubSpot Webhook] Contact ${objectId} lifecycle stage changed to: ${propertyValue}`)
      // TODO: Update local contact status if needed
    }
  }
}

/**
 * Handle deal-related webhook events
 */
async function handleDealEvent(event: HubSpotWebhookEvent): Promise<void> {
  const { subscriptionType, objectId, propertyName, propertyValue } = event

  console.log(`[HubSpot Webhook] Deal event: ${subscriptionType} for deal ${objectId}`)

  if (isCreationEvent(subscriptionType)) {
    // A new deal was created in HubSpot
    console.log(`[HubSpot Webhook] Deal created: ${objectId}`)
    // TODO: Sync deal to local database if created manually in HubSpot
  } else if (isDeletionEvent(subscriptionType)) {
    // A deal was deleted in HubSpot
    console.log(`[HubSpot Webhook] Deal deleted: ${objectId}`)
    // TODO: Handle deletion in local database if needed
  } else if (isPropertyChangeEvent(subscriptionType)) {
    // A deal property was changed
    console.log(
      `[HubSpot Webhook] Deal ${objectId} property changed: ${propertyName} = ${propertyValue}`
    )

    // Handle specific property changes
    if (propertyName === 'dealstage') {
      console.log(`[HubSpot Webhook] Deal ${objectId} stage changed to: ${propertyValue}`)
      // TODO: Update local order status based on deal stage
    }
  }
}

// Route Segment Config for Next.js App Router
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
