"use client"

import { UserButton } from "@/components/clerk-safe"

export function AdminUserButton() {
  return <UserButton afterSignOutUrl="/" />
}
