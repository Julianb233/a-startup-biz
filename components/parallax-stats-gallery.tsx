'use client';

import Image from 'next/image';
import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins (only in browser to avoid SSR issues)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type StatImage = {
  src: string;
  alt: string;
  label: string;
};

export default function ParallaxStatsGallery({
  items = [
    {
      src: '/images/stat-4-7-million.jpg',
      alt: '4.7 million businesses started every year',
      label: '4.7M / year',
    },
    {
      src: '/images/stat-q4-acceleration.webp',
      alt: 'Q4 2023 acceleration chart',
      label: 'Q4 acceleration',
    },
    {
      src: '/images/stat-business-growth.jpg',
      alt: '56.7% increase in new businesses',
      label: '+56.7%',
    },
    {
      src: '/images/comparison-consultants.jpg',
      alt: 'Consultants vs Tory comparison',
      label: 'experience gap',
    },
  ],
}: {
  items?: StatImage[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      cards.forEach((card, i) => {
        const depth = 30 + i * 18;
        const rot = (i % 2 === 0 ? -1 : 1) * (1.2 + i * 0.25);
        gsap.fromTo(
          card,
          { y: depth, rotate: rot, transformPerspective: 900 },
          {
            y: -depth,
            rotate: -rot,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: reduceMotion ? false : 1,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {items.map((item, i) => (
          <div
            key={item.src}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="stat-parallax-card relative rounded-3xl overflow-hidden border border-black/10 bg-white shadow-[0_25px_60px_-35px_rgba(0,0,0,0.45)]"
          >
            <div className="absolute top-4 left-4 z-10 rounded-full bg-black text-white px-4 py-2 text-sm font-extrabold tracking-[0.18em] uppercase">
              {item.label}
            </div>
            <div className="relative aspect-[16/10]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 92vw, 50vw"
                priority={i < 2}
              />
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-black via-orange-500 to-black" />
          </div>
        ))}
      </div>
    </div>
  );
}

