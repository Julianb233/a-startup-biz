'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Rocket,
  CheckCircle2,
  Share2,
  BarChart3,
  BookOpen,
  ArrowRight,
  Copy,
  ExternalLink,
  Sparkles,
  PartyPopper,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { OnboardingLayout } from '@/components/partner/OnboardingLayout'

interface PartnerData {
  companyName: string
  firstName: string
  commissionRate: number
  micrositeUrl: string | null
  micrositeSlug: string | null
}

export default function CompletePage() {
  const router = useRouter()
  const [partnerData, setPartnerData] = useState<PartnerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [confettiShown, setConfettiShown] = useState(false)

  useEffect(() => {
    fetchPartnerData()
  }, [])

  useEffect(() => {
    // Trigger confetti animation once
    if (!confettiShown && !loading) {
      setConfettiShown(true)
    }
  }, [loading, confettiShown])

  const fetchPartnerData = async () => {
    try {
      const response = await fetch('/api/partner/onboarding-status')
      if (!response.ok) {
        throw new Error('Failed to fetch partner data')
      }
      const data = await response.json()

      if (data.success) {
        setPartnerData({
          companyName: data.partner?.company_name || 'Partner',
          firstName: data.partner?.first_name || 'there',
          commissionRate: data.partner?.commission_rate || 10,
          micrositeUrl: data.microsite?.slug ? `${window.location.origin}/p/${data.microsite.slug}` : null,
          micrositeSlug: data.microsite?.slug || null,
        })
      }
    } catch (error) {
      console.error('Error fetching partner data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyMicrositeUrl = async () => {
    if (partnerData?.micrositeUrl) {
      await navigator.clipboard.writeText(partnerData.micrositeUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const quickActions = [
    {
      icon: <Share2 className="h-5 w-5" />,
      title: 'Share Your Link',
      description: 'Start sharing your personalized microsite with potential customers.',
      href: partnerData?.micrositeUrl || '#',
      external: true,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: 'View Dashboard',
      description: 'Track your leads, conversions, and earnings in real-time.',
      href: '/partner-portal/dashboard',
      external: false,
      color: 'bg-green-50 text-green-600 border-green-100',
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: 'Partner Resources',
      description: 'Access marketing materials, sales guides, and training.',
      href: '/partner-portal/resources',
      external: false,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ]

  if (loading) {
    return (
      <OnboardingLayout currentStep={3}>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout currentStep={3}>
      {/* Confetti Effect */}
      {confettiShown && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: window.innerHeight + 20,
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
      )}

      {/* Hero Section */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full mb-6"
        >
          <Rocket className="h-12 w-12 text-orange-600" />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1"
          >
            <CheckCircle2 className="h-5 w-5 text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <PartyPopper className="h-6 w-6 text-orange-500" />
            <span className="text-orange-600 font-semibold">Onboarding Complete!</span>
            <PartyPopper className="h-6 w-6 text-orange-500 transform scale-x-[-1]" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            You&apos;re All Set, {partnerData?.firstName}!
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Congratulations! Your partner account is now fully activated. You&apos;re ready
            to start earning {partnerData?.commissionRate}% commission on every referral.
          </p>
        </motion.div>
      </div>

      {/* Microsite Card */}
      {partnerData?.micrositeUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">Your Personalized Microsite</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Share this link with your network to start earning commissions.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 bg-white/10 rounded-lg px-4 py-3 font-mono text-sm truncate">
                      {partnerData.micrositeUrl}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyMicrositeUrl}
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Link href={partnerData.micrositeUrl} target="_blank">
                        <Button
                          variant="secondary"
                          className="bg-orange-500 hover:bg-orange-600 text-white border-0"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* What's Next Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What&apos;s Next?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Link
                href={action.href}
                target={action.external ? '_blank' : undefined}
                className="block h-full"
              >
                <Card className="h-full hover:shadow-md transition-shadow border-gray-200 hover:border-gray-300">
                  <CardContent className="p-5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${action.color}`}>
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Completed Setup
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Partner agreements signed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Payment details configured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Microsite published</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Button
          onClick={() => router.push('/partner-portal/dashboard')}
          size="lg"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/30"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Need help? Our partner success team is just an email away.
        </p>
      </motion.div>
    </OnboardingLayout>
  )
}
