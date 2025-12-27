"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Timer, Bike, Layers, Mountain, Footprints, Building2, GraduationCap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export interface Industry {
  icon: React.ElementType
  title: string
  description: string
  slug: string
  gradient: string
}

export const industries: Industry[] = [
  {
    icon: Timer,
    title: "Race Directors / Running Events",
    description: "Comprehensive coverage for road races, trail runs, and endurance events of all distances.",
    slug: "race-directors",
    gradient: "from-teal-500 to-teal-600",
  },
  {
    icon: Bike,
    title: "Cycling Events / Bike Races",
    description: "Protect cyclists with instant coverage for criteriums, gran fondos, and mountain bike races.",
    slug: "cycling-events",
    gradient: "from-teal-600 to-cyan-600",
  },
  {
    icon: Layers,
    title: "Triathlons / Multi-Sport",
    description: "Multi-discipline event coverage for swim-bike-run and adventure racing competitions.",
    slug: "triathlons",
    gradient: "from-cyan-600 to-teal-500",
  },
  {
    icon: Mountain,
    title: "Obstacle Course Races (OCR)",
    description: "High-intensity event protection for mud runs, ninja courses, and adventure challenges.",
    slug: "obstacle-course-races",
    gradient: "from-teal-500 to-teal-700",
  },
  {
    icon: Footprints,
    title: "Marathons & Fun Runs",
    description: "From charity 5Ks to major marathons - coverage for events that move communities.",
    slug: "marathons-fun-runs",
    gradient: "from-teal-600 to-cyan-500",
  },
  {
    icon: Building2,
    title: "Corporate Wellness Events",
    description: "Company runs, team challenges, and wellness initiatives with seamless group coverage.",
    slug: "corporate-wellness",
    gradient: "from-cyan-500 to-teal-600",
  },
  {
    icon: GraduationCap,
    title: "Schools & Universities",
    description: "Student races, campus recreation events, and collegiate athletic competitions.",
    slug: "schools-universities",
    gradient: "from-teal-700 to-cyan-600",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// 3D Industry Card Component with mouse tracking
function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring-animated rotation values
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 150,
    damping: 20,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      variants={cardVariants}
      className="group perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/industries/${industry.slug}`} className="block">
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
          className="relative h-full min-h-[280px] sm:min-h-[300px]"
        >
          {/* Glow effect on hover */}
          <motion.div
            className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r ${industry.gradient} opacity-0 blur-xl`}
            animate={{ opacity: isHovered ? 0.4 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Card */}
          <div className="relative h-full bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-premium border border-gray-100/80 hover:shadow-premium-hover transition-shadow duration-500 overflow-hidden">
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
              animate={isHovered ? { x: ["100%", "200%"] } : {}}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ transform: "translateX(-100%)" }}
            />

            {/* Gradient border on hover */}
            <motion.div
              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${industry.gradient}`}
              style={{
                opacity: 0,
                padding: "1px",
              }}
              animate={{ opacity: isHovered ? 0.15 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon Container */}
            <div className="mb-6 relative" style={{ transform: "translateZ(20px)" }}>
              <div className="relative inline-flex">
                {/* Background Glow */}
                <motion.div
                  className="absolute inset-0 bg-teal-500/20 rounded-2xl blur-xl"
                  animate={{
                    scale: isHovered ? 1.3 : 1,
                    opacity: isHovered ? 0.5 : 0.2,
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Icon Circle */}
                <motion.div
                  className={`relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${industry.gradient} rounded-2xl shadow-lg shadow-teal-500/25`}
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                    rotate: isHovered ? [0, -5, 5, 0] : 0,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <industry.icon className="w-7 h-7 md:w-8 md:h-8 text-white" strokeWidth={2} />
                </motion.div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6" style={{ transform: "translateZ(10px)" }}>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300 leading-snug">
                {industry.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {industry.description}
              </p>
            </div>

            {/* Learn More CTA */}
            <motion.div
              className="flex items-center gap-2 text-teal-600 font-semibold text-sm md:text-base"
              style={{ transform: "translateZ(10px)" }}
              initial={{ x: 0 }}
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <span>Learn More</span>
              <motion.div
                animate={{ x: isHovered ? [0, 5, 0] : 0 }}
                transition={{
                  duration: 0.6,
                  repeat: isHovered ? Infinity : 0,
                  repeatType: "loop"
                }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>

            {/* Accent Line */}
            <motion.div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${industry.gradient} rounded-b-2xl`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0 }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function IndustryCards() {
  return (
    <section id="industries" className="relative w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.7, 0.5, 0.7],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #14B8A6 1px, transparent 1px), linear-gradient(to bottom, #14B8A6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6"
          >
            <Layers className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Business Sectors</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Industries We <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">Serve</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Specialized event insurance solutions for active lifestyle businesses
          </p>
        </motion.div>

        {/* Industries Grid - Flexbox for centered orphan cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {industries.map((industry, index) => (
            <div key={industry.slug} className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] xl:w-[calc(25%-24px)]">
              <IndustryCard industry={industry} index={index} />
            </div>
          ))}
        </motion.div>

        {/* Optional CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-base md:text-lg text-gray-600 mb-6">
            Ready to protect your participants and grow your revenue?
          </p>
          <motion.a
            href="#apply"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base md:text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-shadow duration-300"
          >
            Get Started Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
