"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  FileText,
  Scale,
  Calculator,
  BookOpen,
  Bot,
  Users,
  Globe,
  TrendingUp,
  Target,
  Briefcase,
  Server,
  Share2,
  Search,
  UserCheck,
  MessageCircle,
  PenTool,
  BarChart3,
  ArrowRight,
  Check
} from "lucide-react"
import { services, serviceCategories } from "@/lib/service-data"
import { useState } from "react"

const iconMap: Record<string, any> = {
  FileText,
  Scale,
  Calculator,
  BookOpen,
  Bot,
  Users,
  Globe,
  TrendingUp,
  Target,
  Briefcase,
  Server,
  Share2,
  Search,
  UserCheck,
  MessageCircle,
  PenTool,
  BarChart3,
}

export default function ServicesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredServices = selectedCategory
    ? services.filter(s => s.category === selectedCategory)
    : services

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Comprehensive solutions tailored to your business needs
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCategory === null
                ? "bg-[#ff6a1a] text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            All Services
          </button>
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category.id
                  ? "bg-[#ff6a1a] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => {
            const Icon = iconMap[service.icon]
            const priceDisplay = service.pricing.customQuote
              ? "Custom Quote"
              : service.pricing.priceRange
              ? `$${service.pricing.priceRange.min.toLocaleString()} - $${service.pricing.priceRange.max.toLocaleString()}`
              : `$${service.pricing.basePrice.toLocaleString()}`

            const billingPeriod = service.pricing.billingPeriod
              ? service.pricing.billingPeriod === 'one-time'
                ? ''
                : `/${service.pricing.billingPeriod}`
              : ''

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={`/services/${service.slug}`}>
                  <div className="group relative h-full bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#ff6a1a] hover:shadow-xl transition-all duration-300 cursor-pointer">
                    {/* Popular Badge */}
                    {service.popular && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          POPULAR
                        </span>
                      </div>
                    )}

                    {/* Icon */}
                    <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#ff6a1a] transition-colors duration-300">
                      {Icon && (
                        <Icon className="w-7 h-7 text-[#ff6a1a] group-hover:text-white transition-colors duration-300" />
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#ff6a1a] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {service.shortTitle}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {service.description}
                    </p>

                    {/* Features Preview */}
                    <ul className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-[#ff6a1a] mt-0.5 flex-shrink-0" />
                          <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price */}
                    <div className="mb-4 pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Starting at
                      </div>
                      <div className="text-2xl font-bold text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {priceDisplay}
                        <span className="text-sm font-normal text-gray-500">{billingPeriod}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-[#ff6a1a] font-semibold group-hover:gap-3 transition-all" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
