"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderOpen,
  Calendar,
  User,
  Settings,
  X,
  ShoppingBag,
  Briefcase,
  FileText,
  MapPin,
  HelpCircle
} from "lucide-react"

interface DashboardSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    name: "My Services",
    href: "/dashboard/services",
    icon: Briefcase
  },
  {
    name: "My Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag
  },
  {
    name: "Consultations",
    href: "/dashboard/consultations",
    icon: Calendar
  },
  {
    name: "Documents",
    href: "/dashboard/documents",
    icon: FileText
  },
  {
    name: "Local Resources",
    href: "/dashboard/local-resources",
    icon: MapPin
  },
  {
    name: "Resources",
    href: "/dashboard/resources",
    icon: FolderOpen
  },
  {
    name: "Support",
    href: "/dashboard/support",
    icon: HelpCircle
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings
  }
]

export default function DashboardSidebar({ isOpen = true, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff6a1a] to-[#ea580c] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ASB</span>
              </div>
              <span className="font-montserrat font-bold text-lg text-gray-900">
                Dashboard
              </span>
            </Link>

            {/* Close button for mobile */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                              (item.href !== "/dashboard" && pathname?.startsWith(item.href))

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] text-white shadow-lg shadow-orange-500/30"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
                  <span className="font-montserrat">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <h3 className="font-montserrat font-semibold text-sm text-gray-900 mb-1">
                Need Help?
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Schedule a consultation to get personalized guidance.
              </p>
              <Link
                href="/book-call"
                className="block w-full text-center px-4 py-2 bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
              >
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
