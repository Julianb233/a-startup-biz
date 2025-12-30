"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Dumbbell,
  Mountain,
  Sparkles,
  Trophy,
  Calendar,
  CreditCard,
  ArrowRight,
  Shield,
  Check
} from "lucide-react"
import { industryCategories, type IndustryCategory } from "@/lib/category-data"

const iconMap: Record<string, React.ElementType> = {
  Dumbbell,
  Mountain,
  Sparkles,
  Trophy
}

const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string; hover: string }> = {
  teal: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-600",
    badge: "bg-teal-500",
    hover: "hover:border-teal-400 hover:shadow-teal-100"
  },
  sky: {
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-600",
    badge: "bg-sky-500",
    hover: "hover:border-sky-400 hover:shadow-sky-100"
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-600",
    badge: "bg-purple-500",
    hover: "hover:border-purple-400 hover:shadow-purple-100"
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-600",
    badge: "bg-orange-500",
    hover: "hover:border-orange-400 hover:shadow-orange-100"
  }
}

type FilterType = "all" | "single-use" | "monthly"

function ProductTypeBadge({ productType }: { productType: "single-use" | "monthly" | "both" }) {
  if (productType === "both") {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
          <Calendar className="w-3 h-3" />
          Single-Use
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-500 text-white text-xs font-medium rounded-full">
          <CreditCard className="w-3 h-3" />
          ActiveGuard
        </span>
      </div>
    )
  }

  if (productType === "single-use") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
        <Calendar className="w-3 h-3" />
        Single-Use Only
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-500 text-white text-xs font-medium rounded-full">
      <CreditCard className="w-3 h-3" />
      ActiveGuard Monthly
    </span>
  )
}

function CategoryCard({ category, index }: { category: IndustryCategory; index: number }) {
  const Icon = iconMap[category.icon] || Shield
  const colors = colorClasses[category.color] || colorClasses.teal

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/categories/${category.slug}`} className="block group">
        <div
          className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.hover} bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
        >
          {/* Hero Image Area */}
          <div className={`relative h-48 ${colors.bg} overflow-hidden`}>
            <div className="absolute top-6 left-6">
              <div className={`w-16 h-16 rounded-xl ${colors.bg} flex items-center justify-center border-2 ${colors.border} shadow-sm`}>
                <Icon className={`w-8 h-8 ${colors.text}`} />
              </div>
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Product Type Badge */}
            <div className="mb-4">
              <ProductTypeBadge productType={category.productType} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
              {category.title}
            </h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">
              {category.description}
            </p>

            {/* Sectors Preview */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {category.sectors.slice(0, 3).map((sector) => (
                <span
                  key={sector}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md ${colors.bg} ${colors.text}`}
                >
                  {sector.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </span>
              ))}
              {category.sectors.length > 3 && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-500">
                  +{category.sectors.length - 3} more
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
              {category.stats.slice(0, 2).map((stat) => (
                <div key={stat.label}>
                  <div className={`text-lg font-bold ${colors.text}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-4 flex items-center text-sm font-medium text-slate-900 group-hover:text-teal-600 transition-colors">
              Explore {category.shortTitle}
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function CategoryShowcase() {
  const [filter, setFilter] = useState<FilterType>("all")

  const filteredCategories = industryCategories.filter((category) => {
    if (filter === "all") return true
    if (filter === "single-use") return category.productType === "single-use" || category.productType === "both"
    if (filter === "monthly") return category.productType === "monthly" || category.productType === "both"
    return true
  })

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white py-20 md:py-28 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full mb-4">
            <Shield className="w-4 h-4 text-teal-600" />
            <span className="text-teal-600 font-semibold text-sm">Industries We Serve</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Coverage for <span className="text-teal-500">Every Activity</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            From gyms to ski slopes, from wellness centers to race events — we provide flexible insurance solutions that match how your business operates.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex bg-slate-100 rounded-full p-1">
            {[
              { id: "all", label: "All Categories", icon: null },
              { id: "single-use", label: "Single-Use", icon: Calendar },
              { id: "monthly", label: "ActiveGuard", icon: CreditCard }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterType)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  filter === tab.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.icon && <tab.icon className="w-4 h-4" />}
                {tab.label}
                {filter === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-900">Don&apos;t see your industry?</div>
                <div className="text-sm text-slate-600">We&apos;re expanding to new verticals</div>
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
