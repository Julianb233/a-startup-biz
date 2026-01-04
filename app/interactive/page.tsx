"use client"

import { useRef, useState, useMemo, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// ============================================
// GRADIENT COLOR JOURNEY - Black to Orange
// ============================================
const gradientStops = [
  { at: 0.0, from: "#000000", mid: "#050505", to: "#0a0a0a" },
  { at: 0.15, from: "#0a0500", mid: "#1a0a00", to: "#0f0805" },
  { at: 0.3, from: "#1a0a00", mid: "#2a1500", to: "#1f1005" },
  { at: 0.5, from: "#2a1500", mid: "#4a2500", to: "#3a1a0a" },
  { at: 0.7, from: "#3a1a0a", mid: "#6a3510", to: "#4a2510" },
  { at: 0.85, from: "#1a0a00", mid: "#ff6a1a", to: "#ff8a4a" },
  { at: 1.0, from: "#0a0500", mid: "#1a0a00", to: "#000000" },
]

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = parseInt(color1.slice(1), 16)
  const c2 = parseInt(color2.slice(1), 16)
  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff
  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}

function getGradientColors(progress: number) {
  let lower = gradientStops[0]
  let upper = gradientStops[1]
  for (let i = 0; i < gradientStops.length - 1; i++) {
    if (progress >= gradientStops[i].at && progress <= gradientStops[i + 1].at) {
      lower = gradientStops[i]
      upper = gradientStops[i + 1]
      break
    }
  }
  const range = upper.at - lower.at
  const factor = range > 0 ? (progress - lower.at) / range : 0
  return {
    from: interpolateColor(lower.from, upper.from, factor),
    mid: interpolateColor(lower.mid, upper.mid, factor),
    to: interpolateColor(lower.to, upper.to, factor),
  }
}

// ============================================
// SPLIT TEXT FOR LETTER ANIMATION
// ============================================
function SplitText({ text, className = "", charClassName = "" }: { text: string; className?: string; charClassName?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span key={i} className={`char inline-block ${charClassName}`} style={{ display: char === " " ? "inline" : "inline-block" }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function InteractivePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const hasAnimated = useRef(false)

  const gradientColors = useMemo(() => getGradientColors(scrollProgress), [scrollProgress])

  useLayoutEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      // Track scroll progress for gradient background
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => setScrollProgress(self.progress),
      })

      // Hero animations
      const heroSection = heroRef.current
      if (heroSection) {
        const logo = heroSection.querySelector(".hero-logo")
        const entrepreneurChars = heroSection.querySelectorAll(".hero-entrepreneur")
        const wantrepreneurChars = heroSection.querySelectorAll(".hero-wantrepreneur")
        const line1Chars = heroSection.querySelectorAll(".hero-line-1")
        const line3Chars = heroSection.querySelectorAll(".hero-line-3")
        const subhead = heroSection.querySelector(".hero-subhead")

        const heroTL = gsap.timeline({ delay: 0.3 })

        // Logo scales in big
        if (logo) {
          heroTL.fromTo(logo, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.5)" })
        }

        // "Are you an" slides up
        if (line1Chars.length > 0) {
          heroTL.fromTo(line1Chars, { y: 80, opacity: 0, rotateX: -45 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.03, duration: 0.6, ease: "power3.out" }, "-=0.5")
        }

        // "ENTREPRENEUR" dramatic entrance with glow
        if (entrepreneurChars.length > 0) {
          heroTL.fromTo(entrepreneurChars, { y: 120, rotateX: -90, opacity: 0, scale: 0.5 }, { y: 0, rotateX: 0, opacity: 1, scale: 1, stagger: 0.02, duration: 0.8, ease: "back.out(1.2)" }, "-=0.3")
          heroTL.to(entrepreneurChars, { textShadow: "0 0 40px rgba(255,106,26,0.9), 0 0 80px rgba(255,106,26,0.6)", stagger: 0.015, duration: 0.5 }, "-=0.4")
        }

        // "or a" fades in
        if (line3Chars.length > 0) {
          heroTL.fromTo(line3Chars, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: "power2.out" }, "-=0.3")
        }

        // "WANTREPRENEUR?" muted entrance
        if (wantrepreneurChars.length > 0) {
          heroTL.fromTo(wantrepreneurChars, { y: 60, rotateX: -30, opacity: 0 }, { y: 0, rotateX: 0, opacity: 1, stagger: 0.015, duration: 0.5, ease: "power2.out" }, "-=0.2")
        }

        // Subhead
        if (subhead) {
          heroTL.fromTo(subhead, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.2")
        }
      }

      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>(".flow-animate").forEach((section) => {
        gsap.fromTo(section, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: isMobile ? 0.6 : 1, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 85%", toggleActions: "play none none none" } })
      })

      // Parallax orbs (desktop only)
      if (!isMobile) {
        gsap.utils.toArray<HTMLElement>(".depth-orb").forEach((orb, i) => {
          const speed = 0.2 + i * 0.1
          gsap.to(orb, { y: () => -window.innerHeight * speed, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top top", end: "bottom bottom", scrub: 1 } })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0 transition-colors duration-300" style={{ background: `linear-gradient(145deg, ${gradientColors.from} 0%, ${gradientColors.mid} 50%, ${gradientColors.to} 100%)` }} />

      {/* Floating Depth Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="depth-orb absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] top-[10%] left-[-10%] rounded-full bg-orange-500/10 blur-[80px]" />
        <div className="depth-orb absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] top-[40%] right-[-5%] rounded-full bg-orange-400/5 blur-[60px]" />
        <div className="depth-orb absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] top-[60%] left-[20%] rounded-full bg-white/5 blur-[50px]" />
        <div className="depth-orb absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] bottom-[-10%] right-[10%] rounded-full bg-orange-500/10 blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col">

        {/* HERO SECTION */}
        <section ref={heroRef} className="flow-section flow-section-hero text-center">
          {/* MASSIVE Logo */}
          <div className="hero-logo mb-8 md:mb-12">
            <Image src="/images/a-startup-biz-logo.webp" alt="A Startup Biz" width={800} height={400} className="w-auto h-32 sm:h-48 md:h-64 lg:h-80 xl:h-96 mx-auto" priority />
          </div>

          {/* Main Question */}
          <h1 className="text-massive font-black leading-none tracking-tight max-w-[95vw] px-4">
            <span className="block mb-2 md:mb-4 overflow-hidden">
              <SplitText text="Are you an" className="text-white/90" charClassName="hero-char hero-line-1 text-huge" />
            </span>
            <span className="block mb-2 md:mb-4 overflow-hidden">
              <SplitText text="ENTREPRENEUR" className="text-orange-500" charClassName="hero-char hero-entrepreneur" />
            </span>
            <span className="block mb-2 md:mb-4 overflow-hidden">
              <SplitText text="or a" className="text-white/60" charClassName="hero-char hero-line-3 text-huge" />
            </span>
            <span className="block overflow-hidden">
              <SplitText text="WANTREPRENEUR?" className="text-gray-500/70" charClassName="hero-char hero-wantrepreneur" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subhead mt-8 md:mt-12 text-lg sm:text-xl md:text-2xl text-white/60 max-w-2xl mx-auto px-4">
            Get 46+ years of lived experience focused on your business plan.
          </p>

          {/* CTA */}
          <div className="hero-subhead mt-8 md:mt-10">
            <Link href="https://astartupbiz.com/#contact" className="inline-block px-8 py-4 md:px-10 md:py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30">
              APPLY TO QUALIFY
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs md:text-sm tracking-widest uppercase">Scroll</span>
            <div className="w-5 h-8 md:w-6 md:h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* TORY PROFILE SECTION */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                Meet <span className="text-orange-500 glow-orange-medium">Tory R. Zweigle</span>
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-semibold">Serial Entrepreneur & Business Mentor</p>
            </div>

            {/* Tory's Image */}
            <div className="relative mx-auto w-[280px] h-[373px] sm:w-[350px] sm:h-[467px] md:w-[400px] md:h-[533px] rounded-2xl md:rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-[0_0_60px_rgba(255,106,26,0.3)]">
              <Image src="/images/tory-profile.jpg" alt="Tory R. Zweigle" fill className="object-cover" sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, 400px" />
            </div>
          </div>
        </section>

        {/* WISTIA VIDEO SECTION */}
        <section className="flow-section flow-section-compact">
          <div className="flow-animate max-w-lg mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 md:mb-8">
              See How We Help <span className="text-orange-500">Entrepreneurs</span>
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20">
              <div className="relative w-full" style={{ paddingTop: "177.78%" }}>
                <iframe src="https://fast.wistia.net/embed/iframe/kono7sttzg?seo=true&videoFoam=false" title="A Startup Biz Introduction Video" allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 w-full h-full" style={{ border: "none" }} />
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS STATISTICS SECTION */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-5xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-10 md:mb-16">
              The <span className="text-orange-500 glow-orange-medium">Startup Boom</span> Is Real
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 md:p-8 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-orange-500 mb-2 glow-orange-medium">4.7M</div>
                <div className="text-base md:text-lg text-white/80">New businesses started every year</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 md:p-8 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-orange-500 mb-2 glow-orange-medium">+57%</div>
                <div className="text-base md:text-lg text-white/80">Growth since 2019</div>
              </div>
              <div className="bg-black/40 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-6 md:p-8 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-orange-500 mb-2 glow-orange-medium">90%</div>
                <div className="text-base md:text-lg text-white/80">Fail within first 5 years</div>
              </div>
            </div>

            <p className="text-center text-lg md:text-xl text-white/70 mt-8 md:mt-12 max-w-2xl mx-auto">
              Why become a statistic when solid advice from someone seasoned can help you avoid the biggest potholes?
            </p>
          </div>
        </section>

        {/* WHAT WE KNOW SECTION */}
        <section className="flow-section">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-8 md:mb-12">
              A Lifetime Devoted to <span className="text-orange-500">Business</span>
            </h2>
            <div className="space-y-6 text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
              <p>My name is Tory R. Zweigle, and I am a serial entrepreneur. For the last five decades, I have done nothing but eat, breathe, and sleep business. I started at age 11, beginning a lifelong journey of ideas and startups.</p>
              <p>I have been in thousands of situations across the many businesses I&apos;ve run. For every business I start, it&apos;s always a new journey. I still learn every day. There are not many people on this planet who have started over 100 businesses.</p>
            </div>
          </div>
        </section>

        {/* THE FISHBOWL QUOTE */}
        <section className="flow-section flow-section-compact">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <div className="relative p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30">
              <blockquote className="text-lg sm:text-xl md:text-2xl font-bold text-white italic leading-relaxed">
                &ldquo;I&apos;ve had so many startups that I can see what others do not. Your business is in a fishbowl to me. I can see all around it while you&apos;re inside the bowl trying to keep things going. I see the ups, the downs, the patterns, the blind spots, the opportunities, and the dangers.&rdquo;
              </blockquote>
              <p className="mt-4 text-orange-400 font-semibold">— Tory R. Zweigle</p>
            </div>
          </div>
        </section>

        {/* THE $1,000 INVESTMENT */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              The <span className="text-orange-500 glow-orange-intense">$1,000</span> Investment
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-semibold mb-8 md:mb-12">That Pays for Itself</p>

            <div className="text-left space-y-6 text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
              <p>I charge <span className="text-orange-500 font-bold">$1,000</span> for a 30-minute Zoom call. You will fill out our questionnaire beforehand so I can prepare and understand your idea, your funding, your timeline, and your plan.</p>
              <p>During the call, I will tell you exactly what I see—good or bad. After the call, I follow up with an email explaining why your idea works or why it doesn&apos;t.</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400">It will be the best $1,000 you ever spend for your future in business and in life.</p>
            </div>
          </div>
        </section>

        {/* TRANSFORMATION */}
        <section className="flow-section flow-section-compact">
          <div className="flow-animate text-center space-y-4 md:space-y-6 px-4">
            <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white">Today you <span className="text-orange-400">decide</span>.</p>
            <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">Today you <span className="text-orange-500">commit</span>.</p>
            <p className="text-3xl sm:text-4xl md:text-6xl font-black text-orange-500 glow-orange-extreme">Today you BECOME.</p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 md:mb-6">
              Book Your <span className="text-orange-500 glow-orange-intense">$1,000</span> Clarity Call Now
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 mb-8 md:mb-12 max-w-2xl mx-auto">
              30 minutes on Zoom with Tory. Direct access to 46+ years of real-world entrepreneurial experience. No theory. Just actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link href="https://astartupbiz.com/#contact" className="px-8 py-4 md:px-10 md:py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base md:text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30">
                Book Your Clarity Call
              </Link>
              <Link href="https://astartupbiz.com" className="px-8 py-4 md:px-10 md:py-5 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold text-base md:text-lg rounded-full transition-all duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* FINAL QUESTION */}
        <section className="flow-section flow-section-compact">
          <div className="flow-animate text-center px-4">
            <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white leading-relaxed">
              The question isn&apos;t whether you <span className="text-orange-400">CAN</span>...
            </p>
            <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-4 md:mt-6">
              it&apos;s whether you <span className="text-orange-500 glow-orange-extreme text-3xl sm:text-4xl md:text-6xl">WILL</span>.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="flow-section flow-section-compact text-center">
          <div className="flow-animate px-4">
            <Image src="/images/a-startup-biz-logo.webp" alt="A Startup Biz" width={200} height={100} className="w-auto h-10 md:h-12 lg:h-16 mx-auto mb-4 md:mb-6" />
            <p className="text-white/40 text-xs md:text-sm">© {new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            <p className="text-white/30 text-xs mt-2">Stop dreaming about success. Start building it.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
