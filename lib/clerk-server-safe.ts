/**
 * Safe Clerk Server-Side Utilities
 *
 * These utilities wrap Clerk's server-side functions to handle
 * the case when Clerk isn't configured with valid credentials.
 */

import { auth as clerkAuth } from '@clerk/nextjs/server';

// Check if Clerk is properly configured (not using placeholder keys)
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return key && !key.includes('placeholder') && key.startsWith('pk_');
};

/**
 * Safe auth() wrapper that returns empty auth when Clerk isn't configured
 */
export async function auth() {
  if (!isClerkConfigured()) {
    return {
      userId: null,
      sessionId: null,
      sessionClaims: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      protect: async () => {},
      has: () => false,
      redirectToSignIn: () => {},
    };
  }
  return clerkAuth();
}

export { isClerkConfigured };
