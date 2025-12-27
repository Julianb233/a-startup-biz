/**
 * RBAC Usage Examples
 *
 * This file contains example implementations of role-based access control
 * patterns using the auth utilities. Use these as reference for implementing
 * RBAC throughout your application.
 */

import {
  checkRole,
  requireRole,
  getUserRole,
  getUserRoles,
  hasAnyRole,
  meetsRoleLevel,
  checkPermission,
  isAuthenticated,
  requireAuth,
} from './auth';
import { redirect } from 'next/navigation';

/**
 * Example 1: Basic Role Check in Server Component
 */
export async function ExampleServerComponent() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
}

/**
 * Example 2: Multiple Role Check
 */
export async function ExampleMultiRoleCheck() {
  // User must be either admin or moderator
  const canModerate = await hasAnyRole(['admin', 'moderator']);

  if (!canModerate) {
    redirect('/');
  }

  return <div>Moderation Tools</div>;
}

/**
 * Example 3: Server Action with Role Requirement
 */
export async function deleteUserAction(userId: string) {
  'use server';

  // Require admin role, throw error if not authorized
  await requireRole('admin');

  // Proceed with deletion
  console.log(`Deleting user ${userId}`);
  // ... deletion logic
}

/**
 * Example 4: API Route Handler with RBAC
 */
export async function handleAdminApiRequest() {
  const userRole = await getUserRole();

  if (userRole !== 'admin') {
    return new Response('Unauthorized', { status: 403 });
  }

  return new Response('Success', { status: 200 });
}

/**
 * Example 5: Role Hierarchy Check
 */
export async function ExampleRoleHierarchy() {
  // Check if user's role is moderator or higher (moderator or admin)
  const canManageContent = await meetsRoleLevel('moderator');

  if (!canManageContent) {
    return <div>Insufficient Permissions</div>;
  }

  return <div>Content Management Panel</div>;
}

/**
 * Example 6: Permission-Based Access
 */
export async function ExamplePermissionCheck() {
  const canEditPosts = await checkPermission('posts.edit');

  if (!canEditPosts) {
    return <div>Cannot edit posts</div>;
  }

  return <div>Post Editor</div>;
}

/**
 * Example 7: Conditional UI Rendering Based on Role
 */
export async function ExampleConditionalUI() {
  const roles = await getUserRoles();
  const userRole = await getUserRole();

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Show to all authenticated users */}
      <section>
        <h2>Your Profile</h2>
      </section>

      {/* Show only to moderators and admins */}
      {roles.some((r) => ['admin', 'moderator'].includes(r)) && (
        <section>
          <h2>Moderation Tools</h2>
        </section>
      )}

      {/* Show only to admins */}
      {userRole === 'admin' && (
        <section>
          <h2>Admin Settings</h2>
        </section>
      )}
    </div>
  );
}

/**
 * Example 8: Protected Server Action with Custom Error
 */
export async function updateSettingsAction(settings: Record<string, unknown>) {
  'use server';

  try {
    await requireRole('admin');
  } catch (error) {
    return { success: false, error: 'Admin access required' };
  }

  // Update settings logic
  console.log('Updating settings:', settings);

  return { success: true };
}

/**
 * Example 9: Authentication Check with Redirect
 */
export async function ExampleAuthRequired() {
  // Redirect to login if not authenticated
  await requireAuth('/login');

  return <div>Protected Content</div>;
}

/**
 * Example 10: Role-Based Data Filtering
 */
export async function getFilteredData() {
  const userRole = await getUserRole();
  const isAuth = await isAuthenticated();

  if (!isAuth) {
    return { data: [], error: 'Not authenticated' };
  }

  // Return different data based on role
  switch (userRole) {
    case 'admin':
      // Admins see all data
      return { data: ['all', 'data', 'including', 'sensitive'], error: null };

    case 'moderator':
      // Moderators see most data
      return { data: ['all', 'data', 'except', 'sensitive'], error: null };

    case 'user':
      // Regular users see limited data
      return { data: ['public', 'data'], error: null };

    default:
      // Viewers see minimal data
      return { data: ['public'], error: null };
  }
}

/**
 * Example 11: Multiple Protection Layers
 */
export async function ExampleMultiLayerProtection() {
  // Layer 1: Require authentication
  await requireAuth('/login');

  // Layer 2: Check minimum role level
  const hasAccess = await meetsRoleLevel('moderator');
  if (!hasAccess) {
    redirect('/');
  }

  // Layer 3: Check specific permission
  const canDelete = await checkPermission('content.delete');

  return (
    <div>
      <h1>Content Management</h1>
      {canDelete && <button>Delete Content</button>}
    </div>
  );
}
