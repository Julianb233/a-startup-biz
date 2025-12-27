"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const STORAGE_KEY = "wizardai-cta-dismissed"

export function MidPageCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user already dismissed this session
    const dismissed = sessionStorage.getItem(STORAGE_KEY)
    if (dismissed === "true") {
      setIsDismissed(true)
      return
    }

    const handleScroll = () => {
      // Calculate scroll percentage (0 to 1)
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = scrollTop / docHeight

      // Show CTA when user has scrolled past 50% (midway) but before 90%
      const shouldShow = scrollPercent >= 0.5 && scrollPercent < 0.9
      setIsVisible(shouldShow)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDismissed(true)
    setIsVisible(false)
    sessionStorage.setItem(STORAGE_KEY, "true")
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const applySection = document.querySelector('#apply')
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Don't render if dismissed
  if (isDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
        >
          <motion.div
            className="relative block bg-[#0A4D3C] border-2 border-[#D4A84B] rounded-2xl overflow-hidden group"
            style={{
              boxShadow: "0 10px 40px rgba(212, 168, 75, 0.3), 0 0 0 1px rgba(212, 168, 75, 0.1)",
            }}
          >
            {/* X DISMISS BUTTON */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-[#FDF8E8]/10 hover:bg-[#FDF8E8]/20 transition-colors group/close"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-[#FDF8E8]/60 group-hover/close:text-[#FDF8E8]" />
            </button>

            {/* Clickable area for CTA */}
            <a
              href="#apply"
              onClick={handleClick}
              className="block"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A4D3C] via-[#0D5A45] to-[#0A4D3C] opacity-90" />

              {/* Animated golden sparkles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#D4A84B] rounded-full"
                    initial={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}

                {/* Larger sparkles */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={`large-${i}`}
                    className="absolute"
                    style={{
                      left: `${20 + i * 25}%`,
                      top: `${30 + (i % 2) * 40}%`,
                    }}
                    animate={{
                      rotate: [0, 180, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "linear",
                    }}
                  >
                    <svg
                      className="w-4 h-4 text-[#D4A84B]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0l1.5 8.5L12 12 10.5 8.5 12 0zM12 24l1.5-8.5L12 12l-1.5 3.5L12 24zM0 12l8.5-1.5L12 12l-3.5 1.5L0 12zM24 12l-8.5-1.5L12 12l3.5 1.5L24 12z" />
                    </svg>
                  </motion.div>
                ))}
              </div>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4A84B]/20 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Content */}
              <div className="relative px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left side - Text */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <motion.div
                      animate={{
                        rotate: [0, 20, -20, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-[#D4A84B]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </motion.div>
                    <span className="text-[#D4A84B] text-xs md:text-sm font-semibold uppercase tracking-wider">
                      Limited Spots Available
                    </span>
                  </div>
                  <h3 className="text-[#FDF8E8] text-lg md:text-2xl font-bold mb-1">
                    Get Your AI Roadmap
                  </h3>
                  <p className="text-[#FDF8E8]/70 text-sm md:text-base">
                    30-Minute Strategy Call • No Obligation • 24hr Response
                  </p>
                </div>

                {/* Right side - CTA Button */}
                <motion.button
                  className="relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#D4A84B] to-[#B8923F] text-[#0A4D3C] font-bold rounded-lg text-sm md:text-base whitespace-nowrap overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    boxShadow: "0 4px 20px rgba(212, 168, 75, 0.4)",
                  }}
                >
                  {/* Button shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Book Your Call
                    <svg
                      className="w-4 h-4 md:w-5 md:h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </motion.button>
              </div>

              {/* Bottom pulse line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4A84B] to-transparent"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </a>
          </motion.div>

          {/* Backdrop blur for mobile */}
          <div className="absolute inset-0 -z-10 backdrop-blur-md bg-black/20 rounded-2xl" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
