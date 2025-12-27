"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const features = [
  {
    title: "Vision",
    description: "Entrepreneurs see opportunities where others see obstacles. They envision a future that doesn't yet exist.",
    icon: "🎯",
  },
  {
    title: "Action",
    description: "While wantrepreneurs wait for the 'perfect moment,' entrepreneurs take imperfect action today.",
    icon: "🚀",
  },
  {
    title: "Resilience",
    description: "Failure is feedback. Real entrepreneurs embrace setbacks as stepping stones to success.",
    icon: "💪",
  },
  {
    title: "Growth",
    description: "Continuous learning and adaptation separate those who make it from those who talk about it.",
    icon: "📈",
  },
];

const differences = [
  { entrepreneur: "Takes action today", wantrepreneur: "Waits for the perfect time" },
  { entrepreneur: "Learns from failure", wantrepreneur: "Fears failure" },
  { entrepreneur: "Invests in growth", wantrepreneur: "Makes excuses" },
  { entrepreneur: "Builds a network", wantrepreneur: "Works alone" },
  { entrepreneur: "Creates value first", wantrepreneur: "Chases money first" },
];

export default function InteractivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero text reveal animation
      const chars = questionRef.current?.querySelectorAll(".char");
      if (chars) {
        gsap.from(chars, {
          yPercent: 100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.02,
          ease: "power3.out",
          delay: 0.5,
        });
      }

      // Logo entrance
      gsap.from(logoRef.current, {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.7)",
        delay: 0.2,
      });

      // Parallax hero background
      gsap.to(".hero-bg", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Feature cards stagger animation
      gsap.from(".feature-card", {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%",
        },
      });

      // Comparison section animations
      gsap.from(".comparison-row", {
        x: (index) => (index % 2 === 0 ? -100 : 100),
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".comparison-section",
          start: "top 70%",
        },
      });

      // Pinned section with text reveal
      const pinnedTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".pinned-section",
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1,
        },
      });

      pinnedTl
        .from(".pinned-text-1", { opacity: 0, y: 50, duration: 1 })
        .to(".pinned-text-1", { opacity: 0, y: -50, duration: 1 }, "+=0.5")
        .from(".pinned-text-2", { opacity: 0, y: 50, duration: 1 })
        .to(".pinned-text-2", { opacity: 0, y: -50, duration: 1 }, "+=0.5")
        .from(".pinned-text-3", { opacity: 0, scale: 0.5, duration: 1 })
        .to(".pinned-text-3", { scale: 1.2, duration: 0.5 }, "+=0.3");

      // CTA section animation
      gsap.from(".cta-section", {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
        },
      });

      // Floating elements parallax
      gsap.utils.toArray<HTMLElement>(".floating-element").forEach((el, i) => {
        gsap.to(el, {
          y: `${(i + 1) * -30}%`,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: containerRef }
  );

  // Split text into characters for animation
  const splitText = (text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ display: char === " " ? "inline" : "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="bg-black min-h-screen overflow-x-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="floating-element absolute top-[20%] left-[10%] w-32 h-32 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="floating-element absolute top-[40%] right-[15%] w-48 h-48 rounded-full bg-orange-400/5 blur-3xl" />
        <div className="floating-element absolute top-[60%] left-[20%] w-24 h-24 rounded-full bg-white/5 blur-2xl" />
        <div className="floating-element absolute top-[80%] right-[25%] w-40 h-40 rounded-full bg-orange-500/10 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        <div className="hero-bg absolute inset-0 bg-gradient-to-b from-orange-900/20 via-black to-black" />

        {/* Logo */}
        <div ref={logoRef} className="relative z-10 mb-8">
          <Image
            src="/images/a-startup-biz-logo.webp"
            alt="A Startup Biz"
            width={300}
            height={150}
            className="w-auto h-20 md:h-28"
            priority
          />
        </div>

        {/* Main Question */}
        <h1
          ref={questionRef}
          className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-5xl leading-tight"
        >
          <span className="text-white">Are you an </span>
          <span className="text-orange-500">{splitText("entrepreneur")}</span>
          <br />
          <span className="text-white">or </span>
          <span className="text-orange-400">{splitText("wantrepreneur")}</span>
          <span className="text-white">?</span>
        </h1>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/60 text-sm">Scroll to discover</span>
          <svg
            className="w-6 h-6 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Pinned Text Section */}
      <section className="pinned-section relative h-screen flex items-center justify-center bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="pinned-text-1 absolute text-3xl md:text-5xl font-bold text-center px-4">
            <span className="text-white">The difference between </span>
            <span className="text-orange-500">success</span>
            <span className="text-white"> and </span>
            <span className="text-orange-400">dreaming</span>
            <span className="text-white">...</span>
          </p>
          <p className="pinned-text-2 absolute text-3xl md:text-5xl font-bold text-center px-4 opacity-0">
            <span className="text-white">...is </span>
            <span className="text-orange-500">taking action</span>
            <span className="text-white"> when others </span>
            <span className="text-orange-400">hesitate</span>
          </p>
          <p className="pinned-text-3 absolute text-4xl md:text-6xl font-bold text-center px-4 opacity-0">
            <span className="text-orange-500">Which one are you?</span>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="text-white">What Makes an </span>
            <span className="text-orange-500">Entrepreneur</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-gradient-to-br from-gray-900 to-gray-950 border border-orange-500/20 rounded-2xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-orange-500 mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/80 text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="comparison-section py-24 px-4 bg-gradient-to-b from-black via-orange-950/10 to-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="text-orange-500">Entrepreneur</span>
            <span className="text-white"> vs </span>
            <span className="text-orange-400">Wantrepreneur</span>
          </h2>

          <div className="space-y-6">
            {differences.map((diff, index) => (
              <div
                key={index}
                className="comparison-row grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
              >
                <div className="bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/30 rounded-xl p-6 text-center md:text-right">
                  <span className="text-orange-500 font-semibold text-lg">
                    {diff.entrepreneur}
                  </span>
                </div>
                <div className="bg-gradient-to-l from-gray-500/20 to-transparent border border-gray-500/30 rounded-xl p-6 text-center md:text-left">
                  <span className="text-gray-400 text-lg">
                    {diff.wantrepreneur}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Parallax */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-orange-600/10" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="stat-item">
              <div className="text-5xl md:text-7xl font-bold text-orange-500 mb-2">
                90%
              </div>
              <p className="text-white/80 text-lg">
                of startups fail because founders give up too early
              </p>
            </div>
            <div className="stat-item">
              <div className="text-5xl md:text-7xl font-bold text-orange-500 mb-2">
                72%
              </div>
              <p className="text-white/80 text-lg">
                of people have business ideas but never take action
              </p>
            </div>
            <div className="stat-item">
              <div className="text-5xl md:text-7xl font-bold text-orange-500 mb-2">
                100%
              </div>
              <p className="text-white/80 text-lg">
                of successful entrepreneurs started somewhere
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Ready to become an </span>
            <span className="text-orange-500">Entrepreneur</span>
            <span className="text-white">?</span>
          </h2>
          <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto">
            Stop waiting for the perfect moment. The best time to start was yesterday.
            The second best time is now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30">
              Start Your Journey
            </button>
            <button className="px-8 py-4 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold text-lg rounded-full transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-orange-500/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            src="/images/a-startup-biz-logo.webp"
            alt="A Startup Biz"
            width={150}
            height={75}
            className="w-auto h-12"
          />
          <p className="text-white/50 text-sm">
            &copy; {new Date().getFullYear()} A Startup Biz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
