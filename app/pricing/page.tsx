"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ArrowLeft, Check, Shield, Building2, Mountain, Bike, Zap, ChevronRight, DollarSign, BadgeCheck } from "lucide-react"
import Link from "next/link"

// Pricing tiers - Insurance commission structure
const pricingTiers = [
  {
    id: 1,
    name: "Starter Partner",
    tagline: "Perfect for Small Operations",
    commission: "25%",
    commissionDetail: "Commission per policy",
    description: "Ideal for independent studios, single-location gyms, and small rental operations just starting out.",
    icon: Shield,
    features: [
      "25% commission on every policy sold",
      "Simple API integration or standalone portal",
      "Member dashboard for easy sign-ups",
      "Same-day coverage activation",
      "Email & chat support",
      "Monthly payout reports",
    ],
    businessTypes: "Perfect for: Yoga studios, personal training, small gyms",
    cta: "Start Earning",
    featured: false,
    gradient: "from-teal-500/20 to-teal-600/10",
  },
  {
    id: 2,
    name: "Growth Partner",
    tagline: "For Expanding Facilities",
    commission: "30%",
    commissionDetail: "Commission per policy",
    description: "Best for growing businesses with multiple locations or high member volume.",
    icon: Building2,
    features: [
      "30% commission on every policy sold",
      "Priority API integration support",
      "Custom branding options",
      "Advanced analytics dashboard",
      "Dedicated account manager",
      "Weekly payout options",
      "Marketing materials & templates",
      "Phone support",
    ],
    businessTypes: "Perfect for: Multi-location gyms, climbing facilities, fitness chains",
    cta: "Get Started",
    featured: true,
    gradient: "from-teal-500/30 to-teal-600/20",
  },
  {
    id: 3,
    name: "Premium Partner",
    tagline: "For High-Volume Operations",
    commission: "35%",
    commissionDetail: "Commission per policy",
    description: "Designed for high-traffic facilities and equipment rental businesses processing hundreds of policies monthly.",
    icon: Mountain,
    features: [
      "35% commission on every policy sold",
      "White-label insurance platform",
      "Custom integration with your systems",
      "Real-time reporting & analytics",
      "Priority 24/7 support",
      "Bi-weekly or weekly payouts",
      "Co-marketing opportunities",
      "Training for your staff",
      "Custom policy types available",
    ],
    businessTypes: "Perfect for: Adventure parks, large rental companies, resort facilities",
    cta: "Partner With Us",
    featured: false,
    gradient: "from-teal-500/40 to-teal-600/30",
  },
  {
    id: 4,
    name: "Enterprise Partner",
    tagline: "Custom Solutions",
    commission: "Up to 40%",
    commissionDetail: "Custom terms available",
    description: "Tailored solutions for enterprise organizations, franchise networks, and large-scale operations.",
    icon: Bike,
    features: [
      "Up to 40% commission on policies",
      "Fully custom integration & branding",
      "Dedicated technical team",
      "Custom policy development",
      "API access for full automation",
      "Real-time payouts available",
      "Joint marketing campaigns",
      "Franchise rollout support",
      "SLA guarantees",
      "Quarterly business reviews",
    ],
    businessTypes: "Perfect for: Franchise networks, enterprise chains, resort portfolios",
    cta: "Let's Talk",
    featured: false,
    gradient: "from-teal-500/50 to-teal-600/40",
  },
]

// Value propositions
const valueProps = [
  {
    title: "No Setup Fees",
    description: "Get started with zero upfront costs. Only pay when you earn.",
    icon: DollarSign,
  },
  {
    title: "No Long-Term Contracts",
    description: "Month-to-month partnership. Cancel anytime, no penalties.",
    icon: Check,
  },
  {
    title: "Fast Implementation",
    description: "Most partners are up and running within 48 hours of signing.",
    icon: Zap,
  },
]

// Floating shields animation
const floatingShields = [
  { left: "10%", top: "20%", delay: 0, duration: 4 },
  { left: "85%", top: "15%", delay: 0.5, duration: 5 },
  { left: "15%", top: "70%", delay: 0.3, duration: 4.5 },
  { left: "90%", top: "75%", delay: 0.8, duration: 4.2 },
  { left: "50%", top: "10%", delay: 0.2, duration: 5.5 },
  { left: "5%", top: "50%", delay: 1.0, duration: 4.8 },
]

export default function PricingPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Floating Shields Background */}
      {floatingShields.map((shield, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-12 z-0 pointer-events-none opacity-5"
          style={{ left: shield.left, top: shield.top }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.05, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: shield.duration,
            delay: shield.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          <Shield className="w-full h-full text-teal-500" />
        </motion.div>
      ))}

      <div className="pt-40 md:pt-48 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-500 transition-all duration-300 mb-8 group"
            >
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <span className="font-medium group-hover:underline underline-offset-4">Back to Home</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16 text-center"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full mb-6 border border-teal-200"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(20,184,166,0.1)",
                  "0 0 30px rgba(20,184,166,0.2)",
                  "0 0 20px rgba(20,184,166,0.1)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-5 h-5 text-teal-600" />
              <span className="text-teal-700 font-bold text-sm uppercase tracking-wider">Partner Commission Structure</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-tight mb-6 text-slate-900"
            >
              <span className="block">Partner</span>
              <motion.span
                className="block text-teal-500"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Revenue
              </motion.span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Earn commission on every policy your members purchase. No setup fees, no long-term contracts.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full"
            >
              <DollarSign className="w-4 h-4 text-teal-600" />
              <span className="text-teal-700 text-sm font-semibold">247 partners earning $2,400/month average</span>
            </motion.div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`group relative ${tier.featured ? 'lg:scale-105' : ''}`}
                style={{ perspective: "1000px" }}
                onMouseEnter={() => setHoveredCard(tier.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  className={`relative h-full bg-gradient-to-br ${tier.gradient} bg-white rounded-3xl overflow-hidden border ${
                    tier.featured ? 'border-teal-500 border-2' : 'border-slate-200'
                  } transition-all duration-500 shadow-lg`}
                  whileHover={{
                    rotateY: 5,
                    rotateX: -5,
                    scale: tier.featured ? 1.02 : 1.05,
                    boxShadow: tier.featured
                      ? "0 30px 60px rgba(20,184,166,0.3)"
                      : "0 25px 50px rgba(20,184,166,0.15)"
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Featured badge */}
                  {tier.featured && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 py-2 bg-gradient-to-r from-teal-500 to-teal-400 text-white text-center font-bold text-sm uppercase tracking-wider"
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(20,184,166,0.5)",
                          "0 0 30px rgba(20,184,166,0.7)",
                          "0 0 20px rgba(20,184,166,0.5)",
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <BadgeCheck className="w-4 h-4 inline-block mr-1" />
                      Verified Partner • 65% Start Here
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className={`p-6 ${tier.featured ? 'pt-14' : 'pt-6'}`}>
                    {/* Icon */}
                    <motion.div
                      className="mb-4"
                      animate={{
                        rotate: hoveredCard === tier.id ? [0, -10, 10, 0] : 0,
                        scale: hoveredCard === tier.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`inline-flex p-3 rounded-xl ${
                        tier.featured ? 'bg-teal-50' : 'bg-slate-50'
                      }`}>
                        <tier.icon className="w-8 h-8 text-teal-500" />
                      </div>
                    </motion.div>

                    {/* Tier name and tagline */}
                    <h3 className="text-2xl font-black text-slate-900 mb-1">
                      {tier.name}
                    </h3>
                    <p className="text-teal-600 text-sm font-medium mb-4">
                      {tier.tagline}
                    </p>

                    {/* Commission */}
                    <div className="mb-4">
                      <div className="text-4xl font-black text-teal-500 mb-1">
                        {tier.commission}
                      </div>
                      <div className="text-slate-500 text-sm">
                        {tier.commissionDetail}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {tier.description}
                    </p>

                    {/* Business Types */}
                    <div className="mb-6 p-3 bg-teal-50 rounded-lg border border-teal-100">
                      <p className="text-xs text-teal-700 font-medium">
                        {tier.businessTypes}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className="flex items-start gap-2 text-slate-700 text-sm"
                        >
                          <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.a
                      href="/#apply"
                      className={`block w-full py-3 px-6 rounded-xl font-bold text-center transition-all duration-300 ${
                        tier.featured
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                          : 'bg-slate-50 text-teal-600 border border-slate-200 hover:border-teal-500 hover:bg-teal-50'
                      }`}
                      whileHover={{ scale: 1.05, boxShadow: tier.featured ? "0 0 20px rgba(20,184,166,0.4)" : "0 0 10px rgba(20,184,166,0.2)" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {tier.cta}
                    </motion.a>
                  </div>

                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent pointer-events-none"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: tier.featured ? 2 : 4,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Value Props Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 text-center">
              Why Partner With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {valueProps.map((prop, index) => (
                <motion.div
                  key={prop.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px rgba(20,184,166,0.15)"
                  }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-300 transition-all duration-500 shadow-lg"
                >
                  <div className="inline-flex p-3 rounded-xl bg-teal-50 mb-4">
                    <prop.icon className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {prop.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {prop.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden"
          >
            <div className="relative py-16 px-8 bg-gradient-to-br from-teal-50 to-white rounded-3xl border border-teal-200 shadow-xl">
              {/* Animated border glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(20,184,166,0.15), transparent)",
                  backgroundSize: "200% 100%",
                }}
                animate={{
                  backgroundPosition: ["200% 0", "-200% 0"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <Shield className="w-12 h-12 text-teal-500" />
                </motion.div>

                <motion.h3
                  className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase"
                >
                  Ready to Start <span className="text-teal-500">Earning?</span>
                </motion.h3>
                <p className="text-slate-600 mb-8 text-lg">
                  Schedule a demo to see how easy it is to add insurance to your member experience and start generating passive revenue today.
                </p>

                <motion.a
                  href="/#apply"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-lg rounded-full transition-all duration-300 shadow-xl shadow-teal-500/30"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 40px rgba(20,184,166,0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule a Demo
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.div>
                </motion.a>

                <p className="mt-6 text-sm text-slate-500">
                  No credit card required • 15-minute demo • Get started in 48 hours
                </p>
              </div>

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`cta-particle-${i}`}
                  className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-40"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: `${25 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0.2, 0.6, 0.2],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.4,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
