/**
 * CORS configuration for API routes
 * Restricts origins to known domains instead of wildcard (*)
 */

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  'https://astartupbiz.com',
  'https://www.astartupbiz.com',
  'https://a-startup-biz.vercel.app',
  // Add partner domains as needed
].filter(Boolean) as string[]

// Development origins
if (process.env.NODE_ENV === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://127.0.0.1:3000')
}

/**
 * Get allowed origin for CORS header
 * Returns the request origin if allowed, or the primary domain
 */
export function getAllowedOrigin(requestOrigin: string | null): string {
  if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin
  }
  // Default to primary domain
  return process.env.NEXT_PUBLIC_APP_URL || 'https://astartupbiz.com'
}

/**
 * Standard CORS headers for API responses
 */
export function getCorsHeaders(requestOrigin: string | null, methods: string = 'GET, POST, OPTIONS') {
  return {
    'Access-Control-Allow-Origin': getAllowedOrigin(requestOrigin),
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  }
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin: string | null): boolean {
  return origin !== null && ALLOWED_ORIGINS.includes(origin)
}
