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
      <div className="w-[120px] h-10 bg-gray-100 dark:bg-gray-800 rounded-full" />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-[#1a365d] dark:to-[#2c5282] rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 border border-blue-200 dark:border-blue-900"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Lake Martin ${isDark ? "Day" : "Night"} Mode`}
    >
      {/* Lake Martin Branding Text */}
      <span className="text-xs font-semibold text-blue-600 dark:text-blue-300 whitespace-nowrap tracking-wide">
        Lake Martin
      </span>

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
          className={`absolute inset-0 w-5 h-5 text-blue-200 transition-all duration-300 ${
            isDark
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 -rotate-90"
          }`}
        />
      </div>

      {/* Ripple effect on hover */}
      <div className="absolute inset-0 rounded-full bg-white dark:bg-blue-900 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </button>
  )
}
