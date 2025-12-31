/**
 * Supabase Auth Integration
 *
 * This module provides authentication utilities using Supabase Auth
 * to replace Clerk authentication.
 */

import { createBrowserClient } from '@supabase/ssr'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

/**
 * Creates a Supabase client for browser/client-side operations
 */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

/**
 * Role-based access types
 */
export type Role = 'admin' | 'user' | 'moderator' | 'viewer'

/**
 * User metadata interface
 */
export interface UserMetadata {
  role?: Role
  roles?: Role[]
  permissions?: string[]
  [key: string]: unknown
}

/**
 * Extended user type with metadata
 */
export interface ExtendedUser {
  id: string
  email?: string
  user_metadata: UserMetadata
  app_metadata: {
    provider?: string
    providers?: string[]
  }
  created_at: string
  updated_at?: string
}

/**
 * Auth response type
 */
export interface AuthResponse {
  user: ExtendedUser | null
  session: {
    access_token: string
    refresh_token: string
    expires_in: number
    expires_at?: number
    token_type: string
    user: ExtendedUser
  } | null
  error: Error | null
}

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, metadata?: UserMetadata) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })

  return { data, error }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: 'google' | 'github' | 'azure') {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = createClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(metadata: Partial<UserMetadata>) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  })

  return { data, error }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })

  return { data, error }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient()

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  return { data, error }
}

/**
 * Listen for auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClient()

  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)

  return subscription
}
