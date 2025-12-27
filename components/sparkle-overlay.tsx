"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface SparkleOverlayProps {
  count?: number
  className?: string
}

export function SparkleOverlay({ count = 12, className = "" }: SparkleOverlayProps) {
  const [showSparkles, setShowSparkles] = useState(false)

  useEffect(() => {
    setShowSparkles(true)
  }, [])

  // Generate random sparkle positions
  const sparkles = Array.from({ length: count }, (_, i) => ({
    left: `${5 + Math.random() * 90}%`,
    top: `${5 + Math.random() * 90}%`,
    delay: Math.random() * 2,
    size: ["sm", "md", "lg"][Math.floor(Math.random() * 3)] as "sm" | "md" | "lg",
  }))

  const getSparkleSize = (size: string) => {
    switch (size) {
      case "lg":
        return "w-4 h-4 md:w-6 md:h-6"
      case "md":
        return "w-3 h-3 md:w-4 md:h-4"
      default:
        return "w-2 h-2 md:w-3 md:h-3"
    }
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <AnimatePresence>
        {showSparkles &&
          sparkles.map((sparkle, i) => (
            <motion.div
              key={i}
              className={`absolute ${getSparkleSize(sparkle.size)} z-10`}
              style={{ left: sparkle.left, top: sparkle.top }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.7, 1, 0],
                scale: [0, 1.3, 0.9, 1.3, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3.5,
                delay: sparkle.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1.2,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                  fill="#D4A84B"
                  style={{ filter: "drop-shadow(0 0 10px rgba(212,168,75,0.95))" }}
                />
              </svg>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  )
}
