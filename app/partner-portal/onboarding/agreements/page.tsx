'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertCircle,
  Clock,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { OnboardingLayout } from '@/components/partner/OnboardingLayout'

interface Agreement {
  id: string
  type: string
  title: string
  version: string
  content: string
  summary: string | null
  isRequired: boolean
  isSigned: boolean
  signedAt: string | null
}

interface Progress {
  total: number
  signed: number
  remaining: number
  allSigned: boolean
}

export default function AgreementsPage() {
  const router = useRouter()
  const [agreements, setAgreements] = useState<Agreement[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [signingId, setSigningId] = useState<string | null>(null)
  const [checkedAgreements, setCheckedAgreements] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAgreements()
  }, [])

  const fetchAgreements = async () => {
    try {
      const response = await fetch('/api/partner/agreements')
      if (!response.ok) throw new Error('Failed to fetch agreements')
      const data = await response.json()
      setAgreements(data.agreements)
      setProgress(data.progress)

      // Auto-expand first unsigned agreement
      const firstUnsigned = data.agreements.find((a: Agreement) => !a.isSigned)
      if (firstUnsigned) {
        setExpandedId(firstUnsigned.id)
      }
    } catch {
      setError('Failed to load agreements')
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async (agreementId: string) => {
    if (!checkedAgreements.has(agreementId)) return

    setSigningId(agreementId)

    try {
      const response = await fetch('/api/partner/agreements/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementId,
          signatureText: 'I have read and agree to the terms and conditions',
        }),
      })

      if (!response.ok) throw new Error('Failed to sign agreement')

      const data = await response.json()

      // Update local state
      setAgreements((prev) =>
        prev.map((a) =>
          a.id === agreementId
            ? { ...a, isSigned: true, signedAt: new Date().toISOString() }
            : a
        )
      )

      if (data.allAgreementsSigned) {
        // All agreements signed, redirect to payment
        setTimeout(() => {
          router.push('/partner-portal/onboarding/payment')
        }, 1500)
      } else {
        // Expand next unsigned agreement
        const nextUnsigned = agreements.find(
          (a) => a.id !== agreementId && !a.isSigned
        )
        if (nextUnsigned) {
          setExpandedId(nextUnsigned.id)
        }
        fetchAgreements()
      }
    } catch {
      setError('Failed to sign agreement. Please try again.')
    } finally {
      setSigningId(null)
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const toggleChecked = (id: string) => {
    setCheckedAgreements((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  if (loading) {
    return (
      <OnboardingLayout currentStep={1}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </OnboardingLayout>
    )
  }

  if (error && !agreements.length) {
    return (
      <OnboardingLayout currentStep={1}>
        <div className="text-center py-20">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout currentStep={1}>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"
        >
          <FileText className="h-8 w-8 text-orange-600" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Partner Agreements
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Please review and sign the following agreements. Take your time - these documents
          outline our partnership terms and your earning potential.
        </p>
      </div>

      {/* Progress Card */}
      {progress && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-6 border border-orange-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">
                {progress.signed} of {progress.total} agreements signed
              </span>
            </div>
            <span className="text-sm text-orange-600 font-medium">
              {progress.remaining === 0 ? 'All complete!' : `${progress.remaining} remaining`}
            </span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.signed / progress.total) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Quick tip for reviewing</p>
            <p className="text-blue-700">
              Click on each agreement to expand and read the full terms. You must check
              the acknowledgment box before you can sign.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Agreements List */}
      <div className="space-y-4">
        {agreements.map((agreement, index) => (
          <motion.div
            key={agreement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card
              className={`overflow-hidden transition-all duration-300 ${
                agreement.isSigned
                  ? 'border-green-200 bg-green-50/30'
                  : expandedId === agreement.id
                    ? 'border-orange-200 shadow-lg shadow-orange-100/50'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Agreement Header */}
              <div
                className={`p-5 cursor-pointer ${!agreement.isSigned ? 'hover:bg-gray-50' : ''}`}
                onClick={() => !agreement.isSigned && toggleExpanded(agreement.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 mt-0.5 ${
                      agreement.isSigned ? 'text-green-600' : 'text-gray-300'
                    }`}>
                      {agreement.isSigned ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{agreement.title}</h3>
                        {agreement.isRequired && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      {agreement.summary && (
                        <p className="text-sm text-gray-500 mt-1">{agreement.summary}</p>
                      )}
                      {agreement.isSigned && agreement.signedAt && (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Signed on {new Date(agreement.signedAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  {!agreement.isSigned && (
                    <div className="text-gray-400">
                      {expandedId === agreement.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === agreement.id && !agreement.isSigned && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="pt-0 pb-5 px-5">
                      {/* Agreement Content */}
                      <div
                        className="prose prose-sm max-w-none bg-white border border-gray-200 rounded-lg p-5 max-h-80 overflow-y-auto mb-5 shadow-inner"
                        dangerouslySetInnerHTML={{ __html: agreement.content }}
                      />

                      {/* Signature Section */}
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <div className="flex items-start gap-3 mb-5">
                          <Checkbox
                            id={`agree-${agreement.id}`}
                            checked={checkedAgreements.has(agreement.id)}
                            onCheckedChange={() => toggleChecked(agreement.id)}
                            className="mt-0.5"
                          />
                          <label
                            htmlFor={`agree-${agreement.id}`}
                            className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                          >
                            I have carefully read and understand the {agreement.title}. I agree to
                            be bound by its terms and conditions. I understand this constitutes a
                            legally binding agreement.
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Shield className="h-4 w-4" />
                            <span>Secured with timestamp and IP verification</span>
                          </div>
                          <Button
                            onClick={() => handleSign(agreement.id)}
                            disabled={!checkedAgreements.has(agreement.id) || signingId === agreement.id}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            {signingId === agreement.id ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Signing...
                              </>
                            ) : (
                              'Sign Agreement'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* All Signed Success State */}
      <AnimatePresence>
        {progress?.allSigned && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              All Agreements Signed!
            </h2>
            <p className="text-gray-600 mb-6">
              Excellent! You&apos;ve completed all required agreements. Let&apos;s set up how
              you&apos;ll receive your commission payments.
            </p>
            <Button
              onClick={() => router.push('/partner-portal/onboarding/payment')}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600"
            >
              Continue to Payment Setup
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
        >
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </motion.div>
      )}
    </OnboardingLayout>
  )
}
