"use client"

import { motion } from "framer-motion"
import {
  Shield,
  DollarSign,
  TrendingDown,
  Zap,
  ArrowRight,
  Activity,
  Bike,
  Waves,
  Mountain,
  Award,
  Building,
  GraduationCap,
  AlertTriangle,
  Users,
  Calendar,
  Heart,
  Globe,
  Plane,
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle,
  Droplet
} from "lucide-react"
import { SectorFAQ } from "@/components/sector-faq"
import { getSectorBySlug, getAllSectorSlugs, IndustrySector } from "@/lib/industry-data"
import Link from "next/link"

// Icon mapping
const iconMap: Record<string, any> = {
  Shield,
  DollarSign,
  TrendingDown,
  Zap,
  Activity,
  Bike,
  Waves,
  Mountain,
  Award,
  Building,
  GraduationCap,
  AlertTriangle,
  Users,
  Calendar,
  Heart,
  Globe,
  Plane,
  Briefcase,
  FileText,
  TrendingUp,
  CheckCircle,
  Droplet
}

// Hero Section
function SectorHero({ sector }: { sector: IndustrySector }) {
  const HeroIcon = iconMap[sector.icon] || Activity

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500">
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
            <HeroIcon className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white uppercase">{sector.shortTitle}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white leading-tight tracking-tight mb-6"
          >
            {sector.heroTitle}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            {sector.heroSubtitle}
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <motion.a
              href="#apply"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-black uppercase text-teal-700 bg-white rounded-full shadow-2xl hover:bg-teal-50 transition-all duration-300"
            >
              <span>Get Started Today</span>
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>

            <motion.a
              href="/#calculator"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-black uppercase text-white bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              See How Much You Can Earn
            </motion.a>
          </motion.div>

          {/* Stats */}
          {sector.stats && sector.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 text-white/90"
            >
              {sector.stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-sm font-semibold text-white/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
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

// Benefits Section
function BenefitsSection({ sector }: { sector: IndustrySector }) {
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
            Why <span className="text-teal-600">{sector.shortTitle}</span> Choose Us
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Benefits designed specifically for {sector.title.toLowerCase()} organizers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sector.benefits.map((benefit, index) => {
            const BenefitIcon = iconMap[benefit.icon] || Shield

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-slate-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 bg-teal-600 rounded-xl flex items-center justify-center mb-6">
                  <BenefitIcon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection({ sector }: { sector: IndustrySector }) {
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
            How It <span className="text-teal-600">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Three simple steps to start offering insurance and earning revenue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sector.howItWorks.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-teal-600 to-teal-500 rounded-2xl p-8 h-full overflow-hidden group hover:scale-105 transition-transform duration-300">
                {/* Number Badge */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-teal-600">0{index + 1}</span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase text-white mb-4 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonial Section (if available)
function TestimonialSection({ sector }: { sector: IndustrySector }) {
  if (!sector.testimonial) return null

  return (
    <section className="relative bg-teal-900 py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative bg-teal-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-teal-500/20 overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-teal-600/20 rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-teal-400" />
            </div>

            <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
              &ldquo;{sector.testimonial.quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-black text-white">
                  {sector.testimonial.author.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <div className="font-black text-white text-lg">{sector.testimonial.author}</div>
                <div className="text-teal-400 font-semibold">{sector.testimonial.role}</div>
                <div className="text-slate-400 text-sm">{sector.testimonial.company}</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section with Revenue Calculator Link
function CTASection() {
  return (
    <section className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-6">
            Ready to Add Insurance
            <span className="block text-teal-100">To Your Events?</span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Calculate your potential revenue and see how much you could earn with Daily Event Insurance
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="/#calculator"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-black uppercase rounded-full hover:bg-teal-50 transition-colors shadow-xl"
            >
              Calculate Your Revenue
              <ArrowRight className="w-5 h-5" />
            </motion.a>

            <motion.a
              href="#apply"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white font-black uppercase rounded-full hover:bg-white/30 transition-colors"
            >
              Request Demo
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Related Industries Section
function RelatedIndustries({ currentSlug }: { currentSlug: string }) {
  const allSlugs = getAllSectorSlugs().filter(slug => slug !== currentSlug)
  const relatedSlugs = allSlugs.slice(0, 3)

  return (
    <section className="relative bg-slate-50 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 leading-tight tracking-tight mb-4">
            Other <span className="text-teal-600">Industries</span>
          </h2>
          <p className="text-lg text-slate-600">
            Explore insurance solutions for other event types
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedSlugs.map((slug, index) => {
            const sector = getSectorBySlug(slug)
            if (!sector) return null

            const IconComponent = iconMap[sector.icon] || Activity

            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={`/industries/${slug}`}>
                  <div className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-slate-200 group cursor-pointer">
                    <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-black uppercase text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                      {sector.title}
                    </h3>
                    <div className="flex items-center text-teal-600 text-sm font-semibold">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/industries">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors"
            >
              View All Industries
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Main Client Component that wraps all interactive sections
export function SectorPageContent({ sector }: { sector: IndustrySector }) {
  return (
    <>
      <SectorHero sector={sector} />
      <BenefitsSection sector={sector} />
      <HowItWorksSection sector={sector} />
      <TestimonialSection sector={sector} />
      <SectorFAQ faqs={sector.faqs} sectorTitle={sector.title} />
      <CTASection />
      <RelatedIndustries currentSlug={sector.slug} />
    </>
  )
}
