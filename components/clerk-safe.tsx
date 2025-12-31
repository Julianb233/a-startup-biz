"use client"

import { ReactNode, useState, useEffect, lazy, Suspense } from "react"
import dynamic from "next/dynamic"

// Check if Clerk is properly configured
// Only requires a valid publishable key - no separate enable flag needed
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  return key && !key.includes('placeholder') && key.startsWith('pk_')
}

// Dynamically import Clerk components to prevent SSG issues
const DynamicClerkSignedIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignedIn })),
  { ssr: false }
)

const DynamicClerkSignedOut = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignedOut })),
  { ssr: false }
)

const DynamicClerkUserButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.UserButton })),
  { ssr: false }
)

const DynamicClerkSignInButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignInButton })),
  { ssr: false }
)

const DynamicClerkSignUpButton = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignUpButton })),
  { ssr: false }
)

const DynamicClerkSignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignIn })),
  { ssr: false }
)

const DynamicClerkSignUp = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.SignUp })),
  { ssr: false }
)

const DynamicClerkRedirectToSignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => ({ default: mod.RedirectToSignIn })),
  { ssr: false }
)

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
    return <>{children}</>
  }

  return <DynamicClerkSignedOut>{children}</DynamicClerkSignedOut>
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
    return null
  }

  return <DynamicClerkSignedIn>{children}</DynamicClerkSignedIn>
}

// Safe SignInButton
export function SignInButton({ children, mode, ...props }: { children?: ReactNode; mode?: "modal" | "redirect" } & Record<string, unknown>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isClerkConfigured()) {
    return (
      <a href="/login" className="inline-block">
        {children}
      </a>
    )
  }

  return <DynamicClerkSignInButton mode={mode} {...props}>{children}</DynamicClerkSignInButton>
}

// Safe SignUpButton
export function SignUpButton({ children, mode, ...props }: { children?: ReactNode; mode?: "modal" | "redirect" } & Record<string, unknown>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isClerkConfigured()) {
    return (
      <a href="/register" className="inline-block">
        {children}
      </a>
    )
  }

  return <DynamicClerkSignUpButton mode={mode} {...props}>{children}</DynamicClerkSignUpButton>
}

// Safe UserButton
export function UserButton(props: { afterSignOutUrl?: string } & Record<string, unknown>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isClerkConfigured()) {
    return null
  }

  return <DynamicClerkUserButton {...props} />
}

// Safe SignIn component
export function SignIn(props: Record<string, unknown>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="text-center p-8">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!isClerkConfigured()) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Sign In</h2>
        <p className="text-gray-600 mb-4">Authentication is not configured.</p>
        <p className="text-sm text-gray-500">Please configure Clerk authentication to enable sign in.</p>
      </div>
    )
  }

  return <DynamicClerkSignIn {...props} />
}

// Safe SignUp component
export function SignUp(props: Record<string, unknown>) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="text-center p-8">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  if (!isClerkConfigured()) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
        <p className="text-gray-600 mb-4">Authentication is not configured.</p>
        <p className="text-sm text-gray-500">Please configure Clerk authentication to enable registration.</p>
      </div>
    )
  }

  return <DynamicClerkSignUp {...props} />
}

// Safe useUser hook that handles SSR/prerendering
export function useUser() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/prerendering, return a safe default
  if (typeof window === 'undefined' || !mounted) {
    return {
      isLoaded: false,
      isSignedIn: undefined,
      user: undefined,
    } as unknown as ReturnType<typeof import("@clerk/nextjs").useUser>
  }

  // If Clerk is not configured, return safe mock values
  if (!isClerkConfigured()) {
    return {
      isLoaded: true,
      isSignedIn: false,
      user: null,
    } as unknown as ReturnType<typeof import("@clerk/nextjs").useUser>
  }

  // On client with Clerk configured, use the real hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useUser: clerkUseUser } = require("@clerk/nextjs")
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return clerkUseUser()
}

// Safe useAuth hook that handles SSR/prerendering
export function useAuth() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/prerendering, return a safe default
  if (typeof window === 'undefined' || !mounted) {
    return {
      isLoaded: false,
      isSignedIn: undefined,
      userId: null,
      sessionId: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      has: () => false,
      signOut: async () => {},
      getToken: async () => null,
    } as unknown as ReturnType<typeof import("@clerk/nextjs").useAuth>
  }

  // If Clerk is not configured, return safe mock values
  if (!isClerkConfigured()) {
    return {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionId: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      has: () => false,
      signOut: async () => {},
      getToken: async () => null,
    } as unknown as ReturnType<typeof import("@clerk/nextjs").useAuth>
  }

  // On client with Clerk configured, use the real hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useAuth: clerkUseAuth } = require("@clerk/nextjs")
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return clerkUseAuth()
}

// Safe useClerk hook that handles SSR/prerendering
export function useClerk() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/prerendering, return a safe default
  if (typeof window === 'undefined' || !mounted) {
    return {
      loaded: false,
      signOut: async () => {},
      openSignIn: () => {},
      openSignUp: () => {},
      openUserProfile: () => {},
    } as unknown as ReturnType<typeof import("@clerk/nextjs").useClerk>
  }

  // If Clerk is not configured, return safe mock values
  if (!isClerkConfigured()) {
    return {
      loaded: true,
      signOut: async () => {},
      openSignIn: () => {},
      openSignUp: () => {},
      openUserProfile: () => {},
    } as unknown as ReturnType<typeof import("@clerk/nextjs").useClerk>
  }

  // On client with Clerk configured, use the real hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { useClerk: clerkUseClerk } = require("@clerk/nextjs")
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return clerkUseClerk()
}

// Safe RedirectToSignIn
export function RedirectToSignIn() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (!isClerkConfigured()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }

  return <DynamicClerkRedirectToSignIn />
}

// Export the isClerkConfigured check for other components
export { isClerkConfigured }
