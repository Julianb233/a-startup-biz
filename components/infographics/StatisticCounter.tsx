'use client';

import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface StatisticCounterProps {
  targetNumber: number;
  label: string;
  duration?: number;
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  showParticles?: boolean;
  counterDecimals?: number;
  prefix?: string;
  suffix?: string;
}

export const StatisticCounter: React.FC<StatisticCounterProps> = ({
  targetNumber,
  label,
  duration = 2.5,
  primaryColor = '#ff6a1a',
  accentColor = '#ff8a4a',
  textColor = '#ffffff',
  showParticles = true,
  counterDecimals = 0,
  prefix = '',
  suffix = '',
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useGSAP(() => {
    if (!sectionRef.current || !counterRef.current || !labelRef.current) return;

    const animateCounter = () => {
      if (hasAnimated) return;
      setHasAnimated(true);

      // Counter animation
      const counterAnimation = { value: 0 };
      gsap.to(counterAnimation, {
        value: targetNumber,
        duration: duration,
        ease: 'power2.out',
        onUpdate: () => {
          setDisplayValue(counterAnimation.value);
        },
      });

      // Counter glow pulse
      gsap.fromTo(
        counterRef.current,
        {
          filter: 'drop-shadow(0 0 0px rgba(255, 106, 26, 0))',
          scale: 0.8,
          opacity: 0,
        },
        {
          filter: `drop-shadow(0 0 30px ${primaryColor})`,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }
      );

      // Continuous glow pulse
      gsap.to(counterRef.current, {
        filter: `drop-shadow(0 0 20px ${primaryColor}) drop-shadow(0 0 40px ${accentColor})`,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8,
      });

      // Label character reveal animation
      const chars = labelRef.current!.querySelectorAll('.char');
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: 20,
          rotationX: -90,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          delay: 0.5,
        }
      );

      // Particle effect on completion
      if (showParticles && particlesRef.current) {
        gsap.to('.particle', {
          opacity: 0,
          scale: 0,
          y: -100,
          x: 'random(-100, 100)',
          duration: 1.5,
          stagger: 0.05,
          ease: 'power2.out',
          delay: duration,
        });
      }
    };

    // ScrollTrigger setup
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => animateCounter(),
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [targetNumber, duration, primaryColor, accentColor, showParticles, hasAnimated]);

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: counterDecimals,
      maximumFractionDigits: counterDecimals,
    });
  };

  // Split label into individual characters for animation
  const labelChars = label.split('').map((char, index) => (
    <span key={index} className="char inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
      {char}
    </span>
  ));

  return (
    <div
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center min-h-[60vh] px-6 py-20"
      style={{
        background: `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`,
      }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(${primaryColor}22 1px, transparent 1px),
              linear-gradient(90deg, ${primaryColor}22 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Main counter */}
      <div className="relative z-10 text-center mb-8">
        <div
          ref={counterRef}
          className="text-8xl md:text-9xl font-black mb-6 leading-none"
          style={{
            color: primaryColor,
            textShadow: `0 0 20px ${primaryColor}80`,
          }}
        >
          {prefix}
          {formatNumber(displayValue)}
          {suffix}
        </div>

        {/* Label with character animation */}
        <div
          ref={labelRef}
          className="text-2xl md:text-4xl font-light tracking-wide perspective-1000"
          style={{ color: textColor }}
        >
          {labelChars}
        </div>
      </div>

      {/* Particles */}
      {showParticles && (
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="particle absolute w-2 h-2 rounded-full"
              style={{
                background: `radial-gradient(circle, ${accentColor} 0%, ${primaryColor} 100%)`,
                left: `${50 + Math.random() * 20 - 10}%`,
                top: `${50 + Math.random() * 20 - 10}%`,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 rounded-full opacity-20" style={{ borderColor: primaryColor }} />
      <div className="absolute bottom-10 right-10 w-32 h-32 border-2 rounded-full opacity-20" style={{ borderColor: accentColor }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 rounded-full opacity-10" style={{ borderColor: textColor }} />
    </div>
  );
};

export default StatisticCounter;
