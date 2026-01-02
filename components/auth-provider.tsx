"use client"

/**
 * AuthProvider - Passthrough wrapper for authentication
 *
 * CLERK DISABLED: Clerk SDK auto-initializes when imported, even if not rendered.
 * This causes "Development mode" banners with test keys (pk_test_*).
 *
 * Current auth: Supabase (via clerk-safe.tsx components)
 *
 * TODO: To re-enable Clerk, get production keys (pk_live_*) and restore
 * the ClerkProvider import and wrapper logic.
 */

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Clerk disabled - using Supabase auth via clerk-safe.tsx
  return <>{children}</>
}
