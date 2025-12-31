'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GrowthComparisonProps {
  beforeYear: number;
  afterYear: number;
  beforeValue: number;
  afterValue: number;
  growthPercent: number;
  label: string;
}

export default function GrowthComparison({
  beforeYear,
  afterYear,
  beforeValue,
  afterValue,
  growthPercent,
  label,
}: GrowthComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeCountRef = useRef<HTMLSpanElement>(null);
  const afterCountRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
        },
      });

      // Animate connecting line
      timeline.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );

      // Animate both counters simultaneously
      timeline.fromTo(
        beforeCountRef.current,
        { textContent: 0 },
        {
          textContent: beforeValue,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 0.1 },
          onUpdate: function () {
            if (beforeCountRef.current) {
              const val = parseFloat(gsap.getProperty(beforeCountRef.current, 'textContent') as string);
              beforeCountRef.current.textContent = val.toFixed(1) + 'M';
            }
          },
        },
        '<'
      );

      timeline.fromTo(
        afterCountRef.current,
        { textContent: 0 },
        {
          textContent: afterValue,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 0.1 },
          onUpdate: function () {
            if (afterCountRef.current) {
              const val = parseFloat(gsap.getProperty(afterCountRef.current, 'textContent') as string);
              afterCountRef.current.textContent = val.toFixed(1) + 'M';
            }
          },
        },
        '<'
      );

      // Badge pulse and glow animation
      timeline.fromTo(
        badgeRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.7)',
        },
        '-=0.5'
      );

      // Add pulsing glow effect to badge
      timeline.to(badgeRef.current, {
        boxShadow: '0 0 30px rgba(255, 106, 26, 0.8), 0 0 60px rgba(255, 106, 26, 0.4)',
        duration: 0.6,
        repeat: 2,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Fade in label
      timeline.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.8'
      );

      // Continuous subtle pulse for badge
      gsap.to(badgeRef.current, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2.5,
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto px-4 py-16">
      {/* Desktop: Side-by-side | Mobile: Stacked */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Before side - Black/White */}
        <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-white rounded-2xl shadow-lg border-2 border-black/10">
          <div className="text-center">
            <div className="text-5xl lg:text-6xl font-black text-black/80 mb-4">{beforeYear}</div>
            <div className="text-6xl lg:text-7xl font-black text-black">
              <span ref={beforeCountRef}>0.0M</span>
            </div>
            <div className="text-lg lg:text-xl text-black/70 mt-4 font-semibold">Businesses</div>
          </div>
        </div>

        {/* Connecting Line (Hidden on mobile) */}
        <div
          ref={lineRef}
          className="hidden lg:block absolute left-1/2 top-1/2 w-16 h-1 bg-gradient-to-r from-black/30 via-black/10 to-orange-400 -translate-x-1/2 -translate-y-1/2 origin-center"
          style={{ transformOrigin: 'center' }}
        />

        {/* Growth Badge - Center on desktop, between cards on mobile */}
        <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10 flex justify-center my-4 lg:my-0">
          <div
            ref={badgeRef}
            className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-8 py-6 rounded-2xl shadow-2xl border-4 border-white"
            style={{ boxShadow: '0 0 20px rgba(255, 106, 26, 0.4)' }}
          >
            <div className="text-5xl lg:text-6xl font-black text-center">
              +{growthPercent}%
            </div>
            <div className="text-sm lg:text-base font-semibold text-center mt-2 opacity-90">
              GROWTH
            </div>
          </div>
        </div>

        {/* After side - Orange/Vibrant */}
        <div className="flex flex-col items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg border-2 border-orange-200">
          <div className="text-center">
            <div className="text-5xl lg:text-6xl font-black text-orange-700 mb-4">{afterYear}</div>
            <div className="text-6xl lg:text-7xl font-black text-black">
              <span ref={afterCountRef}>0.0M</span>
            </div>
            <div className="text-lg lg:text-xl text-black/70 mt-4 font-semibold">Businesses</div>
          </div>
        </div>
      </div>

      {/* Label */}
      <p
        ref={labelRef}
        className="text-center text-xl lg:text-2xl font-bold text-black/80 mt-8 lg:mt-12"
      >
        {label}
      </p>
    </div>
  );
}
