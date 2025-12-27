import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * API Authentication Helpers for Clerk
 *
 * Provides utilities for protecting API routes and checking user permissions.
 */

export interface AuthenticatedUser {
  userId: string;
  user: any; // Clerk user object
}

/**
 * Requires authentication for API route
 * Throws an error that returns 401 if not authenticated
 *
 * @returns Promise<{ userId: string }>
 * @throws Returns NextResponse with 401 if not authenticated
 */
export async function requireAuth(): Promise<{ userId: string }> {
  const { userId } = await auth();

  if (!userId) {
    throw NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  return { userId };
}

/**
 * Requires admin role for API route
 * Checks for 'admin' role in Clerk user metadata
 *
 * @returns Promise<{ userId: string, user: any }>
 * @throws Returns NextResponse with 401 if not authenticated or 403 if not admin
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const { userId } = await auth();

  if (!userId) {
    throw NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  const user = await currentUser();

  if (!user) {
    throw NextResponse.json(
      { error: 'Unauthorized', message: 'User not found' },
      { status: 401 }
    );
  }

  // Check for admin role in public metadata
  const isAdmin = user.publicMetadata?.role === 'admin' ||
                  user.privateMetadata?.role === 'admin';

  if (!isAdmin) {
    throw NextResponse.json(
      { error: 'Forbidden', message: 'Admin access required' },
      { status: 403 }
    );
  }

  return { userId, user };
}

/**
 * Gets the authenticated user if available, returns null otherwise
 * Does not throw errors - safe for optional authentication
 *
 * @returns Promise<AuthenticatedUser | null>
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await currentUser();

  if (!user) {
    return null;
  }

  return { userId, user };
}

/**
 * Checks if current user has a specific role
 *
 * @param role - Role to check for in user metadata
 * @returns Promise<boolean>
 */
export async function hasRole(role: string): Promise<boolean> {
  const authUser = await getAuthenticatedUser();

  if (!authUser) {
    return false;
  }

  const userRole = authUser.user.publicMetadata?.role ||
                   authUser.user.privateMetadata?.role;

  return userRole === role;
}

/**
 * Wrapper for API route handlers that catches auth errors
 * Use this to wrap your route handlers for automatic error handling
 *
 * @param handler - Async function that handles the API route
 * @returns NextResponse
 */
export function withAuth(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  return handler().catch((error) => {
    // If error is already a NextResponse (thrown by requireAuth/requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }

    // Otherwise, return a generic 500 error
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  });
}
