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
  Check,
  ArrowRight,
  ArrowLeft,
  Clock,
  Shield,
  Zap
} from "lucide-react"
import { Service } from "@/lib/service-data"

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

interface ServiceDetailProps {
  service: Service
}

export default function ServiceDetail({ service }: ServiceDetailProps) {
  const Icon = iconMap[service.icon]

  const priceDisplay = service.pricing.customQuote
    ? "Custom Quote"
    : service.pricing.priceRange
    ? `$${service.pricing.priceRange.min.toLocaleString()} - $${service.pricing.priceRange.max.toLocaleString()}`
    : `$${service.pricing.basePrice.toLocaleString()}`

  const billingPeriod = service.pricing.billingPeriod
    ? service.pricing.billingPeriod === 'one-time'
      ? 'one-time'
      : `per ${service.pricing.billingPeriod}`
    : ''

  return (
    <>
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ff6a1a] transition-colors font-medium"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Service Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Icon & Badge */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-2xl flex items-center justify-center shadow-lg">
                  {Icon && <Icon className="w-10 h-10 text-white" />}
                </div>
                {service.popular && (
                  <span className="px-4 py-2 bg-orange-100 text-orange-600 text-sm font-bold rounded-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    POPULAR SERVICE
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {service.title}
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {service.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <Clock className="w-6 h-6 text-[#ff6a1a] mb-2" />
                  <div className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>Quick Setup</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <Shield className="w-6 h-6 text-[#ff6a1a] mb-2" />
                  <div className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>Guaranteed</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <Zap className="w-6 h-6 text-[#ff6a1a] mb-2" />
                  <div className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>Expert Support</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24"
            >
              <div className="bg-white rounded-2xl border-2 border-[#ff6a1a] p-8 shadow-xl">
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {service.pricing.customQuote ? "Pricing" : "Starting at"}
                  </div>
                  <div className="text-5xl font-bold text-black mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {priceDisplay}
                  </div>
                  {billingPeriod && (
                    <div className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {billingPeriod}
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-8">
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 bg-[#ff6a1a] text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#e55f17] transition-all shadow-md hover:shadow-lg"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <a
                    href="mailto:Astartupbiz@gmail.com"
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-black px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Contact Us
                  </a>
                </div>

                {/* Benefits */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    What's included:
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Expert consultation",
                      "Personalized service",
                      "Ongoing support",
                      "Satisfaction guarantee"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-[#ff6a1a] flex-shrink-0" />
                        <span style={{ fontFamily: 'Montserrat, sans-serif' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              What You Get
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Comprehensive features designed to meet your business needs
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-start gap-3 bg-gray-50 rounded-xl p-6"
                >
                  <div className="w-6 h-6 rounded-full bg-[#ff6a1a] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Let's discuss how {service.shortTitle} can help you achieve your goals.
              Book a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#ff6a1a] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e55f17] transition-all shadow-md hover:shadow-lg"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Book Free Consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-white text-black border-2 border-gray-300 px-8 py-4 rounded-xl font-bold text-lg hover:border-[#ff6a1a] hover:text-[#ff6a1a] transition-all"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                View All Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
