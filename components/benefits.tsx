"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { DollarSign, ShieldCheck, Zap, Settings, ToggleRight } from "lucide-react"
import { useState } from "react"

interface Benefit {
  icon: React.ElementType
  title: string
  description: string
}

const benefits: Benefit[] = [
  {
    icon: DollarSign,
    title: "New Revenue Stream",
    description: "Earn commission on every policy sold. Turn liability into profit.",
  },
  {
    icon: ShieldCheck,
    title: "Reduced Liability",
    description: "Transfer risk to our insurance carriers. Protect your business from claims.",
  },
  {
    icon: ToggleRight,
    title: "Optional or Required",
    description: "Your choice: offer coverage as an add-on, or make it a simple checkbox requirement.",
  },
  {
    icon: Zap,
    title: "Customer Convenience",
    description: "Instant coverage, no paperwork. Delight customers with seamless protection.",
  },
  {
    icon: Settings,
    title: "Simple Integration",
    description: "Works with your existing POS and booking systems. API or portal access.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

// 3D Card Component with mouse tracking
function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring-animated rotation values
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
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
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative h-full"
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-teal-500/20 via-teal-400/30 to-teal-500/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Card */}
        <div className="relative h-full bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-premium border border-gray-100/80 hover:shadow-premium-hover transition-shadow duration-500 overflow-hidden">
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
            animate={isHovered ? { x: ["100%", "200%"] } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transform: "translateX(-100%)" }}
          />

          {/* Gradient border on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(20,184,166,0.3) 0%, rgba(14,165,233,0.2) 50%, rgba(20,184,166,0.3) 100%)",
              opacity: 0,
              padding: "1px",
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Icon Container */}
          <div className="mb-6 relative" style={{ transform: "translateZ(20px)" }}>
            <div className="relative inline-flex items-center justify-center">
              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 bg-teal-500/20 rounded-2xl blur-xl"
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  opacity: isHovered ? 0.4 : 0.2,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Icon Circle */}
              <motion.div
                className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl shadow-lg shadow-teal-500/25"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <benefit.icon className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2} />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div style={{ transform: "translateZ(10px)" }}>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-teal-600 transition-colors duration-300">
              {benefit.title}
            </h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {benefit.description}
            </p>
          </div>

          {/* Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-b-2xl"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ originX: 0 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Benefits() {
  return (
    <section id="benefits" className="relative w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
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
          className="absolute bottom-20 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
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
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Partner Benefits</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6">
            Why Partner <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">With Us</span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Benefits that boost your bottom line
          </p>
        </motion.div>

        {/* Benefits Grid - Flexbox for centered orphan cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-wrap justify-center gap-6 md:gap-8"
        >
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className="w-full md:w-[calc(50%-16px)]">
              <BenefitCard benefit={benefit} index={index} />
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
            Ready to transform your business with daily event insurance?
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
