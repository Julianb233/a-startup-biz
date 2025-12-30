"use client"

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

/**
 * Supabase Auth Components
 * Provides authentication state components similar to Clerk's pattern
 */

// SignedOut - renders children when not signed in
export function SignedOut({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    setMounted(true)
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  if (!mounted) return null
  if (user) return null

  return <>{children}</>
}

// SignedIn - renders children only when signed in
export function SignedIn({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [mounted, setMounted] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    setMounted(true)
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  if (!mounted) return null
  if (!user) return null

  return <>{children}</>
}

// SignInButton
export function SignInButton({
  children,
  redirectUrl = '/dashboard',
  className = ''
}: {
  children?: ReactNode
  redirectUrl?: string
  className?: string
}) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`)
  }

  if (children) {
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    )
  }

  return (
    <button onClick={handleClick} className={className}>
      Sign In
    </button>
  )
}

// SignUpButton
export function SignUpButton({
  children,
  redirectUrl = '/dashboard',
  className = ''
}: {
  children?: ReactNode
  redirectUrl?: string
  className?: string
}) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/register?redirectTo=${encodeURIComponent(redirectUrl)}`)
  }

  if (children) {
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    )
  }

  return (
    <button onClick={handleClick} className={className}>
      Sign Up
    </button>
  )
}

// UserButton
export function UserButton({
  afterSignOutUrl = '/',
  className = ''
}: {
  afterSignOutUrl?: string
  className?: string
}) {
  const [user, setUser] = useState<User | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push(afterSignOutUrl)
  }

  if (!user) return null

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100"
      >
        {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.email || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-medium">
            {(user.email?.[0] || 'U').toUpperCase()}
          </div>
        )}
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

// RedirectToSignIn
export function RedirectToSignIn() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return null
}

// useUser hook
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null)
      setIsLoaded(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
      setIsLoaded(true)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return {
    user,
    isLoaded,
    isSignedIn: !!user,
  }
}

// useAuth hook
export function useAuth() {
  const { user, isLoaded } = useUser()
  const supabase = getSupabaseClient()

  return {
    isLoaded,
    isSignedIn: !!user,
    userId: user?.id || null,
    sessionId: null, // Supabase doesn't expose session ID directly
    signOut: () => supabase.auth.signOut(),
    getToken: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.access_token || null
    },
  }
}
