"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GrowthComparison from "@/components/infographics/GrowthComparison";
import { BarChartAnimation } from "@/components/infographics/BarChartAnimation";
import GStepStats from "@/components/g-step-stats";
import ParallaxStatsGallery from "@/components/parallax-stats-gallery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Keep the background brand-forward: black + orange (no gray journey).
const gradientStops = [
  { at: 0.0, from: "#000000", mid: "#050505", to: "#000000" },
  { at: 0.35, from: "#000000", mid: "#090909", to: "#000000" },
  { at: 0.55, from: "#000000", mid: "#140a03", to: "#000000" },
  { at: 0.75, from: "#000000", mid: "#ff6a1a", to: "#000000" },
  { at: 1.0, from: "#000000", mid: "#050505", to: "#000000" },
];

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff,
    g1 = (c1 >> 8) & 0xff,
    b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff,
    g2 = (c2 >> 8) & 0xff,
    b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function getGradientColors(progress: number) {
  let lower = gradientStops[0];
  let upper = gradientStops[1];

  for (let i = 0; i < gradientStops.length - 1; i++) {
    if (progress >= gradientStops[i].at && progress <= gradientStops[i + 1].at) {
      lower = gradientStops[i];
      upper = gradientStops[i + 1];
      break;
    }
  }

  const range = upper.at - lower.at;
  const factor = range > 0 ? (progress - lower.at) / range : 0;

  return {
    from: interpolateColor(lower.from, upper.from, factor),
    mid: interpolateColor(lower.mid, upper.mid, factor),
    to: interpolateColor(lower.to, upper.to, factor),
  };
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const questionBandRef = useRef<HTMLElement>(null);
  const questionTrackRef = useRef<HTMLDivElement>(null);
  const firstQuestionRef = useRef<HTMLDivElement>(null);
  const entrepreneurBandRef = useRef<HTMLElement>(null);
  const entrepreneurTrackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoMounted, setVideoMounted] = useState(false);

  // Hydration-safe video mounting
  useEffect(() => {
    setVideoMounted(true);
  }, []);

  const gradientColors = useMemo(() => getGradientColors(scrollProgress), [scrollProgress]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const createdTriggers: ScrollTrigger[] = [];

      // Track scroll progress for background accent.
      createdTriggers.push(ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => setScrollProgress(self.progress),
      }));

      // Full-frame logo hero: simple, bold, readable.
      if (heroRef.current) {
        const logoFrame = heroRef.current.querySelector(".hero-logo-frame");
        const scrollHint = heroRef.current.querySelector(".hero-scroll-hint");

        gsap.fromTo(
          logoFrame,
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 1.0, ease: "power3.out", delay: 0.2 }
        );

        gsap.fromTo(
          scrollHint,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.8 }
        );
      }

      // Pinned sideways questions: entrepreneur vs wantrepreneur
      if (questionBandRef.current && questionTrackRef.current) {
        const questionTween = gsap.fromTo(
          questionTrackRef.current,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: questionBandRef.current,
              start: "top top",
              end: "+=130%",
              pin: true,
              scrub: 1,
            },
          }
        );
        if (questionTween.scrollTrigger) {
          createdTriggers.push(questionTween.scrollTrigger);
        }
      }

      // Animate the first question text with GSAP
      if (firstQuestionRef.current) {
        const textElements = firstQuestionRef.current.querySelectorAll("span");
        
        // Create staggered entrance animation with ScrollTrigger
        const textTween = gsap.fromTo(
          textElements,
          { 
            opacity: 0, 
            y: 40,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: firstQuestionRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        
        // Track the ScrollTrigger for cleanup
        if (textTween.scrollTrigger) {
          createdTriggers.push(textTween.scrollTrigger);
        }

        // Add a subtle pulse animation to the "entrepreneur" word (triggered on scroll, not infinite)
        const entrepreneurSpan = firstQuestionRef.current.querySelector(".text-orange-500");
        if (entrepreneurSpan) {
          const pulseTween = gsap.fromTo(
            entrepreneurSpan,
            { scale: 1, textShadow: "0 0 0px rgba(249, 115, 22, 0)" },
            {
              scale: 1.08,
              textShadow: "0 0 20px rgba(249, 115, 22, 0.5)",
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: firstQuestionRef.current,
                start: "top 70%",
                end: "bottom 30%",
                scrub: 1,
              },
            }
          );
          
          // Track for cleanup
          if (pulseTween.scrollTrigger) {
            createdTriggers.push(pulseTween.scrollTrigger);
          }
        }
      }

      // Pinned parallax: ENTREPRENEUR ENTREPRENEUR
      if (entrepreneurBandRef.current && entrepreneurTrackRef.current) {
        const entrepreneurTween = gsap.fromTo(
          entrepreneurTrackRef.current,
          // Left -> right as you scroll down
          { xPercent: -10 },
          {
            xPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: entrepreneurBandRef.current,
              start: "top top",
              end: "+=140%",
              pin: true,
              scrub: 1,
            },
          }
        );
        if (entrepreneurTween.scrollTrigger) {
          createdTriggers.push(entrepreneurTween.scrollTrigger);
        }
      }

      // Animate sections on scroll (stronger entrance).
      const flowSections = gsap.utils.toArray<HTMLElement>(".flow-animate");
      flowSections.forEach((section) => {
        const sectionTween = gsap.from(section, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        if (sectionTween.scrollTrigger) {
          createdTriggers.push(sectionTween.scrollTrigger);
        }
      });

      // Depth orbs (orange only).
      const orbs = gsap.utils.toArray<HTMLElement>(".depth-orb");
      orbs.forEach((orb, i) => {
        const speed = 0.25 + i * 0.12;
        const orbTween = gsap.to(orb, {
          y: () => -window.innerHeight * speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
        if (orbTween.scrollTrigger) {
          createdTriggers.push(orbTween.scrollTrigger);
        }
      });

      return () => {
        createdTriggers.forEach((t) => t.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 transition-colors duration-500"
        style={{
          background: `linear-gradient(145deg, ${gradientColors.from} 0%, ${gradientColors.mid} 50%, ${gradientColors.to} 100%)`,
        }}
      />

      {/* Orange depth orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="depth-orb orb-orange w-[680px] h-[680px] top-[8%] left-[-14%]" />
        <div className="depth-orb orb-orange w-[520px] h-[520px] top-[42%] right-[-12%] opacity-70" />
        <div className="depth-orb orb-orange w-[420px] h-[420px] bottom-[-12%] right-[12%] opacity-60" />
      </div>

      <div className="relative z-10 flex flex-col">
        {/* ============================================
            SECTION 1: HERO — full-frame logo
            ============================================ */}
        <section
          ref={heroRef}
          className="relative min-h-screen w-full flex items-center justify-center"
        >
          <div className="hero-logo-frame relative w-screen h-screen overflow-hidden bg-black">
            <Image
              src="/images/a-startup-biz-logo.webp"
              alt="A Startup Biz"
              fill
              priority
              className="object-contain hero-logo-mega"
              sizes="100vw"
            />
          </div>

          {/* Scroll hint */}
          <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/80">
            <span className="text-sm tracking-[0.25em] uppercase font-extrabold">Scroll</span>
            <div className="w-7 h-11 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1.5 h-2.5 bg-orange-500 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 2: pinned sideways questions
            ============================================ */}
        <section ref={questionBandRef} className="relative w-full">
          <div className="min-h-screen w-full bg-black flex items-center overflow-hidden">
            <div
              ref={questionTrackRef}
              className="w-[220vw] md:w-[200vw] flex items-center justify-center gap-14 md:gap-20 px-10 md:px-16"
            >
              <div className="whitespace-nowrap text-[clamp(2.3rem,6.2vw,6.5rem)] font-black tracking-tight text-white">
                Are you an{" "}
                <span className="text-orange-500">entrepreneur</span> or{" "}
                <span className="text-white/70">not</span>?
              </div>
              <div 
                ref={firstQuestionRef}
                className="whitespace-nowrap text-[clamp(2.3rem,6.2vw,6.5rem)] font-black tracking-tight text-white"
              >
                <span>Are you an </span>
                <span className="text-orange-500">entrepreneur</span>
                <span> or a </span>
                <span className="text-white/70">wantrepreneur</span>
                <span>?</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 3: pinned parallax word band
            ============================================ */}
        <section ref={entrepreneurBandRef} className="relative w-full">
          <div className="min-h-screen w-full bg-white flex items-center overflow-hidden">
            <div
              ref={entrepreneurTrackRef}
              className="w-[140vw] md:w-[120vw] flex items-center justify-center gap-10 md:gap-16 px-6 md:px-16"
            >
              <div className="whitespace-nowrap text-[clamp(3rem,9vw,9rem)] font-black tracking-tight text-black">
                entrepreneur
              </div>
              <div className="whitespace-nowrap text-[clamp(3rem,9vw,9rem)] font-black tracking-tight text-orange-500">
                entrepreneur
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 4: Me and Tori (use homepage Tory photo)
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-large font-black text-white mb-3">
                <span className="text-orange-500 glow-orange-medium">Me and Tori</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/90 font-semibold">
                Clear guidance from lived experience — not theory.
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden h-[82vh] md:h-[92vh] bg-black/60 border border-white/15 box-glow-orange">
              <Image
                src="/images/tory-profile.jpg"
                alt="Tory R. Zweigle"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 92vw, 960px"
                priority
              />
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 4.5: VIDEO — Wistia Embed
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-lg mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-large font-black text-white mb-3">
                <span className="text-orange-500 glow-orange-medium">Watch This</span>
              </h2>
              <p className="text-lg md:text-xl text-white/90 font-semibold">
                See how Tory helps entrepreneurs succeed.
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden border border-orange-500/30 box-glow-orange bg-black/60">
              {videoMounted ? (
                <>
                  <Script
                    src="https://fast.wistia.com/player.js"
                    strategy="lazyOnload"
                  />
                  <Script
                    src="https://fast.wistia.com/embed/kono7sttzg.js"
                    strategy="lazyOnload"
                    type="module"
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: '<wistia-player media-id="kono7sttzg" aspect="0.5625"></wistia-player>'
                    }}
                  />
                </>
              ) : (
                <div
                  className="bg-black/80 animate-pulse flex items-center justify-center"
                  style={{ paddingTop: '177.78%' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 5+: Core story (updated contrast + weight)
            ============================================ */}
        <section className="flow-section">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-huge font-black text-white text-center mb-8">
              A Lifetime Devoted to <span className="text-orange-500">Business</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/90 font-medium leading-relaxed">
              <p>
                My name is Tory R. Zweigle, and I am a serial entrepreneur. For the last five decades, I have done nothing but eat,
                breathe, and sleep business. I started at age 11, beginning a lifelong journey of ideas and startups.
              </p>

              <p>
                Most people will never start a new business. And those who do usually only build one. Some will grow it into a very
                successful company, or expand into multiple locations. Along that path of owner–operator, you get hands-on training in
                people, finance, rules, regulations, legal issues, ergonomics, human nature, and hopefully some common sense.
              </p>
            </div>
          </div>
        </section>

        <section className="flow-section flow-section-compact">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-large font-black text-white text-center mb-8">
              Lessons From a Lifetime of <span className="text-orange-500">Business</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/90 font-medium leading-relaxed">
              <p>
                You learn a lot from a single business venture. If you&apos;re lucky enough to build two successful businesses, then you&apos;re
                on a path of hard work and intentional growth. Being self-employed means you learn every day, every month, and every year.
                Those lessons stay with you forever—and sometimes you even pass them along to others who cross your path.
              </p>
            </div>
          </div>
        </section>

        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-huge font-black text-white text-center mb-8">
              Why Most Business Advice <span className="text-orange-500">Fails</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/90 font-medium leading-relaxed">
              <p>
                I have been helping others in business for many years. I am always asking questions, whether someone is a new entrepreneur or
                a seasoned owner. I am curious about every business owner&apos;s path. Rarely are two stories alike.
              </p>
            </div>

            <div className="relative p-8 md:p-12 mt-12 rounded-3xl bg-gradient-to-br from-orange-500/25 to-black/40 border border-orange-500/40 box-glow-orange">
              <blockquote className="text-xl md:text-2xl font-extrabold text-white leading-relaxed">
                I&apos;ve had so many startups that I can see what others do not. Your business is in a fishbowl to me. I can see all around it
                while you&apos;re inside the bowl trying to keep things going.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION: G-Step stats (from your images)
            This is placed RIGHT BEFORE the "Animations" section.
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate">
            <div className="max-w-6xl mx-auto px-4">
              <div className="rounded-[2rem] bg-white/95 border border-black/10 p-6 md:p-10">
                {/* GSAP parallax versions of the stat visuals (same assets as homepage) */}
                <div className="mb-10">
                  <ParallaxStatsGallery />
                </div>
                <GStepStats />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION: Animations (infographics)
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-6xl mx-auto px-4 w-full">
            <div className="text-center mb-10">
              <h2 className="text-large font-black text-white">
                <span className="text-orange-500 glow-orange-medium">Animations</span>
              </h2>
              <p className="mt-3 text-lg md:text-xl font-semibold text-white/85">
                Crisp, readable motion — orange and black, high contrast.
              </p>
            </div>

            <div className="rounded-3xl bg-white overflow-hidden border border-black/10">
              <GrowthComparison
                beforeYear={2019}
                afterYear={2024}
                beforeValue={3.5}
                afterValue={5.5}
                growthPercent={57}
                label="New Business Formations in the U.S. (Millions)"
              />
            </div>

            <div className="h-10" />

            <div className="rounded-3xl bg-white overflow-hidden border border-black/10">
              <BarChartAnimation
                title="Q4 2023 Acceleration"
                data={[
                  { label: "Q1", value: 10.1 },
                  { label: "Q2", value: 15.2 },
                  { label: "Q3", value: 22.4 },
                  { label: "Q4", value: 30.6 },
                ]}
                duration={1.35}
                className="bg-white"
              />
            </div>
          </div>
        </section>

        {/* ============================================
            FINAL CTA
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto text-center px-4">
            <h2 className="text-huge font-black text-white mb-6">
              Book Your <span className="text-orange-500 glow-orange-intense">$1,000</span> Clarity Call Now
            </h2>

            <p className="text-xl md:text-2xl text-white/90 font-semibold mb-12 max-w-2xl mx-auto">
              30 minutes on Zoom with Tory. Direct access to 46+ years of real-world entrepreneurial experience. No theory — just
              actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://astartupbiz.com/#contact"
                className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
              >
                Book Your Clarity Call
              </Link>
              <Link
                href="https://astartupbiz.com"
                className="px-10 py-5 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-extrabold text-lg rounded-full transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <footer className="flow-section flow-section-compact text-center">
          <div className="flow-animate px-4">
            <Image
              src="/images/a-startup-biz-logo.webp"
              alt="A Startup Biz"
              width={220}
              height={110}
              className="w-auto h-12 md:h-16 mx-auto mb-6"
            />
            <p className="text-white/70 text-sm font-semibold">
              © {new Date().getFullYear()} A Startup Biz. All rights reserved.
            </p>
            <p className="text-white/60 text-xs mt-2 font-semibold">
              Stop dreaming about success. Start building it.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

