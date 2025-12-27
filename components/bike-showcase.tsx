"use client"

import { motion, AnimatePresence } from "framer-motion"

const PORTRAIT_URL = "/images/5b967406-7d8b-451d-a95d.jpeg"

const sparkles = [
  { left: "5%", top: "10%", delay: 0, size: "lg" },
  { left: "92%", top: "15%", delay: 0.5, size: "md" },
  { left: "8%", top: "85%", delay: 0.3, size: "md" },
  { left: "88%", top: "80%", delay: 0.8, size: "lg" },
  { left: "50%", top: "5%", delay: 0.2, size: "sm" },
  { left: "95%", top: "45%", delay: 0.7, size: "md" },
  { left: "3%", top: "50%", delay: 0.4, size: "lg" },
  { left: "70%", top: "90%", delay: 1.0, size: "sm" },
]

const getSparkleSize = (size: string) => {
  switch (size) {
    case "lg":
      return "w-4 h-4 md:w-6 md:h-6"
    case "md":
      return "w-3 h-3 md:w-4 md:h-4"
    default:
      return "w-2 h-2 md:w-3 md:h-3"
  }
}

export default function AIShowcase() {
  return (
    <section id="showcase" className="relative bg-[#0A4D3C] px-6 md:px-12 overflow-hidden py-20 md:py-32">
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

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A84B]/30">
              <img
                src={PORTRAIT_URL || "/placeholder.svg"}
                alt="Julian Bradley - The Wizard of AI"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A4D3C]/60 via-transparent to-transparent" />
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-[#D4A84B]/10 rounded-3xl blur-2xl -z-10" />
          </motion.div>

          {/* Right side - Copy */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#FDF8E8] leading-[1.1] tracking-tight">
                Your Business
                <span className="block text-[#D4A84B]">Deserves Better</span>
              </h2>
            </div>

            <p className="text-lg md:text-xl text-[#F0D98C]/90 leading-relaxed">
              You didn&apos;t start your business to drown in repetitive tasks, chase unqualified leads, or answer the
              same questions 100 times a day.
            </p>

            <p className="text-lg md:text-xl text-[#FDF8E8]/80 leading-relaxed">
              AI isn&apos;t the future—it&apos;s happening <strong className="text-[#D4A84B]">right now</strong>. And
              the businesses that embrace it are leaving their competition in the dust.
            </p>

            <div className="space-y-4 py-4 border-y border-[#D4A84B]/20">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#D4A84B]" />
                <p className="text-[#FDF8E8]/90">
                  <strong className="text-[#D4A84B]">24/7 automation</strong> that never sleeps, never complains, never
                  calls in sick
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#D4A84B]" />
                <p className="text-[#FDF8E8]/90">
                  <strong className="text-[#D4A84B]">Qualified leads</strong> delivered to your inbox while you focus on
                  closing deals
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-[#D4A84B]" />
                <p className="text-[#FDF8E8]/90">
                  <strong className="text-[#D4A84B]">Custom AI agents</strong> trained on YOUR business, YOUR voice,
                  YOUR processes
                </p>
              </div>
            </div>

            <motion.a
              href="#apply"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A84B] text-[#0A4D3C] font-bold text-lg rounded-xl hover:bg-[#E8C55A] transition-all duration-300 shadow-lg hover:shadow-[#D4A84B]/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Book Your Strategy Call
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>

            <p className="text-sm text-[#FDF8E8]/50">
              No commitment required. Let&apos;s see if AI is right for your business.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
