'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'

interface HeroSectionProps {
  videoUrl?: string
  onGetStartedClick?: () => void
  onWatchVideoClick?: () => void
}

export default function HeroSection({
  videoUrl,
  onGetStartedClick,
  onWatchVideoClick,
}: HeroSectionProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const handleWatchVideo = () => {
    setIsVideoPlaying(true)
    onWatchVideoClick?.()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const ctaVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.4,
      },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            {/* Main headline */}
            <motion.h1
              variants={itemVariants}
              className="font-montserrat font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-black leading-tight mb-6"
            >
              Are You an{' '}
              <span className="text-[#ff6a1a] relative inline-block">
                Entrepreneur
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-3 bg-[#ff6a1a] opacity-20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                />
              </span>{' '}
              or Wantrepreneur?
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="font-lato text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Stop dreaming about success.{' '}
              <span className="font-semibold text-black">We help you build it.</span>
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={ctaVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              {/* Get Started CTA */}
              <motion.button
                onClick={onGetStartedClick}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -15px rgba(255, 106, 26, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-8 py-4 bg-[#ff6a1a] text-white font-montserrat font-bold text-lg rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#ff6a1a] to-[#ff8a4a]"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Watch Video CTA */}
              <motion.button
                onClick={handleWatchVideo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="group w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#ff6a1a] text-[#ff6a1a] font-montserrat font-bold text-lg rounded-lg hover:bg-[#ff6a1a] hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Watch Video</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Video embed section */}
          <motion.div
            variants={itemVariants}
            className="relative w-full"
          >
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
              {!isVideoPlaying && (
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isVideoPlaying ? 0 : 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer group"
                  onClick={handleWatchVideo}
                >
                  {/* Placeholder thumbnail */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a1a]/20 to-transparent" />

                  {/* Play button overlay */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 bg-[#ff6a1a] rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-[0_0_40px_rgba(255,106,26,0.6)] transition-all duration-300"
                  >
                    <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" fill="currentColor" />
                  </motion.div>

                  {/* Decorative elements */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 border-4 border-[#ff6a1a] rounded-2xl opacity-50"
                  />
                </motion.div>
              )}

              {/* Video iframe (YouTube/Vimeo ready) */}
              {isVideoPlaying && videoUrl && (
                <motion.iframe
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={videoUrl}
                  title="A Startup Biz Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}

              {/* Decorative border glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ff6a1a] to-[#c0c0c0] rounded-2xl opacity-20 blur-lg -z-10" />
            </div>

            {/* Floating accent elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-[#ff6a1a] rounded-lg opacity-10 -z-10 blur-xl"
            />
            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#c0c0c0] rounded-lg opacity-10 -z-10 blur-xl"
            />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="text-xs font-lato uppercase tracking-wider">Scroll</span>
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
