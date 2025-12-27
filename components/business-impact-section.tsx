"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { AlertTriangle, TrendingUp, Quote, ArrowRight } from "lucide-react"
import Link from "next/link"
import { BusinessImpact } from "@/lib/service-data"

interface BusinessImpactSectionProps {
  impact: BusinessImpact
  serviceTitle: string
}

function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState("0")
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true

            // Check if value is a number or contains special formatting
            const numericPart = value.replace(/[^0-9.]/g, '')
            const prefix = value.match(/^[^0-9]*/)?.[0] || ''
            const suffix = value.match(/[^0-9]*$/)?.[0] || ''

            if (numericPart && !isNaN(parseFloat(numericPart))) {
              const targetNum = parseFloat(numericPart)
              const isInteger = Number.isInteger(targetNum)

              const controls = animate(0, targetNum, {
                duration,
                ease: "easeOut",
                onUpdate: (latest) => {
                  const formatted = isInteger
                    ? Math.floor(latest).toString()
                    : latest.toFixed(1)
                  setDisplayValue(`${prefix}${formatted}${suffix}`)
                },
              })

              return () => controls.stop()
            } else {
              setDisplayValue(value)
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref}>{displayValue}</span>
}

export default function BusinessImpactSection({ impact, serviceTitle }: BusinessImpactSectionProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
      </div>

      {/* Gradient accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff6a1a]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff6a1a]/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-[#ff6a1a]/20 border border-[#ff6a1a]/30">
            <TrendingUp className="w-4 h-4 text-[#ff6a1a]" />
            <span className="text-sm font-semibold text-[#ff6a1a] uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Business Impact
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {impact.headline}
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {impact.subheadline}
          </p>
        </motion.div>

        {/* Pain Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Common Challenges We Solve
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {impact.painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                </div>
                <span className="text-white/80 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Outcomes / Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <TrendingUp className="w-5 h-5 text-green-400" />
            Real Results You Can Expect
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {impact.outcomes.map((outcome, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 overflow-hidden group"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a1a]/0 to-[#ff6a1a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl font-bold text-[#ff6a1a] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <AnimatedCounter value={outcome.metric} />
                  </div>
                  <div className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {outcome.label}
                  </div>
                  <p className="text-sm text-white/60" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {outcome.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#ff6a1a]/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial (if available) */}
        {impact.testimonialQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative bg-gradient-to-br from-[#ff6a1a]/20 to-[#ff6a1a]/5 border border-[#ff6a1a]/30 rounded-2xl p-8 sm:p-12"
          >
            <Quote className="absolute top-6 left-6 w-12 h-12 text-[#ff6a1a]/30" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <p className="text-xl sm:text-2xl text-white italic mb-6 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                "{impact.testimonialQuote}"
              </p>
              {impact.testimonialAuthor && (
                <div className="text-[#ff6a1a] font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  — {impact.testimonialAuthor}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#ff6a1a] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e55f17] transition-all shadow-lg hover:shadow-[#ff6a1a]/25 hover:-translate-y-1"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Start Seeing Results
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
