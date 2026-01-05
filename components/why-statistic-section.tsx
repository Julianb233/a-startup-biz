'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Award, TrendingUp, ShieldCheck, Target } from 'lucide-react';
import Image from 'next/image';

export default function WhyStatisticSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const stats = [
    {
      icon: Briefcase,
      value: '100+',
      label: 'Businesses Started',
      description: 'Real experience from launching over a hundred ventures'
    },
    {
      icon: Award,
      value: '46+',
      label: 'Years of Experience',
      description: 'Nearly five decades of entrepreneurial knowledge'
    },
    {
      icon: TrendingUp,
      value: '11',
      label: 'Started at Age',
      description: 'A lifetime devoted to building businesses'
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="tory-profile-section relative bg-gradient-to-b from-gray-900 via-gray-950 to-gray-50 dark:to-gray-900 py-24 sm:py-32 overflow-hidden"
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
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
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
            className="text-xl text-gray-400 max-w-3xl mx-auto"
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
            <div className="tory-image relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a1a]/20 via-transparent to-[#ff8c4a]/20 z-10" />

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
                  className="tory-stat-item flex items-start gap-5 p-5 bg-gray-800/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-[#ff6a1a]/50 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6a1a] to-[#ff8c4a] flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-black text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {stat.value}
                      </span>
                      <span className="text-lg font-bold text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {stat.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Key Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="bg-gradient-to-br from-[#ff6a1a]/10 to-orange-900/10 rounded-2xl p-6 border border-[#ff6a1a]/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-[#ff6a1a]" />
                <h4 className="text-xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Why Most Businesses Fail
                </h4>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                They try to figure it out alone. They learn from theory instead of experience. They get advice from people who've never built a business.
              </p>
              <p className="text-white font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
              <p className="text-lg text-gray-300 italic mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
