"use client"

import dynamic from "next/dynamic"

// Dynamic import to prevent SSR issues with Clerk hooks
const FloatingCallButton = dynamic(
  () => import("./floating-call-button").then(mod => mod.FloatingCallButton),
  { ssr: false }
)

export function FloatingCallButtonWrapper() {
  return <FloatingCallButton />
}
