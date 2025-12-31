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

// Check if Clerk is properly configured
// Requires valid publishable key AND must be explicitly enabled
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const enabled = process.env.NEXT_PUBLIC_CLERK_ENABLED

  // Must have valid key format
  const hasValidKey = key && !key.includes('placeholder') && key.startsWith('pk_')

  // In production with test keys, disable Clerk unless explicitly enabled
  const isTestKey = key?.includes('pk_test_')
  const isProduction = typeof window !== 'undefined' &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')

  // Disable test keys in production unless explicitly enabled
  if (isTestKey && isProduction && enabled !== 'true') {
    return false
  }

  return hasValidKey
}

export function AuthProvider({ children }: AuthProviderProps) {
  // If Clerk is not configured, render children without auth wrapper
  if (!isClerkConfigured()) {
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
