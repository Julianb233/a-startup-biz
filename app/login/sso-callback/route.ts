import { NextRequest, NextResponse } from 'next/server'

/**
 * SSO Callback Redirect Handler
 *
 * This route handles old Clerk SSO callback URLs that may still be cached
 * or bookmarked. Since we migrated from Clerk to Supabase, these URLs
 * no longer have a corresponding handler.
 *
 * This redirects users to the login page with the proper redirect param.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  // Extract redirect URL from Clerk-style params
  const redirectTo = searchParams.get('after_sign_in_url') ||
                     searchParams.get('sign_in_force_redirect_url') ||
                     searchParams.get('redirect_url') ||
                     '/dashboard'

  // Parse the redirect URL to get just the pathname (avoid external redirects)
  let redirectPath = '/dashboard'
  try {
    const redirectUrl = new URL(redirectTo)
    // Only use the pathname if it's from our domain
    if (redirectUrl.hostname === 'astartupbiz.com' ||
        redirectUrl.hostname === 'localhost' ||
        redirectUrl.hostname.endsWith('.vercel.app')) {
      redirectPath = redirectUrl.pathname
    }
  } catch {
    // If it's already a relative path, use it directly
    if (redirectTo.startsWith('/')) {
      redirectPath = redirectTo
    }
  }

  // Redirect to login page with proper redirect param
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('redirectTo', redirectPath)

  return NextResponse.redirect(loginUrl)
}
