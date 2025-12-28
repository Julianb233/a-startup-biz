"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Star,
  Briefcase,
  HandshakeIcon,
  Target,
  Zap,
  Shield,
} from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    icon: DollarSign,
    title: "Generous Commissions",
    description: "Earn up to 20% commission on every successful referral. Our transparent payout structure ensures you're rewarded for your efforts.",
  },
  {
    icon: TrendingUp,
    title: "Recurring Revenue",
    description: "Build passive income with recurring commissions on subscription services. Earn month after month from your referrals.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Get access to a dedicated partner success manager who'll help you maximize your earning potential.",
  },
  {
    icon: Award,
    title: "Training & Resources",
    description: "Access comprehensive training materials, marketing assets, and sales tools to help you succeed.",
  },
  {
    icon: Shield,
    title: "Trusted Brand",
    description: "Partner with a trusted name in business services. Our reputation helps you close deals faster.",
  },
  {
    icon: Target,
    title: "Performance Bonuses",
    description: "Hit quarterly targets and earn bonus payouts on top of your regular commissions.",
  },
]

const partnerTypes = [
  {
    title: "Referral Partner",
    description: "Perfect for individuals who want to earn by simply referring businesses in their network.",
    features: [
      "No minimum commitment",
      "Earn per referral",
      "Basic marketing materials",
      "Monthly payouts",
    ],
    cta: "Start Referring",
    recommended: false,
  },
  {
    title: "Strategic Partner",
    description: "Ideal for consultants and agencies looking to add value to their existing client relationships.",
    features: [
      "Higher commission rates",
      "Co-branded materials",
      "Priority support",
      "Quarterly bonuses",
      "Joint marketing opportunities",
    ],
    cta: "Apply Now",
    recommended: true,
  },
  {
    title: "Enterprise Partner",
    description: "For organizations with established networks looking for a comprehensive partnership.",
    features: [
      "Custom commission structure",
      "Dedicated account manager",
      "White-label solutions",
      "API access",
      "Revenue sharing options",
    ],
    cta: "Contact Sales",
    recommended: false,
  },
]

const steps = [
  {
    number: "01",
    title: "Apply Online",
    description: "Fill out our simple application form. We review applications within 48 hours.",
  },
  {
    number: "02",
    title: "Get Approved",
    description: "Once approved, you'll receive access to your partner portal and resources.",
  },
  {
    number: "03",
    title: "Start Referring",
    description: "Share your unique referral link or directly introduce clients to our team.",
  },
  {
    number: "04",
    title: "Earn Commissions",
    description: "Track your referrals and earnings in real-time. Get paid monthly.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Business Consultant",
    image: "/testimonials/sarah.jpg",
    quote: "Partnering with A Startup Biz has been a game-changer for my consulting practice. I can now offer my clients a full suite of services while earning additional revenue.",
    earnings: "$15,000+",
    period: "in 6 months",
  },
  {
    name: "Michael Chen",
    role: "Accountant",
    image: "/testimonials/michael.jpg",
    quote: "The referral program is straightforward and the commissions are competitive. My clients get great service and I earn passive income.",
    earnings: "$8,500+",
    period: "in 4 months",
  },
  {
    name: "Jennifer Martinez",
    role: "Marketing Agency Owner",
    image: "/testimonials/jennifer.jpg",
    quote: "As a strategic partner, I've been able to expand my service offerings and increase my revenue without adding staff.",
    earnings: "$25,000+",
    period: "in 12 months",
  },
]

export default function BecomePartnerPage() {
  const [activeType, setActiveType] = useState(1)

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6">
              <HandshakeIcon className="w-4 h-4" />
              Partner Program
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Grow Your Business.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Earn More.
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Join our partner network and earn generous commissions by referring
              businesses to our trusted services. Simple, transparent, rewarding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Active Partners" },
              { value: "$2M+", label: "Commissions Paid" },
              { value: "95%", label: "Partner Satisfaction" },
              { value: "48hrs", label: "Avg Approval Time" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  {stat.value}
                </p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join a partner program designed to help you succeed and grow your income.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partner Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Partnership Level
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the partnership type that best fits your business model and goals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {partnerTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  type.recommended
                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white ring-4 ring-orange-500/20"
                    : "bg-white border border-gray-200"
                }`}
              >
                {type.recommended && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-orange-600 text-sm font-bold rounded-full shadow-lg">
                    Most Popular
                  </span>
                )}
                <h3
                  className={`text-2xl font-bold mb-3 ${
                    type.recommended ? "text-white" : "text-gray-900"
                  }`}
                >
                  {type.title}
                </h3>
                <p
                  className={`mb-6 ${
                    type.recommended ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  {type.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {type.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2
                        className={`w-5 h-5 ${
                          type.recommended ? "text-white" : "text-orange-500"
                        }`}
                      />
                      <span
                        className={
                          type.recommended ? "text-white" : "text-gray-700"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/apply"
                  className={`block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    type.recommended
                      ? "bg-white text-orange-600 hover:bg-gray-100"
                      : "bg-orange-600 text-white hover:bg-orange-700"
                  }`}
                >
                  {type.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to begin earning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
                )}
                <div className="text-5xl font-bold text-orange-500/30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Partner Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from partners who are already earning with our program.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-orange-500 fill-orange-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">
                      {testimonial.earnings}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.period}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join our partner program today and start earning commissions on every
              successful referral. No upfront costs, no obligations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/partner-benefits"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-all"
              >
                View All Benefits
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
