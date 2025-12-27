"use client"

import { motion } from "framer-motion"
import {
  Activity,
  Bike,
  Waves,
  Mountain,
  Award,
  Building,
  GraduationCap,
  ArrowRight,
  CheckCircle2
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { industrySectorsList } from "@/lib/industry-data"
import type { Metadata } from "next"

// Icon mapping
const iconMap: Record<string, any> = {
  Activity,
  Bike,
  Waves,
  Mountain,
  Award,
  Building,
  GraduationCap
}

// Hero Section
function IndustriesHero() {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-8"
          >
            <Activity className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">INDUSTRIES WE SERVE</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white leading-tight tracking-tight mb-6"
          >
            Event Insurance
            <span className="block text-teal-100">For Every Sport</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90 mb-4 max-w-3xl mx-auto"
          >
            Same-day coverage tailored to your industry
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Protect your participants, reduce liability, and create a new revenue stream with coverage built specifically for your event type.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 text-white/90"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-100" />
              <span className="font-semibold">7 Industries Supported</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-100" />
              <span className="font-semibold">5-Minute Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-100" />
              <span className="font-semibold">20-30% Commission</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        <svg
          className="w-full h-full text-white"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  )
}

// Industry Card Component
function IndustryCard({ sector, index }: { sector: typeof industrySectorsList[0], index: number }) {
  const IconComponent = iconMap[sector.icon] || Activity

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={`/industries/${sector.slug}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 h-full group cursor-pointer"
        >
          {/* Gradient accent on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/5 group-hover:to-cyan-500/5 rounded-2xl transition-all duration-300" />

          <div className="relative z-10">
            {/* Icon */}
            <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="w-7 h-7 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-black uppercase text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
              {sector.title}
            </h3>

            {/* Description - show first benefit */}
            <p className="text-slate-600 mb-6 leading-relaxed">
              {sector.benefits[0].description}
            </p>

            {/* Stats */}
            {sector.stats && sector.stats.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-6 pb-6 border-b border-slate-200">
                {sector.stats.slice(0, 3).map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-xl font-black text-teal-600">{stat.value}</div>
                    <div className="text-xs text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-teal-600 group-hover:text-teal-700">
                Learn More
              </span>
              <ArrowRight className="w-5 h-5 text-teal-600 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

// Industries Grid
function IndustriesGrid() {
  return (
    <section className="relative bg-slate-50 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight mb-4">
            Choose Your <span className="text-teal-600">Industry</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Specialized insurance solutions designed for your specific event type and participant needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industrySectorsList.map((sector, index) => (
            <IndustryCard key={sector.slug} sector={sector} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Why Choose By Industry
function WhyChooseByIndustry() {
  const benefits = [
    {
      title: "Industry-Specific Coverage",
      description: "Each sport has unique risks. Our policies are tailored to the specific hazards and liability concerns of your event type.",
      icon: Award
    },
    {
      title: "Regulatory Compliance",
      description: "Stay compliant with sport-specific regulations, sanctioning body requirements, and venue insurance mandates.",
      icon: CheckCircle2
    },
    {
      title: "Pricing Optimized for Your Market",
      description: "Policy pricing reflects the actual risk profile of your industry, ensuring fair rates and strong conversion.",
      icon: Activity
    }
  ]

  return (
    <section className="relative bg-white py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight mb-4">
            Why <span className="text-teal-600">Industry Matters</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            One-size-fits-all insurance doesn't work for active sports and events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative bg-slate-50 rounded-2xl p-8"
            >
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase text-slate-900 mb-4">
                {benefit.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function IndustriesCTA() {
  return (
    <section className="relative bg-teal-900 py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-6">
            Don't See Your <span className="text-teal-400">Industry?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            We're always expanding our coverage options. Tell us about your events and we'll create a custom insurance solution.
          </p>

          <motion.a
            href="#apply"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white font-black uppercase rounded-full hover:bg-teal-400 transition-colors shadow-xl"
          >
            Contact Us Today
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

// Main Page Component
export default function IndustriesPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />
      <IndustriesHero />
      <IndustriesGrid />
      <WhyChooseByIndustry />
      <IndustriesCTA />
      <Footer />
    </main>
  )
}
