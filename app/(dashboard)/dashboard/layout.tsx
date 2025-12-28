"use client"

import { useState } from "react"
import { useUser, useClerk, SignedIn, RedirectToSignIn } from "@/components/clerk-safe"
import { useRouter } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { ChatbotProvider } from "@/components/chatbot-provider"
import SalesChatbot from "@/components/sales-chatbot"
import { Menu, User, LogOut, Settings, ChevronDown } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a1a]"></div>
      </div>
    )
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  const initials = user?.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U"

  const userName = user?.fullName || user?.firstName || "User"
  const userEmail = user?.primaryEmailAddress?.emailAddress

  return (
    <ChatbotProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <DashboardSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      aria-label="Open sidebar"
                    >
                      <Menu className="h-6 w-6 text-gray-700" />
                    </button>

                    {/* Greeting */}
                    <div>
                      <h1 className="font-montserrat text-xl font-bold text-gray-900">
                        Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
                      </h1>
                      <p className="text-sm text-gray-600">
                        Here's what's happening with your business today.
                      </p>
                    </div>
                  </div>

                  {/* User menu */}
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {user?.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={userName}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#ff6a1a] flex items-center justify-center text-white font-bold">
                          {initials}
                        </div>
                      )}
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Dropdown menu */}
                    {userMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">
                              {userName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {userEmail}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false)
                              router.push("/dashboard/profile")
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </button>
                          <button
                            onClick={() => {
                              setUserMenuOpen(false)
                              router.push("/dashboard/settings")
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </button>
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                              onClick={() => signOut({ redirectUrl: "/" })}
                              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <LogOut className="w-4 h-4" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Page content */}
            <main className="flex-1 overflow-y-auto">
              <div className="px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>

          {/* Sales Chatbot */}
          <SalesChatbot />
        </div>
      </div>
    </ChatbotProvider>
  )
}
