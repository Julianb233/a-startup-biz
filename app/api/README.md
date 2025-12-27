# API Routes Documentation

## Protected API Routes with Clerk Authentication

This directory contains protected API routes using Clerk authentication.

## Available Endpoints

### User Endpoint

**GET /api/user**
- Returns current authenticated user data
- Requires: Authentication
- Returns: User profile data

```bash
curl -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  http://localhost:3000/api/user
```

**PATCH /api/user**
- Updates user data (example endpoint)
- Requires: Authentication
- Body: User data to update

### Admin Endpoint

**GET /api/admin**
- Returns admin dashboard data
- Requires: Authentication + Admin role
- Returns: Admin statistics and permissions

**POST /api/admin**
- Performs admin actions
- Requires: Authentication + Admin role
- Body: `{ "action": "action_name", "data": {...} }`

**DELETE /api/admin**
- Performs admin deletions
- Requires: Authentication + Admin role
- Body: `{ "resource": "resource_type", "resourceId": "id" }`

## Setting Admin Role

To set a user as admin, update their Clerk metadata:

1. Go to Clerk Dashboard → Users
2. Select a user
3. Edit **Public Metadata** or **Private Metadata**
4. Add: `{ "role": "admin" }`

## Authentication Helper Functions

Located in `/lib/api-auth.ts`:

### `requireAuth()`
Ensures user is authenticated, throws 401 if not.

```typescript
import { requireAuth } from '@/lib/api-auth';

export async function GET() {
  const { userId } = await requireAuth();
  // ... protected logic
}
```

### `requireAdmin()`
Ensures user is authenticated AND has admin role, throws 401/403 if not.

```typescript
import { requireAdmin } from '@/lib/api-auth';

export async function POST() {
  const { userId, user } = await requireAdmin();
  // ... admin-only logic
}
```

### `getAuthenticatedUser()`
Returns user if authenticated, null otherwise (no errors thrown).

```typescript
import { getAuthenticatedUser } from '@/lib/api-auth';

export async function GET() {
  const authUser = await getAuthenticatedUser();

  if (authUser) {
    // User is logged in
  } else {
    // User is not logged in
  }
}
```

### `hasRole(role: string)`
Checks if current user has a specific role.

```typescript
import { hasRole } from '@/lib/api-auth';

export async function GET() {
  const isEditor = await hasRole('editor');

  if (isEditor) {
    // User has editor role
  }
}
```

### `withAuth(handler)`
Wrapper for automatic error handling in protected routes.

```typescript
import { withAuth, requireAuth } from '@/lib/api-auth';

export async function GET() {
  return withAuth(async () => {
    const { userId } = await requireAuth();
    // ... your logic
    return NextResponse.json({ data: 'success' });
  });
}
```

## Usage Examples

### Basic Protected Route

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ message: 'Protected data', userId });
}
```

### Using Helper Functions

```typescript
import { requireAuth, withAuth } from '@/lib/api-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  return withAuth(async () => {
    const { userId } = await requireAuth();

    // Your protected logic here
    return NextResponse.json({
      message: 'Success',
      userId
    });
  });
}
```

### Admin-Only Route

```typescript
import { requireAdmin, withAuth } from '@/lib/api-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return withAuth(async () => {
    const { userId, user } = await requireAdmin();

    const body = await request.json();

    // Admin-only logic here
    return NextResponse.json({
      message: 'Admin action completed',
      userId
    });
  });
}
```

### Optional Authentication

```typescript
import { getAuthenticatedUser } from '@/lib/api-auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const authUser = await getAuthenticatedUser();

  // Different responses for authenticated vs anonymous users
  if (authUser) {
    return NextResponse.json({
      message: 'Personalized data',
      user: authUser.userId
    });
  }

  return NextResponse.json({
    message: 'Public data'
  });
}
```

## Error Responses

### 401 Unauthorized
User is not authenticated.

```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
User is authenticated but lacks required permissions.

```json
{
  "error": "Forbidden",
  "message": "Admin access required"
}
```

### 500 Internal Server Error
Server error occurred.

```json
{
  "error": "Internal Server Error",
  "message": "Error details"
}
```

## Testing

### Testing with cURL

```bash
# Get user data (requires auth token)
curl -X GET http://localhost:3000/api/user \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"

# Get admin data (requires admin role)
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Perform admin action
curl -X POST http://localhost:3000/api/admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"action": "update_settings", "data": {"theme": "dark"}}'
```

### Testing with Fetch

```typescript
// Client-side fetch
const response = await fetch('/api/user', {
  headers: {
    'Authorization': `Bearer ${await getToken()}`,
  },
});

const data = await response.json();
```

## Security Notes

1. **Always validate input** in API routes
2. **Use HTTPS** in production
3. **Store admin role** in Clerk metadata (public or private)
4. **Rate limit** API endpoints to prevent abuse
5. **Log admin actions** for audit trails
6. **Validate JWT tokens** (Clerk handles this automatically)
7. **Use environment variables** for sensitive configuration

## Role Management

### Supported Roles

- `admin` - Full system access
- `editor` - Edit permissions
- `viewer` - Read-only access
- Custom roles as needed

### Setting Roles in Clerk

1. **Public Metadata** (visible to client):
```json
{
  "role": "admin"
}
```

2. **Private Metadata** (server-only):
```json
{
  "role": "admin",
  "permissions": ["manage_users", "view_analytics"]
}
```
