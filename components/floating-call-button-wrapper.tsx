"use client"

import dynamic from "next/dynamic"

// Dynamic import to prevent SSR issues with Clerk hooks and LiveKit
const FloatingCallButton = dynamic(
  () => import("./floating-call-button").then(mod => ({ default: mod.FloatingCallButton })),
  {
    ssr: false,
    loading: () => null // Don't show anything while loading to avoid flash
  }
)

export function FloatingCallButtonWrapper() {
  return <FloatingCallButton />
}
