"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { Component, type ReactNode, type ErrorInfo } from "react"

interface AuthProviderProps {
  children: React.ReactNode
}

// Error boundary to catch Clerk initialization failures
class ClerkErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Clerk initialization failed, rendering without auth:', error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// TEMPORARILY DISABLED: Clerk test keys don't work in production
// TODO: Re-enable when live Clerk keys (pk_live_) are configured
// Force disable Clerk - using Supabase auth fallback
const IS_CLERK_CONFIGURED = false

export function AuthProvider({ children }: AuthProviderProps) {
  // If Clerk is not configured, render children without auth wrapper
  if (!IS_CLERK_CONFIGURED) {
    return <>{children}</>
  }

  return (
    <ClerkErrorBoundary fallback={<>{children}</>}>
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
    </ClerkErrorBoundary>
  )
}
