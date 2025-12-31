function normalizeUrl(url: string): string {
  let value = url.trim()
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`
  return value.replace(/\/+$/, '')
}

/**
 * Returns the canonical public site URL.
 *
 * Prefers explicit env vars, falls back to Vercel-provided URL, then localhost.
 */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.SITE_URL ??
    process.env.APP_URL

  const fromVercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined

  return normalizeUrl(fromEnv ?? fromVercel ?? 'http://localhost:3000')
}

/**
 * Returns the request origin (scheme + host) as a normalized URL.
 *
 * Useful for building absolute redirect/payment URLs in server route handlers.
 */
export function getRequestOrigin(headers: Headers): string {
  const origin = headers.get('origin')
  if (origin) return normalizeUrl(origin)

  const host = headers.get('x-forwarded-host') ?? headers.get('host')
  const proto = headers.get('x-forwarded-proto') ?? 'https'

  if (host) return normalizeUrl(`${proto}://${host}`)

  return getSiteUrl()
}

