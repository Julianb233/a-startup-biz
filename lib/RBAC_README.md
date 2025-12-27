# Role-Based Access Control (RBAC) Implementation Guide

This directory contains a complete RBAC implementation for Next.js 16 with Clerk authentication.

## Files Overview

- **`auth.ts`** - Core RBAC utility functions
- **`rbac-examples.ts`** - Usage examples and patterns
- **`../types/globals.d.ts`** - TypeScript type definitions for Clerk metadata
- **`../proxy.ts`** - Middleware with route protection
- **`../app/admin/page.tsx`** - Example protected admin page

## Quick Start

### 1. Set Up Clerk Roles

In your Clerk Dashboard, add custom session claims to include role metadata:

1. Go to **Sessions** → **Customize session token**
2. Add the following JSON:

```json
{
  "metadata": {
    "role": "{{user.public_metadata.role}}"
  }
}
```

3. Set user roles in Clerk Dashboard under **Users** → Select User → **Metadata** → **Public metadata**:

```json
{
  "role": "admin"
}
```

Available roles: `admin`, `moderator`, `user`, `viewer`

### 2. Basic Usage

#### Check if User Has a Role

```typescript
import { checkRole } from '@/lib/auth';

export default async function MyPage() {
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Content</div>;
}
```

#### Require a Role (with redirect)

```typescript
import { requireRole } from '@/lib/auth';

export default async function AdminPage() {
  // Redirects to home if user is not admin
  await requireRole('admin', '/');

  return <div>Admin Dashboard</div>;
}
```

#### Get User's Role

```typescript
import { getUserRole } from '@/lib/auth';

export default async function ProfilePage() {
  const role = await getUserRole();

  return <div>Your role: {role}</div>;
}
```

### 3. Middleware Protection

The `proxy.ts` middleware automatically protects routes:

```typescript
// These routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/dashboard(.*)',
]);

// These routes require admin role
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);
```

To protect additional routes, add them to these matchers.

### 4. Server Actions

Protect server actions with role checks:

```typescript
'use server';

import { requireRole } from '@/lib/auth';

export async function deleteUser(userId: string) {
  // Throws error if user is not admin
  await requireRole('admin');

  // Proceed with deletion
  // ...
}
```

### 5. API Routes

Protect API routes in `app/api/*/route.ts`:

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ data: 'Admin data' });
}
```

## Available Functions

### Authentication Checks

- `isAuthenticated()` - Check if user is logged in
- `getUserId()` - Get current user's ID
- `requireAuth(redirectTo?)` - Require authentication

### Role Checks

- `getUserRole()` - Get user's primary role
- `getUserRoles()` - Get all user roles (supports multiple roles)
- `checkRole(role)` - Check if user has specific role
- `hasAnyRole(roles[])` - Check if user has any of the roles
- `hasAllRoles(roles[])` - Check if user has all specified roles
- `meetsRoleLevel(minRole)` - Check if user's role meets minimum level

### Permission Checks

- `checkPermission(permission)` - Check if user has specific permission

### Authorization Enforcement

- `requireRole(role, redirectTo?)` - Require specific role
- `requireAnyRole(roles[], redirectTo?)` - Require one of the roles

## Role Hierarchy

Roles have hierarchical levels:

1. **viewer** (level 0) - Read-only access
2. **user** (level 1) - Standard user access
3. **moderator** (level 2) - Content moderation access
4. **admin** (level 3) - Full system access

Use `meetsRoleLevel()` to check if a user's role is at or above a certain level:

```typescript
// User must be moderator or admin
const canModerate = await meetsRoleLevel('moderator');
```

## Multiple Roles

Users can have multiple roles. Set this in Clerk public metadata:

```json
{
  "roles": ["user", "moderator"]
}
```

Then check with:

```typescript
const roles = await getUserRoles(); // ['user', 'moderator']
const hasModRole = await checkRole('moderator'); // true
```

## Permissions

In addition to roles, you can assign granular permissions:

Set in Clerk public metadata:
```json
{
  "role": "user",
  "permissions": ["posts.create", "posts.edit", "comments.delete"]
}
```

Check with:
```typescript
const canEditPosts = await checkPermission('posts.edit');
```

## TypeScript Support

The `types/globals.d.ts` file extends Clerk's types to include role metadata:

```typescript
interface CustomJwtSessionClaims {
  metadata?: {
    role?: 'admin' | 'user' | 'moderator' | 'viewer';
    roles?: Array<'admin' | 'user' | 'moderator' | 'viewer'>;
    permissions?: string[];
  };
}
```

This provides full type safety when accessing `sessionClaims.metadata`.

## Security Best Practices

1. **Always verify on the server** - Never trust client-side role checks alone
2. **Use middleware for route protection** - Centralize access control
3. **Implement defense in depth** - Check permissions at multiple layers
4. **Follow principle of least privilege** - Grant minimum necessary access
5. **Audit access logs** - Track who accesses what and when
6. **Regularly review roles** - Ensure role assignments are current

## Common Patterns

### Conditional UI Rendering

```typescript
export default async function Dashboard() {
  const userRole = await getUserRole();
  const isAdmin = await checkRole('admin');

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Show to all users */}
      <UserProfile />

      {/* Show to moderators and admins */}
      {(userRole === 'moderator' || isAdmin) && (
        <ModerationTools />
      )}

      {/* Show only to admins */}
      {isAdmin && (
        <AdminSettings />
      )}
    </div>
  );
}
```

### Protected Server Component

```typescript
import { requireRole } from '@/lib/auth';

export default async function AdminPage() {
  await requireRole('admin', '/');

  return <div>Admin Content</div>;
}
```

### Protected Client Component (via Server Component wrapper)

```typescript
// app/admin/client-component-wrapper.tsx
import { requireRole } from '@/lib/auth';
import { AdminClientComponent } from './admin-client-component';

export default async function AdminClientWrapper() {
  await requireRole('admin', '/');

  return <AdminClientComponent />;
}
```

### API Route with Multiple Checks

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const { userId, sessionClaims } = await auth();

  // Check 1: Authentication
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check 2: Role
  const metadata = sessionClaims?.metadata as { role?: string; permissions?: string[] };
  const role = metadata?.role;

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Check 3: Permission
  const hasDeletePermission = metadata?.permissions?.includes('users.delete');

  if (!hasDeletePermission) {
    return NextResponse.json({ error: 'Missing permission' }, { status: 403 });
  }

  // Proceed with deletion
  return NextResponse.json({ success: true });
}
```

## Testing Roles

### Set Admin Role in Clerk Dashboard

1. Go to Clerk Dashboard → Users
2. Select a user
3. Click "Metadata" tab
4. Add to "Public metadata":
   ```json
   {
     "role": "admin"
   }
   ```
5. Save

### Test Different Roles

Create test accounts with different roles:

- `test-admin@example.com` → role: "admin"
- `test-moderator@example.com` → role: "moderator"
- `test-user@example.com` → role: "user"

## Troubleshooting

### Role not showing up

1. Verify the custom session token configuration in Clerk Dashboard
2. Clear cookies and sign in again
3. Check that public metadata is set correctly
4. Ensure the role value matches exactly (case-sensitive)

### Redirects not working

1. Check middleware matcher configuration in `proxy.ts`
2. Verify redirect URLs are absolute paths
3. Ensure middleware is running for the protected routes

### TypeScript errors

1. Restart TypeScript server in your IDE
2. Verify `types/globals.d.ts` is in your project
3. Check `tsconfig.json` includes the types directory

## Next Steps

1. Set up custom roles in Clerk Dashboard
2. Add role metadata to test users
3. Test the admin page at `/admin`
4. Protect additional routes in middleware
5. Add role checks to your API routes
6. Implement permission-based access for fine-grained control

## Example URLs

- `/admin` - Admin dashboard (requires admin role)
- `/dashboard` - User dashboard (requires authentication)
- `/login` - Login page

## Support

For issues or questions:
1. Check Clerk documentation: https://clerk.com/docs
2. Review the example implementations in `rbac-examples.ts`
3. Test with different user roles to verify behavior
