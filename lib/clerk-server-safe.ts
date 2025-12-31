/**
 * Safe Clerk Server-Side Utilities
 *
 * These utilities wrap Clerk's server-side functions to handle
 * the case when Clerk isn't configured with valid credentials.
 * Falls back to Supabase Auth when Clerk is not available.
 */

import { auth as clerkAuth, currentUser as clerkCurrentUser } from '@clerk/nextjs/server';
import { getServerUser } from '@/lib/supabase/server';

// Check if Clerk is properly configured (not using placeholder keys)
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return key && !key.includes('placeholder') && key.startsWith('pk_');
};

/**
 * Safe auth() wrapper that returns Supabase auth when Clerk isn't configured
 */
export async function auth() {
  if (!isClerkConfigured()) {
    // Try Supabase auth as fallback
    try {
      const { user, error } = await getServerUser();

      if (error) {
        console.error('[clerk-server-safe] Supabase auth error:', error);
      }

      return {
        userId: user?.id || null,
        sessionId: user?.id ? `supabase_${user.id.substring(0, 8)}` : null,
        sessionClaims: user ? {
          email: user.email,
          sub: user.id,
          firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || null,
          lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
          fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
        } : null,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        protect: async () => {
          if (!user) {
            throw new Error('Unauthorized');
          }
        },
        has: () => false,
        redirectToSignIn: () => {
          // Server-side redirect not available, use middleware
        },
      };
    } catch (error) {
      console.error('[clerk-server-safe] Error getting Supabase user:', error);
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
  }
  return clerkAuth();
}

/**
 * Safe currentUser() wrapper that returns Supabase user when Clerk isn't configured
 */
export async function currentUser() {
  if (!isClerkConfigured()) {
    try {
      const { user, error } = await getServerUser();

      if (error || !user) {
        return null;
      }

      // Map Supabase user to Clerk-compatible format
      return {
        id: user.id,
        emailAddresses: user.email ? [{ emailAddress: user.email }] : [],
        primaryEmailAddress: user.email ? { emailAddress: user.email } : null,
        firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(' ')[0] || null,
        lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || null,
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
        imageUrl: user.user_metadata?.avatar_url || null,
        username: user.email?.split('@')[0] || null,
        createdAt: user.created_at ? new Date(user.created_at) : null,
        updatedAt: user.updated_at ? new Date(user.updated_at) : null,
      };
    } catch (error) {
      console.error('[clerk-server-safe] Error getting Supabase user:', error);
      return null;
    }
  }
  return clerkCurrentUser();
}

export { isClerkConfigured };
