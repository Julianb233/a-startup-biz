'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  CheckCircle2,
  PartyPopper,
  Calendar,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Star,
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Suspense } from 'react'

function ResultContent() {
  const searchParams = useSearchParams()
  const isApproved = searchParams.get('approved') === 'true'
  const applicationId = searchParams.get('id')
  const businessName = searchParams.get('name') || 'Partner'

  if (isApproved) {
    return <ApprovedView businessName={businessName} />
  }

  return <CallRequiredView applicationId={applicationId} businessName={businessName} />
}

function ApprovedView({ businessName }: { businessName: string }) {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Confetti Effect */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 3, duration: 1 }}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 500,
                  y: -20,
                  rotate: 0,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
                  rotate: Math.random() * 720 - 360,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  delay: Math.random() * 0.5,
                  ease: 'linear',
                }}
                className={`absolute w-3 h-3 ${
                  ['bg-orange-500', 'bg-yellow-400', 'bg-green-500', 'bg-blue-500', 'bg-pink-500'][
                    Math.floor(Math.random() * 5)
                  ]
                } ${Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm'}`}
              />
            ))}
          </motion.div>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="relative inline-flex items-center justify-center w-28 h-28 mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-full" />
            <CheckCircle2 className="w-14 h-14 text-green-500 relative z-10" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-2"
            >
              <PartyPopper className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              You&apos;re Approved!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Welcome to the partner program, <span className="font-semibold">{businessName}</span>!
              You&apos;re now ready to start earning commissions.
            </p>
          </motion.div>

          {/* What's Next Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-left text-white mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-orange-400" />
              <h2 className="text-xl font-bold">Complete Your Setup (2 min)</h2>
            </div>

            <div className="space-y-4">
              {[
                { step: 1, text: 'Sign partner agreements', done: false },
                { step: 2, text: 'Set up your payment details', done: false },
                { step: 3, text: 'Get your personalized microsite', done: false },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <span className="text-gray-200">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/partner-portal/onboarding/welcome"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
            >
              Complete Your Onboarding
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-gray-500 text-sm mt-4">
              We&apos;ve also sent you an email with these details
            </p>
          </motion.div>

          {/* Benefits Reminder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 grid md:grid-cols-3 gap-4"
          >
            {[
              { icon: Star, label: '10%+ Commission', color: 'text-yellow-500' },
              { icon: Sparkles, label: 'Your Own Microsite', color: 'text-purple-500' },
              { icon: CheckCircle2, label: 'Real-Time Tracking', color: 'text-green-500' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-2 text-gray-600 bg-gray-50 rounded-lg py-3"
                >
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function CallRequiredView({
  applicationId,
  businessName,
}: {
  applicationId: string | null
  businessName: string
}) {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full mb-8"
          >
            <Calendar className="w-12 h-12 text-blue-500" />
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Almost There!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thanks for your interest, {businessName}! Let&apos;s schedule a quick 15-minute call
            to learn more about your business and get you approved.
          </p>

          {/* Call Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-2xl p-8 text-left mb-8"
          >
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-orange-500" />
              What to Expect
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Quick 15-minute chat</p>
                  <p className="text-sm text-gray-600">No long sales pitch, just a friendly conversation</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Same-day approval</p>
                  <p className="text-sm text-gray-600">Most partners are approved on the call</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Personalized setup</p>
                  <p className="text-sm text-gray-600">We&apos;ll tailor the program to your business</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA - Calendar Booking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href={`/get-approved/schedule${applicationId ? `?id=${applicationId}` : ''}`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
            >
              <Calendar className="w-5 h-5" />
              Schedule Your Call
            </Link>

            <p className="text-gray-500 text-sm mt-4">
              Pick a time that works for you - takes 30 seconds
            </p>
          </motion.div>

          {/* Alternative Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-gray-600 mb-4">Prefer to reach out directly?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:partners@astartupbiz.com"
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <Mail className="w-4 h-4" />
                partners@astartupbiz.com
              </a>
              <span className="hidden sm:inline text-gray-300">|</span>
              <a
                href="tel:+19498064468"
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <Phone className="w-4 h-4" />
                949-806-4468
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default function ResultPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth min-h-screen">
      <Header />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        }
      >
        <ResultContent />
      </Suspense>
      <Footer />
    </main>
  )
}
