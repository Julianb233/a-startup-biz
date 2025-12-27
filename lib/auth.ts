/**
 * Role-Based Access Control (RBAC) Utilities for Clerk
 *
 * This module provides helper functions for checking user roles and permissions
 * in a Clerk-authenticated Next.js application.
 */

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * Available roles in the system
 */
export type Role = 'admin' | 'user' | 'moderator' | 'viewer';

/**
 * Custom session claims interface
 */
interface SessionClaims {
  metadata?: {
    role?: Role;
    roles?: Role[];
    permissions?: string[];
  };
}

/**
 * Gets the current user's primary role from session claims
 *
 * @returns The user's role or 'user' as default
 */
export async function getUserRole(): Promise<Role> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as SessionClaims;

  return (claims?.metadata?.role as Role) || 'user';
}

/**
 * Gets all roles assigned to the current user
 *
 * @returns Array of roles assigned to the user
 */
export async function getUserRoles(): Promise<Role[]> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as SessionClaims;

  // Check if user has multiple roles array
  if (claims?.metadata?.roles && Array.isArray(claims.metadata.roles)) {
    return claims.metadata.roles;
  }

  // Fallback to single role
  const singleRole = claims?.metadata?.role as Role;
  return singleRole ? [singleRole] : ['user'];
}

/**
 * Checks if the current user has a specific role
 *
 * @param role - The role to check for
 * @returns True if user has the specified role
 */
export async function checkRole(role: Role): Promise<boolean> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as SessionClaims;

  // Check in roles array first
  if (claims?.metadata?.roles && Array.isArray(claims.metadata.roles)) {
    return claims.metadata.roles.includes(role);
  }

  // Check single role
  return claims?.metadata?.role === role;
}

/**
 * Checks if the current user has any of the specified roles
 *
 * @param roles - Array of roles to check
 * @returns True if user has at least one of the specified roles
 */
export async function hasAnyRole(roles: Role[]): Promise<boolean> {
  const userRoles = await getUserRoles();
  return roles.some(role => userRoles.includes(role));
}

/**
 * Checks if the current user has all of the specified roles
 *
 * @param roles - Array of roles to check
 * @returns True if user has all specified roles
 */
export async function hasAllRoles(roles: Role[]): Promise<boolean> {
  const userRoles = await getUserRoles();
  return roles.every(role => userRoles.includes(role));
}

/**
 * Checks if the current user has a specific permission
 *
 * @param permission - The permission string to check
 * @returns True if user has the permission
 */
export async function checkPermission(permission: string): Promise<boolean> {
  const { sessionClaims } = await auth();
  const claims = sessionClaims as SessionClaims;

  if (!claims?.metadata?.permissions || !Array.isArray(claims.metadata.permissions)) {
    return false;
  }

  return claims.metadata.permissions.includes(permission);
}

/**
 * Requires a specific role - throws error or redirects if user doesn't have it
 *
 * @param role - The required role
 * @param redirectTo - Optional path to redirect to if unauthorized (default: '/')
 * @throws Error if redirectTo is not provided and user doesn't have role
 */
export async function requireRole(role: Role, redirectTo?: string): Promise<void> {
  const hasRole = await checkRole(role);

  if (!hasRole) {
    if (redirectTo) {
      redirect(redirectTo);
    } else {
      throw new Error(`Unauthorized: Required role '${role}' not found`);
    }
  }
}

/**
 * Requires any of the specified roles
 *
 * @param roles - Array of acceptable roles
 * @param redirectTo - Optional path to redirect to if unauthorized (default: '/')
 * @throws Error if redirectTo is not provided and user doesn't have any role
 */
export async function requireAnyRole(roles: Role[], redirectTo?: string): Promise<void> {
  const hasRole = await hasAnyRole(roles);

  if (!hasRole) {
    if (redirectTo) {
      redirect(redirectTo);
    } else {
      throw new Error(`Unauthorized: Required one of roles [${roles.join(', ')}]`);
    }
  }
}

/**
 * Requires authentication and returns user info
 *
 * @param redirectTo - Optional path to redirect to if not authenticated
 * @returns User ID if authenticated
 * @throws Error or redirects if not authenticated
 */
export async function requireAuth(redirectTo?: string): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    if (redirectTo) {
      redirect(redirectTo);
    } else {
      throw new Error('Unauthorized: Authentication required');
    }
  }

  return userId;
}

/**
 * Checks if user is authenticated
 *
 * @returns True if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId;
}

/**
 * Gets the current user's ID
 *
 * @returns User ID or null if not authenticated
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Role hierarchy - higher roles inherit permissions from lower roles
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  viewer: 0,
  user: 1,
  moderator: 2,
  admin: 3,
};

/**
 * Checks if user's role meets or exceeds a minimum role level
 *
 * @param minRole - The minimum required role
 * @returns True if user's role is equal to or higher than minRole
 */
export async function meetsRoleLevel(minRole: Role): Promise<boolean> {
  const userRole = await getUserRole();
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}
