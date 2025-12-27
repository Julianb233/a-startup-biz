"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Shield, Zap, TrendingUp, Users, DollarSign, CheckCircle, ArrowRight, Mountain, Bike, Waves, Activity } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useState } from "react"

// Sparkle decorations
const sparkles = [
  { left: "8%", top: "12%", delay: 0, size: "lg" },
  { left: "88%", top: "18%", delay: 0.3, size: "md" },
  { left: "12%", top: "78%", delay: 0.6, size: "lg" },
  { left: "82%", top: "72%", delay: 0.9, size: "md" },
  { left: "50%", top: "8%", delay: 0.4, size: "sm" },
  { left: "92%", top: "48%", delay: 0.8, size: "lg" },
  { left: "6%", top: "42%", delay: 0.2, size: "md" },
]

const getSparkleSize = (size: string) => {
  switch (size) {
    case "lg":
      return "w-5 h-5 md:w-7 md:h-7"
    case "md":
      return "w-4 h-4 md:w-5 md:h-5"
    default:
      return "w-3 h-3 md:w-4 md:h-4"
  }
}

export default function ForAdventurePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    business: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const webhookUrl = process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL
    const payload = {
      ...formData,
      submittedAt: new Date().toISOString(),
      source: "adventure-sports-landing",
      pageType: "for-adventure",
    }

    try {
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) throw new Error("Failed to submit form")
      } else {
        console.log("Form submitted (no webhook configured):", payload)
      }
      setSubmitStatus("success")
      setFormData({ name: "", email: "", business: "", phone: "", message: "" })
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-teal-900 pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            background: [
              "radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13,148,136,0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
              "radial-gradient(ellipse at 70% 30%, rgba(20,184,166,0.15) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(13,148,136,0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
              "radial-gradient(ellipse at 30% 20%, rgba(20,184,166,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(13,148,136,0.1) 0%, transparent 50%), linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 z-[1] opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(20,184,166,0.3) 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Sparkles */}
        <AnimatePresence>
          {sparkles.map((sparkle, i) => (
            <motion.div
              key={i}
              className={`absolute ${getSparkleSize(sparkle.size)} z-10 pointer-events-none`}
              style={{ left: sparkle.left, top: sparkle.top }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.7, 1, 0],
                scale: [0, 1.3, 0.9, 1.3, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3.5,
                delay: sparkle.delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1.2,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                  fill="#14B8A6"
                  style={{ filter: "drop-shadow(0 0 10px rgba(20,184,166,0.95))" }}
                />
              </svg>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-400/30 rounded-full mb-6"
            >
              <Shield className="w-5 h-5 text-teal-400" />
              <span className="text-teal-400 text-sm font-semibold">For Adventure Sports Operators</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white leading-tight tracking-tight mb-6">
              Adventure Insurance
              <br />
              <span className="text-teal-400" style={{ textShadow: "0 0 40px rgba(20,184,166,0.6)" }}>
                Made Simple
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
              Protect your guests with instant coverage for zip lines, obstacle courses, and more
            </p>

            <motion.a
              href="#demo"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-teal-500 text-white font-bold text-lg rounded-xl hover:bg-teal-400 transition-all duration-300 shadow-lg hover:shadow-teal-500/30"
            >
              Request a Demo
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full pointer-events-none z-[3]"
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            background: "radial-gradient(circle, rgba(20,184,166,0.2) 0%, rgba(13,148,136,0.1) 40%, transparent 70%)",
          }}
        />
      </section>

      {/* The Adventure Challenge */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 mb-6">
              The Adventure <span className="text-teal-500">Challenge</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Running an adventure sports operation comes with unique insurance challenges
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "High-Risk Activities",
                description: "Traditional insurance is expensive and complicated for adventure sports",
                color: "teal",
              },
              {
                icon: Users,
                title: "Complex Group Bookings",
                description: "Managing coverage for groups and walk-ins is time-consuming",
                color: "cyan",
              },
              {
                icon: Zap,
                title: "Last-Minute Bookings",
                description: "Customers need instant coverage, not days of paperwork",
                color: "sky",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200"
              >
                <div className="w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-teal-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center"
          >
            <h3 className="text-3xl md:text-4xl font-black uppercase mb-4">The Solution</h3>
            <p className="text-xl text-teal-50 mb-6">
              Per-person, per-activity coverage that integrates seamlessly with your booking system
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Instant Coverage</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Easy Integration</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Earn Commission</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 mb-6">
              How It <span className="text-teal-500">Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Partner with Us",
                description: "Quick onboarding process with dedicated support to get you started",
                icon: Users,
              },
              {
                step: "02",
                title: "Integrate with Your System",
                description: "Seamless integration with your existing booking platform or point-of-sale",
                icon: Zap,
              },
              {
                step: "03",
                title: "Earn Commission",
                description: "Your guests get coverage, you earn commission on every policy sold",
                icon: DollarSign,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 border border-teal-200 hover:border-teal-400 transition-all">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-lg">{item.step}</span>
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4 mt-4">
                    <item.icon className="w-7 h-7 text-teal-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Coverage Types */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 mb-6">
              Activity <span className="text-teal-500">Coverage</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive protection for a wide range of adventure activities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Mountain, title: "Zip Lines", color: "from-teal-500 to-teal-600" },
              { icon: Activity, title: "Obstacle Courses", color: "from-teal-600 to-cyan-600" },
              { icon: Users, title: "Trampoline Parks", color: "from-cyan-500 to-sky-500" },
              { icon: Waves, title: "Water Parks", color: "from-sky-500 to-blue-500" },
              { icon: Mountain, title: "Aerial Adventures", color: "from-blue-500 to-teal-500" },
              { icon: Bike, title: "Outdoor Expeditions", color: "from-teal-500 to-cyan-500" },
            ].map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${activity.color} rounded-xl p-6 text-white cursor-pointer`}
              >
                <activity.icon className="w-8 h-8 mb-3" />
                <h3 className="text-xl font-bold">{activity.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-32 bg-teal-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="benefit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0EA5E9" />
              </linearGradient>
            </defs>
            <motion.path
              d="M100,10 Q150,50 140,100 T100,190 Q50,150 60,100 T100,10"
              fill="none"
              stroke="url(#benefit-gradient)"
              strokeWidth="2"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ transformOrigin: "center" }}
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-6">
              Partner <span className="text-teal-400">Benefits</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: "Reduce Liability Exposure",
                description: "Transfer risk while providing peace of mind to your customers",
              },
              {
                icon: TrendingUp,
                title: "31% Customer Retention",
                description: "Partners see significant improvement in customer loyalty and repeat bookings",
              },
              {
                icon: Users,
                title: "Group Booking Protection",
                description: "Easy coverage management for corporate events and large groups",
              },
              {
                icon: DollarSign,
                title: "New Revenue Stream",
                description: "Earn 15-25% commission on every policy sold through your facility",
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-teal-500/20 rounded-2xl p-8 hover:bg-white/10 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.svg
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </motion.svg>
              ))}
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">
              "Daily Event Insurance transformed how we handle liability. Our guests love the instant coverage, and we earn commission on every sale. It's a win-win."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Mountain className="w-8 h-8" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">Sarah Mitchell</p>
                <p className="text-teal-100">Operations Director, Summit Zip Adventures</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Form */}
      <section id="demo" className="py-20 md:py-32 bg-teal-900">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white mb-6">
              Request a <span className="text-teal-400">Demo</span>
            </h2>
            <p className="text-lg text-slate-300">
              See how Daily Event Insurance can transform your adventure operation
            </p>
          </motion.div>

          {submitStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 bg-white/5 rounded-2xl border border-teal-500/20"
            >
              <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-teal-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Demo Requested!</h3>
              <p className="text-slate-300">We'll contact you within 24 hours to schedule your personalized demo.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-white/5 border border-teal-500/20 rounded-2xl p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                    placeholder="(555) 123-4567"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                    placeholder="john@adventure.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Business Name *</label>
                  <input
                    type="text"
                    value={formData.business}
                    onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors"
                    placeholder="Your adventure business"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-white/70 text-sm mb-2 font-medium">Tell us about your operation</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-teal-400 focus:outline-none transition-colors resize-none"
                  rows={4}
                  placeholder="What activities do you offer? How many guests per month?"
                  disabled={isSubmitting}
                />
              </div>

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                >
                  <p className="text-red-400 text-sm">Something went wrong. Please try again or email us directly.</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)" }}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Request Demo
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
