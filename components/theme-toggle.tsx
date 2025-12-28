"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative group flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-110 border border-gray-200 dark:border-gray-600"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Icon Container with smooth transition */}
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${
            isDark
              ? "opacity-0 scale-0 rotate-90"
              : "opacity-100 scale-100 rotate-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
            isDark
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 -rotate-90"
          }`}
        />
      </div>
    </button>
  )
}
