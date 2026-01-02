"use client"

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // Handle case where Supabase is not configured
    if (!supabase) {
      console.warn("[use-auth] Supabase client not available - auth disabled")
      setIsLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const supabase = getSupabaseClient()
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  return {
    user: user ? {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || "User",
      email: user.email,
      image: user.user_metadata?.avatar_url,
    } : null,
    isAuthenticated: !!user,
    isLoading,
    isUnauthenticated: !isLoading && !user,
    signOut,
  }
}
