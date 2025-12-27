"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ToggleLeft, CheckSquare, Sparkles, TrendingUp, Users, DollarSign, Shield, Zap } from "lucide-react"
import { useState } from "react"

interface Mode {
  id: string
  title: string
  subtitle: string
  icon: React.ElementType
  description: string
  benefits: string[]
  badge?: string
  badgeColor?: string
  customerExperience: string
  paymentModel: string
  bestFor: string[]
  highlight: boolean
}

const modes: Mode[] = [
  {
    id: "optional",
    title: "Optional Add-On",
    subtitle: "Customer Choice",
    icon: ToggleLeft,
    description: "Give your customers the choice to add coverage at checkout. They see the value and decide.",
    benefits: [
      "Customer sees transparent pricing",
      "Separate line item on receipt",
      "Clear opt-in decision point",
      "Higher perceived value",
      "Premium positioning",
    ],
    badge: "Flexibility",
    badgeColor: "from-sky-500 to-sky-600",
    customerExperience: "Customer actively chooses to add coverage",
    paymentModel: "Separate payment/line item",
    bestFor: [
      "Facilities that want to offer choice",
      "Premium positioning strategies",
      "Markets with high insurance awareness",
    ],
    highlight: false,
  },
  {
    id: "required",
    title: "Required/Bundled",
    subtitle: "Everyone Protected",
    icon: CheckSquare,
    description: "Coverage included automatically with every booking. Simple checkbox confirmation. Everyone's covered.",
    benefits: [
      "100% coverage rate guaranteed",
      "Maximum revenue per booking",
      "No decision fatigue for customers",
      "Simplified checkout flow",
      "Strongest risk protection",
    ],
    badge: "Most Popular",
    badgeColor: "from-teal-500 to-teal-600",
    customerExperience: "Simple checkbox to acknowledge coverage",
    paymentModel: "Bundled into total price",
    bestFor: [
      "Facilities prioritizing complete protection",
      "Streamlined operations",
      "Markets expecting included coverage",
    ],
    highlight: true,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

// 3D Card Component with mouse tracking
function ModeCard({ mode, index }: { mode: Mode; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position tracking for 3D effect
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
      className="group perspective-1000 h-full"
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
        whileHover={{ y: -12 }}
        transition={{ duration: 0.3 }}
        className="relative h-full"
      >
        {/* Outer glow effect on hover */}
        <motion.div
          className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-r ${
            mode.highlight
              ? "from-teal-500/30 via-teal-400/40 to-teal-500/30"
              : "from-sky-500/20 via-sky-400/30 to-sky-500/20"
          } blur-2xl`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Main Card Container */}
        <div
          className={`relative h-full bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-premium border-2 ${
            mode.highlight
              ? "border-teal-200/80 hover:border-teal-300"
              : "border-slate-200/80 hover:border-slate-300"
          } transition-all duration-500 overflow-hidden`}
        >
          {/* Shimmer effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r from-transparent ${
              mode.highlight ? "via-teal-400/10" : "via-sky-400/10"
            } to-transparent -translate-x-full`}
            animate={isHovered ? { x: ["100%", "200%"] } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transform: "translateX(-100%)" }}
          />

          {/* Popular Badge */}
          {mode.badge && (
            <motion.div
              className="absolute -top-3 -right-3 z-10"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
            >
              <div className="relative">
                {/* Badge glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${mode.badgeColor} rounded-full blur-lg opacity-50`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.7, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div
                  className={`relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${mode.badgeColor} text-white text-sm font-bold rounded-full shadow-lg`}
                >
                  <Sparkles className="w-4 h-4" />
                  {mode.badge}
                </div>
              </div>
            </motion.div>
          )}

          {/* Icon Container */}
          <div className="mb-6 relative" style={{ transform: "translateZ(20px)" }}>
            <div className="relative inline-flex items-center justify-center">
              {/* Background Glow */}
              <motion.div
                className={`absolute inset-0 ${
                  mode.highlight ? "bg-teal-500/20" : "bg-sky-500/20"
                } rounded-2xl blur-xl`}
                animate={{
                  scale: isHovered ? 1.3 : 1,
                  opacity: isHovered ? 0.5 : 0.2,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Icon Circle */}
              <motion.div
                className={`relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${
                  mode.highlight
                    ? "from-teal-500 to-teal-600 shadow-teal-500/25"
                    : "from-sky-500 to-sky-600 shadow-sky-500/25"
                } rounded-2xl shadow-lg`}
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <mode.icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2} />
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div style={{ transform: "translateZ(10px)" }}>
            {/* Title & Subtitle */}
            <div className="mb-4">
              <h3
                className={`text-2xl md:text-3xl font-bold mb-2 ${
                  mode.highlight ? "text-teal-600" : "text-sky-600"
                } group-hover:scale-105 transition-transform duration-300 origin-left`}
              >
                {mode.title}
              </h3>
              <p className="text-base md:text-lg font-semibold text-slate-700">{mode.subtitle}</p>
            </div>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6">{mode.description}</p>

            {/* Key Details */}
            <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Customer Experience</p>
                  <p className="text-sm text-slate-600">{mode.customerExperience}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-teal-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">Payment Model</p>
                  <p className="text-sm text-slate-600">{mode.paymentModel}</p>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-500" />
                Key Benefits
              </h4>
              <ul className="space-y-2.5">
                {mode.benefits.map((benefit, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2.5 text-sm md:text-base text-slate-700"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        mode.highlight ? "text-teal-500" : "text-sky-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Best For Section */}
            <div
              className={`p-4 rounded-xl ${
                mode.highlight ? "bg-teal-50/50 border border-teal-100" : "bg-sky-50/50 border border-sky-100"
              }`}
            >
              <h4 className="text-sm font-bold text-slate-900 mb-2.5 uppercase tracking-wide flex items-center gap-2">
                <Zap className={`w-4 h-4 ${mode.highlight ? "text-teal-500" : "text-sky-500"}`} />
                Best For
              </h4>
              <ul className="space-y-1.5">
                {mode.bestFor.map((item, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 ${
                        mode.highlight ? "bg-teal-500" : "bg-sky-500"
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Accent Line */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
              mode.highlight ? "from-teal-500 to-teal-600" : "from-sky-500 to-sky-600"
            } rounded-b-3xl`}
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

export default function InsuranceModes() {
  return (
    <section
      id="insurance-modes"
      className="relative w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.4, 0.6],
          }}
          transition={{
            duration: 10,
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
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
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
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Choose Your Approach</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 md:mb-6">
            Your Choice: How to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-sky-500">
              Offer Coverage
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            Pick the approach that works for your business
          </p>
        </motion.div>

        {/* Modes Comparison Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto"
        >
          {modes.map((mode, index) => (
            <ModeCard key={mode.id} mode={mode} index={index} />
          ))}
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="inline-flex items-start gap-3 p-6 bg-gradient-to-r from-slate-50 to-white rounded-2xl border border-slate-200 shadow-lg max-w-3xl">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-bold text-slate-900 mb-2">Not sure which to choose?</h4>
              <p className="text-base text-slate-600 leading-relaxed">
                Our partner success team will help you analyze your customer base, booking patterns, and business goals
                to recommend the optimal approach. You can also switch between modes at any time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Optional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
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
          <p className="mt-4 text-slate-500 text-sm">
            We'll help you choose the best mode for your facility
          </p>
        </motion.div>
      </div>
    </section>
  )
}
