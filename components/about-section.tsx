'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const expertise = [
    'Startup Validation & Launch',
    'Business Plan Development',
    'Absentee Ownership Mastery',
    'Operational Systems',
    'Growth & Scaling Strategy',
    'Exit Planning',
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 sm:py-32 overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#ff6a1a]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#ff6a1a]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#ff6a1a]" />
            <span className="text-sm font-medium text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>The Story</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 section-heading"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            A Lifetime of{' '}
            <span className="bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] bg-clip-text text-transparent">
              Business
            </span>
          </motion.h2>
        </motion.div>

        {/* Content - Centered Single Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-8"
        >
          {/* Bio - A Lifetime Devoted to Business */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                A Lifetime Devoted to Business
              </h3>
              <p className="text-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                My name is Tory R. Zweigle, and I am a serial entrepreneur. For the last five decades,
                I have done nothing but eat, breathe, and sleep business. I started at age 11, beginning
                a lifelong journey of ideas and startups.
              </p>
            </div>

            <p style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Most people will never start a new business. And those who do usually only build one.
              Some will grow it into a very successful company, or expand into multiple locations.
              Along that path of owner–operator, you get hands-on training in people, finance, rules,
              regulations, legal issues, ergonomics, human nature, and hopefully some common sense.
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-bold text-black dark:text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Lessons From a Lifetime of Business
              </h4>
              <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                You learn a lot from a single business venture. If you're lucky enough to build two
                successful businesses, then you're on a path of hard work and intentional growth.
                Being self-employed means you learn every day, every month, and every year. Those
                lessons stay with you forever—and sometimes you even pass them along to others who
                cross your path in business and in life.
              </p>
            </div>
          </motion.div>

          {/* What 100+ Startups Taught Me */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <h4 className="text-xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              What 100+ Startups Taught Me About True Success
            </h4>
            <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              I have been in thousands of situations across the many businesses I've run. For every
              business I start, it's always a new journey, with new insights at new times in new places.
              I still learn every day.
            </p>
            <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              There are not many people on this planet who have started over 100 businesses. And I do
              not recommend it to anyone. Even though entrepreneurship can build great wealth, it comes
              with a price.
            </p>
            <div className="flex items-start gap-3 bg-[#ff6a1a]/5 dark:bg-[#ff6a1a]/10 rounded-xl p-4 border border-[#ff6a1a]/20">
              <Target className="w-6 h-6 text-[#ff6a1a] flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 dark:text-gray-300 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="text-black dark:text-white font-bold">Family is the key to life.</span> If you can build
                both—a good business and a good family life—you are wealthy beyond dreams.
              </p>
            </div>
          </motion.div>

          {/* Why Most Business Advice Fails */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="space-y-4"
          >
            <h4 className="text-xl font-bold text-black dark:text-white flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <AlertTriangle className="w-5 h-5 text-[#ff6a1a]" />
              Why Most Business Advice Fails You
            </h4>
            <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              I've had so many startups that I can see what others do not. Your business is in a
              fishbowl to me. I can see all around it while you're inside the bowl trying to keep
              things going. I see the ups, the downs, the patterns, the blind spots, the opportunities,
              and the dangers.
            </p>
            <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Most business consultants have never started a business before starting their consulting
              career. How do you give advice on something you've never done? Just like professors
              teaching business all over the world—they've likely never started a business.{' '}
              <span className="font-bold text-black dark:text-white">Most consultants teach theory. And theory does not pay the bills.</span>
            </p>
          </motion.div>

          {/* Expertise List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Areas of Expertise</h4>
            <div className="grid sm:grid-cols-2 gap-3">
              {expertise.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#ff6a1a] flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
