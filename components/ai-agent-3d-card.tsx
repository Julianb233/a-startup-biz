"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"

interface AIAgent3DCardProps {
  number: string
  name: string
  category: string
  tagline: string
  problem: string
  solution: string
  capabilities: string[]
  image: string
  icon?: string
}

export function AIAgent3DCard({
  number,
  name,
  category,
  tagline,
  problem,
  solution,
  capabilities,
  image,
}: AIAgent3DCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring animations for smooth movement
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Calculate position relative to center (-0.5 to 0.5)
    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)

    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      className="perspective-1000 w-full max-w-md mx-auto"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-[500px] cursor-pointer"
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <motion.div
          className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-teal-900 via-teal-800 to-black border border-wizard-cyan/30 rounded-3xl overflow-hidden group">
            {/* Animated gradient border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.3), transparent 70%), linear-gradient(-45deg, transparent 30%, rgba(255, 105, 180, 0.3), transparent 70%)",
                backgroundSize: "200% 200%",
              }}
              animate={{
                backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Card content */}
            <div className="relative z-10 w-full h-full p-8 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-wizard-cyan to-wizard-bright-pink flex items-center justify-center font-bold text-teal-900 text-lg"
                    animate={{
                      boxShadow: isHovered
                        ? [
                            "0 0 20px rgba(0, 255, 255, 0.3)",
                            "0 0 40px rgba(0, 255, 255, 0.5)",
                            "0 0 20px rgba(0, 255, 255, 0.3)",
                          ]
                        : "0 0 20px rgba(0, 255, 255, 0.3)",
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {number}
                  </motion.div>
                  <span className="px-3 py-1 rounded-full bg-wizard-cyan/20 text-wizard-cyan text-xs font-semibold uppercase tracking-wider">
                    {category}
                  </span>
                </div>

                {/* 3D rotate hint */}
                <motion.div
                  className="flex items-center gap-1 text-white/40 text-xs"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Flip</span>
                </motion.div>
              </div>

              {/* Image/Visual */}
              <div className="relative flex-1 rounded-2xl overflow-hidden mb-6 group-hover:shadow-2xl group-hover:shadow-wizard-cyan/20 transition-shadow duration-500">
                <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-teal-900 via-transparent to-transparent" />

                {/* Floating icon */}
                <motion.div
                  className="absolute top-4 left-4 w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center"
                  animate={{
                    y: isHovered ? [-5, 5, -5] : 0,
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <svg className="w-8 h-8 text-wizard-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>

                {/* Sparkle particles */}
                {isHovered && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-wizard-bright-pink rounded-full"
                        initial={{
                          x: "50%",
                          y: "50%",
                          scale: 0,
                          opacity: 1,
                        }}
                        animate={{
                          x: `${50 + Math.cos((i / 6) * Math.PI * 2) * 40}%`,
                          y: `${50 + Math.sin((i / 6) * Math.PI * 2) * 40}%`,
                          scale: [0, 1, 0],
                          opacity: [1, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </>
                )}
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2">
                <h3 className="font-[family-name:var(--font-oswald)] text-3xl font-bold text-white uppercase tracking-tight leading-none text-glow-gold">
                  {name}
                </h3>
                <p className="text-wizard-bright-pink font-semibold text-sm">{tagline}</p>
              </div>

              {/* Capabilities tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {capabilities.slice(0, 4).map((cap, idx) => (
                  <motion.span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {cap}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-wizard-cyan/10 via-teal-800 to-wizard-bright-pink/10 border border-wizard-bright-pink/30 rounded-3xl overflow-hidden p-8">
            {/* Back content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Back header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-wizard-bright-pink animate-pulse" />
                  <span className="text-white/60 text-xs uppercase tracking-wider">Solution Details</span>
                </div>
                <motion.button
                  className="text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Problem */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider">The Problem</h4>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{problem}</p>
              </div>

              {/* Solution */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-green-400 font-bold text-sm uppercase tracking-wider">The Solution</h4>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{solution}</p>
              </div>

              {/* All capabilities */}
              <div className="flex-1">
                <h5 className="text-wizard-cyan font-semibold text-xs uppercase tracking-wider mb-3">
                  Full Capabilities
                </h5>
                <div className="grid grid-cols-2 gap-2">
                  {capabilities.map((cap, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-white/70"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-wizard-cyan" />
                      {cap}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-wizard-cyan to-wizard-bright-pink text-teal-900 font-bold text-sm uppercase tracking-wider shadow-lg"
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)" }}
                whileTap={{ scale: 0.98 }}
              >
                Get This Agent
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
