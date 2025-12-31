/**
 * Supabase Client-Side Utilities
 *
 * Client-side utilities for use in Client Components and browser contexts
 */

'use client'

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Creates a Supabase client for browser/client-side operations
 * Singleton pattern to avoid creating multiple clients
 */
let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseClient() {
  if (client) {
    return client
  }

  // Guard against missing env vars (e.g., during tests or builds)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase] Missing URL or anon key - returning null client')
    return null
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}

/**
 * Hook to get Supabase client in React components
 */
export function useSupabase() {
  return getSupabaseClient()
}
