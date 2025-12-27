'use client';

/**
 * Role Gate Components
 *
 * Conditional rendering components for role-based access control.
 * Use these components to show/hide UI elements based on user roles.
 */

import { useRBAC, useHasRole, useHasAnyRole, useHasPermission } from '@/lib/use-rbac';
import { ReactNode } from 'react';

/**
 * RoleGate Component Props
 */
interface RoleGateProps {
  /** The required role */
  role: string;
  /** Content to show if user has the role */
  children: ReactNode;
  /** Optional fallback content to show if user doesn't have the role */
  fallback?: ReactNode;
}

/**
 * RoleGate - Shows content only if user has the specified role
 *
 * @example
 * ```tsx
 * <RoleGate role="admin">
 *   <AdminPanel />
 * </RoleGate>
 * ```
 */
export function RoleGate({ role, children, fallback = null }: RoleGateProps) {
  const hasRole = useHasRole(role);

  if (!hasRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * AnyRoleGate Component Props
 */
interface AnyRoleGateProps {
  /** Array of acceptable roles (user needs at least one) */
  roles: string[];
  /** Content to show if user has any of the roles */
  children: ReactNode;
  /** Optional fallback content to show if user doesn't have any role */
  fallback?: ReactNode;
}

/**
 * AnyRoleGate - Shows content if user has any of the specified roles
 *
 * @example
 * ```tsx
 * <AnyRoleGate roles={['admin', 'moderator']}>
 *   <ModerationTools />
 * </AnyRoleGate>
 * ```
 */
export function AnyRoleGate({ roles, children, fallback = null }: AnyRoleGateProps) {
  const hasAnyRole = useHasAnyRole(roles);

  if (!hasAnyRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * PermissionGate Component Props
 */
interface PermissionGateProps {
  /** The required permission */
  permission: string;
  /** Content to show if user has the permission */
  children: ReactNode;
  /** Optional fallback content to show if user doesn't have the permission */
  fallback?: ReactNode;
}

/**
 * PermissionGate - Shows content only if user has the specified permission
 *
 * @example
 * ```tsx
 * <PermissionGate permission="content.edit">
 *   <EditButton />
 * </PermissionGate>
 * ```
 */
export function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const hasPermission = useHasPermission(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * AuthGate Component Props
 */
interface AuthGateProps {
  /** Content to show if user is authenticated */
  children: ReactNode;
  /** Optional fallback content to show if user is not authenticated */
  fallback?: ReactNode;
}

/**
 * AuthGate - Shows content only if user is authenticated
 *
 * @example
 * ```tsx
 * <AuthGate fallback={<LoginButton />}>
 *   <UserProfile />
 * </AuthGate>
 * ```
 */
export function AuthGate({ children, fallback = null }: AuthGateProps) {
  const { isAuthenticated } = useRBAC();

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * AdminGate - Convenience component for admin-only content
 *
 * @example
 * ```tsx
 * <AdminGate>
 *   <AdminPanel />
 * </AdminGate>
 * ```
 */
export function AdminGate({ children, fallback = null }: Omit<RoleGateProps, 'role'>) {
  return (
    <RoleGate role="admin" fallback={fallback}>
      {children}
    </RoleGate>
  );
}

/**
 * ModeratorGate - Convenience component for moderator/admin content
 *
 * @example
 * ```tsx
 * <ModeratorGate>
 *   <ModerationTools />
 * </ModeratorGate>
 * ```
 */
export function ModeratorGate({ children, fallback = null }: Omit<AnyRoleGateProps, 'roles'>) {
  return (
    <AnyRoleGate roles={['admin', 'moderator']} fallback={fallback}>
      {children}
    </AnyRoleGate>
  );
}

/**
 * RoleSwitch Component Props
 */
interface RoleSwitchCase {
  /** The role to match */
  role: string;
  /** Content to show for this role */
  content: ReactNode;
}

interface RoleSwitchProps {
  /** Array of role cases */
  cases: RoleSwitchCase[];
  /** Default content if no role matches */
  defaultContent?: ReactNode;
}

/**
 * RoleSwitch - Switch between different content based on user role
 *
 * @example
 * ```tsx
 * <RoleSwitch
 *   cases={[
 *     { role: 'admin', content: <AdminDashboard /> },
 *     { role: 'moderator', content: <ModeratorDashboard /> },
 *     { role: 'user', content: <UserDashboard /> },
 *   ]}
 *   defaultContent={<ViewerDashboard />}
 * />
 * ```
 */
export function RoleSwitch({ cases, defaultContent = null }: RoleSwitchProps) {
  const { role } = useRBAC();

  const matchedCase = cases.find((c) => c.role === role);

  if (matchedCase) {
    return <>{matchedCase.content}</>;
  }

  return <>{defaultContent}</>;
}

/**
 * FeatureFlag Component Props
 */
interface FeatureFlagProps {
  /** Feature flag name */
  feature: string;
  /** Content to show if feature is enabled for user */
  children: ReactNode;
  /** Optional fallback content */
  fallback?: ReactNode;
  /** List of roles that have access to this feature */
  allowedRoles?: string[];
  /** List of permissions that grant access to this feature */
  requiredPermissions?: string[];
}

/**
 * FeatureFlag - Conditional rendering based on feature flags and roles
 *
 * @example
 * ```tsx
 * <FeatureFlag
 *   feature="beta-feature"
 *   allowedRoles={['admin', 'beta-tester']}
 * >
 *   <BetaFeature />
 * </FeatureFlag>
 * ```
 */
export function FeatureFlag({
  feature,
  children,
  fallback = null,
  allowedRoles = [],
  requiredPermissions = [],
}: FeatureFlagProps) {
  const { hasAnyRole, hasPermission } = useRBAC();

  // Check if user has required role
  const hasRole = allowedRoles.length === 0 || hasAnyRole(allowedRoles);

  // Check if user has required permission
  const hasRequiredPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((perm) => hasPermission(perm));

  if (!hasRole || !hasRequiredPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
