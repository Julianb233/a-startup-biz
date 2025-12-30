/**
 * Supabase Server-Side Auth Utilities
 *
 * These utilities are for server-side operations (Server Components, Route Handlers, Server Actions)
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Role, UserMetadata } from './auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Creates a Supabase client for server-side operations
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

/**
 * Get the current user on the server
 */
export async function getServerUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  return { user, error }
}

/**
 * Get the current session on the server
 */
export async function getServerSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  return { session, error }
}

/**
 * Require authentication - throws error or redirects if not authenticated
 */
export async function requireAuth(redirectTo?: string): Promise<string> {
  const { user } = await getServerUser()

  if (!user) {
    if (redirectTo) {
      redirect(redirectTo)
    } else {
      throw new Error('Unauthorized: Authentication required')
    }
  }

  return user.id
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { user } = await getServerUser()
  return !!user
}

/**
 * Get the current user's ID
 */
export async function getUserId(): Promise<string | null> {
  const { user } = await getServerUser()
  return user?.id || null
}

/**
 * Get user's role from metadata
 */
export async function getUserRole(): Promise<Role> {
  const { user } = await getServerUser()
  const metadata = user?.user_metadata as UserMetadata

  return (metadata?.role as Role) || 'user'
}

/**
 * Get all roles assigned to the current user
 */
export async function getUserRoles(): Promise<Role[]> {
  const { user } = await getServerUser()
  const metadata = user?.user_metadata as UserMetadata

  // Check if user has multiple roles array
  if (metadata?.roles && Array.isArray(metadata.roles)) {
    return metadata.roles
  }

  // Fallback to single role
  const singleRole = metadata?.role as Role
  return singleRole ? [singleRole] : ['user']
}

/**
 * Check if the current user has a specific role
 */
export async function checkRole(role: Role): Promise<boolean> {
  const { user } = await getServerUser()
  const metadata = user?.user_metadata as UserMetadata

  // Check in roles array first
  if (metadata?.roles && Array.isArray(metadata.roles)) {
    return metadata.roles.includes(role)
  }

  // Check single role
  return metadata?.role === role
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: Role[]): Promise<boolean> {
  const userRoles = await getUserRoles()
  return roles.some(role => userRoles.includes(role))
}

/**
 * Check if the current user has all of the specified roles
 */
export async function hasAllRoles(roles: Role[]): Promise<boolean> {
  const userRoles = await getUserRoles()
  return roles.every(role => userRoles.includes(role))
}

/**
 * Check if the current user has a specific permission
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const { user } = await getServerUser()
  const metadata = user?.user_metadata as UserMetadata

  if (!metadata?.permissions || !Array.isArray(metadata.permissions)) {
    return false
  }

  return metadata.permissions.includes(permission)
}

/**
 * Require a specific role - throws error or redirects if user doesn't have it
 */
export async function requireRole(role: Role, redirectTo?: string): Promise<void> {
  const hasRole = await checkRole(role)

  if (!hasRole) {
    if (redirectTo) {
      redirect(redirectTo)
    } else {
      throw new Error(`Unauthorized: Required role '${role}' not found`)
    }
  }
}

/**
 * Require any of the specified roles
 */
export async function requireAnyRole(roles: Role[], redirectTo?: string): Promise<void> {
  const hasRole = await hasAnyRole(roles)

  if (!hasRole) {
    if (redirectTo) {
      redirect(redirectTo)
    } else {
      throw new Error(`Unauthorized: Required one of roles [${roles.join(', ')}]`)
    }
  }
}

/**
 * Role hierarchy - higher roles inherit permissions from lower roles
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 0,
  user: 1,
  moderator: 2,
  admin: 3,
}

/**
 * Check if user's role meets or exceeds a minimum role level
 */
export async function meetsRoleLevel(minRole: Role): Promise<boolean> {
  const userRole = await getUserRole()
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole]
}
