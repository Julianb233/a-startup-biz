"use client"

import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { Shield, Users, Timer, Dumbbell, Mountain, Waves, Bike, Package, Award, CheckCircle2, Lock } from "lucide-react"
import { useEffect, useRef } from "react"

interface StatItem {
  value: string
  animatedValue?: number
  label: string
  description: string
  icon: typeof Users
}

const stats: StatItem[] = [
  { value: "247", animatedValue: 247, label: "Partner Facilities", description: "Active partnerships", icon: Users },
  { value: "127K+", animatedValue: 127, label: "Members Protected", description: "And growing daily", icon: Shield },
  { value: "47s", animatedValue: 47, label: "Average Coverage Time", description: "Lightning fast", icon: Timer },
]

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix
      }
    })
    return () => unsubscribe()
  }, [springValue, suffix])

  return <div ref={ref}>0{suffix}</div>
}

const industryTypes = [
  { name: "Fitness & Gyms", icon: Dumbbell, color: "from-orange-500 to-red-500" },
  { name: "Rock Climbing", icon: Mountain, color: "from-teal-500 to-cyan-500" },
  { name: "Ski Resorts", icon: Mountain, color: "from-blue-500 to-indigo-500" },
  { name: "Adventure Sports", icon: Bike, color: "from-purple-500 to-pink-500" },
  { name: "Equipment Rentals", icon: Package, color: "from-green-500 to-emerald-500" },
  { name: "Water Sports", icon: Waves, color: "from-cyan-500 to-blue-500" },
]

const partnerLogos = [
  { name: "PowerHouse CrossFit", industry: "Fitness", height: "h-24", avatarSize: "w-10 h-10", hoverLift: -4, featured: false, bgVariant: "plain", borderOpacity: "border-slate-200", delay: 0.05 },
  { name: "Summit Climbing Co.", industry: "Climbing", height: "h-28", avatarSize: "w-12 h-12", hoverLift: -6, featured: true, bgVariant: "gradient", borderOpacity: "border-teal-200", delay: 0.08 },
  { name: "Alpine Peak Resort", industry: "Ski Resort", height: "h-20", avatarSize: "w-8 h-8", hoverLift: -3, featured: false, bgVariant: "plain", borderOpacity: "border-slate-200", delay: 0.12 },
  { name: "Adventure Rentals Pro", industry: "Equipment", height: "h-24", avatarSize: "w-10 h-10", hoverLift: -5, featured: false, bgVariant: "subtle-gradient", borderOpacity: "border-slate-200/80", delay: 0.06 },
  { name: "Coastal Water Sports", industry: "Water Sports", height: "h-26", avatarSize: "w-11 h-11", hoverLift: -5, featured: true, bgVariant: "gradient", borderOpacity: "border-cyan-200", delay: 0.1 },
  { name: "Urban Fitness Hub", industry: "Fitness", height: "h-22", avatarSize: "w-9 h-9", hoverLift: -3, featured: false, bgVariant: "plain", borderOpacity: "border-slate-200", delay: 0.07 },
]

const trustIndicators = [
  { icon: Award, text: "A-Rated Insurance Carriers", subtext: "Top-tier coverage" },
  { icon: CheckCircle2, text: "Licensed in All 50 States", subtext: "Nationwide protection" },
  { icon: Lock, text: "SOC 2 Compliant", subtext: "Enterprise security" },
  { icon: Shield, text: "24/7 Claims Support", subtext: "Always available" },
]


export function DEITrustBadges() {
  return (
    <section data-section="trust-badges" className="relative bg-slate-50 py-12 md:py-16 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-3">
                <div className="flex items-center justify-center p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-teal-400" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-teal-400 mb-1">
                {stat.animatedValue !== undefined ? (
                  <AnimatedCounter
                    value={stat.animatedValue}
                    suffix={stat.value.replace(/[0-9]/g, '')}
                  />
                ) : (
                  stat.value
                )}
              </div>
              <div className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-xs text-slate-500 mt-1 hidden md:block">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mb-12" />

        {/* Trusted By Leading Facilities Section */}
        <div className="text-center mb-12">
          <p className="text-teal-400/70 text-xs uppercase tracking-[0.3em] mb-8">
            Trusted by Leading Facilities In
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {industryTypes.map((industry, index) => {
              const IconComponent = industry.icon
              return (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="group relative"
                >
                  <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-300 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
                    {/* Icon with gradient background */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${industry.color} opacity-20 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                      <IconComponent className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    {/* Grayscale icon overlay */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                      <IconComponent className="w-7 h-7 text-slate-400" />
                    </div>
                    <span className="text-xs md:text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors text-center">
                      {industry.name}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent mb-10" />

        {/* Trust Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {trustIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon
            return (
              <motion.div
                key={indicator.text}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                  <div className="w-12 h-12 rounded-full bg-teal-500/10 group-hover:bg-teal-500/20 transition-colors duration-300 flex items-center justify-center mb-3">
                    <IconComponent className="w-6 h-6 text-teal-400 group-hover:text-teal-500 transition-colors duration-300" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 mb-1">
                    {indicator.text}
                  </div>
                  <div className="text-xs text-slate-500">
                    {indicator.subtext}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
