'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, TrendingUp, Users, Target, CheckCircle2, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const credentials = [
    { icon: Award, label: 'Certified Business Consultant' },
    { icon: TrendingUp, label: '10+ Years Experience' },
    { icon: Users, label: '200+ Businesses Helped' },
    { icon: Target, label: '95% Success Rate' },
  ];

  const expertise = [
    'Business Strategy & Planning',
    'Financial Modeling & Forecasting',
    'Operations Optimization',
    'Marketing & Growth',
    'Team Building & Leadership',
    'Fundraising & Investment',
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-white via-gray-50 to-white py-24 sm:py-32 overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#ff6a1a]/10 to-transparent rounded-full blur-3xl" />
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#ff6a1a]" />
            <span className="text-sm font-medium text-[#ff6a1a]">Meet Your Guide</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            Your Guide to{' '}
            <span className="bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] bg-clip-text text-transparent">
              Business Success
            </span>
          </motion.h2>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a1a]/20 via-transparent to-[#ff8c4a]/20 z-10" />

              {/* Image Placeholder - Replace with actual image */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#ff6a1a] to-[#ff8c4a] flex items-center justify-center">
                      <span className="text-6xl font-bold text-white">TZ</span>
                    </div>
                    <p className="text-gray-600 text-sm">Professional Photo</p>
                    <p className="text-gray-500 text-xs">Coming Soon</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gradient-to-br from-[#ff6a1a] to-[#ff8c4a] blur-2xl opacity-60 z-0"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-gradient-to-tl from-[#ff6a1a] to-[#ff8c4a] blur-2xl opacity-60 z-0"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.8, 0.6, 0.8],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Credentials Cards - Floating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="absolute -bottom-6 -right-6 left-6 grid grid-cols-2 gap-3"
            >
              {credentials.map((cred, index) => (
                <motion.div
                  key={cred.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg backdrop-blur-sm"
                >
                  <cred.icon className="w-6 h-6 text-[#ff6a1a] mb-2" />
                  <p className="text-xs font-medium text-gray-900 leading-tight">
                    {cred.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-8"
          >
            {/* Name & Title */}
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2"
              >
                Tory Zweigle
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-xl text-[#ff6a1a] font-semibold"
              >
                Founder & Business Consultant
              </motion.p>
            </div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-4 text-gray-700 leading-relaxed"
            >
              <p className="text-lg">
                I'm a business consultant dedicated to helping entrepreneurs turn their ideas into thriving realities.
                With over a decade of experience, I've helped hundreds of businesses navigate the challenges of growth,
                strategy, and scaling.
              </p>
              <p>
                My approach is simple: I don't believe in one-size-fits-all solutions. Every business is unique,
                and I work closely with each client to develop strategies that align with their vision, values, and goals.
              </p>
              <p>
                Whether you're just starting out or looking to take your established business to the next level,
                I'm here to provide the guidance, accountability, and expertise you need to succeed.
              </p>
            </motion.div>

            {/* Expertise List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4">Areas of Expertise</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {expertise.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#ff6a1a] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call-to-Action */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="pt-4"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] text-white font-semibold shadow-lg shadow-[#ff6a1a]/30 hover:shadow-[#ff6a1a]/50 transition-all duration-300"
                >
                  Let's Work Together
                </motion.a>
                <motion.a
                  href="#services"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-[#ff6a1a] text-[#ff6a1a] font-semibold hover:bg-[#ff6a1a]/5 transition-all duration-300"
                >
                  View Services
                </motion.a>
              </div>
            </motion.div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="pt-6 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600 italic">
                "Success isn't just about having a great idea—it's about having the right strategy,
                the right mindset, and the right guide to help you navigate the journey."
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-2">— Tory Zweigle</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
