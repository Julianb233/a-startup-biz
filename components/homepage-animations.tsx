'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with GSAP
const ScrollAnimations = dynamic(
  () => import('./scroll-animations').then((mod) => mod.ScrollAnimations),
  { ssr: false }
);

export function HomepageAnimations() {
  return <ScrollAnimations />;
}
