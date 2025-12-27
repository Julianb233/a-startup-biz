import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// TODO: SECURITY CRITICAL - Replace with database storage before production
// WARNING: In-memory user store is for demo/development only
// Users will be lost on server restart. Not suitable for production.
// See: SECURITY_AUDIT_REPORT.md - Issue #11
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    // Password: "password123" (pre-hashed)
    password: "$2b$10$QE/Qt9IOZN9hIqpv60e1COQvCqSM99BHnnjvVeOTiU0oQp.USsTB.",
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        // Find user by email
        const user = users.find((u) => u.email === credentials.email)

        if (!user) {
          throw new Error("No user found with this email")
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        // Return user object (without password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Helper function to add a new user (for registration)
export async function createUser(data: {
  name: string
  email: string
  password: string
}) {
  // Check if user already exists
  const existingUser = users.find((u) => u.email === data.email)
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create new user
  const newUser = {
    id: String(users.length + 1),
    name: data.name,
    email: data.email,
    password: hashedPassword,
  }

  // Add to in-memory store
  users.push(newUser)

  // Return user without password
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  }
}
