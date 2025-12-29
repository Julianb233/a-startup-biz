"use client"

import { SignedIn, SignedOut, UserButton } from "@/components/clerk-safe"
import Link from "next/link"

export function UserMenu() {
  return (
    <>
      <SignedOut>
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
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "shadow-xl",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </>
  )
}
