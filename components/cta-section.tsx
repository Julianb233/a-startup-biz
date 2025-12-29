'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Mail, Phone, Building2, User, MessageSquare, Calendar, Send, ClipboardList } from 'lucide-react';
import Link from 'next/link';

type FormData = {
  name: string;
  email: string;
  phone: string;
  businessType: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const businessTypes = [
    'Startup',
    'Small Business',
    'E-commerce',
    'SaaS',
    'Consulting',
    'Agency',
    'Retail',
    'Restaurant/Food Service',
    'Professional Services',
    'Other',
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

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
          businessStage: formData.businessType,
          services: [],
          message: formData.message,
          source: 'cta_section',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessType: '',
        message: '',
      });
      setErrors({});
    } catch (error) {
      console.error('CTA form error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] py-24 sm:py-32 overflow-hidden"
    >
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-[#ff6a1a]/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-[#ff6a1a]/5 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20">
              <div className="w-2 h-2 rounded-full bg-[#ff6a1a] animate-pulse" />
              <span className="text-sm font-medium text-[#ff6a1a]">
                Ready to Transform Your Business?
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Stop Dreaming.{' '}
            <span className="bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] bg-clip-text text-transparent">
              Start Building.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            The gap between where you are and where you want to be is action.
            Take the first step today and turn your vision into reality.
          </motion.p>
        </motion.div>

        {/* Two-Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Choose Your Path
              </h3>
              <p className="text-gray-400 mb-8">
                Ready to move forward? Pick the option that works best for you.
              </p>
            </div>

            {/* Get Started Card - Primary CTA */}
            <Link href="/onboarding">
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-[#ff6a1a]/10 to-[#ff8c4a]/5 border-2 border-[#ff6a1a]/40 rounded-2xl p-8 hover:border-[#ff6a1a] transition-all duration-300">
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-[#ff6a1a] text-white text-xs font-bold rounded-full">
                      RECOMMENDED
                    </span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6a1a] to-[#ff8c4a] flex items-center justify-center shadow-lg shadow-[#ff6a1a]/30">
                      <ClipboardList className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">
                        Start Your Onboarding
                      </h4>
                      <p className="text-gray-300 mb-4">
                        Complete our quick intake form to get a customized action plan.
                        We&apos;ll analyze your needs and create your success roadmap.
                      </p>
                      <span className="inline-flex items-center gap-2 text-[#ff6a1a] font-semibold group-hover:gap-3 transition-all duration-300">
                        Get Started Now
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Book a Call Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#c0c0c0]/20 rounded-2xl p-8 hover:border-[#ff6a1a]/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6a1a] to-[#ff8c4a] flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">
                      Book a Strategy Call
                    </h4>
                    <p className="text-gray-400 mb-4">
                      Get personalized guidance in a 30-minute strategy call.
                      No pressure, just clarity.
                    </p>
                    <a
                      href="tel:+1234567890"
                      className="inline-flex items-center gap-2 text-[#ff6a1a] font-semibold hover:gap-3 transition-all duration-300"
                    >
                      Schedule Now
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Email Us Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#c0c0c0]/20 rounded-2xl p-8 hover:border-[#ff6a1a]/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6a1a] to-[#ff8c4a] flex items-center justify-center">
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">
                      Email Us Directly
                    </h4>
                    <p className="text-gray-400 mb-4">
                      Prefer to write? Send us your questions and we'll respond promptly.
                    </p>
                    <a
                      href="mailto:contact@astartupbiz.com"
                      className="inline-flex items-center gap-2 text-[#ff6a1a] font-semibold hover:gap-3 transition-all duration-300"
                    >
                      contact@astartupbiz.com
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-sm">Strategy Call</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-sm">No Obligation</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <span className="text-sm">Quick Response</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] rounded-3xl blur-2xl opacity-10" />
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#c0c0c0]/20 rounded-3xl p-8 sm:p-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
                Or Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#0f0f0f] border ${
                        errors.name ? 'border-red-500' : 'border-[#c0c0c0]/30'
                      } rounded-xl text-white placeholder-gray-500 focus:border-[#ff6a1a] focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 transition-all duration-300`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#0f0f0f] border ${
                        errors.email ? 'border-red-500' : 'border-[#c0c0c0]/30'
                      } rounded-xl text-white placeholder-gray-500 focus:border-[#ff6a1a] focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 transition-all duration-300`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#0f0f0f] border ${
                        errors.phone ? 'border-red-500' : 'border-[#c0c0c0]/30'
                      } rounded-xl text-white placeholder-gray-500 focus:border-[#ff6a1a] focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 transition-all duration-300`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Business Type Select */}
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-2">
                    Business Type *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10" />
                    <select
                      id="businessType"
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#0f0f0f] border ${
                        errors.businessType ? 'border-red-500' : 'border-[#c0c0c0]/30'
                      } rounded-xl text-white focus:border-[#ff6a1a] focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 transition-all duration-300 appearance-none cursor-pointer`}
                    >
                      <option value="" className="bg-[#1a1a1a]">Select your business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type} className="bg-[#1a1a1a]">
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.businessType && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.businessType}</p>
                  )}
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Tell Us About Your Business *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={5}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#0f0f0f] border ${
                        errors.message ? 'border-red-500' : 'border-[#c0c0c0]/30'
                      } rounded-xl text-white placeholder-gray-500 focus:border-[#ff6a1a] focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 transition-all duration-300 resize-none`}
                      placeholder="What challenges are you facing? What are your goals?"
                    />
                  </div>
                  {errors.message && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group overflow-hidden rounded-xl py-4 font-semibold text-white shadow-lg shadow-[#ff6a1a]/20 hover:shadow-[#ff6a1a]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a1a] to-[#ff8c4a] transition-transform duration-300 group-hover:scale-105" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center"
                  >
                    Message sent successfully! We'll get back to you soon.
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center"
                  >
                    Something went wrong. Please try again or email us directly.
                  </motion.div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
