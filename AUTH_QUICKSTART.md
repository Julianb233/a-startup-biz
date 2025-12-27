# NextAuth.js Quick Start Guide

## Getting Started in 3 Steps

### 1. Set Environment Variables

Create `.env.local` in the root directory:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-this-to-a-random-string
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2. Start the Development Server

```bash
pnpm dev
```

### 3. Test the Authentication

Visit these pages:

- **Login:** http://localhost:3000/login
- **Register:** http://localhost:3000/register
- **Test Page:** http://localhost:3000/test-auth

### Demo Credentials

```
Email: demo@example.com
Password: password123
```

## What Was Created?

### Core Files

1. **`/lib/next-auth.ts`**
   - NextAuth configuration
   - In-memory user store (demo)
   - User creation function

2. **`/app/api/auth/[...nextauth]/route.ts`**
   - NextAuth API handler

3. **`/app/api/register/route.ts`**
   - User registration endpoint

4. **`/app/(auth)/login/page.tsx`**
   - Beautiful login page with validation

5. **`/app/(auth)/register/page.tsx`**
   - Registration page with password requirements

6. **`/components/auth-provider.tsx`**
   - Session provider wrapper

### Helper Components

7. **`/components/user-menu.tsx`**
   - User dropdown menu (add to navbar)

8. **`/components/protected-route.tsx`**
   - Wrapper for protected pages

9. **`/hooks/use-auth.ts`**
   - Convenient auth hook

10. **`/middleware.ts`**
    - Route protection middleware (optional)

## Quick Examples

### Add User Menu to Navigation

```tsx
import { UserMenu } from "@/components/user-menu"

export default function Navigation() {
  return (
    <nav>
      <UserMenu />
    </nav>
  )
}
```

### Protect a Page

```tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Dashboard content</div>
    </ProtectedRoute>
  )
}
```

### Use Auth Hook

```tsx
"use client"
import { useAuth } from "@/hooks/use-auth"

export default function MyComponent() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <div>Please login</div>

  return <div>Hello {user?.name}!</div>
}
```

### Server-Side Auth

```tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"

export default async function Page() {
  const session = await getServerSession(authOptions)

  return <div>{session?.user?.email}</div>
}
```

## Features

- Modern, branded UI (orange #ff6a1a theme)
- Form validation with react-hook-form + zod
- Password hashing with bcryptjs
- Responsive design
- Loading states
- Error handling
- Remember me functionality
- Auto-login after registration

## Next Steps

1. **Add to Navigation** - Import `UserMenu` component
2. **Protect Routes** - Use `ProtectedRoute` or middleware
3. **Add Database** - Replace in-memory storage with Prisma/MongoDB
4. **Add OAuth** - Google, GitHub, etc.
5. **Email Verification** - Add email confirmation flow
6. **Password Reset** - Implement forgot password

## File Locations

All files are in `/root/github-repos/a-startup-biz/`:

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── test-auth/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       └── register/route.ts
├── components/
│   ├── auth-provider.tsx
│   ├── protected-route.tsx
│   └── user-menu.tsx
├── hooks/
│   └── use-auth.ts
├── lib/
│   └── next-auth.ts
└── types/
    └── next-auth.d.ts
```

## Troubleshooting

**Build Error?** - There's an existing TypeScript error in `/app/(dashboard)/dashboard/settings/page.tsx` (unrelated to auth)

**Can't login?** - Use the demo credentials exactly as shown above

**Session not persisting?** - Make sure `NEXTAUTH_SECRET` is set in `.env.local`

For detailed documentation, see `AUTH_SETUP.md`
