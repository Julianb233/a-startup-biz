'use client';

import React, { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type StatStep = {
  kicker: string;
  headline: string;
  value: number;
  valueSuffix: string;
  accent: string;
  body: string;
  kind: 'big' | 'bars' | 'compare' | 'line';
};

function formatNumber(value: number, decimals: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function GStepStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const barRefs = useRef<Array<HTMLDivElement | null>>([]);
  const compareBarRefs = useRef<Array<HTMLDivElement | null>>([]);
  const linePathRef = useRef<SVGPathElement | null>(null);

  const steps: StatStep[] = useMemo(
    () => [
      {
        kicker: 'Average 2019–2023',
        headline: 'Businesses started every year',
        value: 4.7,
        valueSuffix: 'M',
        accent: 'Will yours be next?',
        body: 'Momentum is real — the market is moving, and the best time to build is before the next wave gets crowded.',
        kind: 'big',
      },
      {
        kicker: 'Q4 2023 Acceleration',
        headline: 'Increase vs Q4 2022',
        value: 30.6,
        valueSuffix: '%',
        accent: 'The trend continues',
        body: 'Quarter-over-quarter momentum is compounding — the lift is strongest at the back end of the year.',
        kind: 'bars',
      },
      {
        kicker: '2019 vs 2023',
        headline: 'Increase in new businesses',
        value: 56.7,
        valueSuffix: '%',
        accent: '3.5M → 5.5M',
        body: 'New business formations are materially higher than pre-pandemic levels — opportunity expanded.',
        kind: 'compare',
      },
      {
        kicker: 'The Entrepreneurial Awakening',
        headline: 'Surge',
        value: 25.7,
        valueSuffix: '%',
        accent: 'Pandemic sparked business boom',
        body: 'The curve changed shape — inflection happened, and the baseline stayed elevated.',
        kind: 'line',
      },
    ],
    []
  );

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const numbers = numberRefs.current.filter(Boolean) as HTMLSpanElement[];

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, rotateX: 12, transformPerspective: 800 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: reduceMotion ? 0.01 : 0.9,
          ease: 'power3.out',
          stagger: reduceMotion ? 0 : 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      steps.forEach((step, i) => {
        const el = numbers[i];
        if (!el) return;

        const decimals = step.value % 1 === 0 ? 0 : 1;
        const obj = { v: 0 };

        gsap.to(obj, {
          v: step.value,
          duration: reduceMotion ? 0.01 : 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cards[i],
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
          onUpdate: () => {
            el.textContent = `${formatNumber(obj.v, decimals)}${step.valueSuffix}`;
          },
        });
      });

      // Q4 bars (card 2): animate four bars
      const qBars = barRefs.current.slice(0, 4).filter(Boolean) as HTMLDivElement[];
      if (qBars.length === 4) {
        const values = [10.1, 15.2, 22.4, 30.6];
        qBars.forEach((bar, idx) => {
          gsap.fromTo(
            bar,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: 'bottom',
              duration: reduceMotion ? 0.01 : 1.0,
              ease: 'power3.out',
              delay: reduceMotion ? 0 : idx * 0.12,
              scrollTrigger: {
                trigger: cards[1],
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
              onStart: () => {
                bar.style.setProperty('--bar-height', `${values[idx]}%`);
              },
            }
          );
        });
      }

      // Compare bars (card 3): animate two bars
      const cBars = compareBarRefs.current.slice(0, 2).filter(Boolean) as HTMLDivElement[];
      if (cBars.length === 2) {
        const values = [3.5, 5.5];
        const max = Math.max(...values);
        cBars.forEach((bar, idx) => {
          const h = (values[idx] / max) * 100;
          bar.style.setProperty('--bar-height', `${h}%`);
          gsap.fromTo(
            bar,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: 'bottom',
              duration: reduceMotion ? 0.01 : 1.0,
              ease: 'power3.out',
              delay: reduceMotion ? 0 : idx * 0.12,
              scrollTrigger: {
                trigger: cards[2],
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }

      // Line draw (card 4)
      if (linePathRef.current) {
        const length = linePathRef.current.getTotalLength();
        linePathRef.current.style.strokeDasharray = `${length}`;
        linePathRef.current.style.strokeDashoffset = `${length}`;

        gsap.to(linePathRef.current, {
          strokeDashoffset: 0,
          duration: reduceMotion ? 0.01 : 1.4,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cards[3],
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }

      return;
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="w-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="uppercase tracking-[0.2em] text-black/70 font-extrabold">
            G-Step
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-black tracking-tight mt-3">
            Turn the <span className="text-orange-500">signal</span> into a plan.
          </h2>
          <p className="mt-4 text-lg md:text-xl font-semibold text-black/70 max-w-3xl mx-auto">
            These are the exact story beats from your images — rebuilt as crisp, readable, animated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {steps.map((s, i) => (
            <div
              key={s.headline}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="rounded-3xl border border-black/10 bg-white shadow-[0_20px_50px_-30px_rgba(0,0,0,0.35)] overflow-hidden"
            >
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm md:text-base font-extrabold text-black/60 uppercase tracking-[0.18em]">
                      {s.kicker}
                    </p>
                    <h3 className="mt-3 text-2xl md:text-3xl font-black text-black">
                      {s.headline}
                    </h3>
                  </div>
                  <div className="shrink-0 rounded-2xl bg-black px-4 py-3">
                    <span
                      ref={(el) => {
                        numberRefs.current[i] = el;
                      }}
                      className="counter-number text-3xl md:text-4xl font-black text-white"
                    >
                      0{s.valueSuffix}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-lg md:text-xl font-black text-orange-500">
                  {s.accent}
                </p>
                <p className="mt-3 text-base md:text-lg font-semibold text-black/70 leading-relaxed">
                  {s.body}
                </p>

                {/* Visuals derived from images */}
                {s.kind === 'bars' && (
                  <div className="mt-7">
                    <div className="grid grid-cols-4 gap-3 items-end h-44">
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((q, idx) => (
                        <div key={q} className="flex flex-col items-center gap-2">
                          <div className="w-full h-32 rounded-xl bg-black/5 relative overflow-hidden">
                            <div
                              ref={(el) => {
                                barRefs.current[idx] = el;
                              }}
                              className={`absolute bottom-0 left-0 right-0 rounded-xl origin-bottom ${
                                q === 'Q4'
                                  ? 'bg-orange-500'
                                  : 'bg-gradient-to-t from-black to-black/80'
                              }`}
                              style={{ height: 'var(--bar-height, 0%)' }}
                            />
                          </div>
                          <p className="text-sm font-extrabold text-black/70">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {s.kind === 'compare' && (
                  <div className="mt-7 grid grid-cols-2 gap-5 items-end h-44">
                    {[
                      { year: 2019, value: '3.5M', accent: false },
                      { year: 2023, value: '5.5M', accent: true },
                    ].map((d, idx) => (
                      <div key={d.year} className="flex flex-col items-center gap-2">
                        <div className="w-full h-32 rounded-xl bg-black/5 relative overflow-hidden">
                          <div
                            ref={(el) => {
                              compareBarRefs.current[idx] = el;
                            }}
                            className={`absolute bottom-0 left-0 right-0 rounded-xl origin-bottom ${
                              d.accent ? 'bg-orange-500' : 'bg-black'
                            }`}
                            style={{ height: 'var(--bar-height, 0%)' }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-extrabold text-black/70">{d.year}</p>
                          <p className="text-lg font-black text-black">{d.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {s.kind === 'line' && (
                  <div className="mt-7 rounded-2xl bg-black/5 p-5 overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-extrabold text-black/60 uppercase tracking-[0.18em]">
                        2018 → 2024
                      </p>
                      <p className="text-sm font-extrabold text-orange-500">
                        inflection + sustained lift
                      </p>
                    </div>
                    <svg viewBox="0 0 600 160" className="w-full h-28">
                      <defs>
                        <linearGradient id="gstepLine" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0" stopColor="#000000" />
                          <stop offset="0.55" stopColor="#ff6a1a" />
                          <stop offset="1" stopColor="#ff6a1a" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M10,130 C60,128 90,126 120,124 C160,121 190,120 220,120 C260,120 285,118 310,84 C335,48 360,42 390,44 C420,46 450,42 480,26 C510,14 540,18 590,10"
                        fill="none"
                        stroke="url(#gstepLine)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        ref={linePathRef}
                      />
                      <circle cx="310" cy="84" r="10" fill="#ff6a1a" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="h-1.5 w-full bg-gradient-to-r from-black via-orange-500 to-black" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

