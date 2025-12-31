"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GrowthComparison from "@/components/infographics/GrowthComparison";
import { BarChartAnimation } from "@/components/infographics/BarChartAnimation";

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ============================================
// GRADIENT COLOR JOURNEY
// ============================================
const gradientStops = [
  { at: 0.0, from: "#000000", mid: "#050505", to: "#0a0a0a" },
  { at: 0.1, from: "#0a0a0a", mid: "#0f0f0f", to: "#151515" },
  { at: 0.2, from: "#111111", mid: "#1a1a1a", to: "#222222" },
  { at: 0.35, from: "#1a1a1a", mid: "#2a2a2a", to: "#3a3a3a" },
  { at: 0.5, from: "#2a2a2a", mid: "#4a4a4a", to: "#5a5a5a" },
  { at: 0.65, from: "#3a3a3a", mid: "#606060", to: "#808080" },
  { at: 0.8, from: "#4a4a4a", mid: "#808080", to: "#c0c0c0" },
  { at: 0.9, from: "#1a0a00", mid: "#ff6a1a", to: "#ff8a4a" },
  { at: 1.0, from: "#0a0500", mid: "#1a0a00", to: "#000000" },
];

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
  const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;

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

// ============================================
// SPLIT TEXT FOR LETTER ANIMATION
// ============================================
function SplitText({
  text,
  className = "",
  charClassName = "",
}: {
  text: string;
  className?: string;
  charClassName?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`char inline-block ${charClassName}`}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function InteractivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Animate background gradient based on scroll
  const gradientColors = useMemo(() => getGradientColors(scrollProgress), [scrollProgress]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Track scroll progress for gradient
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => setScrollProgress(self.progress),
      });

      // Hero animation - letter by letter reveal
      const heroSection = heroRef.current;
      if (heroSection) {
        const line1Chars = heroSection.querySelectorAll(".hero-line-1");
        const entrepreneurChars = heroSection.querySelectorAll(".hero-entrepreneur");
        const line3Chars = heroSection.querySelectorAll(".hero-line-3");
        const wantrepreneurChars = heroSection.querySelectorAll(".hero-wantrepreneur");
        const logo = heroSection.querySelector(".hero-logo");
        const subhead = heroSection.querySelector(".hero-subhead");

        const heroTL = gsap.timeline({ delay: 0.5 });

        // Logo fades in
        heroTL.from(logo, {
          scale: 0.5,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.5)",
        });

        // "Are you an" slides up
        heroTL.from(line1Chars, {
          y: 100,
          opacity: 0,
          rotateX: -60,
          stagger: 0.04,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.3");

        // "ENTREPRENEUR" dramatic entrance
        heroTL.from(entrepreneurChars, {
          y: 150,
          rotateX: -90,
          opacity: 0,
          scale: 0.3,
          stagger: 0.025,
          duration: 0.9,
          ease: "back.out(1.2)",
        }, "-=0.2");

        // Add glow after reveal
        heroTL.to(entrepreneurChars, {
          textShadow: "0 0 40px rgba(255,106,26,0.9), 0 0 80px rgba(255,106,26,0.6), 0 0 120px rgba(255,106,26,0.3)",
          stagger: 0.02,
          duration: 0.6,
        }, "-=0.5");

        // "or"
        heroTL.from(line3Chars, {
          y: 50,
          opacity: 0,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
        }, "-=0.4");

        // "WANTREPRENEUR?" muted entrance
        heroTL.from(wantrepreneurChars, {
          y: 80,
          rotateX: -45,
          opacity: 0,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.out",
        }, "-=0.2");

        // Subhead
        heroTL.from(subhead, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        }, "-=0.1");
      }

      // Animate sections on scroll
      const flowSections = gsap.utils.toArray<HTMLElement>(".flow-animate");
      flowSections.forEach((section) => {
        gsap.from(section, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Parallax orbs
      const orbs = gsap.utils.toArray<HTMLElement>(".depth-orb");
      orbs.forEach((orb, i) => {
        const speed = 0.3 + (i * 0.15);
        gsap.to(orb, {
          y: () => -window.innerHeight * speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-x-hidden"
    >
      {/* Animated Gradient Background */}
      <div
        className="fixed inset-0 z-0 transition-colors duration-500"
        style={{
          background: `linear-gradient(145deg, ${gradientColors.from} 0%, ${gradientColors.mid} 50%, ${gradientColors.to} 100%)`,
        }}
      />

      {/* Floating Depth Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="depth-orb orb-orange w-[600px] h-[600px] top-[10%] left-[-10%]" />
        <div className="depth-orb orb-silver w-[400px] h-[400px] top-[40%] right-[-5%]" />
        <div className="depth-orb orb-white w-[300px] h-[300px] top-[60%] left-[20%]" />
        <div className="depth-orb orb-orange w-[500px] h-[500px] bottom-[-10%] right-[10%]" />
      </div>

      {/* Content Container - Single Flowing Flex */}
      <div className="relative z-10 flex flex-col">

        {/* ============================================
            SECTION 1: HERO - The Big Question
            ============================================ */}
        <section
          ref={heroRef}
          className="flow-section flow-section-hero text-center"
        >
          {/* Logo */}
          <div className="hero-logo mb-12 md:mb-20">
            <Image
              src="/images/a-startup-biz-logo.webp"
              alt="A Startup Biz"
              width={500}
              height={250}
              className="w-auto h-16 md:h-28 lg:h-36 mx-auto"
              priority
            />
          </div>

          {/* Main Question - MASSIVE */}
          <h1 className="text-massive font-black leading-none tracking-tight max-w-[95vw]">
            <span className="block mb-2 md:mb-4 overflow-hidden">
              <SplitText
                text="Are you an"
                className="text-white/90"
                charClassName="hero-char hero-line-1 text-huge"
              />
            </span>

            <span className="block mb-2 md:mb-4 overflow-hidden perspective-1500">
              <SplitText
                text="ENTREPRENEUR"
                className="text-orange-500"
                charClassName="hero-char hero-entrepreneur"
              />
            </span>

            <span className="block mb-2 md:mb-4 overflow-hidden">
              <SplitText
                text="or"
                className="text-white/60"
                charClassName="hero-char hero-line-3 text-huge"
              />
            </span>

            <span className="block overflow-hidden perspective-1500">
              <SplitText
                text="WANTREPRENEUR?"
                className="text-gray-500/70"
                charClassName="hero-char hero-wantrepreneur"
              />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="hero-subhead mt-8 md:mt-12 text-xl md:text-2xl text-white/60 max-w-2xl mx-auto px-4">
            Get 46+ years of lived experience focused on your business plan.
          </p>

          {/* CTA Button */}
          <div className="hero-subhead mt-10">
            <Link
              href="https://astartupbiz.com/#contact"
              className="inline-block px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
            >
              APPLY TO QUALIFY
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
            <span className="text-sm tracking-widest uppercase">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 2: Meet Tory R. Zweigle
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-large font-bold text-white mb-2">
                Meet <span className="text-orange-500 glow-orange-medium">Tory R. Zweigle</span>
              </h2>
              <p className="text-2xl md:text-3xl text-silver font-semibold">
                Serial Entrepreneur & Business Mentor
              </p>
            </div>

            {/* Tory Image placeholder area */}
            <div className="relative rounded-3xl overflow-hidden mb-12 aspect-[16/9] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white/40">
                <p className="text-lg">[Tory&apos;s Image]</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 3: A Lifetime Devoted to Business
            ============================================ */}
        <section className="flow-section">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-huge font-black text-white text-center mb-8">
              A Lifetime Devoted to <span className="text-orange-500">Business</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p>
                My name is Tory R. Zweigle, and I am a serial entrepreneur. For the last five decades, I have done nothing but eat, breathe, and sleep business. I started at age 11, beginning a lifelong journey of ideas and startups.
              </p>

              <p>
                Most people will never start a new business. And those who do usually only build one. Some will grow it into a very successful company, or expand into multiple locations. Along that path of owner–operator, you get hands-on training in people, finance, rules, regulations, legal issues, ergonomics, human nature, and hopefully some common sense.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 4: Lessons From a Lifetime
            ============================================ */}
        <section className="flow-section flow-section-compact">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-large font-bold text-white text-center mb-8">
              Lessons From a Lifetime of <span className="text-orange-500">Business</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p>
                You learn a lot from a single business venture. If you&apos;re lucky enough to build two successful businesses, then you&apos;re on a path of hard work and intentional growth. Being self-employed means you learn every day, every month, and every year. Those lessons stay with you forever—and sometimes you even pass them along to others who cross your path in business and in life.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 5: Why Most Business Advice Fails
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-huge font-black text-white text-center mb-8">
              Why Most Business Advice <span className="text-gray-500">Fails You</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p>
                I have been helping others in business for many years. I am always asking questions, whether someone is a new entrepreneur or a seasoned owner. I am curious about every business owner&apos;s path. Rarely are two stories alike. The businesses may be similar… but the way each person gets there is completely different.
              </p>
            </div>

            {/* The Fishbowl Quote */}
            <div className="relative p-8 md:p-12 mt-12 rounded-3xl bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30">
              <blockquote className="text-xl md:text-2xl font-bold text-white italic leading-relaxed">
                I&apos;ve had so many startups that I can see what others do not. Your business is in a fishbowl to me. I can see all around it while you&apos;re inside the bowl trying to keep things going. I see the ups, the downs, the patterns, the blind spots, the opportunities, and the dangers.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 6: What 100+ Startups Taught Me
            ============================================ */}
        <section className="flow-section">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-large font-bold text-white text-center mb-8">
              What <span className="text-orange-500 glow-orange-intense">100+ Startups</span> Taught Me About True Success
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p>
                I have been in thousands of situations across the many businesses I&apos;ve run. For every business I start, it&apos;s always a new journey, with new insights at new times in new places. I still learn every day. There are not many people on this planet who have started over 100 businesses. And I do not recommend it to anyone.
              </p>

              <p>
                Even though entrepreneurship can build great wealth, it comes with a price. There are many great businesses that profit very well and give their founders a solid family life. That is the most important success of all. Family is the key to life. If you can build both—a good business and a good family life—you are wealthy beyond dreams.
              </p>

              <p className="text-xl md:text-2xl font-semibold text-orange-400">
                This is why I created a very simple and direct new venture in business consulting.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 6B: Growth Statistics
            ============================================ */}
        <section className="flow-section flow-section-compact">
          <div className="flow-animate">
            <h2 className="text-large font-bold text-white text-center mb-8">
              The <span className="text-orange-500 glow-orange-medium">Numbers</span> Don&apos;t Lie
            </h2>
            <GrowthComparison
              beforeYear={2019}
              afterYear={2024}
              beforeValue={3.5}
              afterValue={5.5}
              growthPercent={57}
              label="New Business Formations in the U.S. (Millions)"
            />
          </div>
        </section>

        {/* ============================================
            SECTION 7: Real-World Strategy
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-huge font-black text-white text-center mb-8">
              Real-World Strategy, <span className="text-orange-500">Not Textbook Theory</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p>
                I have the background and skills to give real, day-to-day advice on most startups. I don&apos;t know everything—but I do know the majority of the do&apos;s and don&apos;ts of business. The most important part of any business is having a solid idea of what type of business you want to start. If your idea is bad from the beginning, it will likely fail early. And even a great idea can fail from lack of capital.
              </p>

              <p>
                There are so many variables in a startup. You need every bit of experience you can get to improve your odds. I have decades of lessons—mine and thousands of others&apos;. I have mastered the skill of listening. I dial in on the small things. Everything starts small, whether in business or in life.
              </p>

              <p>
                I can help you avoid the biggest mistake of your life—or guide you down a proven path where the odds are on your side. When you&apos;ve started as many businesses as I have, you develop the ability to &quot;smell&quot; what&apos;s right for today and what will matter tomorrow. You learn from the past and apply it forward.
              </p>
            </div>

            {/* Key statement */}
            <div className="mt-12 text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">
                My goal is to help people understand whether they are true{" "}
                <span className="text-orange-500 glow-orange-medium">entrepreneurs</span>—or{" "}
                <span className="text-gray-500">wantrepreneurs</span>.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 8: The Honest Truth
            ============================================ */}
        <section className="flow-section">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-large font-bold text-white text-center mb-8">
              The <span className="text-orange-500">Honest Truth</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p>
                If I show you that your idea is just like most others and has no unique twist, and I advise you to go home and keep your money in the bank because you are not built for that business—be happy about that advice. I might be saving you from stress, health issues, broken relationships, failure, and worst of all, bankruptcy.
              </p>

              <p>
                If you have a great idea, I can guide you through a strong launch and onto a path toward profit.
              </p>

              <p>
                One part of business I have truly mastered is <span className="text-orange-400 font-semibold">absentee ownership</span>—the holy grail of business. It means your business runs smoothly while you are free to start another venture or simply enjoy life with family and friends.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 9: The Ultimate Goal & The Stark Warning
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto px-4">
            <h2 className="text-huge font-black text-white text-center mb-8">
              The Ultimate Goal & <span className="text-gray-500">The Stark Warning</span>
            </h2>

            <div className="space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p className="text-xl md:text-2xl font-semibold text-white">
                I firmly believe most people do not belong in business.
              </p>

              <p>
                Some statistics show that <span className="text-orange-500 font-bold text-2xl">90%</span> of businesses fail within the first five years. Why become a statistic when solid advice from someone seasoned like me can help you avoid the biggest potholes?
              </p>
            </div>

            {/* Warning Block */}
            <div className="mt-12 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-900/80 to-black/60 border border-white/10">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Most business consultants have never started a business before starting their consulting career. How do you give advice on something you&apos;ve never done? Just like professors teaching business all over the world—they&apos;ve likely never started a business.
              </p>
              <p className="mt-6 text-xl md:text-2xl font-bold text-orange-500 glow-orange-medium">
                Most consultants teach theory. And theory does not pay the bills.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 9B: Revenue Growth Chart
            ============================================ */}
        <section className="flow-section">
          <div className="flow-animate max-w-5xl mx-auto">
            <BarChartAnimation
              title="Client Success: Average Revenue Growth"
              data={[
                { label: "Q1", value: 12 },
                { label: "Q2", value: 18 },
                { label: "Q3", value: 24 },
                { label: "Q4", value: 32 },
              ]}
              duration={1.5}
              className="bg-gradient-to-br from-gray-900/80 to-black/60 rounded-3xl border border-white/10"
            />
          </div>
        </section>

        {/* ============================================
            SECTION 10: The $1,000 Investment
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-huge font-black text-white mb-4">
              The <span className="text-orange-500 glow-orange-intense">$1,000</span> Investment
            </h2>
            <p className="text-2xl md:text-3xl text-silver font-semibold mb-12">
              That Pays for Itself
            </p>

            <div className="text-left space-y-6 text-lg md:text-xl text-white/80 leading-relaxed">
              <p className="text-xl md:text-2xl font-semibold text-white">
                My idea is simple:
              </p>

              <p>
                I charge <span className="text-orange-500 font-bold">$1,000</span> for a 30-minute Zoom call. You will fill out our questionnaire beforehand so I can prepare and understand your idea, your funding, your timeline, and your plan.
              </p>

              <p>
                During the call, I will tell you exactly what I see—good or bad. After the call, I follow up with an email explaining why your idea works or why it doesn&apos;t.
              </p>

              <p className="text-xl md:text-2xl font-bold text-orange-400">
                It will be the best $1,000 you ever spend for your future in business and in life.
              </p>

              <p>
                Think of this as insurance. If you listen to the advice, you will save yourself money, stress, and possibly your life savings.
              </p>

              <p className="text-xl md:text-2xl font-bold text-white">
                Stop throwing good money after bad.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 11: The Transformation
            ============================================ */}
        <section className="flow-section flow-section-compact">
          <div className="flow-animate text-center space-y-6">
            <p className="text-2xl md:text-4xl font-bold text-white">
              Today you <span className="text-orange-400">decide</span>.
            </p>
            <p className="text-3xl md:text-5xl font-bold text-white">
              Today you <span className="text-orange-500">commit</span>.
            </p>
            <p className="text-4xl md:text-6xl font-black text-orange-500 glow-orange-extreme">
              Today you BECOME.
            </p>
          </div>
        </section>

        {/* ============================================
            SECTION 12: Final CTA
            ============================================ */}
        <section className="flow-section flow-section-breathe">
          <div className="flow-animate max-w-4xl mx-auto text-center px-4">
            <h2 className="text-huge font-black text-white mb-6">
              Book Your <span className="text-orange-500 glow-orange-intense">$1,000</span> Clarity Call Now
            </h2>

            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto">
              30 minutes on Zoom with Tory. Direct access to 46+ years of real-world entrepreneurial experience. No theory. Just actionable insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://astartupbiz.com/#contact"
                className="px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
              >
                Book Your Clarity Call
              </Link>
              <Link
                href="https://astartupbiz.com"
                className="px-10 py-5 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold text-lg rounded-full transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================
            SECTION 13: Final Question
            ============================================ */}
        <section className="flow-section flow-section-compact">
          <div className="flow-animate text-center perspective-1500 px-4">
            <p className="text-2xl md:text-4xl font-bold text-white leading-relaxed">
              The question isn&apos;t whether you{" "}
              <span className="text-orange-400 inline-block">CAN</span>...
            </p>
            <p className="text-3xl md:text-5xl font-bold text-white mt-6">
              it&apos;s whether you{" "}
              <span className="text-orange-500 glow-orange-extreme inline-block text-4xl md:text-6xl">
                WILL
              </span>
              .
            </p>
          </div>
        </section>

        {/* ============================================
            FOOTER
            ============================================ */}
        <footer className="flow-section flow-section-compact text-center">
          <div className="flow-animate px-4">
            <Image
              src="/images/a-startup-biz-logo.webp"
              alt="A Startup Biz"
              width={200}
              height={100}
              className="w-auto h-12 md:h-16 mx-auto mb-6"
            />
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} A Startup Biz. All rights reserved.
            </p>
            <p className="text-white/30 text-xs mt-2">
              Stop dreaming about success. Start building it.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
