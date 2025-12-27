"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      setIsVisible(false)
      document.body.style.overflow = "unset"
    }, 3500)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "unset"
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, #0A4D3C 0%, #0D6B4F 50%, #1A8B6B 100%)" }}
        >
          <div className="relative flex items-center justify-center overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <span className="font-brier text-5xl md:text-7xl lg:text-8xl">The Wizard</span>
              <span className="font-[family-name:var(--font-oswald)] text-3xl md:text-4xl lg:text-5xl tracking-wider mt-2">
                OF AI
              </span>

              {/* Stylized sparkle effect */}
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-4 -right-4 md:-top-6 md:-right-6 text-2xl md:text-4xl"
              >
                ✨
              </motion.span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-12 font-[family-name:var(--font-oswald)] text-sm md:text-base font-bold tracking-widest uppercase"
          >
            AI MAGIC AWAITS
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
