"use client"

import { useState, useRef, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export function UserMenu() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (status === "loading") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-gray-700 hover:text-[#ff6a1a] transition-colors font-montserrat font-semibold"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="bg-[#ff6a1a] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg transition-all font-montserrat font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Get Started
        </Link>
      </div>
    )
  }

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a1a] to-[#ea580c] text-white font-bold font-montserrat flex items-center justify-center hover:shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ff6a1a] focus:ring-offset-2"
      >
        {userInitials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 font-montserrat">
              {session?.user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500 font-lato truncate">
              {session?.user?.email}
            </p>
          </div>

          <div className="py-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff6a1a] transition-colors font-lato"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff6a1a] transition-colors font-lato"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>
            <Link
              href="/billing"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#ff6a1a] transition-colors font-lato"
              onClick={() => setIsOpen(false)}
            >
              Billing
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={() => {
                setIsOpen(false)
                signOut({ callbackUrl: "/" })
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-lato font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
