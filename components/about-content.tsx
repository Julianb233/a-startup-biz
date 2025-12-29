"use client"

import { useRef, useState, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { siteContent } from "@/lib/site-content"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  Briefcase,
  TrendingUp,
  Users,
  Lightbulb,
  Target,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight
} from "lucide-react"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Gradient color journey based on scroll position
const gradientStops = [
  { at: 0.0, from: "#000000", mid: "#1a0a00", to: "#000000" },
  { at: 0.25, from: "#0a0500", mid: "#1a0a00", to: "#0a0500" },
  { at: 0.5, from: "#1a0a00", mid: "#2a1500", to: "#1a0a00" },
  { at: 0.75, from: "#2a1500", mid: "#ff6a1a", to: "#2a1500" },
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

// Split text for letter-by-letter animation
function SplitText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="hero-char inline-block"
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}

export default function AboutContent() {
  const { about, clarityCall } = siteContent
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Calculate gradient colors based on scroll
  const gradientColors = useMemo(() => getGradientColors(scrollProgress), [scrollProgress])

  // GSAP animations
  useGSAP(
    () => {
      if (!containerRef.current) return

      // Track scroll progress for gradient
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => setScrollProgress(self.progress),
      })

      // Hero animation - letter by letter reveal
      const heroSection = heroRef.current
      if (heroSection) {
        const heroChars = heroSection.querySelectorAll(".hero-char")

        const heroTL = gsap.timeline({ delay: 0.3 })

        heroTL.from(heroChars, {
          y: 50,
          opacity: 0,
          rotateX: -45,
          stagger: 0.03,
          duration: 0.6,
          ease: "power3.out",
        })

        // Add glow effect to orange chars
        heroTL.to(".hero-char-orange", {
          textShadow: "0 0 30px rgba(255,106,26,0.8), 0 0 60px rgba(255,106,26,0.4)",
          duration: 0.5,
        }, "-=0.3")
      }

      // Parallax orbs
      const orbs = gsap.utils.toArray<HTMLElement>(".depth-orb")
      orbs.forEach((orb, i) => {
        const speed = 0.2 + (i * 0.1)
        gsap.to(orb, {
          y: () => -window.innerHeight * speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        })
      })

      // Animate sections on scroll
      const sections = gsap.utils.toArray<HTMLElement>(".gsap-section")
      sections.forEach((section) => {
        gsap.from(section, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="relative">
      {/* Animated Gradient Background Overlay */}
      <div
        className="fixed inset-0 z-0 transition-colors duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(145deg, ${gradientColors.from} 0%, ${gradientColors.mid} 50%, ${gradientColors.to} 100%)`,
          opacity: 0.3,
        }}
      />

      {/* Floating Depth Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="depth-orb absolute w-[400px] h-[400px] rounded-full bg-[#ff6a1a]/5 blur-3xl top-[10%] left-[-10%]" />
        <div className="depth-orb absolute w-[300px] h-[300px] rounded-full bg-white/5 blur-2xl top-[40%] right-[-5%]" />
        <div className="depth-orb absolute w-[250px] h-[250px] rounded-full bg-[#ff6a1a]/5 blur-3xl bottom-[20%] left-[15%]" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 bg-gradient-to-br from-black via-[#1a0a00] to-black overflow-hidden z-10">
        {/* Subtle Orange Accent Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ff6a1a] to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ff6a1a] to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#ff6a1a]/20 border border-[#ff6a1a]/30 rounded-full mb-8"
            >
              <Award className="w-4 h-4 text-[#ff6a1a]" />
              <span className="text-white font-semibold text-sm tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {about.stats[0].value} {about.stats[0].label}
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif', perspective: '1000px' }}>
              <SplitText text="Meet " className="text-white" />
              <SplitText text={about.name} className="text-white" />
              <br />
              <span className="hero-char-orange">
                <SplitText text={about.title} className="text-[#ff6a1a]" />
              </span>
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {about.tagline}
            </p>
          </motion.div>
        </div>

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff6a1a] to-transparent" />
      </section>

      {/* NOT A CONSULTANT - Authority Differentiator */}
      <section className="py-12 bg-[#ff6a1a] relative z-10 gsap-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Tory is <span className="underline decoration-4">NOT</span> a Consultant.
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              He&apos;s a serial entrepreneur who has <strong>actually started over 100 businesses</strong>.
              Most consultants teach theory from textbooks. Tory teaches from 46+ years of real-world experience
              building, failing, learning, and succeeding—again and again.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-gradient-to-r from-black via-[#1a0a00] to-black border-b border-[#ff6a1a]/20 relative z-10 gsap-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {about.stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#ff6a1a] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white/70 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white dark:bg-gray-900 relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ff6a1a]/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#ff6a1a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {about.tagline}
              </h2>
            </div>
            <p className="text-lg text-black/80 dark:text-white/80 leading-relaxed mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {about.intro}
            </p>
            <p className="text-lg text-black/80 dark:text-white/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {about.experience}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lessons Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ff6a1a]/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-[#ff6a1a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {about.lessons.title}
              </h2>
            </div>
            <p className="text-lg text-black/80 dark:text-white/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {about.lessons.content}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Most Advice Fails */}
      <section className="py-20 bg-white dark:bg-gray-900 relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ff6a1a]/10 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[#ff6a1a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {about.perspective.title}
              </h2>
            </div>
            <div className="space-y-6 text-lg text-black/80 dark:text-white/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {about.perspective.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 100+ Startups Section */}
      <section className="py-20 bg-gradient-to-br from-black via-[#1a0a00] to-black relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ff6a1a]/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#ff6a1a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {about.startups.title}
              </h2>
            </div>
            <div className="space-y-6 text-lg text-white/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {about.startups.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real-World Strategy */}
      <section className="py-20 bg-white dark:bg-gray-900 relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ff6a1a]/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#ff6a1a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {about.strategy.title}
              </h2>
            </div>
            <div className="space-y-6 text-lg text-black/80 dark:text-white/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {about.strategy.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-20 bg-[#ff6a1a]/5 dark:bg-[#ff6a1a]/10 border-y border-[#ff6a1a]/20 dark:border-[#ff6a1a]/30 relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#ff6a1a]/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#ff6a1a]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {about.warning.title}
              </h2>
            </div>
            <div className="space-y-6 text-lg text-black/80 dark:text-white/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {about.warning.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Tory is Different - Authority Grid */}
      <section className="py-20 bg-white dark:bg-gray-900 relative z-10 gsap-section">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Why Tory is Different
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              The difference between a consultant and someone who has lived it
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Traditional Consultants */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-full mb-4">
                  <span className="text-gray-700 dark:text-gray-200 font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    TRADITIONAL CONSULTANTS
                  </span>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Teach from textbooks and theory",
                  "Never started a business themselves",
                  "Charge for generic frameworks",
                  "Give advice they've never tested",
                  "Focus on billable hours, not results"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-xl">✗</span>
                    <span className="text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Tory R. Zweigle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#ff6a1a]/10 to-[#ff6a1a]/5 dark:from-[#ff6a1a]/20 dark:to-[#ff6a1a]/10 rounded-2xl p-8 border-2 border-[#ff6a1a]"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6a1a] rounded-full mb-4">
                  <span className="text-white font-bold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    TORY R. ZWEIGLE
                  </span>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Started 100+ businesses since age 11",
                  "46+ years of hands-on experience",
                  "Mastered absentee ownership",
                  "Shares lessons from real failures & successes",
                  "Invested in YOUR success, not billable hours"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#ff6a1a] font-bold text-xl">✓</span>
                    <span className="text-black dark:text-white font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Absentee Ownership Highlight */}
      <section className="py-16 bg-gradient-to-r from-black via-[#1a0a00] to-black relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ff6a1a]/20 border border-[#ff6a1a]/30 rounded-full mb-6">
              <Award className="w-5 h-5 text-[#ff6a1a]" />
              <span className="text-white font-semibold text-sm tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                THE HOLY GRAIL OF BUSINESS
              </span>
            </div>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed italic" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              &ldquo;{about.absentee}&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#ff6a1a] to-[#ff8a3a] relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 rounded-full mb-6">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-sm tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {clarityCall.duration.toUpperCase()}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {clarityCall.title}
            </h2>

            <div className="text-6xl md:text-7xl font-bold text-white mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {clarityCall.price}
            </div>

            <div className="max-w-2xl mx-auto mb-10">
              <div className="space-y-4 text-left bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                {clarityCall.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-white/90 text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 bg-black text-white font-bold text-lg rounded-xl hover:bg-black/90 transition-all shadow-2xl hover:scale-105 transform duration-200"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {clarityCall.cta}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-white/80 text-sm mt-8 max-w-2xl mx-auto italic" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {clarityCall.savingsNote}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-16 bg-black border-t border-[#ff6a1a]/20 relative z-10 gsap-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-2xl md:text-3xl font-bold text-white/90 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              &ldquo;Are you an entrepreneur or a wantrepreneur?&rdquo;
            </p>
            <p className="text-lg text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              &mdash; {about.name}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
