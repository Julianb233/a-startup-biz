'use client';

/**
 * Client-Side RBAC Hooks
 *
 * React hooks for role-based access control in client components.
 * These hooks use Clerk's client-side user object to check roles.
 *
 * IMPORTANT: Client-side checks are for UI only. Always verify permissions
 * on the server for actual security.
 */

import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

/**
 * Custom metadata interface for type safety
 */
interface CustomMetadata {
  role?: string;
  roles?: string[];
  permissions?: string[];
}

/**
 * Hook to get the current user's role
 *
 * @returns The user's primary role or 'user' as default
 */
export function useUserRole(): string {
  const { user } = useUser();

  return useMemo(() => {
    const metadata = user?.publicMetadata as CustomMetadata | undefined;
    return metadata?.role || 'user';
  }, [user?.publicMetadata]);
}

/**
 * Hook to get all roles assigned to the current user
 *
 * @returns Array of roles
 */
export function useUserRoles(): string[] {
  const { user } = useUser();

  return useMemo(() => {
    const metadata = user?.publicMetadata as CustomMetadata | undefined;

    // Check if user has multiple roles array
    if (metadata?.roles && Array.isArray(metadata.roles)) {
      return metadata.roles;
    }

    // Fallback to single role
    const singleRole = metadata?.role;
    return singleRole ? [singleRole] : ['user'];
  }, [user?.publicMetadata]);
}

/**
 * Hook to check if the current user has a specific role
 *
 * @param role - The role to check for
 * @returns True if user has the specified role
 */
export function useHasRole(role: string): boolean {
  const { user } = useUser();

  return useMemo(() => {
    const metadata = user?.publicMetadata as CustomMetadata | undefined;

    // Check in roles array first
    if (metadata?.roles && Array.isArray(metadata.roles)) {
      return metadata.roles.includes(role);
    }

    // Check single role
    return metadata?.role === role;
  }, [user?.publicMetadata, role]);
}

/**
 * Hook to check if the current user has any of the specified roles
 *
 * @param roles - Array of roles to check
 * @returns True if user has at least one of the specified roles
 */
export function useHasAnyRole(roles: string[]): boolean {
  const userRoles = useUserRoles();

  return useMemo(() => {
    return roles.some((role) => userRoles.includes(role));
  }, [userRoles, roles]);
}

/**
 * Hook to check if the current user has all of the specified roles
 *
 * @param roles - Array of roles to check
 * @returns True if user has all specified roles
 */
export function useHasAllRoles(roles: string[]): boolean {
  const userRoles = useUserRoles();

  return useMemo(() => {
    return roles.every((role) => userRoles.includes(role));
  }, [userRoles, roles]);
}

/**
 * Hook to check if the current user has a specific permission
 *
 * @param permission - The permission string to check
 * @returns True if user has the permission
 */
export function useHasPermission(permission: string): boolean {
  const { user } = useUser();

  return useMemo(() => {
    const metadata = user?.publicMetadata as CustomMetadata | undefined;

    if (!metadata?.permissions || !Array.isArray(metadata.permissions)) {
      return false;
    }

    return metadata.permissions.includes(permission);
  }, [user?.publicMetadata, permission]);
}

/**
 * Hook to check if the current user has any of the specified permissions
 *
 * @param permissions - Array of permissions to check
 * @returns True if user has at least one permission
 */
export function useHasAnyPermission(permissions: string[]): boolean {
  const { user } = useUser();

  return useMemo(() => {
    const metadata = user?.publicMetadata as CustomMetadata | undefined;

    if (!metadata?.permissions || !Array.isArray(metadata.permissions)) {
      return false;
    }

    return permissions.some((perm) => metadata.permissions!.includes(perm));
  }, [user?.publicMetadata, permissions]);
}

/**
 * Hook to get all permissions for the current user
 *
 * @returns Array of permissions
 */
export function useUserPermissions(): string[] {
  const { user } = useUser();

  return useMemo(() => {
    const metadata = user?.publicMetadata as CustomMetadata | undefined;
    return metadata?.permissions || [];
  }, [user?.publicMetadata]);
}

/**
 * Hook to check if user is authenticated
 *
 * @returns True if user is logged in
 */
export function useIsAuthenticated(): boolean {
  const { isSignedIn } = useUser();
  return !!isSignedIn;
}

/**
 * Hook to check if user is an admin
 *
 * @returns True if user has admin role
 */
export function useIsAdmin(): boolean {
  return useHasRole('admin');
}

/**
 * Hook to check if user is a moderator or admin
 *
 * @returns True if user can moderate
 */
export function useCanModerate(): boolean {
  return useHasAnyRole(['admin', 'moderator']);
}

/**
 * Combined RBAC hook that returns all role/permission info
 *
 * @returns Object with role, roles, permissions, and check functions
 */
export function useRBAC() {
  const role = useUserRole();
  const roles = useUserRoles();
  const permissions = useUserPermissions();
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const canModerate = useCanModerate();

  return {
    // Current role info
    role,
    roles,
    permissions,

    // Authentication status
    isAuthenticated,

    // Convenience flags
    isAdmin,
    canModerate,

    // Check functions
    hasRole: (roleToCheck: string) => roles.includes(roleToCheck),
    hasAnyRole: (rolesToCheck: string[]) =>
      rolesToCheck.some((r) => roles.includes(r)),
    hasAllRoles: (rolesToCheck: string[]) =>
      rolesToCheck.every((r) => roles.includes(r)),
    hasPermission: (perm: string) => permissions.includes(perm),
    hasAnyPermission: (perms: string[]) =>
      perms.some((p) => permissions.includes(p)),
    hasAllPermissions: (perms: string[]) =>
      perms.every((p) => permissions.includes(p)),
  };
}

/**
 * Higher-Order Component to protect client components
 *
 * @param Component - The component to protect
 * @param requiredRole - The required role
 * @param fallback - Optional fallback component
 * @returns Protected component
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    const hasRole = useHasRole(requiredRole);

    if (!hasRole) {
      return <>{fallback || <div>Access Denied</div>}</>;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-Order Component to protect client components (any role)
 *
 * @param Component - The component to protect
 * @param requiredRoles - Array of acceptable roles
 * @param fallback - Optional fallback component
 * @returns Protected component
 */
export function withAnyRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: string[],
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    const hasRole = useHasAnyRole(requiredRoles);

    if (!hasRole) {
      return <>{fallback || <div>Access Denied</div>}</>;
    }

    return <Component {...props} />;
  };
}

/**
 * Higher-Order Component to protect client components by permission
 *
 * @param Component - The component to protect
 * @param requiredPermission - The required permission
 * @param fallback - Optional fallback component
 * @returns Protected component
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: P) {
    const hasPermission = useHasPermission(requiredPermission);

    if (!hasPermission) {
      return <>{fallback || <div>Access Denied</div>}</>;
    }

    return <Component {...props} />;
  };
}
