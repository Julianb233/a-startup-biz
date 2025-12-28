"use client"

import { useUser, useAuth as useClerkAuth } from "@/components/clerk-safe"

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerkAuth()

  return {
    user: user ? {
      id: user.id,
      name: user.fullName || user.firstName || "User",
      email: user.primaryEmailAddress?.emailAddress,
      image: user.imageUrl,
    } : null,
    isAuthenticated: !!isSignedIn,
    isLoading: !isLoaded,
    isUnauthenticated: isLoaded && !isSignedIn,
    signOut,
  }
}
