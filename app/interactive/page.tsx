"use client"

import { useRef, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// ============================================
// MAIN COMPONENT
// ============================================
export default function InteractivePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoSectionRef = useRef<HTMLDivElement>(null)
  const questionSectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useLayoutEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      // Logo entrance animation
      const logo = logoSectionRef.current?.querySelector(".hero-logo")
      if (logo) {
        gsap.fromTo(logo,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: "back.out(1.5)", delay: 0.3 }
        )
      }

      // Question section - horizontal slide animation on scroll
      const questionSection = questionSectionRef.current
      if (questionSection) {
        const questionText = questionSection.querySelector(".question-text")

        if (questionText) {
          // Set initial state
          gsap.set(questionText, { x: "-100%", opacity: 0 })

          // Animate from left to right as you scroll into view
          gsap.to(questionText, {
            x: "0%",
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: questionSection,
              start: "top 80%",
              end: "top 20%",
              scrub: 1,
            }
          })
        }
      }

      // Animate other sections on scroll
      gsap.utils.toArray<HTMLElement>(".flow-animate").forEach((section) => {
        gsap.fromTo(section,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.6 : 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none none"
            }
          }
        )
      })

      // Subtle parallax for orbs (desktop only)
      if (!isMobile) {
        gsap.utils.toArray<HTMLElement>(".depth-orb").forEach((orb, i) => {
          const speed = 0.15 + i * 0.08
          gsap.to(orb, {
            y: () => -window.innerHeight * speed,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1
            }
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-black">
      {/* Subtle Background Glow - not distracting */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-black to-black" />
      </div>

      {/* Floating Depth Orbs - subtle glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="depth-orb absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] top-[10%] left-[-10%] rounded-full bg-orange-500/5 blur-[100px]" />
        <div className="depth-orb absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] top-[50%] right-[-5%] rounded-full bg-orange-400/5 blur-[80px]" />
        <div className="depth-orb absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] bottom-[20%] left-[10%] rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col">

        {/* SECTION 1: LOGO ONLY */}
        <section ref={logoSectionRef} className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="hero-logo">
            <Image
              src="/images/a-startup-biz-logo.webp"
              alt="A Startup Biz"
              width={800}
              height={400}
              className="w-auto h-32 sm:h-48 md:h-64 lg:h-80 xl:h-96 mx-auto"
              priority
            />
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs md:text-sm tracking-widest uppercase">Scroll</span>
            <div className="w-5 h-8 md:w-6 md:h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* SECTION 2: THE QUESTION - Full Screen, Slides from Left */}
        <section ref={questionSectionRef} className="min-h-screen flex items-center justify-center overflow-hidden px-4">
          <h1 className="question-text text-center">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4">
              Are you an
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-orange-500 mb-4" style={{ textShadow: "0 0 60px rgba(255,106,26,0.5)" }}>
              ENTREPRENEUR
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4">
              or a
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-500">
              WANTREPRENEUR?
            </span>
          </h1>
        </section>

        {/* SECTION 3: TORY PROFILE */}
        <section className="min-h-screen flex items-center justify-center py-16 md:py-24">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                Meet <span className="text-orange-500">Tory R. Zweigle</span>
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-semibold">Serial Entrepreneur & Business Mentor</p>
            </div>

            {/* Tory's Image */}
            <div className="relative mx-auto w-[280px] h-[373px] sm:w-[350px] sm:h-[467px] md:w-[400px] md:h-[533px] rounded-2xl md:rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-[0_0_60px_rgba(255,106,26,0.2)]">
              <Image
                src="/images/tory-profile.jpg"
                alt="Tory R. Zweigle"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, (max-width: 768px) 350px, 400px"
              />
            </div>
          </div>
        </section>

        {/* WISTIA VIDEO SECTION */}
        <section className="py-16 md:py-24">
          <div className="flow-animate max-w-lg mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-6 md:mb-8">
              Watch This
            </h2>
            <p className="text-center text-white/60 mb-6">See how Tory helps entrepreneurs succeed.</p>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20">
              <div className="relative w-full" style={{ paddingTop: "177.78%" }}>
                <iframe
                  src="https://fast.wistia.net/embed/iframe/kono7sttzg?seo=true&videoFoam=false"
                  title="A Startup Biz Introduction Video"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS STATISTICS */}
        <section className="py-16 md:py-24">
          <div className="flow-animate max-w-5xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center mb-10 md:mb-16">
              The <span className="text-orange-500">Startup Boom</span> Is Real
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 md:p-8 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-orange-500 mb-2">4.7M</div>
                <div className="text-base md:text-lg text-white/80">New businesses started every year</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 md:p-8 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-orange-500 mb-2">+57%</div>
                <div className="text-base md:text-lg text-white/80">Growth since 2019</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 md:p-8 text-center">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-orange-500 mb-2">90%</div>
                <div className="text-base md:text-lg text-white/80">Fail within first 5 years</div>
              </div>
            </div>

            <p className="text-center text-lg md:text-xl text-white/70 mt-8 md:mt-12 max-w-2xl mx-auto">
              Why become a statistic when solid advice from someone seasoned can help you avoid the biggest potholes?
            </p>
          </div>
        </section>

        {/* WHAT WE KNOW SECTION */}
        <section className="py-16 md:py-24">
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
        <section className="py-12 md:py-20">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <div className="relative p-6 sm:p-8 md:p-12 rounded-2xl md:rounded-3xl bg-black/60 border border-orange-500/20">
              <blockquote className="text-lg sm:text-xl md:text-2xl font-bold text-white italic leading-relaxed">
                &ldquo;I&apos;ve had so many startups that I can see what others do not. Your business is in a fishbowl to me. I can see all around it while you&apos;re inside the bowl trying to keep things going. I see the ups, the downs, the patterns, the blind spots, the opportunities, and the dangers.&rdquo;
              </blockquote>
              <p className="mt-4 text-orange-400 font-semibold">— Tory R. Zweigle</p>
            </div>
          </div>
        </section>

        {/* THE $1,000 INVESTMENT */}
        <section className="py-16 md:py-24">
          <div className="flow-animate max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              The <span className="text-orange-500">$1,000</span> Investment
            </h2>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 font-semibold mb-8 md:mb-12">That Pays for Itself</p>

            <div className="text-left space-y-6 text-base sm:text-lg md:text-xl text-white/80 leading-relaxed">
              <p>I charge <span className="text-orange-500 font-bold">$1,000</span> for a 30-minute Zoom call. You will fill out our questionnaire beforehand so I can prepare and understand your idea, your funding, your timeline, and your plan.</p>
              <p>During the call, I will tell you exactly what I see—good or bad. After the call, I follow up with an email explaining why your idea works or why it doesn&apos;t.</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-400">It will be the best $1,000 you ever spend for your future in business and in life.</p>
            </div>
          </div>
        </section>

        {/* TRANSFORMATION - Subtle, readable text on dark background */}
        <section className="py-20 md:py-32">
          <div className="flow-animate text-center space-y-4 md:space-y-6 px-4">
            <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
              Today you <span className="text-orange-400">decide</span>.
            </p>
            <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-white">
              Today you <span className="text-orange-500">commit</span>.
            </p>
            <p className="text-3xl sm:text-4xl md:text-6xl font-black text-orange-500">
              Today you BECOME.
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 md:py-24">
          <div className="flow-animate max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 md:mb-6">
              Book Your <span className="text-orange-500">$1,000</span> Clarity Call Now
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
        <section className="py-16 md:py-24">
          <div className="flow-animate text-center px-4">
            <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white leading-relaxed">
              The question isn&apos;t whether you <span className="text-orange-400">CAN</span>...
            </p>
            <p className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mt-4 md:mt-6">
              it&apos;s whether you <span className="text-orange-500 text-3xl sm:text-4xl md:text-6xl">WILL</span>.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 md:py-16 text-center">
          <div className="flow-animate px-4">
            <Image
              src="/images/a-startup-biz-logo.webp"
              alt="A Startup Biz"
              width={200}
              height={100}
              className="w-auto h-10 md:h-12 lg:h-16 mx-auto mb-4 md:mb-6"
            />
            <p className="text-white/40 text-xs md:text-sm">© {new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            <p className="text-white/30 text-xs mt-2">Stop dreaming about success. Start building it.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
