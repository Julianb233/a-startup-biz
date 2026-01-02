"use client"

import { ReactNode, useState, useEffect, FormEvent, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser, Session, AuthChangeEvent } from "@supabase/supabase-js"

// Import Supabase auth utilities
import { getSupabaseClient } from "@/lib/supabase/client"

/**
 * Local type definitions for Clerk-compatible hooks
 * These replace the @clerk/nextjs type imports to avoid package dependency
 */

// Clerk-compatible user type
interface ClerkCompatibleUser {
  id: string
  primaryEmailAddress: { emailAddress: string } | null | undefined
  emailAddresses: { emailAddress: string }[]
  firstName: string | null | undefined
  lastName: string | null | undefined
  fullName: string | null | undefined
  imageUrl: string | null | undefined
  username: string | null | undefined
  createdAt: Date | null | undefined
  updatedAt: Date | null | undefined
  publicMetadata: Record<string, unknown>
}

// Return type for useUser hook
interface UseUserReturn {
  isLoaded: boolean
  isSignedIn: boolean | undefined
  user: ClerkCompatibleUser | null | undefined
}

// SignOut options type
interface SignOutOptions {
  redirectUrl?: string
}

// Return type for useAuth hook
interface UseAuthReturn {
  isLoaded: boolean
  isSignedIn: boolean | undefined
  userId: string | null
  sessionId: string | null
  orgId: string | null
  orgRole: string | null
  orgSlug: string | null
  has: (permission: unknown) => boolean
  signOut: (options?: SignOutOptions) => Promise<void>
  getToken: () => Promise<string | null>
}

// Return type for useClerk hook
interface UseClerkReturn {
  loaded: boolean
  signOut: (options?: SignOutOptions) => Promise<void>
  openSignIn: () => void
  openSignUp: () => void
  openUserProfile: () => void
}

/**
 * Hook to get Supabase session state
 * Used as fallback when Clerk is not configured
 */
function useSupabaseSession() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      } catch (error) {
        console.error("[clerk-safe] Error getting Supabase session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async (options?: SignOutOptions) => {
    const supabase = getSupabaseClient()
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    // Redirect after sign out (use provided URL or default to home)
    if (typeof window !== "undefined") {
      window.location.href = options?.redirectUrl ?? "/"
    }
  }, [])

  return { user, session, isLoading, signOut }
}

// Check if Clerk is properly configured
// TEMPORARILY DISABLED: Using Supabase auth fallback
// TODO: Re-enable when live Clerk keys (pk_live_) are configured
const isClerkConfigured = () => {
  // Force disable Clerk - test keys don't work in production
  // When ready to enable Clerk:
  // const key = typeof window !== 'undefined'
  //   ? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  //   : undefined
  // return key && key.startsWith('pk_live_')
  return false
}

// NOTE: Clerk dynamic imports REMOVED to prevent SDK auto-initialization
// The Clerk SDK auto-initializes when it detects NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
// even if we don't render Clerk components. By removing all imports,
// Clerk is completely excluded from the client bundle.

// Safe SignedOut - renders children when not signed in or when Clerk isn't configured
export function SignedOut({ children }: { children: ReactNode }) {
  // Clerk is disabled - always show signed out content
  // When Clerk is re-enabled, this will need to use the actual Clerk component
  return <>{children}</>
}

// Safe SignedIn - renders children only when signed in (nothing when Clerk isn't configured)
export function SignedIn({ children }: { children: ReactNode }) {
  // Clerk is disabled - don't render Clerk-based signed-in content
  // Use useAuth() hook instead to check if user is signed in with Supabase
  return null
}

// Safe SignInButton - always links to login page when Clerk is disabled
export function SignInButton({ children }: { children?: ReactNode; mode?: "modal" | "redirect" } & Record<string, unknown>) {
  return (
    <a href="/login" className="inline-block">
      {children}
    </a>
  )
}

// Safe SignUpButton - always links to register page when Clerk is disabled
export function SignUpButton({ children }: { children?: ReactNode; mode?: "modal" | "redirect" } & Record<string, unknown>) {
  return (
    <a href="/register" className="inline-block">
      {children}
    </a>
  )
}

// Safe UserButton - returns null when Clerk is disabled
// Use a custom user menu component with useAuth() hook instead
export function UserButton(_props: { afterSignOutUrl?: string } & Record<string, unknown>) {
  return null
}

// Supabase Login Form Fallback
function SupabaseLoginForm({ signUpUrl = "/register", redirectUrl = "/dashboard" }: { signUpUrl?: string; redirectUrl?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { signIn } = await import("@/lib/supabase/auth")
      const { data, error: signInError } = await signIn(email, password)

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data?.session) {
        router.push(redirectUrl)
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Welcome back</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter your password"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#ff6a1a] hover:bg-[#ea580c] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <a href={signUpUrl} className="text-[#ff6a1a] hover:text-[#ea580c] font-semibold">
          Sign up
        </a>
      </p>
    </div>
  )
}

// Safe SignIn component - always renders Supabase login when Clerk is disabled
export function SignIn(props: Record<string, unknown>) {
  const signUpUrl = typeof props.signUpUrl === 'string' ? props.signUpUrl : '/register'
  const redirectUrl = typeof props.forceRedirectUrl === 'string' ? props.forceRedirectUrl : '/dashboard'
  return <SupabaseLoginForm signUpUrl={signUpUrl} redirectUrl={redirectUrl} />
}

// Supabase Sign Up Form Fallback
function SupabaseSignUpForm({ signInUrl = "/login", redirectUrl = "/dashboard" }: { signInUrl?: string; redirectUrl?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { signUp } = await import("@/lib/supabase/auth")
      const { data, error: signUpError } = await signUp(email, password)

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data?.user) {
        setSuccess(true)
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Check your email</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We&apos;ve sent a confirmation link to <strong>{email}</strong>
        </p>
        <a href={signInUrl} className="text-[#ff6a1a] hover:text-[#ea580c] font-semibold">
          Back to sign in
        </a>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Create an account</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Get started with your free account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#ff6a1a] hover:bg-[#ea580c] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <a href={signInUrl} className="text-[#ff6a1a] hover:text-[#ea580c] font-semibold">
          Sign in
        </a>
      </p>
    </div>
  )
}

// Safe SignUp component - always renders Supabase signup when Clerk is disabled
export function SignUp(props: Record<string, unknown>) {
  const signInUrl = typeof props.signInUrl === 'string' ? props.signInUrl : '/login'
  const redirectUrl = typeof props.forceRedirectUrl === 'string' ? props.forceRedirectUrl : '/dashboard'
  return <SupabaseSignUpForm signInUrl={signInUrl} redirectUrl={redirectUrl} />
}

// Safe useUser hook that handles SSR/prerendering
export function useUser() {
  const [mounted, setMounted] = useState(false)
  const supabaseSession = useSupabaseSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  // During SSR/prerendering, return a safe default
  if (typeof window === 'undefined' || !mounted) {
    return {
      isLoaded: false,
      isSignedIn: undefined,
      user: undefined,
    } as UseUserReturn
  }

  // If Clerk is not configured, use Supabase session
  if (!isClerkConfigured()) {
    const { user, isLoading } = supabaseSession

    // Map Supabase user to Clerk-compatible format
    const clerkCompatibleUser = user ? {
      id: user.id,
      primaryEmailAddress: {
        emailAddress: user.email || "",
      },
      emailAddresses: user.email ? [{ emailAddress: user.email }] : [],
      firstName: user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || null,
      lastName: user.user_metadata?.last_name || user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || null,
      fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || null,
      imageUrl: user.user_metadata?.avatar_url || null,
      username: user.email?.split("@")[0] || null,
      createdAt: user.created_at ? new Date(user.created_at) : null,
      updatedAt: user.updated_at ? new Date(user.updated_at) : null,
      publicMetadata: user.user_metadata || {},
    } : null

    return {
      isLoaded: !isLoading,
      isSignedIn: !!user,
      user: clerkCompatibleUser,
    } as UseUserReturn
  }

  // Clerk is disabled - this branch is never reached
  // When re-enabling Clerk, uncomment:
  // const { useUser: clerkUseUser } = require("@clerk/nextjs")
  // return clerkUseUser()
  return {
    isLoaded: true,
    isSignedIn: false,
    user: null,
  } as UseUserReturn
}

// Safe useAuth hook that handles SSR/prerendering
export function useAuth() {
  const [mounted, setMounted] = useState(false)
  const supabaseSession = useSupabaseSession()

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
    } as UseAuthReturn
  }

  // If Clerk is not configured, use Supabase session
  if (!isClerkConfigured()) {
    const { user, session, isLoading, signOut } = supabaseSession

    return {
      isLoaded: !isLoading,
      isSignedIn: !!user,
      userId: user?.id || null,
      sessionId: session?.access_token?.substring(0, 16) || null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      has: () => false,
      signOut: signOut,
      getToken: async () => session?.access_token || null,
    } as UseAuthReturn
  }

  // Clerk is disabled - this branch is never reached
  // When re-enabling Clerk, uncomment:
  // const { useAuth: clerkUseAuth } = require("@clerk/nextjs")
  // return clerkUseAuth()
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
  } as UseAuthReturn
}

// Safe useClerk hook that handles SSR/prerendering
export function useClerk() {
  const [mounted, setMounted] = useState(false)
  const supabaseSession = useSupabaseSession()
  const router = useRouter()

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
    } as UseClerkReturn
  }

  // If Clerk is not configured, use Supabase for sign out
  if (!isClerkConfigured()) {
    const { signOut, isLoading } = supabaseSession

    return {
      loaded: !isLoading,
      signOut: async (options?: SignOutOptions) => {
        await signOut(options)
      },
      openSignIn: () => {
        router.push("/login")
      },
      openSignUp: () => {
        router.push("/register")
      },
      openUserProfile: () => {
        router.push("/dashboard/profile")
      },
    } as UseClerkReturn
  }

  // Clerk is disabled - this branch is never reached
  // When re-enabling Clerk, uncomment:
  // const { useClerk: clerkUseClerk } = require("@clerk/nextjs")
  // return clerkUseClerk()
  return {
    loaded: true,
    signOut: async () => {},
    openSignIn: () => {},
    openSignUp: () => {},
    openUserProfile: () => {},
  } as UseClerkReturn
}

// Safe RedirectToSignIn - redirects to login page when Clerk is disabled
export function RedirectToSignIn() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }, [])
  return null
}

// Export the isClerkConfigured check for other components
export { isClerkConfigured }
