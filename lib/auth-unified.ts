/**
 * Unified Server Authentication
 *
 * This module provides a consistent auth interface that works with both
 * Clerk (when configured) and Supabase (as fallback).
 *
 * Usage:
 *   import { getServerAuth } from "@/lib/auth-unified"
 *   const { userId, email, isAuthenticated } = await getServerAuth()
 */

import { isClerkConfigured } from "@/components/clerk-safe"
import { getServerUser } from "@/lib/supabase/server"

export interface AuthResult {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  provider: "clerk" | "supabase" | null
}

/**
 * Get the current authenticated user from either Clerk or Supabase
 * This is the primary auth function for API routes and server components
 */
export async function getServerAuth(): Promise<AuthResult> {
  // Try Clerk first if configured
  if (isClerkConfigured()) {
    try {
      const { auth } = await import("@clerk/nextjs/server")
      const { userId } = await auth()

      if (userId) {
        // Get email from Clerk user
        const { currentUser } = await import("@clerk/nextjs/server")
        const user = await currentUser()

        return {
          userId,
          email: user?.emailAddresses?.[0]?.emailAddress || null,
          isAuthenticated: true,
          provider: "clerk"
        }
      }
    } catch (error) {
      console.error("[auth-unified] Clerk auth error:", error)
      // Fall through to Supabase
    }
  }

  // Fall back to Supabase
  try {
    const { user, error } = await getServerUser()

    if (error) {
      console.error("[auth-unified] Supabase auth error:", error)
      return {
        userId: null,
        email: null,
        isAuthenticated: false,
        provider: null
      }
    }

    if (user) {
      return {
        userId: user.id,
        email: user.email || null,
        isAuthenticated: true,
        provider: "supabase"
      }
    }
  } catch (error) {
    console.error("[auth-unified] Supabase auth error:", error)
  }

  // No authenticated user found
  return {
    userId: null,
    email: null,
    isAuthenticated: false,
    provider: null
  }
}

/**
 * Require authentication - throws if not authenticated
 * Use this for protected API routes
 */
export async function requireAuth(): Promise<AuthResult & { userId: string; isAuthenticated: true }> {
  const auth = await getServerAuth()

  if (!auth.isAuthenticated || !auth.userId) {
    throw new Error("Unauthorized")
  }

  return auth as AuthResult & { userId: string; isAuthenticated: true }
}
