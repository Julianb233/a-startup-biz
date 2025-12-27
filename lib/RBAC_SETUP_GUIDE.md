# RBAC Setup Guide - Step by Step

This guide walks you through setting up role-based access control from scratch.

## Step 1: Configure Clerk Custom Session Claims

### 1.1 Access Clerk Dashboard

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to **Sessions** → **Customize session token**

### 1.2 Add Custom Claims

Add the following JSON to customize the session token:

```json
{
  "metadata": {
    "role": "{{user.public_metadata.role}}",
    "roles": "{{user.public_metadata.roles}}",
    "permissions": "{{user.public_metadata.permissions}}"
  }
}
```

**What this does:** Makes the user's role and permissions available in the session token, which can be accessed server-side without additional API calls.

### 1.3 Save Configuration

Click **Save** or **Apply changes**.

## Step 2: Create Test Users with Different Roles

### 2.1 Create Admin User

1. In Clerk Dashboard, go to **Users**
2. Click **Create user** or select an existing user
3. Click on the **Metadata** tab
4. In **Public metadata**, add:

```json
{
  "role": "admin",
  "permissions": [
    "users.view",
    "users.edit",
    "users.delete",
    "content.edit",
    "content.delete",
    "settings.edit"
  ]
}
```

5. Click **Save**

### 2.2 Create Moderator User

1. Create or select another user
2. In **Public metadata**, add:

```json
{
  "role": "moderator",
  "permissions": [
    "content.edit",
    "content.delete",
    "comments.moderate"
  ]
}
```

### 2.3 Create Regular User

1. Create or select another user
2. In **Public metadata**, add:

```json
{
  "role": "user",
  "permissions": [
    "content.create",
    "comments.create"
  ]
}
```

### 2.4 Create Viewer User

1. Create or select another user
2. In **Public metadata**, add:

```json
{
  "role": "viewer",
  "permissions": [
    "content.view"
  ]
}
```

## Step 3: Test the Implementation

### 3.1 Test Admin Access

1. Sign out of any existing session
2. Sign in as the admin user
3. Navigate to `/admin`
4. You should see the Admin Dashboard
5. Check that all admin features are accessible

### 3.2 Test Role Restrictions

1. Sign out
2. Sign in as a regular user
3. Try to navigate to `/admin`
4. You should be redirected to the home page
5. Verify the redirect works as expected

### 3.3 Test Moderator Access

1. Sign in as the moderator user
2. Navigate to `/admin`
3. Should be redirected (moderator is not admin)
4. Test moderator-specific routes if you have them

### 3.4 Verify Session Claims

Add a test page to verify session claims are working:

Create `/app/test-auth/page.tsx`:

```typescript
import { auth } from '@clerk/nextjs/server';

export default async function TestAuthPage() {
  const { userId, sessionClaims } = await auth();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      <div className="mb-4">
        <strong>User ID:</strong> {userId || 'Not authenticated'}
      </div>

      <div className="mb-4">
        <strong>Session Claims:</strong>
        <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
          {JSON.stringify(sessionClaims, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <strong>Metadata:</strong>
        <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
          {JSON.stringify(
            (sessionClaims as any)?.metadata,
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
```

Visit `/test-auth` while signed in to see your session data.

## Step 4: Environment Variables

Ensure your `.env.local` file has the correct Clerk keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Customize sign-in/sign-up URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Step 5: Update TypeScript Configuration

Ensure `types/globals.d.ts` is included in your TypeScript compilation.

Check `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... other options
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "types/**/*.d.ts"
  ]
}
```

## Step 6: Protect Your Routes

### 6.1 Middleware Protection (Already Done)

The `/admin/*` routes are already protected in `proxy.ts`.

### 6.2 Add More Protected Routes

Edit `proxy.ts` to add more protected routes:

```typescript
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/dashboard(.*)',
  '/settings(.*)',      // Add this
  '/profile(.*)',       // Add this
]);

const isModeratorRoute = createRouteMatcher([
  '/moderate(.*)',      // Add moderator routes
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);
```

Then add the moderator check in the middleware:

```typescript
// Check if route requires moderator role
if (isModeratorRoute(req)) {
  const userRole = (sessionClaims?.metadata as { role?: string })?.role;

  if (!['admin', 'moderator'].includes(userRole || '')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
```

## Step 7: Use RBAC in Components

### 7.1 Server Component Example

```typescript
import { checkRole } from '@/lib/auth';

export default async function DashboardPage() {
  const isAdmin = await checkRole('admin');

  return (
    <div>
      <h1>Dashboard</h1>

      {isAdmin && (
        <div>
          <h2>Admin Tools</h2>
          {/* Admin-only content */}
        </div>
      )}
    </div>
  );
}
```

### 7.2 Client Component Example

```typescript
'use client';

import { useRBAC } from '@/lib/use-rbac';

export function ClientDashboard() {
  const { isAdmin, hasPermission } = useRBAC();

  return (
    <div>
      <h1>Dashboard</h1>

      {isAdmin && <div>Admin Tools</div>}

      {hasPermission('content.create') && (
        <button>Create Content</button>
      )}
    </div>
  );
}
```

### 7.3 Server Action Example

```typescript
'use server';

import { requireRole } from '@/lib/auth';

export async function deleteUserAction(userId: string) {
  await requireRole('admin');

  // Delete user logic
  console.log(`Deleting user ${userId}`);

  return { success: true };
}
```

### 7.4 API Route Example

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden - Admin access required' },
      { status: 403 }
    );
  }

  // Delete logic
  return NextResponse.json({ success: true });
}
```

## Step 8: Testing Checklist

- [ ] Custom session claims are configured in Clerk
- [ ] Test users with different roles are created
- [ ] Admin user can access `/admin`
- [ ] Regular user is redirected from `/admin`
- [ ] Middleware is protecting routes correctly
- [ ] Server components can check roles
- [ ] Client components can check roles
- [ ] API routes enforce role requirements
- [ ] TypeScript types are working correctly
- [ ] Environment variables are set

## Common Issues and Solutions

### Issue: Role is `undefined` in session claims

**Solution:**
1. Verify custom session token is configured correctly in Clerk Dashboard
2. Sign out and sign back in (session token is generated at login)
3. Clear browser cookies and cache
4. Check that public metadata is set on the user

### Issue: TypeScript errors for `sessionClaims.metadata`

**Solution:**
1. Ensure `types/globals.d.ts` exists and is properly formatted
2. Restart TypeScript server in your IDE
3. Check `tsconfig.json` includes the types directory

### Issue: Middleware not protecting routes

**Solution:**
1. Verify `proxy.ts` is named `middleware.ts` in Next.js 13+ (rename if needed)
2. Check the matcher configuration
3. Ensure the route pattern matches your routes
4. Check Next.js version compatibility

### Issue: User gets redirected even with correct role

**Solution:**
1. Add debug logging to middleware
2. Check session claims in `/test-auth` page
3. Verify role value matches exactly (case-sensitive)
4. Check for typos in role name

## Advanced Configuration

### Multiple Roles per User

Set multiple roles in public metadata:

```json
{
  "roles": ["user", "moderator"],
  "permissions": ["content.edit", "comments.moderate"]
}
```

Use with:

```typescript
const roles = await getUserRoles();
const canModerate = roles.includes('moderator');
```

### Dynamic Permissions

Permissions can be added/removed per user:

```json
{
  "role": "user",
  "permissions": [
    "content.create",
    "content.edit",
    "special.feature"
  ]
}
```

### Organization-Based Roles

Add organization context:

```json
{
  "role": "admin",
  "organization": "acme-corp",
  "department": "engineering",
  "permissions": ["org.manage"]
}
```

## Next Steps

1. Customize roles and permissions in `lib/rbac-config.ts`
2. Add more protected routes as needed
3. Implement audit logging for role changes
4. Create admin UI for managing user roles
5. Add role-based data filtering in your API
6. Set up monitoring for unauthorized access attempts

## Resources

- [Clerk Custom Session Claims](https://clerk.com/docs/backend-requests/making/custom-session-token)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [RBAC Best Practices](https://en.wikipedia.org/wiki/Role-based_access_control)
