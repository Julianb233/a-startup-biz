"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const PORTRAIT_URL = "/images/e52f0172-aad3-4ca1-ad35.jpeg"

// Service paths - simplified from 9 checkboxes to 3 clear paths
const servicePaths = [
  {
    id: "optimize-operations",
    label: "Optimize My Operations",
    description: "AI consulting, backend automation, and process optimization to streamline your business",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "scale-agents",
    label: "Scale With AI Agents",
    description: "Custom bots, systems integration, and AI-powered content creation at scale",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    id: "help-choose",
    label: "I'm Not Sure - Help Me Choose",
    description: "Let's have a discovery call to identify the best AI solutions for your unique needs",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const options = [
  {
    id: "consultation",
    title: "Business Consultation",
    description: "Get a custom AI strategy for your business",
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
    id: "learn",
    title: "Learn to Build AI",
    description: "Join my community and learn to build your own agents",
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
    id: "community",
    title: "Join the Community",
    description: "Connect with other AI enthusiasts and entrepreneurs",
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
    id: "youtube",
    title: "Watch on YouTube",
    description: "Free tutorials and AI insights",
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
  const [selectedOption, setSelectedOption] = useState<string>("consultation")
  const [selectedServicePath, setSelectedServicePath] = useState<string>("optimize-operations")
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
      selectedServicePath: servicePaths.find(s => s.id === selectedServicePath)?.label,
      ...formData,
      submittedAt: new Date().toISOString(),
      source: "wizard-of-ai-website",
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
      setSelectedServicePath("optimize-operations")
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
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #041f1a 0%, #0a3d2e 50%, #041f1a 100%)",
      }}
    >
      {/* Background elements - Updated colors to gold/emerald */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#FFD700]/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#156b4a]/30 rounded-full blur-[100px]" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Header - Updated accent color */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#FFD700] text-sm font-semibold tracking-[0.3em] uppercase mb-2 block">
            Ready to Transform?
          </span>
          <h2 className="font-[family-name:var(--font-oswald)] text-4xl md:text-6xl font-bold uppercase text-white tracking-tighter mb-4">
            BOOK A CONSULTATION
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Whether you want to optimize your business, learn to build AI, or join a community of innovators - your
            journey starts here.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Options */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold mb-6">What brings you here?</h3>
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
                    ? "bg-gradient-to-r from-[#FFD700]/20 to-[#156b4a]/20 border-2 border-[#FFD700]"
                    : "bg-white/5 border-2 border-transparent hover:border-white/20"
                }`}
              >
                <div
                  className={`${selectedOption === option.id ? "text-[#FFD700]" : "text-white/50 group-hover:text-white/80"} transition-colors`}
                >
                  {option.icon}
                </div>
                <div>
                  <h4
                    className={`font-semibold mb-1 ${selectedOption === option.id ? "text-[#FFD700]" : "text-white"}`}
                  >
                    {option.title}
                  </h4>
                  <p className="text-white/60 text-sm">{option.description}</p>
                </div>
                {selectedOption === option.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                    <svg className="w-6 h-6 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
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

            {/* Social Links - Updated colors */}
            <div className="pt-6 border-t border-white/10 mt-8">
              <p className="text-white/50 text-sm mb-4">Or connect with me directly:</p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600/20 rounded-lg text-red-400 hover:bg-red-600/30 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 bg-[#156b4a]/30 rounded-lg text-[#FFD700] hover:bg-[#156b4a]/50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Community
                </a>
              </div>
            </div>
          </div>

          {/* Right side - Dynamic Content based on selection */}
          <motion.div
            key={selectedOption}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 rounded-2xl p-8 border border-[#FFD700]/20"
          >
            {/* YouTube Option */}
            {selectedOption === "youtube" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Watch Free Tutorials</h3>
                <p className="text-white/60 mb-8">
                  Learn AI automation, agent development, and cutting-edge strategies for free on my YouTube channel.
                </p>
                <a
                  href="https://www.youtube.com/@TheWizardofAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Visit YouTube Channel
                </a>
              </div>
            )}

            {/* Community Option */}
            {selectedOption === "community" && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-[#156b4a]/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#FFD700]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Join the Community</h3>
                <p className="text-white/60 mb-8">
                  Connect with AI enthusiasts, entrepreneurs, and innovators. Get help, share ideas, and grow together.
                </p>
                <a
                  href="https://discord.gg/wizardofai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#156b4a] hover:bg-[#1a8056] text-[#FFD700] font-bold rounded-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Join Discord Community
                </a>
              </div>
            )}

            {/* Learn Option - Newsletter/Resources Signup */}
            {selectedOption === "learn" && (
              <>
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Welcome to the Journey!</h3>
                    <p className="text-white/60 mb-6">
                      Check your email for exclusive learning resources and community access.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-[#FFD700] font-semibold hover:underline"
                    >
                      Sign up another email
                    </button>
                  </motion.div>
                ) : (
                  <div className="py-4">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Start Learning AI</h3>
                      <p className="text-white/60">
                        Get access to tutorials, guides, and exclusive resources to build your own AI agents.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Your Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none transition-colors"
                          placeholder="John Doe"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Email Address *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none transition-colors"
                          placeholder="john@example.com"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">What do you want to learn? (Optional)</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none transition-colors resize-none"
                          rows={3}
                          placeholder="AI agents, automation, specific tools..."
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
                        className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-[#041f1a] font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" }}
                        whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)" } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Subscribing...
                          </>
                        ) : (
                          "Get Learning Resources"
                        )}
                      </motion.button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-white/50 text-sm text-center">
                        You'll also get access to our exclusive community and updates on new tutorials.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Business Consultation Option - Full Form */}
            {selectedOption === "consultation" && (
              <>
                {submitStatus === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                    <p className="text-white/60 mb-6">
                      Your message has been received. I'll get back to you within 24 hours.
                    </p>
                    <button
                      onClick={resetForm}
                      className="text-[#FFD700] font-semibold hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFD700]">
                        <img
                          src={PORTRAIT_URL || "/placeholder.svg"}
                          alt="The Wizard of AI"
                          className="w-full h-full object-cover object-top"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">The Wizard of AI</h3>
                        <p className="text-white/60 text-sm">Usually responds within 24 hours</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none transition-colors"
                            placeholder="John Doe"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none transition-colors"
                            placeholder="(555) 123-4567"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Email Address *</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none transition-colors"
                            placeholder="john@example.com"
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Company Name</label>
                          <input
                            type="text"
                            value={formData.business}
                            onChange={(e) => setFormData({ ...formData, business: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none transition-colors"
                            placeholder="Your company or industry"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      {/* Service Path Selection - Simplified to 3 clear options */}
                      <div>
                        <label className="block text-white/70 text-sm mb-3">What path interests you most?</label>
                        <div className="space-y-3">
                          {servicePaths.map((path) => (
                            <motion.button
                              key={path.id}
                              type="button"
                              onClick={() => setSelectedServicePath(path.id)}
                              disabled={isSubmitting}
                              className={`w-full p-4 rounded-lg text-left transition-all flex items-start gap-4 ${
                                selectedServicePath === path.id
                                  ? "bg-gradient-to-r from-[#FFD700]/20 to-[#156b4a]/20 border-2 border-[#FFD700]"
                                  : "bg-white/5 border-2 border-transparent hover:border-white/20"
                              }`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${
                                selectedServicePath === path.id
                                  ? "border-[#FFD700] bg-[#FFD700]/20"
                                  : "border-white/30"
                              }`}>
                                {selectedServicePath === path.id && (
                                  <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`${selectedServicePath === path.id ? "text-[#FFD700]" : "text-white/50"}`}>
                                    {path.icon}
                                  </div>
                                  <p className={`font-semibold ${selectedServicePath === path.id ? "text-[#FFD700]" : "text-white"}`}>
                                    {path.label}
                                  </p>
                                </div>
                                <p className="text-white/60 text-sm">{path.description}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/70 text-sm mb-2">Tell me about your goals *</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-[#FFD700] focus:outline-none transition-colors resize-none"
                          rows={4}
                          placeholder="What do you want to achieve with AI? What are your biggest bottlenecks?"
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
                        className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#DAA520] text-[#041f1a] font-bold rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{ boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" }}
                        whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 30px rgba(255, 215, 0, 0.5)" } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Claim Your Spot"
                        )}
                      </motion.button>
                    </form>
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
