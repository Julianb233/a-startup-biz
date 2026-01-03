import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected route patterns
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/partner-portal',
]

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key)
}

export async function middleware(req: NextRequest) {
  // CRITICAL: Handle legacy Clerk SSO callback URLs
  // This runs at edge BEFORE cached 404 responses are served
  // Cache-bust timestamp: 2026-01-03T09:00:00Z
  if (req.nextUrl.pathname === '/login/sso-callback' ||
      req.nextUrl.pathname === '/login/sso-callback/') {
    const { searchParams } = req.nextUrl

    // Extract redirect from Clerk-style params
    const redirectTo = searchParams.get('after_sign_in_url') ||
                       searchParams.get('sign_in_force_redirect_url') ||
                       searchParams.get('redirect_url') ||
                       '/dashboard'

    // Parse and validate redirect path
    let redirectPath = '/dashboard'
    try {
      const redirectUrl = new URL(redirectTo)
      if (redirectUrl.hostname === 'astartupbiz.com' ||
          redirectUrl.hostname === 'localhost' ||
          redirectUrl.hostname.endsWith('.vercel.app')) {
        redirectPath = redirectUrl.pathname
      }
    } catch {
      if (redirectTo.startsWith('/')) {
        redirectPath = redirectTo
      }
    }

    // Redirect to login with the redirect param
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirectTo', redirectPath)
    loginUrl.searchParams.set('from', 'sso')

    const response = NextResponse.redirect(loginUrl, 307)
    response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('CDN-Cache-Control', 'private, no-store')
    response.headers.set('Vercel-CDN-Cache-Control', 'private, no-store, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  }

  const res = NextResponse.next()

  // Check if route is protected
  const isProtected = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  )

  // Only run auth/session checks on protected routes.
  // This prevents Supabase/network issues from impacting the entire public site.
  if (!isProtected) {
    return res
  }

  // If Supabase is not configured, redirect protected routes to login
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Create Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  let session: unknown = null
  try {
    // Refresh session if expired
    const { data } = await supabase.auth.getSession()
    session = data?.session ?? null
  } catch {
    // Fail closed for protected routes: if Supabase is unavailable, require login.
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect to login if trying to access protected route without session
  if (!session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    // Only protect authenticated areas (avoids running Supabase session checks site-wide)
    "/dashboard/:path*",
    "/admin/:path*",
    "/partner-portal/:path*",
    // Legacy Clerk SSO callback - must be in matcher for middleware to intercept cached 404
    "/login/sso-callback",
    "/login/sso-callback/",
  ],
}
