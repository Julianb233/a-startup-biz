"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Check } from "lucide-react";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ConsultantVSProps {
  leftTitle?: string;
  rightTitle?: string;
  leftPoints?: string[];
  rightPoints?: string[];
}

export default function ConsultantVS({
  leftTitle = "Other Consultants",
  rightTitle = "Tory Zweigle",
  leftPoints = [
    "Generic advice",
    "One-size-fits-all",
    "Theory over practice",
    "No follow-up",
  ],
  rightPoints = [
    "Personalized strategy",
    "Real-world experience",
    "Action-oriented",
    "Ongoing support",
  ],
}: ConsultantVSProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);
  const vsBadgeRef = useRef<HTMLDivElement>(null);
  const leftPointsRef = useRef<HTMLDivElement>(null);
  const rightPointsRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });

        // Initial states
        gsap.set(leftSideRef.current, { x: -100, opacity: 0 });
        gsap.set(rightSideRef.current, { x: 100, opacity: 0 });
        gsap.set(vsBadgeRef.current, { scale: 0, opacity: 0 });
        gsap.set(glowRef.current, { opacity: 0 });

        // Split reveal animation
        tl.to(leftSideRef.current, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        })
          .to(
            rightSideRef.current,
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            "<"
          )
          .to(vsBadgeRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          })
          .fromTo(
            leftPointsRef.current?.children || [],
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
            }
          )
          .fromTo(
            rightPointsRef.current?.children || [],
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
            },
            "<"
          )
          .to(glowRef.current, {
            opacity: 0.6,
            duration: 0.8,
            ease: "power2.inOut",
          });
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full py-16 lg:py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: Side-by-side layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 relative">
          {/* Left Side - Other Consultants */}
          <div
            ref={leftSideRef}
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700"
          >
            {/* Generic consultant icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-300 text-center mb-8">
              {leftTitle}
            </h3>

            <div ref={leftPointsRef} className="space-y-4">
              {leftPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <X className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-lg">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Tory Zweigle */}
          <div
            ref={rightSideRef}
            className="relative bg-gradient-to-br from-orange-900/30 to-orange-950/30 backdrop-blur-sm rounded-2xl p-8 border border-orange-800/50"
          >
            {/* Orange glow effect */}
            <div
              ref={glowRef}
              className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-transparent to-transparent rounded-2xl blur-2xl -z-10"
            />

            {/* Personal branding icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/50">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-orange-400 text-center mb-8">
              {rightTitle}
            </h3>

            <div ref={rightPointsRef} className="space-y-4">
              {rightPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-orange-100 text-lg font-medium">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VS Badge - Center */}
          <div
            ref={vsBadgeRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full" />
              <div className="relative bg-gray-900 border-4 border-orange-500 rounded-full w-20 h-20 flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-xl tracking-tight">
                  VS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked layout */}
        <div className="lg:hidden space-y-8">
          {/* Left Side - Other Consultants (Top on mobile) */}
          <div
            ref={leftSideRef}
            className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-300 text-center mb-6">
              {leftTitle}
            </h3>

            <div ref={leftPointsRef} className="space-y-3">
              {leftPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <X className="w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-gray-400">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* VS Badge */}
          <div ref={vsBadgeRef} className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 blur-xl rounded-full" />
              <div className="relative bg-gray-900 border-4 border-orange-500 rounded-full w-16 h-16 flex items-center justify-center shadow-2xl">
                <span className="text-white font-black text-lg tracking-tight">
                  VS
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Tory Zweigle */}
          <div
            ref={rightSideRef}
            className="relative bg-gradient-to-br from-orange-900/30 to-orange-950/30 backdrop-blur-sm rounded-2xl p-6 border border-orange-800/50"
          >
            <div
              ref={glowRef}
              className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-transparent to-transparent rounded-2xl blur-2xl -z-10"
            />

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/50">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
            </div>

            <h3 className="text-xl font-bold text-orange-400 text-center mb-6">
              {rightTitle}
            </h3>

            <div ref={rightPointsRef} className="space-y-3">
              {rightPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-orange-100 font-medium">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
