'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react'

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const highlights = [
    "46+ years of lived experience",
    "100+ businesses started",
    "Absentee ownership mastery"
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/tory-profile.jpg"
          alt="A Startup Biz hero"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Readability overlay (light + dark modes) */}
        <div className="absolute inset-0 bg-white/85 dark:bg-black/65" />
      </div>

      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-[#ff6a1a] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-[#c0c0c0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#ff6a1a] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Main headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white leading-tight mb-6"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Get{' '}
            <span className="text-[#ff6a1a] relative inline-block">
              46+ Years
              <motion.span
                className="absolute -bottom-2 left-0 w-full h-3 bg-[#ff6a1a] opacity-20"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                style={{ transformOrigin: 'left' }}
              />
            </span>{' '}
            of Lived Experience
            <br className="hidden sm:block" />
            <span className="text-gray-700 dark:text-gray-300">Focused on Your Business</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-medium"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Are You an{' '}
            <span className="font-bold text-black dark:text-white">Entrepreneur</span>{' '}
            or a{' '}
            <span className="font-bold text-[#ff6a1a]">Wantrepreneur?</span>
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Real-world strategy from someone who's started 100+ businesses—not textbook theory from consultants who've never built anything.
          </motion.p>

          {/* Highlights */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10"
          >
            {highlights.map((highlight, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <CheckCircle className="w-5 h-5 text-[#ff6a1a] flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {highlight}
                </span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {/* Primary CTA - Book Call */}
            <Link href="/book-call">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -15px rgba(255, 106, 26, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-8 py-4 bg-[#ff6a1a] text-white font-bold text-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <Calendar className="w-5 h-5" />
                <span>Apply to Qualify</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>

            {/* Secondary CTA */}
            <Link href="#about">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-lg rounded-xl hover:border-[#ff6a1a] hover:text-[#ff6a1a] transition-all duration-300"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Meet Tory
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              The $1,000 investment that could save you everything
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-gray-600 dark:text-gray-400">
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>$1,000</div>
                <div className="text-xs uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>30-Min Clarity Call</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>100+</div>
                <div className="text-xs uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>Businesses Started</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>46+</div>
                <div className="text-xs uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>Years Experience</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
          >
            <span className="text-xs uppercase tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>Scroll</span>
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
