'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2,
  Mail,
  Phone,
  Briefcase,
  Users,
  Globe,
  ArrowRight,
  Loader2,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

const businessTypes = [
  { value: 'accountant', label: 'Accountant / CPA' },
  { value: 'financial_advisor', label: 'Financial Advisor' },
  { value: 'insurance_agent', label: 'Insurance Agent' },
  { value: 'real_estate', label: 'Real Estate Professional' },
  { value: 'attorney', label: 'Attorney / Law Firm' },
  { value: 'consultant', label: 'Consultant / Coach' },
  { value: 'marketing', label: 'Marketing Agency' },
  { value: 'technology', label: 'Technology Provider' },
  { value: 'other', label: 'Other' },
]

const referralOptions = [
  { value: '1-5', label: '1-5 per month' },
  { value: '5-10', label: '5-10 per month' },
  { value: '10-20', label: '10-20 per month' },
  { value: '20+', label: '20+ per month' },
]

export default function GetApprovedPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    monthlyReferrals: '',
    website: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const isValid =
    formData.businessName &&
    formData.email &&
    formData.phone &&
    formData.businessType &&
    formData.monthlyReferrals

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/partner/instant-approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.error === 'already_partner') {
          setError('You\'re already a partner! Log in to your portal.')
          return
        }
        if (result.error === 'pending_application') {
          setError('Your application is already being reviewed!')
          return
        }
        throw new Error(result.error || 'Failed to submit application')
      }

      // Redirect to result page with the outcome
      const params = new URLSearchParams({
        approved: result.data.approved ? 'true' : 'false',
        id: result.data.applicationId,
        name: formData.businessName,
      })

      router.push(`/get-approved/result?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth">
      <Header />

      <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Get Approved in 60 Seconds
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Start Earning{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  Commission Today
                </span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Most partners are approved instantly. Fill out 5 quick fields and find out in seconds.
              </p>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-gray-600"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>60-second application</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>No credit check</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>99% approval rate</span>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1: Business Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        placeholder="Your Company Name"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@company.com"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone & Website */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="(555) 123-4567"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://yoursite.com"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Business Type & Referrals */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Type
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-900 bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Select your industry</option>
                        {businessTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expected Referrals
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="monthlyReferrals"
                        value={formData.monthlyReferrals}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-gray-900 bg-white appearance-none cursor-pointer"
                      >
                        <option value="">How many referrals?</option>
                        {referralOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking Eligibility...
                    </>
                  ) : (
                    <>
                      Get Approved Now
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Fine Print */}
                <p className="text-center text-sm text-gray-500">
                  By submitting, you agree to our{' '}
                  <a href="/terms" className="text-orange-600 hover:underline">
                    Terms
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-orange-600 hover:underline">
                    Privacy Policy
                  </a>
                  . No payment required.
                </p>
              </form>
            </motion.div>

            {/* Benefits Below Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid md:grid-cols-3 gap-6"
            >
              {[
                {
                  title: 'Earn 10%+ Commission',
                  description: 'On every successful referral you send our way',
                },
                {
                  title: 'Your Own Microsite',
                  description: 'Get a branded landing page to share with clients',
                },
                {
                  title: 'Real-Time Tracking',
                  description: 'See your leads and earnings in the partner portal',
                },
              ].map((benefit, index) => (
                <div
                  key={benefit.title}
                  className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100"
                >
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
