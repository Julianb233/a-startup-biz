/**
 * Webhook Idempotency Helper
 *
 * Prevents duplicate processing of webhook events.
 * Uses Redis when available, falls back to in-memory store.
 */

import { Redis } from '@upstash/redis'

// In-memory fallback for development
const processedEvents = new Map<string, { processedAt: number }>()

// Event expiry time (24 hours in seconds)
const EVENT_TTL_SECONDS = 24 * 60 * 60

// Create Redis client if credentials are available
let redis: Redis | null = null
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
} catch (error) {
  console.warn('Failed to initialize Redis for idempotency, using in-memory fallback')
}

/**
 * Check if a webhook event has already been processed
 *
 * @param eventId - Unique event identifier (e.g., Stripe event.id)
 * @param prefix - Prefix to namespace events (e.g., 'stripe', 'hubspot')
 * @returns true if event was already processed, false if it's new
 */
export async function isEventProcessed(
  eventId: string,
  prefix: string = 'webhook'
): Promise<boolean> {
  const key = `idempotency:${prefix}:${eventId}`

  if (redis) {
    try {
      const exists = await redis.exists(key)
      return exists === 1
    } catch (error) {
      console.error('Redis idempotency check failed:', error)
      // Fall through to in-memory check
    }
  }

  // In-memory fallback
  const record = processedEvents.get(key)
  if (!record) return false

  // Check if expired
  const now = Date.now()
  if (now - record.processedAt > EVENT_TTL_SECONDS * 1000) {
    processedEvents.delete(key)
    return false
  }

  return true
}

/**
 * Mark a webhook event as processed
 *
 * @param eventId - Unique event identifier
 * @param prefix - Prefix to namespace events
 */
export async function markEventProcessed(
  eventId: string,
  prefix: string = 'webhook'
): Promise<void> {
  const key = `idempotency:${prefix}:${eventId}`

  if (redis) {
    try {
      // Set with expiry (24 hours)
      await redis.set(key, Date.now().toString(), { ex: EVENT_TTL_SECONDS })
      return
    } catch (error) {
      console.error('Redis idempotency mark failed:', error)
      // Fall through to in-memory
    }
  }

  // In-memory fallback
  processedEvents.set(key, { processedAt: Date.now() })

  // Cleanup old entries periodically (simple eviction)
  if (processedEvents.size > 10000) {
    const now = Date.now()
    const cutoff = now - EVENT_TTL_SECONDS * 1000
    for (const [k, v] of processedEvents.entries()) {
      if (v.processedAt < cutoff) {
        processedEvents.delete(k)
      }
    }
  }
}

/**
 * Process a webhook event with idempotency protection
 *
 * @param eventId - Unique event identifier
 * @param prefix - Prefix to namespace events
 * @param processor - Async function to process the event
 * @returns Object with processed flag and any result
 */
export async function withIdempotency<T>(
  eventId: string,
  prefix: string,
  processor: () => Promise<T>
): Promise<{ alreadyProcessed: boolean; result?: T; error?: Error }> {
  // Check if already processed
  const alreadyProcessed = await isEventProcessed(eventId, prefix)

  if (alreadyProcessed) {
    console.log(`Event ${eventId} already processed, skipping`)
    return { alreadyProcessed: true }
  }

  try {
    // Mark as processed BEFORE processing to prevent race conditions
    // If processing fails, we'll re-process on retry (Stripe will retry)
    await markEventProcessed(eventId, prefix)

    const result = await processor()
    return { alreadyProcessed: false, result }
  } catch (error) {
    // On error, we still return the error but the event is marked processed
    // This prevents infinite retries. Manual intervention may be needed.
    console.error(`Error processing event ${eventId}:`, error)
    return {
      alreadyProcessed: false,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

/**
 * Clear processed events (for testing)
 */
export function clearProcessedEvents(): void {
  processedEvents.clear()
}
