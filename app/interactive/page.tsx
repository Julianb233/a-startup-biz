"use client"

import { useRef, useLayoutEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// The full question text for letter-by-letter reveal
const QUESTION_TEXT = "Are you an ENTREPRENEUR or a WANTREPRENEUR?"

// ============================================
// MAIN COMPONENT
// ============================================
export default function InteractivePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoSectionRef = useRef<HTMLDivElement>(null)
  const questionSectionRef = useRef<HTMLDivElement>(null)
  const torySectionRef = useRef<HTMLDivElement>(null)
  const statsSectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useLayoutEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768

      // ============================================
      // 0. BACKGROUND GLOW PULSING - Throughout entire page
      // ============================================
      const glowBg = document.querySelector(".glow-bg")
      const glowBg2 = document.querySelector(".glow-bg-2")

      if (glowBg) {
        gsap.to(glowBg, {
          opacity: 0.7,
          scale: 1.1,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      }

      if (glowBg2) {
        gsap.to(glowBg2, {
          opacity: 0.5,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        })
      }

      // Animate glow spots
      const glowSpot1 = document.querySelector(".glow-spot-1")
      const glowSpot2 = document.querySelector(".glow-spot-2")

      if (glowSpot1) {
        gsap.to(glowSpot1, {
          x: 100,
          y: 50,
          scale: 1.2,
          opacity: 0.8,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      }

      if (glowSpot2) {
        gsap.to(glowSpot2, {
          x: -80,
          y: -40,
          scale: 1.3,
          opacity: 0.9,
          duration: 7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        })
      }

      // ============================================
      // 0.5. AMBIENT ORBS - Large background orbs that pulse throughout
      // ============================================
      gsap.utils.toArray<HTMLElement>(".ambient-orb").forEach((orb, i) => {
        // Slow pulsing
        gsap.to(orb, {
          scale: 1.3 + (i * 0.1),
          opacity: 0.2 + (i * 0.03),
          duration: 6 + (i * 1.5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })

        // Slow floating movement
        gsap.to(orb, {
          x: `+=${50 + i * 30}`,
          y: `+=${40 + i * 20}`,
          duration: 10 + (i * 2),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      })

      // ============================================
      // 1. ANIMATED FLOATING ORBS - Pulsing and moving (Logo section)
      // ============================================
      gsap.utils.toArray<HTMLElement>(".floating-orb").forEach((orb, i) => {
        // Pulsing animation
        gsap.to(orb, {
          scale: 1.2 + (i * 0.1),
          opacity: 0.2 + (i * 0.05),
          duration: 3 + (i * 0.5),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })

        // Floating movement
        gsap.to(orb, {
          x: `+=${30 + i * 20}`,
          y: `+=${20 + i * 15}`,
          duration: 5 + i,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      })

      // ============================================
      // 2. LOGO ENTRANCE - Smooth scale with bounce
      // ============================================
      const logo = logoSectionRef.current?.querySelector(".hero-logo")
      if (logo) {
        gsap.fromTo(logo,
          { scale: 0.3, opacity: 0, y: 50 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 2,
            ease: "elastic.out(1, 0.5)",
            delay: 0.2
          }
        )
      }

      // ============================================
      // 3. LETTER-BY-LETTER SCROLL REVEAL
      // ============================================
      const questionSection = questionSectionRef.current
      if (questionSection) {
        const chars = questionSection.querySelectorAll(".char")

        if (chars.length > 0) {
          gsap.set(chars, {
            opacity: 0,
            y: 40,
            scale: 0.8,
            rotationX: -45
          })

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: questionSection,
              start: "top top",
              end: "+=150%",
              scrub: 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
            }
          })

          const totalChars = chars.length
          chars.forEach((char, i) => {
            const isEntrepreneur = i >= 11 && i <= 22

            tl.to(char, {
              opacity: 1,
              y: 0,
              scale: 1,
              rotationX: 0,
              duration: 1,
              ease: "power3.out",
            }, i * (1 / totalChars))

            if (isEntrepreneur) {
              tl.to(char, {
                textShadow: "0 0 60px rgba(255,106,26,0.8), 0 0 120px rgba(255,106,26,0.4)",
                duration: 0.5,
                ease: "power2.inOut",
              }, i * (1 / totalChars) + 0.5)
            }
          })
        }
      }

      // ============================================
      // 4. TORY SECTION - Cinematic entrance
      // ============================================
      const torySection = torySectionRef.current
      if (torySection) {
        const toryImage = torySection.querySelector(".tory-image")
        const toryTitle = torySection.querySelector(".tory-title")
        const torySubtitle = torySection.querySelector(".tory-subtitle")

        if (toryTitle) gsap.set(toryTitle, { y: 100, opacity: 0 })
        if (torySubtitle) gsap.set(torySubtitle, { y: 60, opacity: 0 })
        if (toryImage) gsap.set(toryImage, { scale: 0.7, opacity: 0, y: 80 })

        const toryTl = gsap.timeline({
          scrollTrigger: {
            trigger: torySection,
            start: "top 75%",
            end: "top 25%",
            scrub: 0.8,
          }
        })

        if (toryTitle) {
          toryTl.to(toryTitle, { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, 0)
        }
        if (torySubtitle) {
          toryTl.to(torySubtitle, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 0.2)
        }
        if (toryImage) {
          toryTl.to(toryImage, { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }, 0.3)
        }
      }

      // ============================================
      // 5. STATS IMAGES - GSAP animated entrance
      // ============================================
      const statsSection = statsSectionRef.current
      if (statsSection) {
        const statImages = statsSection.querySelectorAll(".stat-image")

        statImages.forEach((img, i) => {
          gsap.fromTo(img,
            { scale: 0.8, opacity: 0, y: 60 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: img,
                start: "top 85%",
                toggleActions: "play none none none"
              },
              delay: i * 0.2
            }
          )
        })
      }

      // ============================================
      // 6. OTHER SECTIONS - Smooth fade up
      // ============================================
      gsap.utils.toArray<HTMLElement>(".flow-animate").forEach((section) => {
        gsap.fromTo(section,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: isMobile ? 0.8 : 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 50%",
              scrub: 0.5,
            }
          }
        )
      })

      // ============================================
      // 7. PARALLAX ORBS - Depth effect
      // ============================================
      if (!isMobile) {
        gsap.utils.toArray<HTMLElement>(".depth-orb").forEach((orb, i) => {
          const speed = 0.1 + i * 0.05
          gsap.to(orb, {
            y: () => -window.innerHeight * speed,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 2
            }
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden bg-black">
      {/* PERSISTENT ORANGE GLOW BACKGROUND - Throughout entire page */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black" />
        {/* Animated radial gradient overlay that pulses */}
        <div
          className="glow-bg absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, rgba(194,65,12,0.25) 0%, rgba(0,0,0,0) 70%)" }}
        />
        <div className="glow-bg-2 absolute inset-0 bg-gradient-to-b from-orange-950/40 via-orange-950/10 to-black" />
        {/* Additional animated glow spots */}
        <div
          className="glow-spot-1 absolute w-[60vw] h-[60vh] top-[20%] left-[10%]"
          style={{ background: "radial-gradient(ellipse at center, rgba(234,88,12,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="glow-spot-2 absolute w-[50vw] h-[50vh] bottom-[30%] right-[5%]"
          style={{ background: "radial-gradient(ellipse at center, rgba(251,146,60,0.1) 0%, transparent 70%)" }}
        />
      </div>

      {/* ANIMATED FLOATING ORBS - Visible throughout the entire page */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Large ambient orbs */}
        <div className="ambient-orb absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] top-[5%] left-[-15%] rounded-full bg-orange-500/15 blur-[120px]" />
        <div className="ambient-orb absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] top-[30%] right-[-10%] rounded-full bg-orange-400/12 blur-[100px]" />
        <div className="ambient-orb absolute w-[450px] h-[450px] md:w-[700px] md:h-[700px] bottom-[10%] left-[10%] rounded-full bg-orange-600/10 blur-[110px]" />
        <div className="ambient-orb absolute w-[350px] h-[350px] md:w-[550px] md:h-[550px] top-[60%] right-[5%] rounded-full bg-orange-500/8 blur-[90px]" />

        {/* Parallax depth orbs */}
        <div className="depth-orb absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] top-[10%] left-[-10%] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="depth-orb absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] top-[50%] right-[-5%] rounded-full bg-orange-400/10 blur-[80px]" />
        <div className="depth-orb absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] bottom-[20%] left-[10%] rounded-full bg-orange-500/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col">

        {/* SECTION 1: LOGO WITH ANIMATED ORBS */}
        <section ref={logoSectionRef} className="min-h-screen flex flex-col items-center justify-center px-4 relative">
          {/* Animated floating orbs behind the logo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="floating-orb absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] top-[20%] left-[10%] rounded-full bg-orange-500/10 blur-[80px]" />
            <div className="floating-orb absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] top-[30%] right-[15%] rounded-full bg-orange-400/15 blur-[60px]" />
            <div className="floating-orb absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] bottom-[25%] left-[25%] rounded-full bg-orange-600/10 blur-[70px]" />
            <div className="floating-orb absolute w-[180px] h-[180px] md:w-[300px] md:h-[300px] top-[50%] right-[20%] rounded-full bg-orange-500/8 blur-[90px]" />
          </div>

          {/* BIGGER Logo */}
          <div className="hero-logo relative z-10">
            <Image
              src="/images/a-startup-biz-logo.webp"
              alt="A Startup Biz"
              width={1400}
              height={700}
              className="w-auto h-56 sm:h-72 md:h-96 lg:h-[450px] xl:h-[550px] mx-auto"
              priority
            />
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 z-10">
            <span className="text-xs md:text-sm tracking-widest uppercase">Scroll</span>
            <div className="w-5 h-8 md:w-6 md:h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* SECTION 2: THE QUESTION - Letter by letter scroll reveal */}
        <section ref={questionSectionRef} className="min-h-screen flex items-center justify-center px-4">
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
            {QUESTION_TEXT.split("").map((char, i) => {
              const isEntrepreneur = i >= 11 && i <= 22
              const isWantrepreneur = i >= 29 && i <= 42

              let colorClass = "text-white"
              if (isEntrepreneur) colorClass = "text-orange-500"
              if (isWantrepreneur) colorClass = "text-gray-500"

              return (
                <span
                  key={i}
                  className={`char inline-block ${colorClass}`}
                  style={{
                    display: char === " " ? "inline" : "inline-block",
                    textShadow: isEntrepreneur ? "0 0 40px rgba(255,106,26,0.6)" : "none"
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              )
            })}
          </h1>
        </section>

        {/* SECTION 3: TORY PROFILE - BIGGER HEADING */}
        <section ref={torySectionRef} className="min-h-screen flex items-center justify-center py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="tory-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4">
                Meet <span className="text-orange-500">Tory R. Zweigle</span>
              </h2>
              <p className="tory-subtitle text-2xl sm:text-3xl md:text-4xl text-gray-400 font-semibold">Serial Entrepreneur & Business Mentor</p>
            </div>

            {/* BIGGER Tory's Image */}
            <div className="tory-image relative mx-auto w-[320px] h-[427px] sm:w-[400px] sm:h-[533px] md:w-[480px] md:h-[640px] lg:w-[550px] lg:h-[733px] rounded-2xl md:rounded-3xl overflow-hidden border-2 border-orange-500/30 shadow-[0_0_80px_rgba(255,106,26,0.25)]">
              <Image
                src="/images/tory-profile.jpg"
                alt="Tory R. Zweigle"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 320px, (max-width: 768px) 400px, (max-width: 1024px) 480px, 550px"
              />
            </div>
          </div>
        </section>

        {/* WISTIA VIDEO SECTION - Same size heading as Tory section */}
        <section className="py-16 md:py-24">
          <div className="flow-animate max-w-xl mx-auto px-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white text-center mb-4">
              Watch This
            </h2>
            <p className="text-center text-xl md:text-2xl text-white/60 mb-8">See how Tory helps entrepreneurs succeed.</p>
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20">
              <div className="relative w-full" style={{ paddingTop: "177.78%" }}>
                <iframe
                  src="https://fast.wistia.net/embed/iframe/kono7sttzg?seo=true&videoFoam=false"
                  title="A Startup Biz Introduction Video"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS STATISTICS WITH IMAGES */}
        <section ref={statsSectionRef} className="py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="flow-animate text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-12 md:mb-20">
              The <span className="text-orange-500">Startup Boom</span> Is Real
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {/* Stat 1 - 4.7M Image */}
              <div className="stat-image bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl overflow-hidden">
                <div className="relative w-full h-48 md:h-56">
                  <Image
                    src="/images/stat-4-7-million.jpg"
                    alt="4.7 Million new businesses"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-orange-500 mb-2">4.7M</div>
                  <div className="text-base md:text-lg text-white/80">New businesses started every year</div>
                </div>
              </div>

              {/* Stat 2 - Growth Image */}
              <div className="stat-image bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl overflow-hidden">
                <div className="relative w-full h-48 md:h-56">
                  <Image
                    src="/images/stat-business-growth.jpg"
                    alt="Business growth statistics"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-orange-500 mb-2">+57%</div>
                  <div className="text-base md:text-lg text-white/80">Growth since 2019</div>
                </div>
              </div>

              {/* Stat 3 - Q4 Acceleration Image */}
              <div className="stat-image bg-black/60 backdrop-blur-sm border border-orange-500/20 rounded-2xl overflow-hidden">
                <div className="relative w-full h-48 md:h-56">
                  <Image
                    src="/images/stat-q4-acceleration.webp"
                    alt="90% fail rate"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <div className="text-4xl sm:text-5xl md:text-6xl font-black text-orange-500 mb-2">90%</div>
                  <div className="text-base md:text-lg text-white/80">Fail within first 5 years</div>
                </div>
              </div>
            </div>

            <p className="flow-animate text-center text-lg md:text-xl text-white/70 mt-10 md:mt-16 max-w-3xl mx-auto">
              Why become a statistic when solid advice from someone seasoned can help you avoid the biggest potholes?
            </p>
          </div>
        </section>

        {/* WHAT WE KNOW SECTION */}
        <section className="py-16 md:py-24">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-8 md:mb-12">
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

        {/* TRANSFORMATION */}
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

        {/* FOOTER WITH LOGO */}
        <footer className="py-12 md:py-16 text-center border-t border-orange-500/20">
          <div className="flow-animate px-4">
            <Image
              src="/images/a-startup-biz-logo.webp"
              alt="A Startup Biz"
              width={300}
              height={150}
              className="w-auto h-16 md:h-20 lg:h-24 mx-auto mb-6 md:mb-8"
            />
            <p className="text-white/40 text-sm md:text-base">© {new Date().getFullYear()} A Startup Biz. All rights reserved.</p>
            <p className="text-white/30 text-xs md:text-sm mt-2">Stop dreaming about success. Start building it.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
