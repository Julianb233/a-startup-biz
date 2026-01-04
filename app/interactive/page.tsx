"use client"

import { useRef, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function InteractivePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useLayoutEffect(() => {
    // Prevent double animation in strict mode
    if (hasAnimated.current) return
    hasAnimated.current = true

    // Register plugin on client side only
    gsap.registerPlugin(ScrollTrigger)

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Detect mobile for optimized animations
      const isMobile = window.innerWidth < 768

      // Animate sections on scroll
      const sections = gsap.utils.toArray<HTMLElement>(".reveal-on-scroll")

      sections.forEach((section) => {
        gsap.fromTo(section,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.5 : 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      })

      // Staggered stat cards
      const statCards = gsap.utils.toArray<HTMLElement>(".stat-card")
      if (statCards.length > 0) {
        gsap.fromTo(statCards,
          { y: 40, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: statCards[0],
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-black overflow-x-hidden">
      {/* Section 1: Logo */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="reveal-on-scroll relative w-[35vw] max-w-[250px] min-w-[120px] aspect-[3/1]">
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
        <h1 className="reveal-on-scroll text-[clamp(1.5rem,5vw,4rem)] font-black text-center leading-tight max-w-4xl">
          <span className="text-white">Are you an </span>
          <span className="text-orange-500">entrepreneur</span>
          <br className="hidden sm:block" />
          <span className="text-white"> or a </span>
          <span className="text-white/60">wantrepreneur</span>
          <span className="text-white">?</span>
        </h1>
      </section>

      {/* Section 3: H2 - Supporting Text */}
      <section className="min-h-[50vh] md:min-h-[60vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-orange-950/20 to-black">
        <div className="reveal-on-scroll max-w-3xl text-center">
          <h2 className="text-[clamp(1.1rem,3vw,2rem)] font-bold text-white mb-4">
            Clear guidance from <span className="text-orange-500">lived experience</span> — not theory.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/80 leading-relaxed">
            46+ years of building businesses from the ground up.
            Real answers to real problems. No fluff, no filler.
          </p>
        </div>
      </section>

      {/* Section 4: Tory's Profile Image */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-black via-orange-950/10 to-black">
        <div className="reveal-on-scroll text-center mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-2">
            Meet <span className="text-orange-500">Tory</span>
          </h2>
          <p className="text-sm md:text-base text-white/70">Serial Entrepreneur & Business Mentor</p>
        </div>
        <div className="reveal-on-scroll relative w-[220px] h-[293px] md:w-[300px] md:h-[400px] lg:w-[350px] lg:h-[467px] rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-[0_0_30px_rgba(255,106,26,0.2)]">
          <Image
            src="/images/tory-profile.jpg"
            alt="Tory R. Zweigle"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 220px, (max-width: 1024px) 300px, 350px"
          />
        </div>
      </section>

      {/* Section 5: Business Stats */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-black to-orange-950/30">
        <div className="max-w-4xl w-full">
          <h2 className="reveal-on-scroll text-xl md:text-3xl lg:text-4xl font-black text-white text-center mb-8">
            The <span className="text-orange-500">Startup Boom</span> Is Real
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="stat-card bg-black/60 border border-orange-500/30 rounded-xl p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-orange-500 mb-1">4.7M</div>
              <div className="text-sm md:text-base text-white/80">New businesses started every year</div>
            </div>

            <div className="stat-card bg-black/60 border border-orange-500/30 rounded-xl p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-orange-500 mb-1">+57%</div>
              <div className="text-sm md:text-base text-white/80">Growth since 2019</div>
            </div>

            <div className="stat-card bg-black/60 border border-orange-500/30 rounded-xl p-5 md:p-6 text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-orange-500 mb-1">90%</div>
              <div className="text-sm md:text-base text-white/80">Fail within first 5 years</div>
            </div>
          </div>

          <div className="reveal-on-scroll mt-8 text-center">
            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 px-2">
              Don&apos;t become a statistic. Get guidance from someone who&apos;s been there.
            </p>
            <Link
              href="https://astartupbiz.com/#contact"
              className="inline-block px-6 py-3 md:px-8 md:py-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm md:text-base rounded-full transition-colors duration-200"
            >
              Book Your Clarity Call
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black border-t border-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs md:text-sm text-white/60">© 2026 A Startup Biz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
