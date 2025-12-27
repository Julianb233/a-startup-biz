'use client';

/**
 * Role-Based Menu Component
 *
 * Example component demonstrating how to use RBAC hooks to
 * conditionally render menu items based on user roles.
 */

import { useRBAC } from '@/lib/use-rbac';
import { AdminGate, ModeratorGate, AuthGate } from './RoleGate';
import Link from 'next/link';

/**
 * Main navigation menu with role-based items
 */
export function RoleBasedMenu() {
  const { isAuthenticated, role, isAdmin, canModerate } = useRBAC();

  return (
    <nav className="flex flex-col space-y-2 p-4">
      {/* Public links - visible to everyone */}
      <Link href="/" className="px-4 py-2 rounded hover:bg-accent transition-colors">
        Home
      </Link>

      <Link href="/about" className="px-4 py-2 rounded hover:bg-accent transition-colors">
        About
      </Link>

      {/* Authenticated user links */}
      <AuthGate>
        <Link href="/dashboard" className="px-4 py-2 rounded hover:bg-accent transition-colors">
          Dashboard
        </Link>

        <Link href="/profile" className="px-4 py-2 rounded hover:bg-accent transition-colors">
          Profile
        </Link>
      </AuthGate>

      {/* Moderator and Admin links */}
      <ModeratorGate>
        <div className="border-t pt-2 mt-2">
          <p className="px-4 py-1 text-xs text-muted-foreground font-semibold uppercase">
            Moderation
          </p>
          <Link
            href="/moderate"
            className="px-4 py-2 rounded hover:bg-accent transition-colors block"
          >
            Moderate Content
          </Link>
        </div>
      </ModeratorGate>

      {/* Admin-only links */}
      <AdminGate>
        <div className="border-t pt-2 mt-2">
          <p className="px-4 py-1 text-xs text-muted-foreground font-semibold uppercase">
            Administration
          </p>
          <Link
            href="/admin"
            className="px-4 py-2 rounded hover:bg-accent transition-colors block"
          >
            Admin Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2 rounded hover:bg-accent transition-colors block"
          >
            Manage Users
          </Link>
          <Link
            href="/admin/settings"
            className="px-4 py-2 rounded hover:bg-accent transition-colors block"
          >
            System Settings
          </Link>
        </div>
      </AdminGate>

      {/* Role indicator */}
      {isAuthenticated && (
        <div className="border-t pt-2 mt-2">
          <div className="px-4 py-2 text-sm">
            <span className="text-muted-foreground">Current role: </span>
            <span className="font-semibold capitalize">{role}</span>
          </div>
        </div>
      )}
    </nav>
  );
}

/**
 * User actions menu with role-based actions
 */
export function UserActionsMenu() {
  const { hasPermission, isAdmin } = useRBAC();

  return (
    <div className="flex flex-wrap gap-2">
      {/* Actions based on permissions */}
      {hasPermission('content.create') && (
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
          Create Post
        </button>
      )}

      {hasPermission('content.edit') && (
        <button className="px-4 py-2 border rounded hover:bg-accent">
          Edit Content
        </button>
      )}

      {hasPermission('content.delete') && (
        <button className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 dark:hover:bg-red-950">
          Delete Content
        </button>
      )}

      {/* Admin-only actions */}
      {isAdmin && (
        <>
          <button className="px-4 py-2 border rounded hover:bg-accent">
            Manage Users
          </button>
          <button className="px-4 py-2 border rounded hover:bg-accent">
            System Settings
          </button>
        </>
      )}
    </div>
  );
}

/**
 * Role badge component
 */
export function RoleBadge() {
  const { role, isAuthenticated } = useRBAC();

  if (!isAuthenticated) {
    return null;
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    moderator: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    user: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  const colorClass = roleColors[role] || roleColors.user;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {role}
    </span>
  );
}

/**
 * Comprehensive dashboard layout with role-based sections
 */
export function RoleBasedDashboard() {
  const { role, permissions, isAuthenticated } = useRBAC();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access the dashboard.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <RoleBadge />
        </div>
        <p className="text-muted-foreground mt-2">
          Welcome! You are signed in as a <strong className="capitalize">{role}</strong>.
        </p>
      </div>

      {/* User-specific content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Your Content</h2>
          <p className="text-sm text-muted-foreground">
            View and manage your posts and comments.
          </p>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Activity</h2>
          <p className="text-sm text-muted-foreground">
            Recent activity and notifications.
          </p>
        </div>
      </div>

      {/* Moderator section */}
      <ModeratorGate>
        <div className="border-t pt-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Moderation Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Pending Reviews</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Content awaiting moderation approval.
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                View Queue
              </button>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Reported Content</h3>
              <p className="text-sm text-muted-foreground mb-4">
                User-reported posts and comments.
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
                Review Reports
              </button>
            </div>
          </div>
        </div>
      </ModeratorGate>

      {/* Admin section */}
      <AdminGate>
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">User Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage users, roles, and permissions.
              </p>
              <Link
                href="/admin/users"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Manage Users
              </Link>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">System Settings</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure application settings.
              </p>
              <Link
                href="/admin/settings"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Settings
              </Link>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View system analytics and reports.
              </p>
              <Link
                href="/admin/analytics"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </AdminGate>

      {/* Permissions list */}
      <div className="border-t pt-8 mt-8">
        <h2 className="text-xl font-bold mb-4">Your Permissions</h2>
        {permissions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {permissions.map((perm) => (
              <span
                key={perm}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {perm}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No specific permissions assigned.</p>
        )}
      </div>
    </div>
  );
}
