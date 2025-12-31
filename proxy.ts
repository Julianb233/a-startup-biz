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

export async function proxy(req: NextRequest) {
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
  ],
}

