# NextAuth.js Authentication System

This project uses NextAuth.js v4 for authentication with credentials provider (email/password).

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then update the values:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

To generate a secure secret:

```bash
openssl rand -base64 32
```

### 2. Demo Credentials

For testing, use these credentials:

- **Email:** `demo@example.com`
- **Password:** `password123`

## File Structure

```
/root/github-repos/a-startup-biz/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                    # Auth pages layout (no nav/footer)
│   │   ├── login/
│   │   │   └── page.tsx                  # Login page
│   │   └── register/
│   │       └── page.tsx                  # Registration page
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts              # NextAuth API route
│   │   └── register/
│   │       └── route.ts                  # User registration endpoint
│   └── layout.tsx                        # Root layout with AuthProvider
├── components/
│   ├── auth-provider.tsx                 # Session provider wrapper
│   ├── protected-route.tsx               # Protected route component
│   └── user-menu.tsx                     # User dropdown menu
├── hooks/
│   └── use-auth.ts                       # Auth hook
├── lib/
│   └── next-auth.ts                      # NextAuth configuration
└── types/
    └── next-auth.d.ts                    # TypeScript type extensions
```

## Usage Examples

### 1. Protecting Routes

Use the `ProtectedRoute` component to require authentication:

```tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Protected dashboard content</div>
    </ProtectedRoute>
  )
}
```

### 2. Using the Auth Hook

```tsx
"use client"

import { useAuth } from "@/hooks/use-auth"

export default function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return <div>Welcome, {user?.name}!</div>
}
```

### 3. Server-Side Authentication

In Server Components or API routes:

```tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"

export default async function ServerComponent() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <div>Welcome, {session.user.name}!</div>
}
```

### 4. Sign Out

```tsx
import { signOut } from "next-auth/react"

<button onClick={() => signOut({ callbackUrl: "/" })}>
  Sign Out
</button>
```

### 5. User Menu Component

Add the user menu to your navigation:

```tsx
import { UserMenu } from "@/components/user-menu"

export default function Navigation() {
  return (
    <nav>
      {/* Your navigation items */}
      <UserMenu />
    </nav>
  )
}
```

## Available Pages

- `/login` - Login page
- `/register` - Registration page

## User Storage

Currently using **in-memory storage** for demo purposes. The user data is stored in the `/root/github-repos/a-startup-biz/lib/next-auth.ts` file.

### Migrating to Database

To use a real database:

1. Install a database adapter (e.g., Prisma):
   ```bash
   pnpm add @prisma/client @next-auth/prisma-adapter
   pnpm add -D prisma
   ```

2. Update `/root/github-repos/a-startup-biz/lib/next-auth.ts`:
   ```tsx
   import { PrismaAdapter } from "@next-auth/prisma-adapter"
   import { PrismaClient } from "@prisma/client"

   const prisma = new PrismaClient()

   export const authOptions: NextAuthOptions = {
     adapter: PrismaAdapter(prisma),
     // ... rest of config
   }
   ```

3. Create Prisma schema for users, accounts, sessions

## Form Validation

Both login and register forms use:
- **react-hook-form** for form state management
- **zod** for schema validation
- **@hookform/resolvers** for zod integration

### Password Requirements

Registration passwords must:
- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number

## Styling

All auth pages use:
- **Orange (#ff6a1a)** brand color
- **Montserrat** font for headings
- **Lato** font for body text
- Tailwind CSS for styling
- Gradient backgrounds with orange tones
- Modern card design with shadows

## API Endpoints

### POST `/api/auth/[...nextauth]`
NextAuth.js handles authentication

### POST `/api/register`
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (Success):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "2",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response (Error):**
```json
{
  "error": "User with this email already exists"
}
```

## Security Features

1. **Password Hashing:** bcryptjs with 10 salt rounds
2. **JWT Sessions:** Secure JWT-based sessions
3. **CSRF Protection:** Built into NextAuth.js
4. **Secure Cookies:** HTTP-only cookies for session tokens
5. **Form Validation:** Client and server-side validation

## Next Steps

1. **Add OAuth Providers** (Google, GitHub, etc.)
2. **Implement Email Verification**
3. **Add Password Reset Flow**
4. **Setup Database Integration**
5. **Add Two-Factor Authentication**
6. **Implement Role-Based Access Control**

## Troubleshooting

### "Invalid email or password" error
- Ensure you're using the demo credentials
- Check that the user exists in `/root/github-repos/a-startup-biz/lib/next-auth.ts`

### Session not persisting
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain

### TypeScript errors
- The `/root/github-repos/a-startup-biz/types/next-auth.d.ts` file extends NextAuth types
- Make sure it's included in your `tsconfig.json`

## Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Credentials Provider Guide](https://next-auth.js.org/providers/credentials)
- [Session Management](https://next-auth.js.org/getting-started/client#usesession)
