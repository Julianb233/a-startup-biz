'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, Clock, DollarSign, Mail, Phone, Sparkles, TrendingUp, User, AlertCircle } from 'lucide-react'

export default function BookCallPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessIdea: '',
    currentStage: '',
    fundingAvailable: '',
    timeline: '',
    biggestChallenge: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const included = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Pre-Call Questionnaire',
      description: 'We\'ll understand your situation before we meet'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: '30-Minute Focused Consultation',
      description: 'Direct Zoom call with Tory - no sales pitch'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Honest Assessment',
      description: 'Good or bad, you\'ll get the truth about your idea'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Detailed Follow-Up Email',
      description: 'Written insights and recommendations you can reference'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: '46+ Years of Experience',
      description: 'Actionable advice from someone who\'s been there'
    }
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-premium-orange p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Application Received!
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Thank you, {formData.fullName}. We&apos;ve received your application for the $1,000 Clarity Call.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-black mb-3">What Happens Next:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                <p className="text-gray-700">We&apos;ll review your application within 24 hours</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                <p className="text-gray-700">If we&apos;re a good fit, you&apos;ll receive a pre-call questionnaire</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                <p className="text-gray-700">You&apos;ll get a calendar link to schedule your 30-minute call</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">4</div>
                <p className="text-gray-700">Payment details will be sent before the scheduled call</p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            Check your email at <strong className="text-black">{formData.email}</strong> for updates.
          </p>

          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Return to Home
          </motion.a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-50" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-3 rounded-full mb-6 border border-orange-200"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Limited Availability</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight"
          >
            The <span className="text-orange-gradient">$1,000 Investment</span> That Pays for Itself
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Get 30 minutes of brutally honest, experience-backed advice that could save you from costly mistakes or bankruptcy.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 text-gray-700"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>30 Minutes</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <span>$1,000</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span>46+ Years Experience</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* What's Included Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center text-black mb-4"
          >
            What&apos;s Included
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto"
          >
            This isn&apos;t a sales call. It&apos;s a genuine consultation designed to give you clarity.
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-premium hover:shadow-premium-hover transition-all duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Note */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 md:p-12 text-white shadow-premium-orange"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                This Could Save You from Bankruptcy
              </h3>
              <p className="text-xl text-white/90 leading-relaxed">
                Many entrepreneurs waste years and tens of thousands of dollars on ideas that were doomed from the start.
                <strong className="block mt-3 text-white">For $1,000, you&apos;ll know if your idea is worth pursuing - or if you should pivot before it&apos;s too late.</strong>
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4" id="apply">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Apply for Your Clarity Call
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and we&apos;ll be in touch within 24 hours
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-premium-orange p-8 md:p-10 space-y-6"
          >
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="John Smith"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number <span className="text-orange-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Business Idea */}
            <div>
              <label htmlFor="businessIdea" className="block text-sm font-semibold text-gray-700 mb-2">
                Business Idea (Brief Description) <span className="text-orange-500">*</span>
              </label>
              <textarea
                id="businessIdea"
                name="businessIdea"
                required
                value={formData.businessIdea}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                placeholder="Briefly describe your business idea..."
              />
            </div>

            {/* Current Stage */}
            <div>
              <label htmlFor="currentStage" className="block text-sm font-semibold text-gray-700 mb-2">
                Current Stage <span className="text-orange-500">*</span>
              </label>
              <select
                id="currentStage"
                name="currentStage"
                required
                value={formData.currentStage}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
              >
                <option value="">Select current stage...</option>
                <option value="idea">Idea Stage</option>
                <option value="planning">Planning Stage</option>
                <option value="early">Early Stage</option>
                <option value="established">Established</option>
              </select>
            </div>

            {/* Funding Available */}
            <div>
              <label htmlFor="fundingAvailable" className="block text-sm font-semibold text-gray-700 mb-2">
                Funding Available <span className="text-orange-500">*</span>
              </label>
              <select
                id="fundingAvailable"
                name="fundingAvailable"
                required
                value={formData.fundingAvailable}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all bg-white"
              >
                <option value="">Select funding range...</option>
                <option value="under-10k">Under $10,000</option>
                <option value="10k-50k">$10,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k-plus">$100,000+</option>
              </select>
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-semibold text-gray-700 mb-2">
                When Do You Want to Launch? <span className="text-orange-500">*</span>
              </label>
              <input
                type="text"
                id="timeline"
                name="timeline"
                required
                value={formData.timeline}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                placeholder="e.g., 3 months, 6 months, 1 year"
              />
            </div>

            {/* Biggest Challenge */}
            <div>
              <label htmlFor="biggestChallenge" className="block text-sm font-semibold text-gray-700 mb-2">
                What&apos;s Your Biggest Challenge? <span className="text-orange-500">*</span>
              </label>
              <textarea
                id="biggestChallenge"
                name="biggestChallenge"
                required
                value={formData.biggestChallenge}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                placeholder="What's keeping you up at night about this business?"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Apply for Your Clarity Call'
              )}
            </motion.button>

            <p className="text-sm text-gray-500 text-center">
              By submitting this form, you agree to be contacted about the Clarity Call program.
            </p>
          </motion.form>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 px-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Our Commitment to You
          </h2>

          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            If you don&apos;t get at least one actionable insight that could save or make you thousands of dollars, we&apos;ll refund your $1,000. No questions asked.
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-premium inline-block">
            <p className="text-2xl font-bold text-orange-500 mb-2">
              100% Satisfaction Guarantee
            </p>
            <p className="text-gray-600">
              Because we&apos;re confident in the value we provide
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
