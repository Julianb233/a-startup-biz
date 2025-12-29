import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// In-memory fallback for development (when Redis not configured)
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

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
  console.warn('Failed to initialize Redis, using in-memory fallback')
}

// Rate limiters for different endpoints
export const rateLimiters = {
  // General API rate limit: 60 requests per minute
  api: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(60, '1m'),
        analytics: true,
        prefix: 'ratelimit:api',
      })
    : null,

  // Auth rate limit: 10 requests per minute
  auth: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1m'),
        analytics: true,
        prefix: 'ratelimit:auth',
      })
    : null,

  // Checkout rate limit: 5 requests per minute
  checkout: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '1m'),
        analytics: true,
        prefix: 'ratelimit:checkout',
      })
    : null,

  // Contact form: 3 requests per 10 minutes
  contact: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '10m'),
        analytics: true,
        prefix: 'ratelimit:contact',
      })
    : null,

  // Onboarding: 5 requests per 10 minutes
  onboarding: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '10m'),
        analytics: true,
        prefix: 'ratelimit:onboarding',
      })
    : null,

  // Email: 10 requests per hour
  email: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1h'),
        analytics: true,
        prefix: 'ratelimit:email',
      })
    : null,

  // PDF generation: 10 requests per 10 minutes (resource intensive)
  pdf: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10m'),
        analytics: true,
        prefix: 'ratelimit:pdf',
      })
    : null,

  // Quote creation: 20 requests per hour
  quote: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1h'),
        analytics: true,
        prefix: 'ratelimit:quote',
      })
    : null,

  // CRM operations: 20 requests per minute
  crm: redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1m'),
        analytics: true,
        prefix: 'ratelimit:crm',
      })
    : null,
}

// Clear in-memory store (for testing)
export function clearRateLimitStore(): void {
  inMemoryStore.clear()
}

// In-memory rate limiting for development
export function inMemoryRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const key = identifier
  const record = inMemoryStore.get(key)

  if (!record || now > record.resetAt) {
    inMemoryStore.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxRequests - 1, reset: now + windowMs }
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0, reset: record.resetAt }
  }

  record.count++
  return { success: true, remaining: maxRequests - record.count, reset: record.resetAt }
}

// Type definitions
type RateLimitType = keyof typeof rateLimiters

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const configs: Record<RateLimitType, RateLimitConfig> = {
  api: { maxRequests: 60, windowMs: 60000 },
  auth: { maxRequests: 10, windowMs: 60000 },
  checkout: { maxRequests: 5, windowMs: 60000 },
  contact: { maxRequests: 3, windowMs: 600000 },
  onboarding: { maxRequests: 5, windowMs: 600000 },
  email: { maxRequests: 10, windowMs: 3600000 }, // 10 per hour
  pdf: { maxRequests: 10, windowMs: 600000 }, // 10 per 10 minutes
  quote: { maxRequests: 20, windowMs: 3600000 }, // 20 per hour
  crm: { maxRequests: 20, windowMs: 60000 }, // 20 per minute
}

// Get client IP from request
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  const realIp = headersList.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'unknown'
}

// Main rate limiting function
export async function rateLimit(
  type: RateLimitType = 'api',
  identifier?: string
): Promise<{
  success: boolean
  remaining: number
  reset: number
  error?: string
}> {
  const ip = identifier || await getClientIp()
  const key = `${type}:${ip}`

  const limiter = rateLimiters[type]

  if (limiter) {
    // Use Upstash rate limiter
    try {
      const result = await limiter.limit(key)
      return {
        success: result.success,
        remaining: result.remaining,
        reset: result.reset,
      }
    } catch (error) {
      console.error('Rate limit check failed:', error)
      // Fall back to in-memory on error
    }
  }

  // Fall back to in-memory rate limiting
  const config = configs[type]
  return inMemoryRateLimit(key, config.maxRequests, config.windowMs)
}

// Middleware helper for rate limiting
export async function withRateLimit(
  request: NextRequest,
  type: RateLimitType = 'api'
): Promise<NextResponse | null> {
  const result = await rateLimit(type)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          'X-RateLimit-Limit': configs[type].maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.reset.toString(),
        },
      }
    )
  }

  // Return null to indicate request should proceed
  return null
}

// Utility to add rate limit headers to response
export function addRateLimitHeaders(
  response: NextResponse,
  type: RateLimitType,
  remaining: number,
  reset: number
): NextResponse {
  response.headers.set('X-RateLimit-Limit', configs[type].maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())
  return response
}
