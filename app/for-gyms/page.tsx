"use client"

import { motion } from "framer-motion"
import {
  Shield,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  DollarSign,
  Clock,
  FileCheck,
  Dumbbell,
  Activity,
  Award,
  ArrowRight,
  Calculator
} from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useState } from "react"

// Hero Section for Gyms
function GymHeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500">
      {/* Sparkle Effects */}
      
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
            <Dumbbell className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">FOR GYM OWNERS & FITNESS CENTERS</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white leading-tight tracking-tight mb-6"
          >
            Insurance Revenue
            <span className="block text-teal-100">For Your Gym</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90 mb-4 max-w-3xl mx-auto"
          >
            Earn commission on every policy while protecting your members
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Turn day passes and memberships into a new revenue stream. Zero overhead. Pure profit.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="#demo-form"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-black uppercase text-teal-700 bg-white rounded-full shadow-2xl hover:bg-teal-50 transition-all duration-300"
            >
              <span>Request a Demo</span>
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.a>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-sm"
            >
              <span className="font-semibold">Free setup • No commitment • 5-minute integration</span>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/90"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-100" />
              <span className="font-semibold">127+ Gyms Partner With Us</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-100" />
              <span className="font-semibold">Avg. $3,200/mo Extra Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-100" />
              <span className="font-semibold">99.2% Member Satisfaction</span>
            </div>
          </motion.div>
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

// Problem/Solution Section
function ProblemSolutionSection() {
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
            The <span className="text-teal-600">Challenge</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Every gym owner faces the same twin problems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Problem Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-teal-900 rounded-2xl p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white mb-4">The Problem</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Your members need liability coverage but don't know where to get it</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>You're exposed to potential claims without member insurance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Day passes and drop-ins leave money on the table</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Traditional insurance is complicated and slow to set up</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Solution Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-teal-600 to-teal-500 rounded-2xl p-8 overflow-hidden"
          >
                        <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black uppercase text-white mb-4">The Solution</h3>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-100 mt-1 flex-shrink-0" />
                  <span>Embedded insurance at checkout - members get coverage instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-100 mt-1 flex-shrink-0" />
                  <span>Reduce your liability exposure with every covered member</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-100 mt-1 flex-shrink-0" />
                  <span>Earn 20-30% commission on every policy sold</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-100 mt-1 flex-shrink-0" />
                  <span>5-minute integration with your POS or check-in system</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Sign Up in Minutes",
      description: "Create your account and get API credentials. No paperwork, no waiting. Start earning revenue today.",
      icon: FileCheck,
      color: "from-teal-600 to-teal-500"
    },
    {
      number: "02",
      title: "Add to Your System",
      description: "Integrate with your POS, booking system, or check-in app. Works with MindBody, Zen Planner, and all major platforms.",
      icon: Zap,
      color: "from-teal-500 to-cyan-500"
    },
    {
      number: "03",
      title: "Start Earning",
      description: "Members purchase coverage at checkout. You earn commission automatically. No management required.",
      icon: DollarSign,
      color: "from-cyan-500 to-sky-500"
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
            How It <span className="text-teal-600">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Three simple steps to start earning insurance revenue
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
              <div className={`relative bg-gradient-to-br ${step.color} rounded-2xl p-8 h-full overflow-hidden group hover:scale-105 transition-transform duration-300`}>
                
                {/* Number Badge */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-black text-teal-600">{step.number}</span>
                </div>

                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black uppercase text-white mb-4">
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

// Benefits Section
function GymBenefitsSection() {
  const benefits = [
    {
      title: "Day Pass Insurance",
      description: "Offer protection for drop-in guests and day pass visitors. Instant coverage for single-day activities.",
      icon: Clock,
      color: "bg-teal-600"
    },
    {
      title: "Equipment Liability",
      description: "Coverage for weight training, cardio equipment, and functional fitness areas. Protect your facility.",
      icon: Shield,
      color: "bg-teal-500"
    },
    {
      title: "Personal Training Protection",
      description: "Specialized coverage for 1-on-1 and small group training sessions. Keep your trainers and clients protected.",
      icon: Users,
      color: "bg-cyan-600"
    },
    {
      title: "Group Class Coverage",
      description: "Insurance for CrossFit, spin classes, yoga, HIIT, and all group fitness activities. Full protection for all members.",
      icon: Activity,
      color: "bg-sky-600"
    }
  ]

  return (
    <section className="relative bg-teal-900 py-20 md:py-32 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(20,184,166,0.4) 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}
        />
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
            Coverage for <span className="text-teal-400">Every Activity</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Comprehensive insurance options designed specifically for gyms and fitness centers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-teal-800/50 backdrop-blur-sm rounded-2xl p-8 border border-teal-500/20 overflow-hidden group"
            >
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600/0 to-teal-500/0 group-hover:from-teal-600/10 group-hover:to-teal-500/10 transition-all duration-300" />

              <div className="relative z-10">
                <div className={`w-12 h-12 ${benefit.color} rounded-lg flex items-center justify-center mb-6`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Revenue Calculator Section
function RevenueCalculatorSection() {
  const [dailyCheckins, setDailyCheckins] = useState(100)
  const [conversionRate, setConversionRate] = useState(30)
  const [pricePerPolicy, setPricePerPolicy] = useState(5)
  const [commissionRate] = useState(25)

  const dailyRevenue = (dailyCheckins * (conversionRate / 100) * pricePerPolicy * (commissionRate / 100))
  const monthlyRevenue = dailyRevenue * 30
  const yearlyRevenue = monthlyRevenue * 12

  return (
    <section className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 py-20 md:py-32 overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full mb-6">
            <Calculator className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">REVENUE CALCULATOR</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
            Calculate Your <span className="text-teal-100">New Revenue</span>
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            See how much additional revenue your gym can generate
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-12">
            {/* Controls */}
            <div className="space-y-8">
              <div>
                <label className="flex items-center justify-between text-white font-semibold mb-3">
                  <span>Daily Check-ins</span>
                  <span className="text-2xl font-black text-teal-100">{dailyCheckins}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={dailyCheckins}
                  onChange={(e) => setDailyCheckins(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-white font-semibold mb-3">
                  <span>Insurance Conversion Rate</span>
                  <span className="text-2xl font-black text-teal-100">{conversionRate}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-white font-semibold mb-3">
                  <span>Price per Policy</span>
                  <span className="text-2xl font-black text-teal-100">${pricePerPolicy}</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="1"
                  value={pricePerPolicy}
                  onChange={(e) => setPricePerPolicy(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <span>Your Commission Rate</span>
                  <span className="font-bold">{commissionRate}%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-white/80 text-sm font-semibold mb-2">Monthly Revenue</div>
                <div className="text-5xl font-black text-white mb-1">
                  ${monthlyRevenue.toFixed(0).toLocaleString()}
                </div>
                <div className="text-white/70 text-sm">
                  ${dailyRevenue.toFixed(2)} per day
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-white/80 text-sm font-semibold mb-2">Annual Revenue</div>
                <div className="text-4xl font-black text-white">
                  ${yearlyRevenue.toFixed(0).toLocaleString()}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-3 text-teal-700">
                  <TrendingUp className="w-6 h-6" />
                  <div>
                    <div className="font-black text-lg">100% Passive Income</div>
                    <div className="text-sm">Zero management required</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm mb-4">
              Based on industry average conversion rates and commission structure
            </p>
            <motion.a
              href="#demo-form"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-black uppercase rounded-full hover:bg-teal-50 transition-colors"
            >
              Start Earning This Revenue
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonial Section
function TestimonialSection() {
  return (
    <section className="relative bg-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight mb-4">
            Gym Owners <span className="text-teal-600">Love It</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 overflow-hidden"
        >
          
          {/* Quote Icon */}
          <div className="relative z-10">
            <div className="w-16 h-16 bg-teal-600/20 rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-teal-400" />
            </div>

            <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
              "We added Daily Event Insurance to our check-in process and started earning an extra $3,800 per month.
              Our members love the convenience, and we love the passive revenue. It's a complete win-win."
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                <span className="text-2xl font-black text-white">SM</span>
              </div>
              <div>
                <div className="font-black text-white text-lg">Sarah Mitchell</div>
                <div className="text-teal-400 font-semibold">Owner, CrossFit Summit</div>
                <div className="text-slate-400 text-sm">Portland, OR • 450 Members</div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-black text-teal-400">$3,800</div>
                <div className="text-slate-400 text-sm">Monthly Revenue</div>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-400">42%</div>
                <div className="text-slate-400 text-sm">Conversion Rate</div>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-400">8 min</div>
                <div className="text-slate-400 text-sm">Setup Time</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Demo Form Section
function DemoFormSection() {
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
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
            Ready to Add Insurance
            <span className="block text-teal-400">To Your Gym?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            Schedule a personalized demo and see exactly how Daily Event Insurance works with your facility
          </p>
          <p className="text-teal-400 font-bold">
            Free setup • No commitment • Start earning revenue this week
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-teal-800/50 backdrop-blur-sm rounded-2xl border border-teal-500/20 p-8 md:p-12"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Your Name *</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  required
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  placeholder="john@yourgym.com"
                  required
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Gym Name *</label>
                <input
                  type="text"
                  placeholder="Your Gym Name"
                  required
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Gym Type *</label>
                <select
                  required
                  className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Type</option>
                  <option value="traditional">Traditional Gym</option>
                  <option value="crossfit">CrossFit Box</option>
                  <option value="boutique">Boutique Fitness Studio</option>
                  <option value="climbing">Climbing Gym</option>
                  <option value="yoga">Yoga/Pilates Studio</option>
                  <option value="martial-arts">Martial Arts</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Avg. Daily Check-ins</label>
                <select className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option value="">Select Range</option>
                  <option value="0-50">0-50</option>
                  <option value="50-100">50-100</option>
                  <option value="100-200">100-200</option>
                  <option value="200-500">200-500</option>
                  <option value="500+">500+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Current POS/Software System</label>
              <input
                type="text"
                placeholder="e.g., MindBody, Zen Planner, Wodify, etc."
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">What are you most interested in?</label>
              <textarea
                placeholder="Tell us about your gym and what you'd like to achieve with insurance revenue..."
                rows={4}
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -12px rgba(20, 184, 166, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-teal-500 text-white font-black uppercase px-8 py-5 rounded-full text-lg tracking-wider hover:bg-teal-400 transition-colors shadow-xl"
            >
              Request Your Personalized Demo
            </motion.button>

            <p className="text-center text-slate-400 text-sm">
              We'll respond within 4 hours to schedule your demo. Most gyms are up and running within 24 hours.
            </p>
          </form>
        </motion.div>

        {/* Additional Trust Signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <div className="bg-teal-800/30 rounded-xl p-6 border border-teal-700">
            <div className="text-3xl font-black text-teal-400 mb-2">127+</div>
            <div className="text-slate-300 text-sm">Gyms Using DEI</div>
          </div>
          <div className="bg-teal-800/30 rounded-xl p-6 border border-teal-700">
            <div className="text-3xl font-black text-teal-400 mb-2">$485K+</div>
            <div className="text-slate-300 text-sm">Earned by Partners</div>
          </div>
          <div className="bg-teal-800/30 rounded-xl p-6 border border-teal-700">
            <div className="text-3xl font-black text-teal-400 mb-2">4.9/5</div>
            <div className="text-slate-300 text-sm">Partner Satisfaction</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main Page Component
export default function ForGymsPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />
      <GymHeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <GymBenefitsSection />
      <RevenueCalculatorSection />
      <TestimonialSection />
      <DemoFormSection />
      <Footer />
    </main>
  )
}
