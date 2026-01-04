"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function InteractivePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const questionRef = useRef<HTMLHeadingElement>(null)
  const supportingTextRef = useRef<HTMLDivElement>(null)
  const toryTitleRef = useRef<HTMLDivElement>(null)
  const toryImageRef = useRef<HTMLDivElement>(null)
  const statsTitleRef = useRef<HTMLHeadingElement>(null)
  const statsGridRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Detect mobile for optimized animations
    const isMobile = window.matchMedia("(max-width: 768px)").matches

    // GSAP defaults for smooth 60fps animations
    gsap.defaults({
      ease: "power3.out",
      duration: isMobile ? 0.8 : 1,
      force3D: true, // GPU acceleration
    })

    // Create a master timeline for scroll-based reveals
    const sections = [
      { ref: logoRef, y: 60, scale: 0.95 },
      { ref: questionRef, y: 80, scale: 1 },
      { ref: supportingTextRef, y: 60, scale: 1 },
      { ref: toryTitleRef, y: 40, scale: 1 },
      { ref: toryImageRef, y: 80, scale: 0.9 },
      { ref: statsTitleRef, y: 60, scale: 1 },
      { ref: ctaRef, y: 40, scale: 1 },
    ]

    sections.forEach(({ ref, y, scale }) => {
      if (!ref.current) return

      gsap.set(ref.current, {
        opacity: 0,
        y: y,
        scale: scale,
        willChange: "transform, opacity",
      })

      ScrollTrigger.create({
        trigger: ref.current,
        start: isMobile ? "top 90%" : "top 85%",
        end: "top 20%",
        onEnter: () => {
          gsap.to(ref.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isMobile ? 0.6 : 0.8,
            ease: "power2.out",
            clearProps: "willChange", // Clean up after animation
          })
        },
        onLeaveBack: () => {
          gsap.to(ref.current, {
            opacity: 0,
            y: y * 0.5,
            scale: scale,
            duration: 0.4,
          })
        },
      })
    })

    // Staggered stat cards animation - optimized for mobile
    if (statsGridRef.current) {
      const cards = statsGridRef.current.querySelectorAll(".stat-card")

      gsap.set(cards, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        willChange: "transform, opacity",
      })

      ScrollTrigger.create({
        trigger: statsGridRef.current,
        start: isMobile ? "top 85%" : "top 80%",
        onEnter: () => {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isMobile ? 0.5 : 0.7,
            stagger: isMobile ? 0.1 : 0.15,
            ease: "back.out(1.4)",
            clearProps: "willChange",
          })
        },
        onLeaveBack: () => {
          gsap.to(cards, {
            opacity: 0,
            y: 30,
            scale: 0.95,
            duration: 0.3,
            stagger: 0.05,
          })
        },
      })
    }

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-black overflow-x-hidden">
      {/* Section 1: Logo - Appropriately sized for all screens */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <div
          ref={logoRef}
          className="relative w-[40vw] max-w-[280px] min-w-[150px] aspect-[3/1]"
        >
          <Image
            src="/images/a-startup-biz-logo.webp"
            alt="A Startup Biz"
            fill
            className="object-contain"
            priority
          />
        </div>
      </section>

      {/* Section 2: H1 - The Question */}
      <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-b from-black to-orange-950/20">
        <h1
          ref={questionRef}
          className="text-[clamp(1.75rem,5vw,4.5rem)] font-black text-center leading-tight max-w-4xl"
        >
          <span className="text-white">Are you an </span>
          <span className="text-orange-500">entrepreneur</span>
          <br className="hidden sm:block" />
          <span className="text-white"> or a </span>
          <span className="text-white/60">wantrepreneur</span>
          <span className="text-white">?</span>
        </h1>
      </section>

      {/* Section 3: H2 - Supporting Text */}
      <section className="min-h-[60vh] md:min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-orange-950/20 to-black">
        <div ref={supportingTextRef} className="max-w-3xl text-center">
          <h2 className="text-[clamp(1.25rem,3.5vw,2.5rem)] font-bold text-white mb-4 md:mb-6">
            Clear guidance from <span className="text-orange-500">lived experience</span> — not theory.
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-white/80 leading-relaxed">
            46+ years of building businesses from the ground up.
            Real answers to real problems. No fluff, no filler.
          </p>
        </div>
      </section>

      {/* Section 4: Tory's Profile Image */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 md:py-16 bg-gradient-to-b from-black via-orange-950/10 to-black">
        <div ref={toryTitleRef} className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">
            Meet <span className="text-orange-500">Tory</span>
          </h2>
          <p className="text-base md:text-lg text-white/70">Serial Entrepreneur & Business Mentor</p>
        </div>
        <div
          ref={toryImageRef}
          className="relative w-[250px] h-[333px] md:w-[350px] md:h-[467px] lg:w-[400px] lg:h-[533px] rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-[0_0_40px_rgba(255,106,26,0.25)] md:shadow-[0_0_60px_rgba(255,106,26,0.3)]"
        >
          <Image
            src="/images/tory-profile.jpg"
            alt="Tory R. Zweigle"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 250px, (max-width: 1024px) 350px, 400px"
          />
        </div>
      </section>

      {/* Section 5: Business Stats */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12 md:py-16 bg-gradient-to-b from-black to-orange-950/30">
        <div className="max-w-4xl w-full">
          <h2
            ref={statsTitleRef}
            className="text-2xl md:text-4xl lg:text-5xl font-black text-white text-center mb-8 md:mb-12"
          >
            The <span className="text-orange-500">Startup Boom</span> Is Real
          </h2>

          <div ref={statsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Stat 1 */}
            <div className="stat-card bg-black/60 border border-orange-500/30 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-orange-500 mb-2">4.7M</div>
              <div className="text-base md:text-lg text-white/80">New businesses started every year</div>
            </div>

            {/* Stat 2 */}
            <div className="stat-card bg-black/60 border border-orange-500/30 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-orange-500 mb-2">+57%</div>
              <div className="text-base md:text-lg text-white/80">Growth since 2019</div>
            </div>

            {/* Stat 3 */}
            <div className="stat-card bg-black/60 border border-orange-500/30 rounded-xl md:rounded-2xl p-6 md:p-8 text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-orange-500 mb-2">90%</div>
              <div className="text-base md:text-lg text-white/80">Fail within first 5 years</div>
            </div>
          </div>

          <div ref={ctaRef} className="mt-8 md:mt-12 text-center">
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 px-2">
              Don&apos;t become a statistic. Get guidance from someone who&apos;s been there.
            </p>
            <Link
              href="https://astartupbiz.com/#contact"
              className="inline-block px-8 py-4 md:px-10 md:py-5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-extrabold text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105 active:scale-100 hover:shadow-xl hover:shadow-orange-500/30 touch-manipulation"
            >
              Book Your Clarity Call
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 md:py-8 bg-black border-t border-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm md:text-base text-white/60">© 2026 A Startup Biz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
