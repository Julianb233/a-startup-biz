'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ChartDataPoint {
  label: string;
  value: number;
}

interface BarChartAnimationProps {
  data: ChartDataPoint[];
  title: string;
  duration?: number;
  className?: string;
}

export const BarChartAnimation: React.FC<BarChartAnimationProps> = ({
  data,
  title,
  duration = 1.5,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [animatedValues, setAnimatedValues] = useState<number[]>(data.map(() => 0));

  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => d.value));

  useGSAP(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: -30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
      }

      // Bar animations with stagger
      barsRef.current.forEach((bar, index) => {
        if (!bar) return;

        const targetHeight = (data[index].value / maxValue) * 100;

        gsap.from(bar, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          scaleY: 0,
          transformOrigin: 'bottom',
          duration: duration,
          delay: index * 0.15,
          ease: 'power3.out',
          onUpdate: function() {
            const progress = this.progress();
            setAnimatedValues(prev => {
              const updated = [...prev];
              updated[index] = data[index].value * progress;
              return updated;
            });
          },
        });

        // Emphasize Q4 bar (last bar)
        if (index === data.length - 1) {
          gsap.to(bar, {
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
            scale: 1.05,
            duration: 0.3,
            delay: duration + (index * 0.15) + 0.2,
            ease: 'back.out(1.2)',
            yoyo: true,
            repeat: 1,
          });
        }
      });

      // Label animations
      labelsRef.current.forEach((label, index) => {
        if (!label) return;

        gsap.from(label, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: duration + (index * 0.15),
          ease: 'power2.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [data, duration, maxValue]);

  return (
    <div
      ref={containerRef}
      className={`w-full py-12 px-4 md:px-8 ${className}`}
    >
      {/* Title */}
      <h2
        ref={titleRef}
        className="text-3xl md:text-4xl font-black text-center mb-12 text-black"
      >
        {title}
      </h2>

      {/* Chart Container */}
      <div className="max-w-4xl mx-auto">
        {/* Y-axis labels */}
        <div className="flex items-end justify-between mb-4 px-4 md:px-8">
          <div className="flex flex-col items-end space-y-2 text-sm text-black/60 pr-4 font-semibold">
            <span>30%</span>
            <span className="mt-8">20%</span>
            <span className="mt-8">10%</span>
            <span className="mt-8">0%</span>
          </div>

          {/* Bars Container */}
          <div className="flex-1 flex items-end justify-around gap-4 md:gap-8 h-80 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-full h-px bg-black/10"
                  style={{ marginBottom: i === 3 ? '0' : 'auto' }}
                />
              ))}
            </div>

            {/* Bars */}
            {data.map((item, index) => {
              const isQ4 = index === data.length - 1;
              const barHeight = (item.value / maxValue) * 100;

              return (
                <div
                  key={item.label}
                  className="flex-1 flex flex-col items-center relative z-10"
                >
                  {/* Percentage Label */}
                  <div
                    ref={(el) => { labelsRef.current[index] = el; }}
                    className={`text-lg md:text-xl font-bold mb-2 ${
                      isQ4 ? 'text-orange-600' : 'text-black'
                    }`}
                    style={{ minHeight: '2rem' }}
                  >
                    {animatedValues[index].toFixed(1)}%
                  </div>

                  {/* Bar */}
                  <div
                    ref={(el) => { barsRef.current[index] = el; }}
                    className={`w-full rounded-t-lg relative transition-all duration-300 ${
                      isQ4 ? 'shadow-lg shadow-orange-500/50' : ''
                    }`}
                    style={{
                      height: `${barHeight}%`,
                      background: isQ4
                        ? 'linear-gradient(180deg, #ff8a4a 0%, #ff6a1a 100%)'
                        : 'linear-gradient(180deg, #ff7a3a 0%, #ff5a0a 100%)',
                      minHeight: '4px',
                    }}
                  >
                    {/* Shine effect */}
                    <div
                      className="absolute inset-0 rounded-t-lg opacity-20"
                      style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                      }}
                    />
                  </div>

                  {/* Quarter Label */}
                  <div
                    className={`mt-3 text-sm md:text-base font-semibold ${
                      isQ4 ? 'text-orange-600' : 'text-black/70'
                    }`}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis line */}
        <div className="w-full h-px bg-black/20 ml-20" />

        {/* Chart Footer */}
        <div className="text-center mt-8 text-sm text-black/60 font-semibold">
          <p>Revenue Growth Rate by Quarter</p>
        </div>
      </div>
    </div>
  );
};

export default BarChartAnimation;
