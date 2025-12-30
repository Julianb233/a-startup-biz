/**
 * Role-Based Access Control (RBAC) Utilities for Supabase Auth
 *
 * This module provides helper functions for checking user roles and permissions
 * in a Supabase-authenticated Next.js application.
 */

// Re-export types from Supabase auth module
export { type Role, type UserMetadata } from '@/lib/supabase/auth'

// Re-export server-side auth functions from Supabase
export {
  requireAuth,
  isAuthenticated,
  getUserId,
  getUserRole,
  getUserRoles,
  checkRole,
  hasAnyRole,
  hasAllRoles,
  checkPermission,
  requireRole,
  requireAnyRole,
  meetsRoleLevel,
} from '@/lib/supabase/server'
