'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Briefcase, Award, TrendingUp, ShieldCheck, Target } from 'lucide-react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function WhyStatisticSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const stats = [
    {
      icon: Briefcase,
      value: '100+',
      numericValue: 100,
      suffix: '+',
      label: 'Businesses Started',
      description: 'Real experience from launching over a hundred ventures',
      graph: {
        bars: [12, 22, 18, 34, 28, 46, 38, 58, 50, 72, 66, 86],
        path: 'M2 18 L18 17 L30 15 L44 13 L58 11 L72 9 L84 7 L98 6',
      },
    },
    {
      icon: Award,
      value: '46+',
      numericValue: 46,
      suffix: '+',
      label: 'Years of Experience',
      description: 'Nearly five decades of entrepreneurial knowledge',
      graph: {
        bars: [18, 24, 28, 34, 40, 48, 54, 60, 64, 70, 74, 78],
        path: 'M2 19 L16 18 L30 17 L44 15 L58 13 L72 11 L84 9 L98 7',
      },
    },
    {
      icon: TrendingUp,
      value: '11',
      numericValue: 11,
      suffix: '',
      label: 'Started at Age',
      description: 'A lifetime devoted to building businesses',
      graph: {
        bars: [10, 14, 18, 22, 18, 26, 22, 30, 26, 34, 30, 38],
        path: 'M2 18 L18 18 L30 17 L44 16 L58 15 L72 13 L84 12 L98 10',
      },
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.tory-stat-item');

      items.forEach((item) => {
        const valueEl = item.querySelector<HTMLElement>('[data-stat-value]');
        const bars = item.querySelectorAll<HTMLElement>('.mini-bar');
        const path = item.querySelector<SVGPathElement>('.mini-line-path');

        // Bars
        if (bars.length > 0) {
          gsap.fromTo(
            bars,
            { scaleY: 0, opacity: 0.85, transformOrigin: 'bottom' },
            {
              scaleY: 1,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.035,
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // Line
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }

        // Count-up
        if (valueEl) {
          const targetValue = Number(valueEl.getAttribute('data-value') || '0');
          const suffix = valueEl.getAttribute('data-suffix') || '';
          const counter = { value: 0 };

          gsap.fromTo(
            counter,
            { value: 0 },
            {
              value: targetValue,
              duration: 1.0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
              onUpdate: () => {
                valueEl.textContent = `${Math.round(counter.value)}${suffix}`;
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="tory-profile-section relative bg-gradient-to-b from-gray-100 via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#ff6a1a]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#ff6a1a]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/30 mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-[#ff6a1a]" />
            <span className="text-sm font-medium text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              The Alternative
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Why Become a{' '}
            <span className="bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] bg-clip-text text-transparent">
              Statistic?
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            When you can learn from someone who's been there—over 100 times.
          </motion.p>
        </motion.div>

        {/* Side-by-Side Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Tory's Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="tory-image relative w-full h-[520px] sm:h-[600px] lg:h-[680px] rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/55 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a1a]/12 via-transparent to-[#ff8c4a]/12 z-10" />

              {/* Tory's Photo */}
              <Image
                src="/images/tory-profile.jpg"
                alt="Tory R. Zweigle - Serial Entrepreneur with 100+ businesses"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <h3 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Tory R. Zweigle
                  </h3>
                  <p className="text-[#ff6a1a] font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Serial Entrepreneur & Business Mentor
                  </p>
                </motion.div>
              </div>

              {/* Decorative Glow */}
              <motion.div
                className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full bg-gradient-to-tl from-[#ff6a1a] to-[#ff8c4a] blur-3xl opacity-40 z-0"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>

          {/* Right: Stats & Message */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="space-y-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.15 }}
                  whileHover={{ x: 8 }}
                  className="tory-stat-item flex items-start gap-5 p-5 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#ff6a1a]/50 transition-all duration-300 shadow-lg dark:shadow-none"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6a1a] to-[#ff8c4a] flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-black text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        <span data-stat-value data-value={stat.numericValue} data-suffix={stat.suffix}>
                          {stat.value}
                        </span>
                      </span>
                      <span className="text-lg font-bold text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {stat.description}
                    </p>

                    {/* Mini graph (GSAP animated) */}
                    <div className="mt-4">
                      <div className="h-8 flex items-end gap-1">
                        {stat.graph.bars.map((h, i) => (
                          <div
                            key={i}
                            className="mini-bar w-1.5 rounded-full bg-gradient-to-t from-[#ff6a1a]/60 to-[#ff8c4a]/80 shadow-[0_0_16px_rgba(255,106,26,0.18)]"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <svg viewBox="0 0 100 24" className="mt-2 h-5 w-32">
                        <path
                          className="mini-line-path"
                          d={stat.graph.path}
                          fill="none"
                          stroke="rgba(255,106,26,0.95)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Key Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-gradient-to-br from-[#ff6a1a]/10 to-orange-500/10 dark:to-orange-900/10 rounded-2xl p-6 border border-[#ff6a1a]/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-[#ff6a1a]" />
                <h4 className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Why Most Businesses Fail
                </h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                They try to figure it out alone. They learn from theory instead of experience. They get advice from people who've never built a business.
              </p>
              <p className="text-gray-900 dark:text-white font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="text-[#ff6a1a]">Don't be one of them.</span> Learn from someone who's done it over 100 times.
              </p>
            </motion.div>

            {/* Quote */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="border-l-4 border-[#ff6a1a] pl-6"
            >
              <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                "Most consultants teach theory. And theory does not pay the bills."
              </p>
              <footer className="text-[#ff6a1a] font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                — Tory R. Zweigle
              </footer>
            </motion.blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
