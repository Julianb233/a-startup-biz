"use client"

import { ReactNode, useState, useEffect } from "react"
import {
  SignInButton as ClerkSignInButton,
  SignUpButton as ClerkSignUpButton,
  SignedIn as ClerkSignedIn,
  SignedOut as ClerkSignedOut,
  UserButton as ClerkUserButton,
  RedirectToSignIn as ClerkRedirectToSignIn,
  SignIn as ClerkSignIn,
  SignUp as ClerkSignUp,
  useUser as clerkUseUser,
  useAuth as clerkUseAuth,
  useClerk as clerkUseClerk,
} from "@clerk/nextjs"

// Check if Clerk is properly configured (not using placeholder keys)
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return key && !key.includes('placeholder') && key.startsWith('pk_')
}

// Check if we're on the server (during SSR/SSG)
const isServer = typeof window === 'undefined'

// Safe SignedOut - renders children when not signed in or when Clerk isn't configured
export function SignedOut({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/SSG, show the signed out content (safe fallback)
  if (!mounted) {
    return <>{children}</>
  }

  if (!isClerkConfigured()) {
    // When Clerk isn't configured, always show the signed out content
    return <>{children}</>
  }
  return <ClerkSignedOut>{children}</ClerkSignedOut>
}

// Safe SignedIn - renders children only when signed in (nothing when Clerk isn't configured)
export function SignedIn({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/SSG, don't show signed-in content (safe fallback)
  if (!mounted) {
    return null
  }

  if (!isClerkConfigured()) {
    // When Clerk isn't configured, don't show signed-in content
    return null
  }
  return <ClerkSignedIn>{children}</ClerkSignedIn>
}

// Safe SignInButton
export function SignInButton({ children, mode, ...props }: { children?: ReactNode; mode?: "modal" | "redirect" } & Record<string, unknown>) {
  if (!isClerkConfigured()) {
    // When Clerk isn't configured, render a link to login page
    return (
      <a href="/login" className="inline-block">
        {children}
      </a>
    )
  }
  return <ClerkSignInButton mode={mode} {...props}>{children}</ClerkSignInButton>
}

// Safe SignUpButton
export function SignUpButton({ children, mode, ...props }: { children?: ReactNode; mode?: "modal" | "redirect" } & Record<string, unknown>) {
  if (!isClerkConfigured()) {
    // When Clerk isn't configured, render a link to register page
    return (
      <a href="/register" className="inline-block">
        {children}
      </a>
    )
  }
  return <ClerkSignUpButton mode={mode} {...props}>{children}</ClerkSignUpButton>
}

// Safe UserButton
export function UserButton(props: { afterSignOutUrl?: string } & Record<string, unknown>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/SSG, show nothing (safe fallback)
  if (!mounted) {
    return null
  }

  if (!isClerkConfigured()) {
    // When Clerk isn't configured, show nothing
    return null
  }
  return <ClerkUserButton {...props} />
}

// Safe SignIn component
export function SignIn(props: Record<string, unknown>) {
  if (!isClerkConfigured()) {
    // When Clerk isn't configured, show a message
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Sign In</h2>
        <p className="text-gray-600 mb-4">Authentication is not configured.</p>
        <p className="text-sm text-gray-500">Please configure Clerk authentication to enable sign in.</p>
      </div>
    )
  }
  return <ClerkSignIn {...props} />
}

// Safe SignUp component
export function SignUp(props: Record<string, unknown>) {
  if (!isClerkConfigured()) {
    // When Clerk isn't configured, show a message
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
        <p className="text-gray-600 mb-4">Authentication is not configured.</p>
        <p className="text-sm text-gray-500">Please configure Clerk authentication to enable registration.</p>
      </div>
    )
  }
  return <ClerkSignUp {...props} />
}

// Safe useUser hook
export function useUser() {
  if (!isClerkConfigured()) {
    // Return a mock user object when Clerk isn't configured
    return {
      isLoaded: true,
      isSignedIn: false,
      user: null,
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return clerkUseUser()
}

// Safe useAuth hook
export function useAuth() {
  if (!isClerkConfigured()) {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionId: null,
      orgId: null,
      signOut: async () => {},
      getToken: async () => null,
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return clerkUseAuth()
}

// Safe useClerk hook
export function useClerk() {
  if (!isClerkConfigured()) {
    return {
      signOut: async () => {
        // Redirect to home when Clerk isn't configured
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      },
      openSignIn: () => {},
      openSignUp: () => {},
      openUserProfile: () => {},
    }
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return clerkUseClerk()
}

// Safe RedirectToSignIn
export function RedirectToSignIn() {
  if (!isClerkConfigured()) {
    // Redirect to login page when Clerk isn't configured
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }
  return <ClerkRedirectToSignIn />
}

// Export the isClerkConfigured check for other components
export { isClerkConfigured }
