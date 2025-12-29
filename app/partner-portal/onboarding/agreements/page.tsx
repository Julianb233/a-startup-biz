'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  FileText,
  CheckCircle2,
  Circle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

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
  const [checkedAgreements, setCheckedAgreements] = useState<Set<string>>(
    new Set()
  )

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
    } catch {
      setError('Failed to load agreements')
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async (agreementId: string) => {
    if (!checkedAgreements.has(agreementId)) {
      return
    }

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
        router.push('/partner-portal/onboarding/payment')
      } else {
        // Refresh to get updated progress
        fetchAgreements()
      }
    } catch {
      setError('Failed to sign agreement')
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Partner Agreements
          </h1>
          <p className="text-gray-600">
            Please review and sign the following agreements to complete your
            onboarding.
          </p>
        </div>

        {/* Progress */}
        {progress && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {progress.signed} of {progress.total} signed
              </span>
              <span className="text-sm text-gray-500">
                {progress.remaining} remaining
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{
                  width: `${(progress.signed / progress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Agreements */}
        <div className="space-y-4">
          {agreements.map((agreement) => (
            <Card
              key={agreement.id}
              className={`transition-all ${
                agreement.isSigned
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-gray-200'
              }`}
            >
              <CardHeader
                className="cursor-pointer"
                onClick={() => !agreement.isSigned && toggleExpanded(agreement.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {agreement.isSigned ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-300 mt-0.5" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{agreement.title}</CardTitle>
                      {agreement.summary && (
                        <p className="text-sm text-gray-500 mt-1">
                          {agreement.summary}
                        </p>
                      )}
                      {agreement.isSigned && agreement.signedAt && (
                        <p className="text-sm text-green-600 mt-1">
                          Signed on{' '}
                          {new Date(agreement.signedAt).toLocaleDateString()}
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
              </CardHeader>

              {expandedId === agreement.id && !agreement.isSigned && (
                <CardContent className="pt-0">
                  {/* Agreement Content */}
                  <div
                    className="prose prose-sm max-w-none bg-white border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto mb-4"
                    dangerouslySetInnerHTML={{ __html: agreement.content }}
                  />

                  {/* Signature Section */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3 mb-4">
                      <Checkbox
                        id={`agree-${agreement.id}`}
                        checked={checkedAgreements.has(agreement.id)}
                        onCheckedChange={() => toggleChecked(agreement.id)}
                      />
                      <label
                        htmlFor={`agree-${agreement.id}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        I have read and agree to the terms and conditions of this{' '}
                        {agreement.title}. I understand that this is a legally
                        binding agreement.
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Shield className="h-4 w-4" />
                        <span>Your signature will be recorded with timestamp and IP</span>
                      </div>
                      <Button
                        onClick={() => handleSign(agreement.id)}
                        disabled={
                          !checkedAgreements.has(agreement.id) ||
                          signingId === agreement.id
                        }
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
              )}
            </Card>
          ))}
        </div>

        {/* All Signed */}
        {progress?.allSigned && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              All Agreements Signed!
            </h2>
            <p className="text-gray-600 mb-6">
              You&apos;ve completed all required agreements. Continue to set up your
              payment details.
            </p>
            <Button
              onClick={() => router.push('/partner-portal/onboarding/payment')}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Continue to Payment Details
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
