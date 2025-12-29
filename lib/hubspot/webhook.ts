/**
 * HubSpot Webhook Signature Verification
 *
 * Verifies incoming webhooks from HubSpot using their signature scheme.
 * HubSpot uses a client secret and request body to generate signatures.
 */

import crypto from 'crypto'
import type { HubSpotWebhookEvent, HubSpotWebhookSubscriptionType } from './types'

/**
 * Verify HubSpot webhook signature (v3)
 *
 * HubSpot V3 signature verification:
 * 1. Concatenate: requestMethod + requestUri + requestBody + timestamp
 * 2. Create HMAC-SHA256 hash with client secret
 * 3. Compare with X-HubSpot-Signature-v3 header
 */
export function verifyWebhookSignature(
  requestMethod: string,
  requestUri: string,
  requestBody: string,
  signatureHeader: string | null,
  timestampHeader: string | null,
  clientSecret: string
): boolean {
  if (!signatureHeader || !timestampHeader) {
    console.error('[HubSpot Webhook] Missing signature or timestamp header')
    return false
  }

  // Check timestamp to prevent replay attacks (5 minute window)
  const timestamp = parseInt(timestampHeader, 10)
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000

  if (isNaN(timestamp) || Math.abs(now - timestamp) > fiveMinutes) {
    console.error('[HubSpot Webhook] Timestamp outside acceptable window')
    return false
  }

  // Create signature payload
  const signaturePayload = `${requestMethod}${requestUri}${requestBody}${timestampHeader}`

  // Generate HMAC-SHA256
  const expectedSignature = crypto
    .createHmac('sha256', clientSecret)
    .update(signaturePayload)
    .digest('base64')

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

/**
 * Verify HubSpot webhook signature (v2 - legacy)
 *
 * Uses only request body and client secret
 */
export function verifyWebhookSignatureV2(
  requestBody: string,
  signatureHeader: string | null,
  clientSecret: string
): boolean {
  if (!signatureHeader) {
    console.error('[HubSpot Webhook] Missing signature header')
    return false
  }

  const expectedSignature = crypto
    .createHmac('sha256', clientSecret)
    .update(requestBody)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHeader),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

/**
 * Parse and validate webhook events
 */
export function parseWebhookEvents(body: string): HubSpotWebhookEvent[] {
  try {
    const parsed = JSON.parse(body)

    // HubSpot sends events as an array
    if (!Array.isArray(parsed)) {
      return [parsed]
    }

    return parsed
  } catch (error) {
    console.error('[HubSpot Webhook] Failed to parse webhook body:', error)
    return []
  }
}

/**
 * Get subscription type category
 */
export function getEventCategory(
  subscriptionType: HubSpotWebhookSubscriptionType
): 'contact' | 'deal' | 'unknown' {
  if (subscriptionType.startsWith('contact.')) {
    return 'contact'
  }
  if (subscriptionType.startsWith('deal.')) {
    return 'deal'
  }
  return 'unknown'
}

/**
 * Check if event is a creation event
 */
export function isCreationEvent(subscriptionType: string): boolean {
  return subscriptionType.endsWith('.creation')
}

/**
 * Check if event is a deletion event
 */
export function isDeletionEvent(subscriptionType: string): boolean {
  return subscriptionType.endsWith('.deletion')
}

/**
 * Check if event is a property change event
 */
export function isPropertyChangeEvent(subscriptionType: string): boolean {
  return subscriptionType.endsWith('.propertyChange')
}
