/**
 * HubSpot Retry Logic
 *
 * Implements exponential backoff retry for HubSpot API calls.
 * Handles rate limiting and transient errors.
 */

import { parseHubSpotError } from './client'

export interface RetryConfig {
  maxRetries: number
  initialDelayMs: number
  maxDelayMs: number
  backoffMultiplier: number
  retryableStatuses: number[]
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableStatuses: [429, 500, 502, 503, 504],
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(
  attempt: number,
  config: RetryConfig,
  retryAfterMs?: number
): number {
  // If we have a retry-after header, use it
  if (retryAfterMs) {
    return Math.min(retryAfterMs, config.maxDelayMs)
  }

  // Exponential backoff with jitter
  const exponentialDelay = config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt)
  const jitter = Math.random() * 0.3 * exponentialDelay // 0-30% jitter
  const delay = exponentialDelay + jitter

  return Math.min(delay, config.maxDelayMs)
}

/**
 * Extract retry-after value from error response
 */
function getRetryAfterMs(error: unknown): number | undefined {
  if (error && typeof error === 'object') {
    const err = error as any

    // Check for Retry-After header (in seconds or HTTP date)
    const retryAfter = err.response?.headers?.['retry-after']
    if (retryAfter) {
      const seconds = parseInt(retryAfter, 10)
      if (!isNaN(seconds)) {
        return seconds * 1000
      }
      // Try parsing as HTTP date
      const date = Date.parse(retryAfter)
      if (!isNaN(date)) {
        return Math.max(0, date - Date.now())
      }
    }

    // Check HubSpot-specific rate limit headers
    const rateLimitRemaining = err.response?.headers?.['x-hubspot-ratelimit-remaining']
    if (rateLimitRemaining === '0') {
      const intervalMs = err.response?.headers?.['x-hubspot-ratelimit-interval-milliseconds']
      if (intervalMs) {
        return parseInt(intervalMs, 10)
      }
    }
  }

  return undefined
}

/**
 * Check if an error is retryable
 */
function isRetryable(error: unknown, config: RetryConfig): boolean {
  const parsed = parseHubSpotError(error)
  return config.retryableStatuses.includes(parsed.status)
}

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const fullConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }

  let lastError: unknown

  for (let attempt = 0; attempt <= fullConfig.maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      const parsed = parseHubSpotError(error)

      // Don't retry non-retryable errors
      if (!isRetryable(error, fullConfig)) {
        console.error(`[HubSpot] ${operationName} failed (non-retryable):`, parsed)
        throw error
      }

      // Don't retry if we've exhausted attempts
      if (attempt >= fullConfig.maxRetries) {
        console.error(
          `[HubSpot] ${operationName} failed after ${fullConfig.maxRetries + 1} attempts:`,
          parsed
        )
        throw error
      }

      // Calculate delay and wait
      const retryAfterMs = getRetryAfterMs(error)
      const delay = calculateDelay(attempt, fullConfig, retryAfterMs)

      console.warn(
        `[HubSpot] ${operationName} failed (attempt ${attempt + 1}/${fullConfig.maxRetries + 1}), ` +
        `retrying in ${Math.round(delay)}ms:`,
        parsed.message
      )

      await sleep(delay)
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError
}

/**
 * Batch operations with rate limit awareness
 */
export async function withRateLimitAwareness<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  options: {
    batchSize?: number
    delayBetweenBatches?: number
    onProgress?: (completed: number, total: number) => void
  } = {}
): Promise<R[]> {
  const { batchSize = 10, delayBetweenBatches = 100, onProgress } = options
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)

    // Process batch in parallel
    const batchResults = await Promise.all(
      batch.map(item => operation(item))
    )
    results.push(...batchResults)

    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + batchSize, items.length), items.length)
    }

    // Delay between batches to respect rate limits
    if (i + batchSize < items.length) {
      await sleep(delayBetweenBatches)
    }
  }

  return results
}
