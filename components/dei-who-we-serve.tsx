"use client"

import { motion } from "framer-motion"
import { Building2, Mountain, Bike, Waves, ArrowRight, Users, Snowflake, Plane, Sparkles, HeartPulse, Activity, Award, Building, GraduationCap, Shield } from "lucide-react"
import { useState } from "react"
import { UrgencyBanner } from "./urgency-banner"
import Link from "next/link"

const markets = [
  {
    icon: Building2,
    title: "Gyms & Fitness Centers",
    description: "Offer instant coverage for personal training, group classes, and specialized fitness activities.",
    revenue: "$2,400+/mo",
    slug: "gyms-fitness",
  },
  {
    icon: Mountain,
    title: "Rock Climbing Facilities",
    description: "Same-day insurance for climbing sessions, belay certifications, and courses.",
    revenue: "$3,200+/mo",
    slug: "rock-climbing",
  },
  {
    icon: Snowflake,
    title: "Ski Resorts & Snow Sports",
    description: "Day passes, lessons, and equipment rentals with massive commission potential.",
    revenue: "$15,000+/mo",
    slug: "ski-resorts",
  },
  {
    icon: Plane,
    title: "Skydiving & Aerial Sports",
    description: "Essential protection for tandem jumps, solo certifications, and aerial adventures.",
    revenue: "$8,500+/mo",
    slug: "skydiving",
  },
  {
    icon: Bike,
    title: "Equipment Rentals",
    description: "Coverage for bike rentals, water sports equipment, and adventure gear.",
    revenue: "$4,100+/mo",
    slug: "equipment-rentals",
  },
  {
    icon: Waves,
    title: "Water Sports & Adventure",
    description: "Comprehensive protection for kayaking, surfing, zip lines, and outdoor activities.",
    revenue: "$5,600+/mo",
    slug: "water-sports",
  },
  {
    icon: Sparkles,
    title: "MediSpas & Aesthetic Centers",
    description: "Coverage for cosmetic procedures, IV therapy, and wellness treatments.",
    revenue: "$6,800+/mo",
    slug: "medispas",
  },
  {
    icon: HeartPulse,
    title: "Wellness & Recovery",
    description: "From cryotherapy to float tanks, infrared saunas to hyperbaric chambers.",
    revenue: "$3,900+/mo",
    slug: "wellness-recovery",
  },
  {
    icon: Activity,
    title: "Race Directors / Running Events",
    description: "Complete event coverage for road races, trail runs, and community running events.",
    revenue: "$7,200+/mo",
    slug: "race-directors",
  },
  {
    icon: Bike,
    title: "Cycling Events / Bike Races",
    description: "Protection for criteriums, gran fondos, mountain bike races, and cycling events.",
    revenue: "$6,500+/mo",
    slug: "cycling-events",
  },
  {
    icon: Waves,
    title: "Triathlons / Multi-Sport",
    description: "Comprehensive coverage for triathlons, duathlons, and multi-sport competitions.",
    revenue: "$9,800+/mo",
    slug: "triathlons",
  },
  {
    icon: Mountain,
    title: "Obstacle Course Races (OCR)",
    description: "Specialized insurance for Spartan races, Tough Mudder, and adventure racing events.",
    revenue: "$8,200+/mo",
    slug: "obstacle-courses",
  },
  {
    icon: Award,
    title: "Marathons & Fun Runs",
    description: "Event insurance for marathons, half marathons, 5Ks, and charity fun runs.",
    revenue: "$10,500+/mo",
    slug: "marathons",
  },
  {
    icon: Building,
    title: "Corporate Wellness Events",
    description: "Coverage for corporate team building, wellness challenges, and company fitness events.",
    revenue: "$5,400+/mo",
    slug: "corporate-wellness",
  },
  {
    icon: GraduationCap,
    title: "Schools & Universities",
    description: "Protection for campus recreation, intramural sports, and student activity programs.",
    revenue: "$12,000+/mo",
    slug: "schools-universities",
  },
]

// Clean Market Card with link to sector page
function MarketCard({ market, index }: { market: typeof markets[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/industries/${market.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        viewport={{ once: true }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative h-full bg-white rounded-2xl border border-teal-500/20 overflow-hidden cursor-pointer p-6 md:p-8 flex flex-col"
          whileHover={{ scale: 1.02, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle gradient background on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Content */}
          <div className="relative z-10 flex-1 flex flex-col">
            {/* Icon - Centered */}
            <div className="flex justify-center sm:justify-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <market.icon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
              {market.title}
            </h3>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
              {market.description}
            </p>

            {/* Dual Value Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 rounded-full text-xs font-medium text-teal-700">
                <Shield className="w-3 h-3" /> Protection
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full text-xs font-medium text-green-700">
                + Revenue
              </span>
            </div>

            {/* Revenue Badge */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">On average earn</span>
                <span className="text-base font-bold text-teal-600">{market.revenue}</span>
              </div>

              {/* Arrow on hover */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-5 h-5 text-teal-500" />
              </motion.div>
            </div>
          </div>

          {/* Hover shadow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl shadow-xl shadow-teal-500/10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>
    </Link>
  )
}

export function DEIWhoWeServe() {
  return (
    <section id="who-we-serve" className="relative bg-slate-50 py-20 md:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-20 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6"
          >
            <Users className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Industries We Serve</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight">
            Who We <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">Help</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Daily Event Insurance helps active lifestyle businesses <strong className="text-slate-800">earn extra revenue</strong> while <strong className="text-slate-800">reducing liability exposure</strong>. Two problems, one solution.
          </p>
        </motion.div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {markets.map((market, index) => (
            <MarketCard key={market.title} market={market} index={index} />
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
          {/* Urgency Banner */}
          <div className="mb-8 max-w-2xl mx-auto">
            <UrgencyBanner variant="early-bird" />
          </div>

          <p className="text-slate-600 mb-6">Don't see your industry? We're always expanding our coverage options.</p>
          <motion.a
            href="#apply"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
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
