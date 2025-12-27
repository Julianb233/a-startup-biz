"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Building2, Video, Briefcase, Users, Rocket, Lightbulb, ArrowRight } from "lucide-react"
import Link from "next/link"

const sparkles = [
  { left: "6%", top: "10%", delay: 0, size: "lg" },
  { left: "92%", top: "15%", delay: 0.4, size: "lg" },
  { left: "10%", top: "80%", delay: 0.7, size: "lg" },
  { left: "88%", top: "75%", delay: 1.0, size: "lg" },
  { left: "45%", top: "5%", delay: 0.2, size: "md" },
  { left: "95%", top: "50%", delay: 0.6, size: "lg" },
  { left: "3%", top: "45%", delay: 0.3, size: "lg" },
  { left: "70%", top: "88%", delay: 0.9, size: "md" },
  { left: "25%", top: "92%", delay: 0.5, size: "lg" },
  { left: "55%", top: "25%", delay: 0.8, size: "lg" },
  { left: "80%", top: "40%", delay: 1.1, size: "md" },
]

const getSparkleSize = (size: string) => {
  switch (size) {
    case "lg":
      return "w-5 h-5 md:w-7 md:h-7"
    case "md":
      return "w-4 h-4 md:w-5 md:h-5"
    default:
      return "w-3 h-3 md:w-4 md:h-4"
  }
}

const audiences = [
  {
    icon: Building2,
    title: "Business Owners",
    description: "Entrepreneurs drowning in day-to-day tasks who want to scale without hiring an army.",
    slug: "business-owners",
  },
  {
    icon: Video,
    title: "Content Creators",
    description: "Creators who need to produce more content across platforms without burning out.",
    slug: "content-creators",
  },
  {
    icon: Briefcase,
    title: "CEOs & Executives",
    description: "Leaders looking to give their teams superpowers and 10x productivity overnight.",
    slug: "executives",
  },
  {
    icon: Users,
    title: "Agency Owners",
    description: "Agencies that want to deliver more value to clients without increasing headcount.",
    slug: "agency-owners",
  },
  {
    icon: Rocket,
    title: "Startups",
    description: "Fast-moving teams that need enterprise-level automation on a bootstrap budget.",
    slug: "startups",
  },
  {
    icon: Lightbulb,
    title: "Innovators",
    description: "Forward-thinkers who see AI as an opportunity, not a threat, and want to lead their industry.",
    slug: "innovators",
  },
]

export function WhoIServeSection() {
  return (
    <section className="relative bg-[#0A4D3C] py-20 md:py-32 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle, i) => (
          <motion.div
            key={i}
            className={`absolute ${getSparkleSize(sparkle.size)} z-10 pointer-events-none`}
            style={{ left: sparkle.left, top: sparkle.top }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.7, 1, 0],
              scale: [0, 1.3, 0.9, 1.3, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3.5,
              delay: sparkle.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.2,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#D4A84B"
                style={{ filter: "drop-shadow(0 0 10px rgba(212,168,75,0.95))" }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Decorative swirls */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="swirl-gradient-serve" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A84B" />
              <stop offset="100%" stopColor="#E8C55A" />
            </linearGradient>
          </defs>
          <motion.path
            d="M100,10 Q150,50 140,100 T100,190 Q50,150 60,100 T100,10"
            fill="none"
            stroke="url(#swirl-gradient-serve)"
            strokeWidth="2"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#FDF8E8] leading-tight tracking-tight">
            Who I <span className="text-[#D4A84B]">Help & Serve</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[#F0D98C]/90 max-w-2xl mx-auto">
            I partner with ambitious people who are ready to stop trading time for money and start building systems that
            work while they sleep.
          </p>
        </motion.div>

        {/* Audience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <Link
              key={audience.title}
              href={`/serve/${audience.slug}`}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                className="group relative bg-[#0D6B4F]/30 backdrop-blur-sm rounded-2xl p-6 border border-[#D4A84B]/20 hover:border-[#D4A84B]/50 transition-all duration-300 text-center flex flex-col items-center cursor-pointer h-full"
              >
                {/* Icon - Centered */}
                <div className="w-14 h-14 rounded-xl bg-[#D4A84B]/10 flex items-center justify-center mb-4 group-hover:bg-[#D4A84B]/20 transition-colors mx-auto">
                  <audience.icon className="w-7 h-7 text-[#D4A84B]" />
                </div>

                {/* Title - Centered */}
                <h3 className="text-xl font-bold text-[#FDF8E8] mb-2 text-center">{audience.title}</h3>

                {/* Description - Centered */}
                <p className="text-[#FDF8E8]/70 text-sm leading-relaxed text-center mb-4">{audience.description}</p>

                {/* Arrow Icon - Appears on Hover */}
                <div className="mt-auto flex items-center justify-center gap-2 text-[#D4A84B] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm font-semibold">Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-[#D4A84B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-[#FDF8E8]/60 mb-3">Sound like you? Let's talk about how AI can transform your business.</p>
          <motion.div
            className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-[#D4A84B]/20 rounded-full border border-[#D4A84B]/40"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg className="w-4 h-4 text-[#D4A84B]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-[#D4A84B] text-sm font-semibold">Limited Availability</span>
          </motion.div>
          <motion.a
            href="#apply"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A84B] text-[#0A4D3C] font-bold text-lg rounded-xl hover:bg-[#E8C55A] transition-all duration-300 shadow-lg hover:shadow-[#D4A84B]/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Your Free Strategy Call
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
