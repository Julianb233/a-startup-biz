"use client"

import { useAuth } from "@/hooks/use-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"

export default function TestAuthPage() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a1a]"></div>
          <p className="mt-4 text-gray-600 font-montserrat">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-black font-montserrat mb-6">
            Authentication Test Page
          </h1>

          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold font-montserrat">
                  ✓ You are authenticated!
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-900 font-montserrat">
                  User Information
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="font-lato">
                    <span className="font-semibold">Name:</span> {user?.name}
                  </p>
                  <p className="font-lato">
                    <span className="font-semibold">Email:</span> {user?.email}
                  </p>
                  <p className="font-lato">
                    <span className="font-semibold">User ID:</span> {user?.id}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors font-montserrat text-center"
                >
                  Go to Home
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors font-montserrat"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 font-semibold font-montserrat">
                  ⚠ You are not authenticated
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="flex-1 bg-[#ff6a1a] hover:bg-[#ea580c] text-white font-bold py-3 px-4 rounded-lg transition-colors font-montserrat text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors font-montserrat text-center"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
