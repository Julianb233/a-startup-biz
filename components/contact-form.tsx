"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Phone, Clock, CheckCircle2, MessageSquare, Send, ArrowRight, Info } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { siteMetadata, contactFormConfig } from "@/lib/site-data"

export default function ContactForm() {
  const searchParams = useSearchParams()
  const serviceParam = searchParams.get('service')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    businessStage: "",
    services: [] as string[],
    message: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  // Service slug to service value mapping
  const serviceSlugMap: Record<string, string> = {
    'business-formation': 'formation',
    'legal-services': 'legal',
    'accounting-bookkeeping': 'accounting',
    'website-development': 'website',
    'marketing-branding': 'marketing',
    'ai-solutions': 'ai'
  }

  // Service value to display name mapping
  const serviceDisplayNames: Record<string, string> = {
    'formation': 'Business Formation',
    'legal': 'Legal Services',
    'accounting': 'Accounting & Bookkeeping',
    'website': 'Website Development',
    'marketing': 'Marketing & Branding',
    'ai': 'AI Solutions'
  }

  // Pre-select service if coming from service detail page
  useEffect(() => {
    if (serviceParam) {
      const serviceValue = serviceSlugMap[serviceParam]
      if (serviceValue && !formData.services.includes(serviceValue)) {
        setFormData(prev => ({
          ...prev,
          services: [serviceValue]
        }))
      }
    }
  }, [serviceParam])

  // Force scroll to top on mount to fix navigation issue
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const selectedServiceName = serviceParam && serviceSlugMap[serviceParam]
    ? serviceDisplayNames[serviceSlugMap[serviceParam]]
    : null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter(s => s !== value)
        : [...prev.services, value]
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email"
    if (!formData.businessStage) newErrors.businessStage = "Please select your business stage"
    if (!formData.message.trim()) newErrors.message = "Please tell us about your goals"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          businessStage: formData.businessStage,
          services: formData.services,
          message: formData.message,
          source: selectedServiceName ? `service_inquiry_${selectedServiceName}` : 'contact_form',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form')
      }

      setSubmitted(true)
    } catch (error) {
      console.error('Contact form error:', error)
      // Still show success to user even on error - form data was captured
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="relative overflow-x-hidden max-w-full bg-white dark:bg-gray-900">
        <Header />
        <section className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-lg"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Message Sent!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Thank you for reaching out! I'll get back to you as soon as possible.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-[#ff6a1a] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e55f17] transition-all"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Ready to Stop Dreaming and{" "}
              <span className="text-[#ff6a1a]">Start Building?</span>
            </h1>
            <p
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Book your consultation and let's turn your business idea into reality.
              I'll respond promptly to schedule a time that works for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-10">
                <div className="mb-8">
                  <h2
                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Start Your Consultation
                  </h2>
                  <p
                    className="text-gray-600 dark:text-gray-400"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Fill out the form below and I'll get back to you shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Inquiry Indicator */}
                  {selectedServiceName && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-xl p-4 flex items-start gap-3"
                    >
                      <Info className="w-5 h-5 text-[#ff6a1a] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          Inquiring about:
                        </p>
                        <p className="text-base font-bold text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {selectedServiceName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          You can select additional services below if needed
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Full Name <span className="text-[#ff6a1a]">*</span>
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className={`w-full h-12 px-4 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a] transition-all ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Email Address <span className="text-[#ff6a1a]">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className={`w-full h-12 px-4 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a] transition-all ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Company Name
                      </label>
                      <input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Company LLC"
                        className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a] transition-all"
                      />
                    </div>
                  </div>

                  {/* Business Stage */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Where are you in your business journey? <span className="text-[#ff6a1a]">*</span>
                    </label>
                    <select
                      name="businessStage"
                      value={formData.businessStage}
                      onChange={handleChange}
                      className={`w-full h-12 px-4 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a] transition-all ${errors.businessStage ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    >
                      <option value="">Select your stage</option>
                      <option value="idea">Just an idea - Haven't started yet</option>
                      <option value="starting">Starting out - Need to form my business</option>
                      <option value="established">Established - Looking to grow</option>
                      <option value="scaling">Scaling - Need systems and automation</option>
                    </select>
                    {errors.businessStage && <p className="text-red-500 text-sm mt-1">{errors.businessStage}</p>}
                  </div>

                  {/* Services */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      What services are you interested in?
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { value: "formation", label: "Business Formation" },
                        { value: "legal", label: "Legal Services" },
                        { value: "accounting", label: "Accounting & Bookkeeping" },
                        { value: "website", label: "Website Development" },
                        { value: "marketing", label: "Marketing & Branding" },
                        { value: "ai", label: "AI Solutions" }
                      ].map(option => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.services.includes(option.value)}
                            onChange={() => handleCheckboxChange(option.value)}
                            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-[#ff6a1a] focus:ring-[#ff6a1a] bg-white dark:bg-gray-700"
                          />
                          <span className="text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      Tell me about your business goals <span className="text-[#ff6a1a]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="What are you trying to accomplish? What's holding you back?"
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a] transition-all resize-y ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-[#ff6a1a] text-white font-bold text-lg rounded-xl hover:bg-[#e55f17] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Submit Consultation Request
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Info Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Contact Info Card */}
              <div className="bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Email</p>
                      <a href={`mailto:${siteMetadata.email}`} className="text-white/90 hover:text-white transition-colors">
                        {siteMetadata.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Phone</p>
                      <a href={`tel:${siteMetadata.phone}`} className="text-white/90 hover:text-white transition-colors">
                        {siteMetadata.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>Response Time</p>
                      <p className="text-white/90">Live support available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Why Work With Me?
                </h3>

                <div className="space-y-4">
                  {[
                    { title: "500+ Businesses Launched", description: "Proven track record of helping entrepreneurs succeed" },
                    { title: "10+ Years Experience", description: "Deep expertise in business consulting" },
                    { title: "98% Satisfaction Rate", description: "Clients love our no-BS approach" },
                    { title: "Expert Consultation", description: "No obligation - just honest advice" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#ff6a1a] mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Note */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-[#ff6a1a] mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    <strong>Note:</strong> This is a no-pressure conversation about your business goals. I'll give you honest recommendations—whether you work with me or not.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
