"use client"

import { useUser, useClerk, SignedIn, SignedOut } from "@/components/clerk-safe"
import Link from "next/link"

export default function TestAuthPage() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a1a]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black font-montserrat">
            Auth <span className="text-[#ff6a1a]">Test</span>
          </h1>
          <p className="mt-2 text-gray-600 font-lato">
            Testing Clerk authentication
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <SignedIn>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">Authenticated!</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Name:</span> {user?.fullName || user?.firstName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Email:</span> {user?.primaryEmailAddress?.emailAddress || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">User ID:</span> {user?.id || "N/A"}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Link
                  href="/dashboard"
                  className="flex-1 text-center bg-[#ff6a1a] hover:bg-[#ea580c] text-white font-bold py-3 px-4 rounded-lg transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ redirectUrl: "/" })}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </SignedIn>

          <SignedOut>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                <p className="font-semibold">Not authenticated</p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="flex-1 text-center bg-[#ff6a1a] hover:bg-[#ea580c] text-white font-bold py-3 px-4 rounded-lg transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-all"
                >
                  Register
                </Link>
              </div>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  )
}
