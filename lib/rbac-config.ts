/**
 * RBAC Configuration
 *
 * Centralized configuration for role-based access control.
 * Customize roles, permissions, and route protection here.
 */

/**
 * System Roles
 *
 * Define all available roles in your application.
 * Add or remove roles as needed for your use case.
 */
export const ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  VIEWER: 'viewer',
} as const;

export type SystemRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Role Hierarchy
 *
 * Defines the hierarchical level of each role.
 * Higher numbers indicate more privileges.
 * Roles with higher levels inherit permissions from lower levels.
 */
export const ROLE_LEVELS: Record<SystemRole, number> = {
  [ROLES.VIEWER]: 0,
  [ROLES.USER]: 1,
  [ROLES.MODERATOR]: 2,
  [ROLES.ADMIN]: 3,
};

/**
 * Role Descriptions
 *
 * Human-readable descriptions for each role.
 * Useful for admin UIs and documentation.
 */
export const ROLE_DESCRIPTIONS: Record<SystemRole, string> = {
  [ROLES.ADMIN]: 'Full system access with all administrative privileges',
  [ROLES.MODERATOR]: 'Content moderation and user management capabilities',
  [ROLES.USER]: 'Standard user access with content creation privileges',
  [ROLES.VIEWER]: 'Read-only access to public content',
};

/**
 * System Permissions
 *
 * Define granular permissions that can be assigned to roles.
 * Use dot notation for namespacing (e.g., 'resource.action').
 */
export const PERMISSIONS = {
  // User management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',

  // Content management
  CONTENT_VIEW: 'content.view',
  CONTENT_CREATE: 'content.create',
  CONTENT_EDIT: 'content.edit',
  CONTENT_DELETE: 'content.delete',
  CONTENT_PUBLISH: 'content.publish',

  // Comments
  COMMENTS_VIEW: 'comments.view',
  COMMENTS_CREATE: 'comments.create',
  COMMENTS_EDIT: 'comments.edit',
  COMMENTS_DELETE: 'comments.delete',
  COMMENTS_MODERATE: 'comments.moderate',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_EDIT: 'settings.edit',

  // Analytics
  ANALYTICS_VIEW: 'analytics.view',
  ANALYTICS_EXPORT: 'analytics.export',

  // API access
  API_READ: 'api.read',
  API_WRITE: 'api.write',
  API_DELETE: 'api.delete',
} as const;

export type SystemPermission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role Permissions Map
 *
 * Defines which permissions each role has by default.
 * This is used for permission checks and UI rendering.
 */
export const ROLE_PERMISSIONS: Record<SystemRole, SystemPermission[]> = {
  [ROLES.VIEWER]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.COMMENTS_VIEW,
  ],

  [ROLES.USER]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT, // Own content only
    PERMISSIONS.COMMENTS_VIEW,
    PERMISSIONS.COMMENTS_CREATE,
    PERMISSIONS.COMMENTS_EDIT, // Own comments only
    PERMISSIONS.API_READ,
  ],

  [ROLES.MODERATOR]: [
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.COMMENTS_VIEW,
    PERMISSIONS.COMMENTS_CREATE,
    PERMISSIONS.COMMENTS_EDIT,
    PERMISSIONS.COMMENTS_DELETE,
    PERMISSIONS.COMMENTS_MODERATE,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.API_READ,
    PERMISSIONS.API_WRITE,
  ],

  [ROLES.ADMIN]: [
    // Admins have all permissions
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_EDIT,
    PERMISSIONS.CONTENT_DELETE,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.COMMENTS_VIEW,
    PERMISSIONS.COMMENTS_CREATE,
    PERMISSIONS.COMMENTS_EDIT,
    PERMISSIONS.COMMENTS_DELETE,
    PERMISSIONS.COMMENTS_MODERATE,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.API_READ,
    PERMISSIONS.API_WRITE,
    PERMISSIONS.API_DELETE,
  ],
};

/**
 * Protected Routes Configuration
 *
 * Define route patterns that require specific roles.
 * Routes are matched using glob patterns.
 */
export const PROTECTED_ROUTES = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/login',
    '/signup',
    '/about',
    '/blog',
    '/resources',
  ],

  // Authenticated routes (any logged-in user)
  authenticated: [
    '/dashboard',
    '/profile',
    '/settings',
  ],

  // Role-specific routes
  admin: [
    '/admin',
    '/admin/*',
  ],

  moderator: [
    '/moderate',
    '/moderate/*',
  ],
} as const;

/**
 * Redirect URLs
 *
 * Define where users should be redirected based on different scenarios.
 */
export const REDIRECT_URLS = {
  // Redirect after login
  afterLogin: '/dashboard',

  // Redirect after signup
  afterSignup: '/dashboard',

  // Redirect when not authenticated
  unauthenticated: '/login',

  // Redirect when authenticated but lacking required role
  unauthorized: '/',

  // Redirect when forbidden
  forbidden: '/403',
} as const;

/**
 * Feature Flags
 *
 * Toggle RBAC features on/off.
 */
export const RBAC_CONFIG = {
  // Enable permission-based access control
  enablePermissions: true,

  // Enable role hierarchy (higher roles inherit lower role permissions)
  enableRoleHierarchy: true,

  // Enable multiple roles per user
  enableMultipleRoles: true,

  // Enable audit logging for role changes
  enableAuditLogging: true,

  // Cache role checks (in milliseconds)
  roleCacheTTL: 60000, // 1 minute

  // Strict mode (throws errors instead of returning false)
  strictMode: false,
} as const;

/**
 * Helper function to get permissions for a role
 *
 * @param role - The role to get permissions for
 * @param includeInherited - Whether to include permissions from lower roles
 * @returns Array of permissions
 */
export function getPermissionsForRole(
  role: SystemRole,
  includeInherited: boolean = true
): SystemPermission[] {
  const permissions = [...ROLE_PERMISSIONS[role]];

  if (includeInherited && RBAC_CONFIG.enableRoleHierarchy) {
    const roleLevel = ROLE_LEVELS[role];

    // Add permissions from all lower-level roles
    Object.entries(ROLE_LEVELS).forEach(([lowerRole, level]) => {
      if (level < roleLevel) {
        const lowerPermissions = ROLE_PERMISSIONS[lowerRole as SystemRole];
        permissions.push(...lowerPermissions);
      }
    });
  }

  // Remove duplicates
  return [...new Set(permissions)];
}

/**
 * Helper function to check if a role has a permission
 *
 * @param role - The role to check
 * @param permission - The permission to check for
 * @returns True if role has the permission
 */
export function roleHasPermission(
  role: SystemRole,
  permission: SystemPermission
): boolean {
  const permissions = getPermissionsForRole(role, true);
  return permissions.includes(permission);
}

/**
 * Helper function to compare role levels
 *
 * @param role - The role to check
 * @param minRole - The minimum required role
 * @returns True if role level is >= minRole level
 */
export function compareRoleLevels(
  role: SystemRole,
  minRole: SystemRole
): boolean {
  return ROLE_LEVELS[role] >= ROLE_LEVELS[minRole];
}
