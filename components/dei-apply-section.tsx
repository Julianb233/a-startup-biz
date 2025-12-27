"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { UrgencyBanner } from "./urgency-banner"
import { RevenueGuarantee } from "./revenue-guarantee"
import { ValueStack } from "./value-stack"

const PORTRAIT_URL = "/images/hiqor-logo.png"

// Business types for insurance partners
const businessTypes = [
  {
    id: "gym-fitness",
    label: "Gym or Fitness Center",
    description: "Traditional gyms, CrossFit boxes, boutique fitness studios, and training facilities",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "climbing-adventure",
    label: "Climbing or Adventure Sports",
    description: "Rock climbing gyms, ropes courses, adventure parks, and outdoor recreation facilities",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    id: "rental-equipment",
    label: "Equipment Rental Business",
    description: "Ski rentals, bike rentals, sports equipment, and recreational gear providers",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const options = [
  {
    id: "demo",
    title: "Click to Apply",
    description: "Quick 10-minute application. See how embedded insurance can increase revenue for your facility",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    id: "partner",
    title: "Become a Partner",
    description: "Join 200+ facilities earning commissions with Daily Event Insurance",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    id: "pricing",
    title: "Get Pricing Info",
    description: "Learn about our commission structure and revenue sharing",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: "support",
    title: "Technical Support",
    description: "Get help with integration, implementation, or technical questions",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export function ApplySection() {
  const [selectedOption, setSelectedOption] = useState<string>("demo")
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("gym-fitness")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    const webhookUrl = process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL

    const payload = {
      selectedOption,
      optionTitle: options.find((o) => o.id === selectedOption)?.title,
      selectedBusinessType: businessTypes.find(b => b.id === selectedBusinessType)?.label,
      ...formData,
      submittedAt: new Date().toISOString(),
      source: "daily-event-insurance-website",
    }

    try {
      if (webhookUrl) {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error("Failed to submit form")
        }
      } else {
        // Fallback: log to console if no webhook configured
        console.log("Form submitted (no webhook configured):", payload)
      }

      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", business: "", message: "" })
      setSelectedBusinessType("gym-fitness")
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
      setErrorMessage("Something went wrong. Please try again or email directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmitStatus("idle")
    setErrorMessage("")
  }

  return (
    <section
      id="apply"
      ref={containerRef}
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-teal-50 via-white to-slate-50"
    >
      {/* Background elements - Updated to light teal palette */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-teal-400/15 rounded-full blur-[100px]" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header - Updated to teal accent */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-teal-600 text-sm font-semibold tracking-[0.3em] uppercase mb-2 block">
            Your Competitors Are Already Doing This
          </span>
          <h2 className="font-[family-name:var(--font-oswald)] text-4xl md:text-6xl font-bold uppercase text-slate-900 tracking-tighter mb-4">
            CLAIM YOUR EXCLUSIVE TERRITORY
          </h2>
          <p className="text-slate-700 text-lg md:text-xl max-w-2xl mx-auto mb-2">
            Limited partnerships available in your area. Lock in your spot before competitors do.
          </p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            247 facilities already earning. Setup takes 48 hours. Zero setup fees.
          </p>
        </motion.div>

        {/* Urgency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 max-w-3xl mx-auto"
        >
          <UrgencyBanner variant="limited-spots" />
        </motion.div>

        {/* Trust Elements */}
        <motion.div
          className="flex flex-wrap justify-center items-center gap-6 mb-16 pb-8 border-b border-teal-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-5 h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">No Setup Fees</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">Cancel Anytime</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">Dedicated Account Manager</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <svg className="w-5 h-5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold">Live in 48 Hours</span>
          </div>
        </motion.div>

        {/* Revenue Guarantee - Positioned prominently above the form */}
        <RevenueGuarantee />

        {/* Value Stack - Show what they get for FREE */}
        <ValueStack />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Options */}
          <div className="space-y-4">
            <h3 className="text-slate-700 font-semibold mb-6">What are you interested in?</h3>
            {options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full p-5 rounded-xl text-left transition-all flex items-start gap-4 group ${
                  selectedOption === option.id
                    ? "bg-gradient-to-r from-teal-500/20 to-teal-600/20 border-2 border-teal-400"
                    : "bg-white/5 border-2 border-transparent hover:border-teal-200"
                }`}
              >
                <div
                  className={`${selectedOption === option.id ? "text-teal-600" : "text-slate-400 group-hover:text-slate-700"} transition-colors`}
                >
                  {option.icon}
                </div>
                <div>
                  <h4
                    className={`font-semibold mb-1 ${selectedOption === option.id ? "text-teal-600" : "text-slate-700"}`}
                  >
                    {option.title}
                  </h4>
                  <p className="text-slate-500 text-sm">{option.description}</p>
                </div>
                {selectedOption === option.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <svg className="w-6 h-6 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            ))}

            {/* Testimonial Quote - Insurance Context */}
            <div className="pt-6 border-t border-teal-200 mt-8">
              <div className="bg-white/5 rounded-lg p-6 border border-teal-500/20">
                <svg className="w-8 h-8 text-teal-500/40 mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-slate-700 text-sm italic mb-3">
                  "We've been offering Daily Event Insurance for 6 months and our members love it. Easy to implement and we earn extra revenue on every policy sold."
                </p>
                <p className="text-teal-600 text-sm font-semibold">— Peak Climbing Gym, Denver CO</p>
              </div>
            </div>
          </div>

          {/* Right side - Dynamic Content based on selection */}
          <motion.div
            key={selectedOption}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-8 border border-teal-400/20"
          >
            {/* Support Option */}
            {selectedOption === "support" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Technical Support</h3>
                <p className="text-slate-500 mb-8">
                  Get help with integration, API documentation, widget customization, or any technical questions.
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:support@dailyeventinsurance.com"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-slate-700 font-bold rounded-lg transition-all w-full justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Support Team
                  </a>
                  <a
                    href="/docs"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-teal-600 font-bold rounded-lg transition-all w-full justify-center"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    View Documentation
                  </a>
                </div>
              </div>
            )}

            {/* Pricing Option */}
            {selectedOption === "pricing" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Simple, Transparent Pricing</h3>
                <p className="text-slate-500 mb-8">
                  Earn commissions on every policy sold through your facility. No setup fees, no monthly costs.
                </p>

                <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-xl p-6 mb-6 border border-teal-400/30">
                  <div className="text-4xl font-bold text-teal-600 mb-2">15-25%</div>
                  <div className="text-slate-700 text-sm">Commission on each policy</div>
                </div>

                <div className="space-y-3 text-left mb-8">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700 text-sm">No setup fees or integration costs</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700 text-sm">Monthly commission payouts</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700 text-sm">Full support and marketing materials</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOption("demo")}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-slate-700 font-bold rounded-lg transition-all"
                >
                  Click to Apply
                </button>
              </div>
            )}

            {/* Partner Option - Newsletter/Interest Signup */}
            {selectedOption === "partner" && (
              <>
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h3>
                    <p className="text-slate-500 mb-6">
                      We'll review your application and get back to you within 24 hours with next steps.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-teal-600 font-semibold hover:underline"
                    >
                      Submit another application
                    </button>
                  </motion.div>
                ) : (
                  <div className="py-4">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Become a Partner</h3>
                      <p className="text-slate-500 mb-4">
                        Join the Daily Event Insurance partner network and start earning commissions today.
                      </p>

                      {/* Compact Urgency Indicator */}
                      <UrgencyBanner variant="fast-review" compact />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-slate-600 text-sm mb-2">Your Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                          placeholder="John Doe"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 text-sm mb-2">Email Address *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                          placeholder="john@example.com"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 text-sm mb-2">Business Name *</label>
                        <input
                          type="text"
                          value={formData.business}
                          onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                          placeholder="Your gym, facility, or business name"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 text-sm mb-2">Tell us about your business (Optional)</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all resize-none"
                          rows={3}
                          placeholder="Number of members, current offerings, etc."
                          disabled={isSubmitting}
                        />
                      </div>

                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                        >
                          <p className="text-red-400 text-sm">{errorMessage}</p>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-slate-700 font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)" }}
                        whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 30px rgba(20, 184, 166, 0.5)" } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          "Apply to Partner Program"
                        )}
                      </motion.button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-teal-200">
                      <p className="text-slate-400 text-sm text-center">
                        You'll receive partnership details and onboarding information within 24 hours.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Demo Option - Full Contact Form */}
            {selectedOption === "demo" && (
              <>
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Demo Requested!</h3>
                    <p className="text-slate-500 mb-6">
                      We'll contact you within 4 hours to schedule your personalized demo.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-teal-600 font-semibold hover:underline"
                    >
                      Request another demo
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Apply in 10 Minutes</h3>
                      <p className="text-slate-600 mb-4">
                        Quick 10-minute application. Live in 48 hours. $4,200/month average revenue.
                      </p>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-lg border border-teal-400/20">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-teal-600">10min</div>
                          <div className="text-xs text-slate-500">Application</div>
                        </div>
                        <div className="text-center border-x border-teal-200">
                          <div className="text-2xl font-bold text-teal-600">48hrs</div>
                          <div className="text-xs text-slate-500">Go Live</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-teal-600">$0</div>
                          <div className="text-xs text-slate-500">Setup Fee</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <a
                        href="https://calendly.com/dailyeventinsurance/demo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500/20 border-2 border-teal-400 text-teal-600 font-semibold rounded-lg hover:bg-teal-500/30 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Book Application Call
                      </a>
                      <a
                        href="tel:+18555551234"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border-2 border-teal-200 text-slate-700 font-semibold rounded-lg hover:bg-white/10 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call (855) 555-1234
                      </a>
                    </div>

                    <div className="relative mb-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-teal-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-teal-900 text-slate-400">or fill out the form below</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-600 text-sm mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                            placeholder="John Doe"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-sm mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                            placeholder="(555) 123-4567"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-600 text-sm mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                            placeholder="john@example.com"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 text-sm mb-2">Business Name *</label>
                          <input
                            type="text"
                            value={formData.business}
                            onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all"
                            placeholder="Your gym or facility name"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      {/* Business Type Selection */}
                      <div>
                        <label className="block text-slate-600 text-sm mb-3">What type of business do you have? *</label>
                        <div className="space-y-3">
                          {businessTypes.map((type) => (
                            <motion.button
                              key={type.id}
                              type="button"
                              onClick={() => setSelectedBusinessType(type.id)}
                              disabled={isSubmitting}
                              className={`w-full p-4 rounded-lg text-left transition-all flex items-start gap-4 ${
                                selectedBusinessType === type.id
                                  ? "bg-gradient-to-r from-teal-500/20 to-teal-600/20 border-2 border-teal-400"
                                  : "bg-white/5 border-2 border-transparent hover:border-teal-200"
                              }`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${
                                selectedBusinessType === type.id
                                  ? "border-teal-400 bg-teal-500/20"
                                  : "border-white/30"
                              }`}>
                                {selectedBusinessType === type.id && (
                                  <div className="w-3 h-3 rounded-full bg-teal-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`${selectedBusinessType === type.id ? "text-teal-600" : "text-slate-400"}`}>
                                    {type.icon}
                                  </div>
                                  <p className={`font-semibold ${selectedBusinessType === type.id ? "text-teal-600" : "text-slate-700"}`}>
                                    {type.label}
                                  </p>
                                </div>
                                <p className="text-slate-500 text-sm">{type.description}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 text-sm mb-2">What would you like to know? *</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 focus:outline-none transition-all resize-none"
                          rows={4}
                          placeholder="Tell us about your facility and what you'd like to learn about our insurance offerings..."
                          required
                          disabled={isSubmitting}
                        />
                      </div>

                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                        >
                          <p className="text-red-400 text-sm">{errorMessage}</p>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-slate-700 font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ boxShadow: "0 0 20px rgba(20, 184, 166, 0.3)" }}
                        whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 30px rgba(20, 184, 166, 0.5)" } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Scheduling Your Demo...
                          </>
                        ) : (
                          <>
                            <span>Click to Apply Now</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* What Happens Next */}
                    <div className="mt-8 pt-6 border-t border-teal-200">
                      <h4 className="text-slate-700 font-semibold mb-4 text-center">What happens next?</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-teal-600 font-bold text-sm">1</span>
                          </div>
                          <div>
                            <p className="text-slate-700 text-sm font-semibold">We'll contact you within 4 hours</p>
                            <p className="text-slate-400 text-xs">Schedule your personalized demo at your convenience</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-teal-600 font-bold text-sm">2</span>
                          </div>
                          <div>
                            <p className="text-slate-700 text-sm font-semibold">15-minute platform walkthrough</p>
                            <p className="text-slate-400 text-xs">See exactly how it works for your facility</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-teal-600 font-bold text-sm">3</span>
                          </div>
                          <div>
                            <p className="text-slate-700 text-sm font-semibold">Go live in 48 hours</p>
                            <p className="text-slate-400 text-xs">Start earning commissions immediately</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
