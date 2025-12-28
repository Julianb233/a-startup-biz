"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle, TrendingUp, Users, Bike, Waves, Mountain, DollarSign, FileCheck, Zap, ThumbsUp, ArrowRight, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useState } from "react"

// Hero Section
function RentalHeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 pt-32 pb-20 md:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider border border-white/30">
              For Rental Businesses
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase text-white leading-tight tracking-tight mb-6">
            Insurance Built for
            <br />
            <span className="text-teal-100">Rental Businesses</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-4 leading-relaxed">
            Protect your inventory and customers with seamless rental coverage
          </p>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            No more damage disputes. No more security deposit friction. Just easy, profitable protection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#demo-form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-teal-600 font-black uppercase px-10 py-5 rounded-full text-lg tracking-wider hover:bg-teal-50 transition-colors shadow-xl inline-flex items-center justify-center gap-2"
            >
              Request a Demo
              <ArrowRight className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white font-black uppercase px-10 py-5 rounded-full text-lg tracking-wider hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            >
              See How It Works
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// The Rental Dilemma Section
function RentalDilemmaSection() {
  const problems = [
    {
      icon: "😰",
      problem: "Customers damage equipment",
      solution: "Insurance covers replacement costs"
    },
    {
      icon: "🚨",
      problem: "Theft and loss happen",
      solution: "Full coverage for stolen or lost items"
    },
    {
      icon: "💸",
      problem: "Security deposits cause friction",
      solution: "Optional insurance = smoother checkout"
    },
    {
      icon: "⚖️",
      problem: "Damage disputes take time",
      solution: "Claims handled professionally by us"
    }
  ]

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
            The Rental <span className="text-teal-600">Dilemma</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Every rental business faces the same challenges. We solve them all.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">
                    {item.problem}
                  </h3>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-600 leading-relaxed">
                      {item.solution}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works for Rentals
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Sign Up",
      description: "Register your rental business at no cost. We'll integrate with your existing checkout system or provide you with a simple widget.",
      icon: FileCheck,
      color: "from-teal-600 to-teal-500"
    },
    {
      number: "02",
      title: "Add Insurance Option",
      description: "At checkout, customers see optional damage protection for a small fee. They choose to add it or not—completely their call.",
      icon: Shield,
      color: "from-teal-500 to-cyan-500"
    },
    {
      number: "03",
      title: "Customer Pays, You're Covered",
      description: "If they opt in, you're protected from damage claims AND you earn a commission. Win-win for everyone.",
      icon: DollarSign,
      color: "from-cyan-500 to-sky-500"
    }
  ]

  return (
    <section id="how-it-works" className="relative bg-white py-20 md:py-32">
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
            Three simple steps to protect your rentals and increase revenue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-8 h-full`}>
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 font-black text-xl shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="mt-8 mb-6">
                  <step.icon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Coverage Types Section
function CoverageTypesSection() {
  const coverageTypes = [
    {
      title: "Bike Rentals",
      description: "Road bikes, mountain bikes, e-bikes, and specialty bicycles",
      icon: Bike,
      examples: ["Damage coverage", "Theft protection", "Component replacement"]
    },
    {
      title: "Kayak & Paddleboard Rentals",
      description: "Water sports equipment including kayaks, SUPs, and canoes",
      icon: Waves,
      examples: ["Hull damage", "Lost equipment", "Accessory coverage"]
    },
    {
      title: "Ski & Snowboard Rentals",
      description: "Winter sports equipment for all skill levels",
      icon: Mountain,
      examples: ["Equipment damage", "Lost skis/boards", "Binding repairs"]
    },
    {
      title: "Water Sports Equipment",
      description: "Surfboards, wetsuits, snorkel gear, and beach equipment",
      icon: Waves,
      examples: ["Board damage", "Wetsuit tears", "Lost accessories"]
    },
    {
      title: "Adventure Gear",
      description: "Camping equipment, climbing gear, and outdoor rentals",
      icon: Mountain,
      examples: ["Tent damage", "Gear loss", "Equipment malfunction"]
    },
    {
      title: "Specialty Equipment",
      description: "Photography gear, drones, and high-value rental items",
      icon: Shield,
      examples: ["Full replacement", "Accessory coverage", "Tech damage"]
    }
  ]

  return (
    <section className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(20,184,166,0.4) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
            Coverage <span className="text-teal-400">Types</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Comprehensive protection for every type of rental equipment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverageTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-teal-800/50 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/20 hover:border-teal-500/40 transition-all"
            >
              <type.icon className="w-10 h-10 text-teal-400 mb-4" />
              <h3 className="text-xl font-black uppercase text-white mb-2">
                {type.title}
              </h3>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                {type.description}
              </p>
              <div className="space-y-2">
                {type.examples.map((example, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span className="text-slate-400">{example}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Business Benefits Section
function BusinessBenefitsSection() {
  const benefits = [
    {
      icon: TrendingUp,
      stat: "42%",
      title: "Increase in Transaction Value",
      description: "Customers who add insurance spend more and feel more confident renting premium equipment."
    },
    {
      icon: Shield,
      stat: "89%",
      title: "Reduced Damage Disputes",
      description: "Insurance eliminates awkward conversations and keeps customers happy even when accidents happen."
    },
    {
      icon: Zap,
      stat: "3x",
      title: "Lower Security Deposit Friction",
      description: "Offer lower deposits or eliminate them entirely. Insurance provides better protection anyway."
    },
    {
      icon: DollarSign,
      stat: "$$$",
      title: "New Revenue Stream",
      description: "Earn commission on every policy sold. No overhead, no work—just additional profit on each rental."
    }
  ]

  return (
    <section className="relative bg-teal-600 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
            Business <span className="text-teal-100">Benefits</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Real results from rental businesses using Daily Event Insurance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-start gap-6">
                <div className="bg-white/20 rounded-xl p-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-5xl font-black text-white mb-2">
                    {benefit.stat}
                  </div>
                  <h3 className="text-xl font-black uppercase text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {benefit.description}
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

// Testimonial Section
function TestimonialSection() {
  return (
    <section className="relative bg-slate-50 py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200"
        >
          <div className="flex justify-center mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <svg className="w-8 h-8 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>

          <blockquote className="text-center">
            <p className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-relaxed">
              "Adding insurance to our bike rentals was a game-changer. We've reduced damage disputes by 90% and our customers love having the peace of mind. Plus, the commission is a nice bonus!"
            </p>
            <footer className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-black text-white">MR</span>
              </div>
              <div className="text-left">
                <div className="font-black text-slate-900 text-lg">Mike Rodriguez</div>
                <div className="text-slate-600">Owner, Pacific Coast Bike Rentals</div>
                <div className="text-sm text-teal-600 font-bold">Santa Monica, CA</div>
              </div>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section with Form
function CTASection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    rentalType: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.businessName,
          services: [formData.rentalType ? `Rental Insurance - ${formData.rentalType}` : "Rental Insurance"],
          message: formData.message || `Rental business inquiry for ${formData.businessName}. Rental type: ${formData.rentalType}`,
          source: "for_rentals_demo_request",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit")
      }

      setSubmitStatus("success")
      setFormData({ name: "", email: "", businessName: "", rentalType: "", message: "" })
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="demo-form" className="relative bg-teal-900 py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-6">
            Ready to Protect <span className="text-teal-400">Your Rentals?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            Join 500+ rental businesses already earning commissions and protecting their equipment.
          </p>
          <p className="text-base text-teal-400 font-bold">
            Request a demo and see how easy it is to integrate insurance into your rental process.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-teal-800/50 backdrop-blur-sm rounded-2xl border border-teal-500/20 p-8 md:p-12"
        >
          {submitStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Demo Request Received!</h3>
              <p className="text-slate-300 mb-6">
                Thanks for your interest! We'll reach out within 24 hours to schedule your personalized demo.
              </p>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="text-teal-400 hover:text-teal-300 font-semibold"
              >
                Submit another request
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  disabled={isSubmitting}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  disabled={isSubmitting}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                />
              </div>
              <input
                type="text"
                placeholder="Business Name *"
                required
                disabled={isSubmitting}
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              />
              <select
                value={formData.rentalType}
                onChange={(e) => setFormData({ ...formData, rentalType: e.target.value })}
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                required
                disabled={isSubmitting}
              >
                <option value="">Select Rental Type *</option>
                <option value="bikes">Bike Rentals</option>
                <option value="water-sports">Kayak / Paddleboard / Water Sports</option>
                <option value="ski-snowboard">Ski / Snowboard Rentals</option>
                <option value="adventure-gear">Adventure Gear / Camping</option>
                <option value="specialty">Specialty Equipment</option>
                <option value="other">Other</option>
              </select>
              <textarea
                placeholder="Tell us about your rental business and average transaction volume..."
                rows={4}
                disabled={isSubmitting}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
              />

              {submitStatus === "error" && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-300 text-sm">
                    Something went wrong. Please try again or contact us directly.
                  </p>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="w-full bg-teal-500 text-white font-black uppercase px-8 py-5 rounded-full text-lg tracking-wider hover:bg-teal-400 transition-colors shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Request a Demo
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              We'll get back to you within 24 hours to schedule your personalized demo.
            </p>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-slate-400"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold">No setup fees</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold">Easy integration</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold">Earn commissions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold">24/7 support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main Page Component
export default function ForRentalsPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />

      <RentalHeroSection />

      <RentalDilemmaSection />

      <HowItWorksSection />

      <CoverageTypesSection />

      <BusinessBenefitsSection />

      <TestimonialSection />

      <CTASection />

      <Footer />
    </main>
  )
}
