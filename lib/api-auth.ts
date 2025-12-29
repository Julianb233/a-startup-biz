/**
 * API Authentication Utilities for Admin Routes
 *
 * Provides standardized auth patterns for API routes using Clerk
 */

import { NextResponse } from 'next/server'
import { auth } from '@/lib/clerk-server-safe'
import { checkRole } from '@/lib/auth'

/**
 * Wrapper for authenticated API routes
 *
 * @param handler - The async handler function to execute
 * @returns NextResponse or handler result
 */
export async function withAuth<T>(
  handler: () => Promise<T>
): Promise<T | NextResponse> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      )
    }

    return await handler()
  } catch (error) {
    console.error('Auth error:', error)

    if (error instanceof Error && error.message.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Requires admin role - throws if not admin
 *
 * @throws Error if user is not an admin
 */
export async function requireAdmin(): Promise<void> {
  const isAdmin = await checkRole('admin')

  if (!isAdmin) {
    throw new Error('Forbidden - Admin access required')
  }
}

/**
 * Requires moderator or higher role
 *
 * @throws Error if user is not a moderator or admin
 */
export async function requireModerator(): Promise<void> {
  const isAdmin = await checkRole('admin')
  const isModerator = await checkRole('moderator')

  if (!isAdmin && !isModerator) {
    throw new Error('Forbidden - Moderator access required')
  }
}

/**
 * Gets the current user ID from the auth context
 *
 * @returns User ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth()
  return userId
}

/**
 * Combined auth check - returns user ID if authenticated, throws otherwise
 *
 * @returns User ID
 * @throws Error if not authenticated
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized - Authentication required')
  }

  return userId
}
