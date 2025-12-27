"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Image from "next/image"

export default function GoldenTicketReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Ticket animations
  const ticketScale = useTransform(smoothProgress, [0, 0.3, 0.5], [0.6, 1, 1.05])
  const ticketRotateX = useTransform(smoothProgress, [0, 0.3, 0.5], [45, 0, -5])
  const ticketRotateY = useTransform(smoothProgress, [0, 0.3], [15, 0])
  const ticketOpacity = useTransform(smoothProgress, [0, 0.15], [0, 1])
  const ticketY = useTransform(smoothProgress, [0, 0.3], [100, 0])

  // Golden glow intensity
  const glowIntensity = useTransform(smoothProgress, [0.2, 0.4, 0.6], [0, 1, 0.7])

  // Sparkle animations
  const sparkleOpacity = useTransform(smoothProgress, [0.25, 0.4, 0.6], [0, 1, 0.5])

  // Portrait reveal (after ticket is shown)
  const portraitScale = useTransform(smoothProgress, [0.5, 0.7], [0.8, 1])
  const portraitOpacity = useTransform(smoothProgress, [0.5, 0.65], [0, 1])
  const portraitY = useTransform(smoothProgress, [0.5, 0.7], [50, 0])

  // Background parallax
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "-20%"])

  return (
    <section
      ref={containerRef}
      className="relative min-h-[150vh] md:min-h-[200vh] overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #0d2818 30%, #1a4d2e 50%, #0d2818 70%, #0a1628 100%)",
      }}
    >
      {/* Animated starfield background */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ y: bgY }}>
        {[...Array(isMobile ? 20 : 50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-yellow-200"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Sticky container for the reveal */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Golden ambient glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: glowIntensity,
            background:
              "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 40%, transparent 70%)",
          }}
        />

        {/* Sparkle particles - reduced on mobile */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ opacity: sparkleOpacity }}
        >
          {[...Array(isMobile ? 8 : 20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0L11.5 8.5L20 10L11.5 11.5L10 20L8.5 11.5L0 10L8.5 8.5L10 0Z" fill="#D4AF37" />
              </svg>
            </motion.div>
          ))}
        </motion.div>

        {/* Golden Ticket with 3D transform */}
        <motion.div
          className="relative z-10 w-[85vw] max-w-[700px] md:w-[70vw] px-4"
          style={{
            scale: ticketScale,
            rotateX: ticketRotateX,
            rotateY: ticketRotateY,
            opacity: ticketOpacity,
            y: ticketY,
            perspective: 1000,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Ticket glow effect */}
          <motion.div
            className="absolute -inset-2 md:-inset-8 rounded-2xl md:rounded-3xl blur-xl md:blur-3xl"
            style={{
              opacity: glowIntensity,
              background:
                "linear-gradient(135deg, rgba(212, 175, 55, 0.6) 0%, rgba(184, 134, 11, 0.4) 50%, rgba(212, 175, 55, 0.6) 100%)",
            }}
          />

          {/* The Golden Ticket Image */}
          <div className="relative rounded-xl md:rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/692aaacc-002e-42a8-9402.jpeg"
              alt="The Wizard of AI - Golden Ticket"
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />

            {/* Shimmer effect overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.3) 45%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.3) 55%, transparent 60%)",
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPosition: ["200% 0", "-200% 0"],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 2,
              }}
            />
          </div>
        </motion.div>

        {/* Portrait reveal below ticket */}
        <motion.div
          className="absolute bottom-[5%] md:bottom-[12%] z-20 flex flex-col items-center px-4"
          style={{
            scale: portraitScale,
            opacity: portraitOpacity,
            y: portraitY,
          }}
        >
          <div className="relative">
            {/* Portrait glow */}
            <div className="absolute -inset-3 md:-inset-4 rounded-full blur-xl md:blur-2xl bg-gradient-to-b from-[#D4AF37]/40 to-[#4dd9e8]/30" />

            {/* Portrait image */}
            <div className="relative w-20 h-20 md:w-36 md:h-36 rounded-full overflow-hidden border-3 md:border-4 border-[#D4AF37] shadow-2xl">
              <Image src="/images/img-7787.jpeg" alt="The Wizard of AI" fill className="object-cover object-top" />
            </div>
          </div>

          <motion.div
            className="mt-4 md:mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-xs md:text-base font-semibold text-[#D4AF37] tracking-[0.15em] md:tracking-[0.2em] uppercase block">
              Meet Your Guide
            </span>
            <span className="text-[10px] md:text-sm text-white/60 mt-1 block">The Wizard of AI</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 md:gap-2"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.2], [1, 0]),
          }}
        >
          <span className="text-[#D4AF37]/70 text-[10px] md:text-sm tracking-widest uppercase">Scroll to reveal</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
            <svg className="w-4 h-4 md:w-6 md:h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
