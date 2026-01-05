'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingDown, AlertTriangle, Target, Skull, BarChart2 } from 'lucide-react';

export default function HardTruthSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const failureStats = [
    { percentage: '20%', label: 'Fail in Year 1', description: 'One in five businesses close within their first year' },
    { percentage: '50%', label: 'Fail by Year 5', description: 'Half of all startups don\'t make it past five years' },
    { percentage: '65%', label: 'Fail by Year 10', description: 'Only 35% of businesses survive a full decade' },
  ];

  const failureReasons = [
    { icon: Target, reason: 'No market need', percentage: '42%' },
    { icon: TrendingDown, reason: 'Ran out of cash', percentage: '29%' },
    { icon: BarChart2, reason: 'Poor business model', percentage: '19%' },
    { icon: Skull, reason: 'Got outcompeted', percentage: '19%' },
  ];

  return (
    <section
      ref={sectionRef}
      className="hard-truth-section relative bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 py-24 sm:py-32 overflow-hidden"
    >
      {/* Dramatic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-red-900/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6"
          >
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Reality Check
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            The Hard Truth
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              About Startups
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Most businesses fail. These are the statistics that nobody wants to talk about—but you need to know.
          </motion.p>
        </motion.div>

        {/* Failure Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {failureStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="relative group"
            >
              <div className="stat-card bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-red-500/50 transition-all duration-300">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.15, type: 'spring', stiffness: 200 }}
                  className="block text-6xl sm:text-7xl font-black text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text mb-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {stat.percentage}
                </motion.span>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {stat.label}
                </h3>
                <p className="text-gray-400 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Businesses Fail */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-gray-700"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Top Reasons Startups Fail
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {failureReasons.map((item, index) => (
              <motion.div
                key={item.reason}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30">
                  <item.icon className="w-8 h-8 text-red-400" />
                </div>
                <span className="block text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {item.percentage}
                </span>
                <span className="text-gray-400 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {item.reason}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transition to Next Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            So the question is...
          </p>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            With odds like these, why would you try to figure it out alone?
          </p>
        </motion.div>
      </div>
    </section>
  );
}
