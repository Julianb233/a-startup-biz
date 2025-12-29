'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Gift,
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { OnboardingLayout } from '@/components/partner/OnboardingLayout'

interface PartnerData {
  companyName: string
  firstName: string
  commissionRate: number
  micrositeUrl: string | null
}

export default function WelcomePage() {
  const router = useRouter()
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPartnerData()
  }, [])

  const fetchPartnerData = async () => {
    try {
      const response = await fetch('/api/partner/onboarding-status')
      if (response.ok) {
        const data = await response.json()
        setPartnerData({
          companyName: data.partner?.company_name || 'Partner',
          firstName: data.partner?.first_name || 'there',
          commissionRate: data.partner?.commission_rate || 10,
          micrositeUrl: data.microsite?.slug ? `/p/${data.microsite.slug}` : null,
        })
      }
    } catch (error) {
      console.error('Error fetching partner data:', error)
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Earn Generous Commissions',
      description: `Earn ${partnerData?.commissionRate || 10}% on every successful referral that converts to a paying customer.`,
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Your Personalized Microsite',
      description: 'We\'ve created a custom landing page just for you to share with your network.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Dedicated Partner Support',
      description: 'Our partner success team is here to help you succeed every step of the way.',
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: 'Marketing Resources',
      description: 'Access exclusive marketing materials, co-branded content, and sales tools.',
    },
  ]

  const nextSteps = [
    { step: 1, title: 'Sign Partner Agreements', time: '~5 minutes' },
    { step: 2, title: 'Set Up Payment Details', time: '~3 minutes' },
    { step: 3, title: 'Start Sharing & Earning', time: 'Immediately' },
  ]

  if (loading) {
    return (
      <OnboardingLayout currentStep={0}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout currentStep={0}>
      {/* Welcome Hero */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-6"
        >
          <Sparkles className="h-10 w-10 text-orange-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to the Partnership, {partnerData?.firstName || 'Partner'}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re thrilled to have {partnerData?.companyName} join our partner network.
            Let&apos;s get you set up so you can start earning.
          </p>
        </motion.div>
      </div>

      {/* Benefits Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-2 gap-4 mb-12"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                {benefit.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* What's Next Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white"
      >
        <div className="flex items-center gap-3 mb-6">
          <Star className="h-6 w-6 text-orange-400" />
          <h2 className="text-xl font-semibold">Quick Setup - Just 3 Simple Steps</h2>
        </div>

        <div className="space-y-4">
          {nextSteps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center gap-4 bg-white/10 rounded-lg p-4"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {item.step}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
              </div>
              <div className="text-sm text-gray-400">{item.time}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <span>Total time: Less than 10 minutes to complete setup</span>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="text-center"
      >
        <Button
          onClick={() => router.push('/partner-portal/onboarding/agreements')}
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:shadow-xl hover:shadow-orange-500/40"
        >
          Let&apos;s Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          You can save your progress and return at any time
        </p>
      </motion.div>
    </OnboardingLayout>
  )
}
