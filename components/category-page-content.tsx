"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  ArrowRight,
  Calendar,
  CreditCard,
  Check,
  Dumbbell,
  Mountain,
  Sparkles,
  Trophy,
  ChevronRight,
  Star,
  Building2,
  Users
} from "lucide-react"
import type { IndustryCategory } from "@/lib/category-data"
import type { IndustrySector } from "@/lib/industry-data"

const iconMap: Record<string, React.ElementType> = {
  Dumbbell,
  Mountain,
  Sparkles,
  Trophy
}

const colorClasses: Record<string, { gradient: string; bg: string; text: string; border: string }> = {
  teal: {
    gradient: "from-teal-600 to-teal-500",
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-200"
  },
  sky: {
    gradient: "from-sky-600 to-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-200"
  },
  purple: {
    gradient: "from-purple-600 to-purple-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200"
  },
  orange: {
    gradient: "from-orange-600 to-orange-500",
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200"
  }
}

interface CategoryPageContentProps {
  category: IndustryCategory
  sectors: IndustrySector[]
  hasActiveGuard: boolean
}

function SectorCard({ sector, color, index }: { sector: IndustrySector; color: string; index: number }) {
  const colors = colorClasses[color] || colorClasses.teal

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/industries/${sector.slug}`}
        className="group block bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
              {sector.shortTitle}
            </h3>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-sm text-slate-600 mb-4 line-clamp-2">
            {sector.heroSubtitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {sector.stats.slice(0, 2).map((stat) => (
              <div key={stat.label} className={`px-3 py-1.5 rounded-lg ${colors.bg}`}>
                <span className={`text-sm font-semibold ${colors.text}`}>{stat.value}</span>
                <span className="text-xs text-slate-500 ml-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function CategoryPageContent({ category, sectors, hasActiveGuard }: CategoryPageContentProps) {
  const Icon = iconMap[category.icon] || Shield
  const colors = colorClasses[category.color] || colorClasses.teal

  return (
    <>
      {/* Hero Section */}
      <section className={`relative pt-32 pb-20 overflow-hidden bg-gradient-to-br ${colors.gradient}`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-white/80 text-sm mb-8"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/#categories" className="hover:text-white transition-colors">Industries</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{category.title}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Product Type Badges */}
              <div className="flex items-center gap-3 mb-6">
                {(category.productType === "both" || category.productType === "single-use") && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-full backdrop-blur-sm">
                    <Calendar className="w-4 h-4" />
                    Single-Use
                  </span>
                )}
                {(category.productType === "both" || category.productType === "monthly") && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-900 text-sm font-medium rounded-full">
                    <CreditCard className="w-4 h-4" />
                    ActiveGuard
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {category.title}
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-xl">
                {category.longDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="#sectors"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 transition-colors"
                >
                  View All Sectors
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/partner-portal"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  Become a Partner
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="w-96 h-80 mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src={category.heroImage}
                    alt={category.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/90`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className="text-white font-semibold text-lg drop-shadow-lg">
                      {category.shortTitle} Insurance
                    </span>
                  </div>
                </div>
                {/* Stats floating cards */}
                <div className="absolute -left-8 top-1/4 bg-white rounded-xl shadow-xl p-4 min-w-[160px]">
                  <div className={`text-2xl font-bold ${colors.text}`}>{category.stats[0]?.value}</div>
                  <div className="text-sm text-slate-500">{category.stats[0]?.label}</div>
                </div>
                <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-xl p-4 min-w-[140px]">
                  <div className={`text-2xl font-bold ${colors.text}`}>{category.stats[1]?.value}</div>
                  <div className="text-sm text-slate-500">{category.stats[1]?.label}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section id="sectors" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {sectors.length} Industries Served
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore specialized insurance solutions for each sector within {category.shortTitle}.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, index) => (
              <SectorCard key={sector.slug} sector={sector} color={category.color} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ActiveGuard CTA (if eligible) */}
      {hasActiveGuard && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl overflow-hidden"
            >
              <div className="grid lg:grid-cols-2 gap-8 p-8 md:p-12">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full mb-6">
                    <Star className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-medium">ActiveGuard Monthly</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Turn Memberships Into Recurring Revenue
                  </h3>
                  <p className="text-white/90 text-lg mb-8">
                    Bake coverage into your membership dues for just a few dollars a month.
                    Your members stay protected while you earn recurring commissions — automatically.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[160px] border border-white/30">
                      <div className="text-2xl font-bold text-white">Few $/month</div>
                      <div className="text-sm text-white/80">Added to membership</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 min-w-[160px]">
                      <div className="text-2xl font-bold text-teal-600">Recurring</div>
                      <div className="text-sm text-slate-500">Monthly commissions</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h4 className="text-white font-semibold mb-4">Why Bundle ActiveGuard?</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-white/90">
                        <Check className="w-5 h-5 text-white" />
                        Earn commissions every month, not just once
                      </li>
                      <li className="flex items-center gap-3 text-white/90">
                        <Check className="w-5 h-5 text-white" />
                        Revenue grows with your member base
                      </li>
                      <li className="flex items-center gap-3 text-white/90">
                        <Check className="w-5 h-5 text-white" />
                        Members get unlimited visit coverage
                      </li>
                      <li className="flex items-center gap-3 text-white/90">
                        <Check className="w-5 h-5 text-white" />
                        No extra work — it's automatic
                      </li>
                    </ul>
                    <Link
                      href="/#apply"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-full font-semibold mt-6 hover:bg-slate-100 transition-colors"
                    >
                      Become a Partner
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span className="text-teal-400 text-sm font-medium">Partner Program</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Add Coverage to Your {category.shortTitle} Business?
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of partners who are already earning commission while protecting their participants.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/partner-portal"
                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-400 transition-colors"
              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
