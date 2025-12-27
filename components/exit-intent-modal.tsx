"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const STORAGE_KEY = "wizardai-exit-modal-shown"
const DESKTOP_MIN_WIDTH = 768

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  // Check if mobile and if modal was already shown
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < DESKTOP_MIN_WIDTH)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Check if modal was already shown in this session
    const modalShown = sessionStorage.getItem(STORAGE_KEY)
    if (modalShown === "true") {
      setHasShown(true)
    }

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Exit intent detection
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      // Only trigger if cursor leaves from top of page (toward browser chrome)
      if (e.clientY <= 0 && !hasShown && !isMobile && !isOpen) {
        setIsOpen(true)
        setHasShown(true)
        sessionStorage.setItem(STORAGE_KEY, "true")
      }
    },
    [hasShown, isMobile, isOpen]
  )

  useEffect(() => {
    if (!isMobile && !hasShown) {
      document.addEventListener("mouseleave", handleMouseLeave)
      return () => document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [handleMouseLeave, isMobile, hasShown])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const webhookUrl = process.env.NEXT_PUBLIC_FORM_WEBHOOK_URL

    const payload = {
      type: "exit-intent-lead",
      name: formData.name,
      email: formData.email,
      offer: "AI Readiness Assessment",
      submittedAt: new Date().toISOString(),
      source: "wizard-of-ai-exit-intent",
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
        console.log("Exit intent form submitted (no webhook configured):", payload)
      }

      setSubmitStatus("success")
      setFormData({ name: "", email: "" })

      // Auto-close after 3 seconds on success
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't render on mobile
  if (isMobile) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="relative w-full max-w-lg bg-[#0A4D3C] rounded-2xl shadow-2xl border-2 border-[#D4A84B]/30 overflow-hidden"
            style={{
              boxShadow: "0 0 60px rgba(212, 168, 75, 0.3)",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-[#FDF8E8]/10 hover:bg-[#FDF8E8]/20 transition-colors group"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5 text-[#FDF8E8]/60 group-hover:text-[#FDF8E8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#D4A84B]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#D4A84B]/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative p-8 md:p-10">
              {submitStatus === "success" ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-[#D4A84B]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[#D4A84B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#FDF8E8] mb-2">You're All Set!</h3>
                  <p className="text-[#FDF8E8]/70 mb-4">
                    Check your email for your personalized AI Readiness Assessment guide.
                  </p>
                  <p className="text-[#D4A84B] text-sm">This window will close automatically...</p>
                </motion.div>
              ) : (
                /* Form State */
                <>
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4A84B] to-[#B8860B] rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-[#0A4D3C]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Heading */}
                  <h2 className="text-3xl md:text-4xl font-bold text-[#FDF8E8] text-center mb-3">
                    Wait! Don't Leave Yet
                  </h2>
                  <p className="text-[#D4A84B] text-center text-lg font-semibold mb-2">
                    Get Your AI Readiness Assessment
                  </p>
                  <p className="text-[#FDF8E8]/70 text-center mb-8">
                    Don't leave without your personalized AI strategy. Discover how AI can transform your business in
                    under 15 minutes.
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="exit-modal-name" className="block text-[#FDF8E8]/80 text-sm font-medium mb-2">
                        Your Name
                      </label>
                      <input
                        id="exit-modal-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FDF8E8]/10 border-2 border-[#FDF8E8]/20 rounded-lg text-[#FDF8E8] placeholder-[#FDF8E8]/40 focus:border-[#D4A84B] focus:outline-none transition-colors"
                        placeholder="John Doe"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label htmlFor="exit-modal-email" className="block text-[#FDF8E8]/80 text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        id="exit-modal-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FDF8E8]/10 border-2 border-[#FDF8E8]/20 rounded-lg text-[#FDF8E8] placeholder-[#FDF8E8]/40 focus:border-[#D4A84B] focus:outline-none transition-colors"
                        placeholder="john@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Error Message */}
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
                      >
                        <p className="text-red-400 text-sm">
                          Something went wrong. Please try again or contact us directly.
                        </p>
                      </motion.div>
                    )}

                    {/* CTA Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-[#D4A84B] to-[#B8860B] text-[#0A4D3C] font-bold text-lg rounded-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ boxShadow: "0 0 20px rgba(212, 168, 75, 0.4)" }}
                      whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 30px rgba(212, 168, 75, 0.6)" } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
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
                          Get My Assessment
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </motion.button>

                    {/* Trust element */}
                    <p className="text-[#FDF8E8]/50 text-xs text-center">
                      No spam. Unsubscribe anytime. Your data is secure.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
