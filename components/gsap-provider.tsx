'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPProviderProps {
  children: ReactNode;
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Set default GSAP settings
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8,
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}

// Animation hooks for components
export function useGSAPFadeIn(
  ref: React.RefObject<HTMLElement>,
  options?: {
    delay?: number;
    duration?: number;
    y?: number;
    trigger?: string;
  }
) {
  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const { delay = 0, duration = 0.8, y = 50, trigger } = options || {};

    gsap.fromTo(
      element,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        scrollTrigger: trigger
          ? {
              trigger: trigger,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          : undefined,
      }
    );
  }, [ref, options]);
}

export function useGSAPStagger(
  containerRef: React.RefObject<HTMLElement>,
  selector: string,
  options?: {
    stagger?: number;
    duration?: number;
    y?: number;
  }
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const { stagger = 0.1, duration = 0.6, y = 30 } = options || {};
    const elements = containerRef.current.querySelectorAll(selector);

    gsap.fromTo(
      elements,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [containerRef, selector, options]);
}
