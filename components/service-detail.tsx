"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
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
  Zap,
  ChevronRight
} from "lucide-react"
import { Service, getRelatedServices } from "@/lib/service-data"
import ServiceBenefitCards from "./service-benefit-cards"
import ServiceTimeline from "./service-timeline"
import BusinessImpactSection from "./business-impact-section"
import ServiceFAQ from "./service-faq"
import ServiceCalculator from "./service-calculator"
import AddToCartButton from "./add-to-cart-button"
import { getCalculatorConfig } from "@/lib/calculator-config"

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
  const [showStickyCTA, setShowStickyCTA] = useState(false)
  const calculatorConfig = getCalculatorConfig(service.slug)

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

  // Scroll listener for sticky CTA bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Hero Image Section */}
      {service.heroImage && (
        <section className="relative h-[40vh] min-h-[300px] max-h-[500px] overflow-hidden">
          <Image
            src={service.heroImage}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center px-4"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6a1a]/90 rounded-full mb-4">
                {Icon && <Icon className="w-5 h-5 text-white" />}
                <span className="text-white font-semibold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {service.title}
              </h1>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content Section */}
      <section className={`${service.heroImage ? 'pt-12' : 'pt-32'} pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-orange-50 to-white`}>
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
            aria-label="Breadcrumb"
          >
            <ol className="flex items-center gap-2 text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <li>
                <Link
                  href="/"
                  className="text-gray-500 hover:text-[#ff6a1a] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-500 hover:text-[#ff6a1a] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
              <li>
                <span className="text-[#ff6a1a] font-medium">
                  {service.title}
                </span>
              </li>
            </ol>
          </motion.nav>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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

              {/* Title - Only show if no hero image */}
              {!service.heroImage && (
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {service.title}
                </h1>
              )}

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
                  <AddToCartButton
                    slug={service.slug}
                    name={service.title}
                    price={service.pricing.basePrice}
                    className="w-full"
                  />

                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="w-full flex items-center justify-center gap-2 bg-white text-[#ff6a1a] border-2 border-[#ff6a1a] px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#ff6a1a] hover:text-white transition-all shadow-md hover:shadow-lg"
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

      {/* Service Benefit Cards Section */}
      {service.serviceCards && service.serviceCards.length > 0 && (
        <ServiceBenefitCards cards={service.serviceCards} serviceTitle={service.shortTitle} />
      )}

      {/* Value Calculator Section */}
      {calculatorConfig && (
        <ServiceCalculator config={calculatorConfig} serviceSlug={service.slug} />
      )}

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

      {/* Service Timeline Section */}
      {service.timeline && service.timeline.length > 0 && (
        <ServiceTimeline timeline={service.timeline} serviceTitle={service.shortTitle} />
      )}

      {/* Business Impact Section */}
      {service.businessImpact && (
        <BusinessImpactSection impact={service.businessImpact} serviceTitle={service.shortTitle} />
      )}

      {/* FAQ Section */}
      {service.faqs && service.faqs.length > 0 && (
        <ServiceFAQ faqs={service.faqs} serviceTitle={service.shortTitle} />
      )}

      {/* Related Services Section */}
      {(() => {
        const relatedServices = getRelatedServices(service);
        if (relatedServices.length === 0) return null;

        return (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Often Paired With
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Maximize your business success with these complementary services
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {relatedServices.map((relatedService, index) => {
                  const RelatedIcon = iconMap[relatedService.icon];
                  const relatedPriceDisplay = relatedService.pricing.customQuote
                    ? "Custom Quote"
                    : relatedService.pricing.priceRange
                    ? `From $${relatedService.pricing.priceRange.min.toLocaleString()}`
                    : `$${relatedService.pricing.basePrice.toLocaleString()}`;

                  return (
                    <motion.div
                      key={relatedService.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/services/${relatedService.slug}`}
                        className="block h-full bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-6 hover:border-[#ff6a1a] hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            {RelatedIcon && <RelatedIcon className="w-7 h-7 text-white" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-black mb-1 group-hover:text-[#ff6a1a] transition-colors" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {relatedService.shortTitle}
                            </h3>
                            <div className="text-sm font-semibold text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {relatedPriceDisplay}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {relatedService.description}
                        </p>
                        <div className="flex items-center gap-2 text-[#ff6a1a] font-semibold text-sm group-hover:gap-3 transition-all" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Learn More
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Why Work With Tory Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Why Work With <span className="text-[#ff6a1a]">Tory?</span>
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              I'm not a consultant who read about business in books. I've actually done it—over 100 times.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "46+ Years Experience",
                description: "I started my first business at age 11. That's nearly five decades of real-world entrepreneurial experience."
              },
              {
                title: "100+ Businesses Started",
                description: "Not theories. Not case studies. Actual businesses I've built, grown, and many I still run as an absentee owner."
              },
              {
                title: "Your Partner, Not a Vendor",
                description: "I'm in your corner. When you work with me, you get a mentor who's been there and genuinely wants to see you win."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-[#ff6a1a] mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-white/70" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
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
                href={`/contact?service=${service.slug}`}
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

      {/* Sticky Mobile CTA Bar */}
      <AnimatePresence>
        {showStickyCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
          >
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
              <div className="px-4 py-3 flex items-center justify-between gap-3">
                {/* Service Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-black truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {service.shortTitle}
                  </div>
                  <div className="text-xs text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {priceDisplay}
                    {billingPeriod && ` ${billingPeriod}`}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex items-center gap-2">
                  <AddToCartButton
                    slug={service.slug}
                    name={service.title}
                    price={service.pricing.basePrice}
                    variant="icon"
                    showToast={true}
                  />
                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="flex items-center gap-2 bg-[#ff6a1a] text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#e55f17] transition-all shadow-md whitespace-nowrap"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
