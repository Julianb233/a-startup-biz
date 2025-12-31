"use client"

import { ClerkProvider } from "@clerk/nextjs"

interface AuthProviderProps {
  children: React.ReactNode
}

// Check if Clerk is properly configured
// Only requires a valid publishable key - no separate enable flag needed
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return key && !key.includes('placeholder') && key.startsWith('pk_')
}

export function AuthProvider({ children }: AuthProviderProps) {
  // If Clerk is not configured, render children without auth wrapper
  if (!isClerkConfigured()) {
    return <>{children}</>
  }

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white",
          card: "shadow-lg",
          headerTitle: "text-gray-900",
          headerSubtitle: "text-gray-600",
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
