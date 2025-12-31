"use client"

import { ReactNode, useState, useEffect, lazy, Suspense, FormEvent } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

// Check if Clerk is properly configured
// Must match the logic in auth-provider.tsx exactly
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const enabled = process.env.NEXT_PUBLIC_CLERK_ENABLED

  // Must have valid key format
  const hasValidKey = key && !key.includes('placeholder') && key.startsWith('pk_')
  if (!hasValidKey) return false

  // In production with test keys, disable Clerk unless explicitly enabled
  const isTestKey = key?.includes('pk_test_')
  const isProduction = typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')

  // Disable test keys in production unless explicitly enabled
  if (isTestKey && isProduction && enabled !== 'true') {
    return false
  }

  return true
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
    const signUpUrl = typeof props.signUpUrl === 'string' ? props.signUpUrl : '/register'
    const redirectUrl = typeof props.forceRedirectUrl === 'string' ? props.forceRedirectUrl : '/dashboard'
    return <SupabaseLoginForm signUpUrl={signUpUrl} redirectUrl={redirectUrl} />
  }

  return <DynamicClerkSignIn {...props} />
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
    const signInUrl = typeof props.signInUrl === 'string' ? props.signInUrl : '/login'
    const redirectUrl = typeof props.forceRedirectUrl === 'string' ? props.forceRedirectUrl : '/dashboard'
    return <SupabaseSignUpForm signInUrl={signInUrl} redirectUrl={redirectUrl} />
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
