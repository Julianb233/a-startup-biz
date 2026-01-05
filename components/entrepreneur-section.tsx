'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Rocket, Clock, CheckCircle, XCircle, Zap, Brain } from 'lucide-react';

export default function EntrepreneurSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const entrepreneurTraits = [
    { icon: CheckCircle, text: 'Takes action despite fear', color: 'text-green-500' },
    { icon: CheckCircle, text: 'Embraces calculated risks', color: 'text-green-500' },
    { icon: CheckCircle, text: 'Learns from every failure', color: 'text-green-500' },
    { icon: CheckCircle, text: 'Builds systems, not just dreams', color: 'text-green-500' },
    { icon: CheckCircle, text: 'Invests in mentorship', color: 'text-green-500' },
    { icon: CheckCircle, text: 'Starts before they\'re ready', color: 'text-green-500' },
  ];

  const wantrepreneurTraits = [
    { icon: XCircle, text: 'Waits for the "perfect" time', color: 'text-red-500' },
    { icon: XCircle, text: 'Fears any form of risk', color: 'text-red-500' },
    { icon: XCircle, text: 'Makes excuses for inaction', color: 'text-red-500' },
    { icon: XCircle, text: 'Talks more than they do', color: 'text-red-500' },
    { icon: XCircle, text: 'Avoids expert guidance', color: 'text-red-500' },
    { icon: XCircle, text: 'Always "planning" to start', color: 'text-red-500' },
  ];

  return (
    <section
      ref={sectionRef}
      className="entrepreneur-section relative bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-24 sm:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-br from-green-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-red-500/20 to-transparent rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20 mb-6"
          >
            <Brain className="w-4 h-4 text-[#ff6a1a]" />
            <span className="text-sm font-medium text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              The Mindset Test
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Are You an{' '}
            <span className="bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] bg-clip-text text-transparent">
              Entrepreneur
            </span>
            <br />
            or a Wantrepreneur?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            The difference isn't talent or luck—it's action. Which side are you on?
          </motion.p>
        </motion.div>

        {/* Two Column Comparison */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Entrepreneur Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 border-2 border-green-200 dark:border-green-800 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Entrepreneur
                  </h3>
                  <p className="text-green-600 dark:text-green-400 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    The Action-Taker
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                {entrepreneurTraits.map((trait, index) => (
                  <motion.li
                    key={trait.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="entrepreneur-trait flex items-center gap-3"
                  >
                    <trait.icon className={`w-5 h-5 ${trait.color} flex-shrink-0`} />
                    <span className="text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {trait.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-8 p-4 bg-green-100 dark:bg-green-900/30 rounded-xl"
              >
                <p className="text-green-800 dark:text-green-300 font-semibold text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  "Done is better than perfect."
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Wantrepreneur Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-3xl p-8 border-2 border-red-200 dark:border-red-800 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Wantrepreneur
                  </h3>
                  <p className="text-red-600 dark:text-red-400 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    The Eternal Planner
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                {wantrepreneurTraits.map((trait, index) => (
                  <motion.li
                    key={trait.text}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="entrepreneur-trait flex items-center gap-3"
                  >
                    <trait.icon className={`w-5 h-5 ${trait.color} flex-shrink-0`} />
                    <span className="text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {trait.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-8 p-4 bg-red-100 dark:bg-red-900/30 rounded-xl"
              >
                <p className="text-red-800 dark:text-red-300 font-semibold text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  "I'll start... someday."
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-[#ff6a1a]" />
            <p className="text-xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Ready to stop planning and start doing?
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            The first step to becoming an entrepreneur is making a decision. The second step? Getting the right guidance.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
