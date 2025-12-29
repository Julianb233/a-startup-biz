'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Building2,
  Loader2,
  AlertCircle,
  Lock,
  Shield,
  Info,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OnboardingLayout } from '@/components/partner/OnboardingLayout'

interface BankDetails {
  accountHolderName: string
  bankName: string
  accountType: string
  accountNumberLast4: string
  isVerified: boolean
}

interface FormData {
  accountHolderName: string
  bankName: string
  routingNumber: string
  accountNumber: string
  confirmAccountNumber: string
  accountType: 'checking' | 'savings'
}

export default function PaymentDetailsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [existingDetails, setExistingDetails] = useState<BankDetails | null>(null)
  const [formData, setFormData] = useState<FormData>({
    accountHolderName: '',
    bankName: '',
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: '',
    accountType: 'checking',
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [showRoutingHelp, setShowRoutingHelp] = useState(false)

  useEffect(() => {
    fetchBankDetails()
  }, [])

  const fetchBankDetails = async () => {
    try {
      const response = await fetch('/api/partner/bank-details')
      if (!response.ok) throw new Error('Failed to fetch bank details')
      const data = await response.json()

      if (data.hasBankDetails) {
        setExistingDetails(data.bankDetails)
        setFormData((prev) => ({
          ...prev,
          accountHolderName: data.bankDetails.accountHolderName || '',
          bankName: data.bankDetails.bankName || '',
          accountType: data.bankDetails.accountType || 'checking',
        }))
      }
    } catch {
      setError('Failed to load bank details')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {}

    if (!formData.accountHolderName.trim()) {
      errors.accountHolderName = 'Account holder name is required'
    }

    if (!formData.bankName.trim()) {
      errors.bankName = 'Bank name is required'
    }

    if (!formData.routingNumber) {
      errors.routingNumber = 'Routing number is required'
    } else if (!/^\d{9}$/.test(formData.routingNumber)) {
      errors.routingNumber = 'Routing number must be 9 digits'
    }

    if (!formData.accountNumber) {
      errors.accountNumber = 'Account number is required'
    } else if (!/^\d{4,17}$/.test(formData.accountNumber)) {
      errors.accountNumber = 'Account number must be 4-17 digits'
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      errors.confirmAccountNumber = 'Account numbers do not match'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/partner/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          routingNumber: formData.routingNumber,
          accountNumber: formData.accountNumber,
          accountType: formData.accountType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save bank details')
      }

      setSuccess(true)
      setExistingDetails(data.bankDetails)

      // Redirect to completion page after short delay
      setTimeout(() => {
        router.push('/partner-portal/onboarding/complete')
      }, 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  if (loading) {
    return (
      <OnboardingLayout currentStep={2}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </OnboardingLayout>
    )
  }

  if (success) {
    return (
      <OnboardingLayout currentStep={2}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Payment Details Saved!
          </h1>
          <p className="text-gray-600 mb-2 max-w-md mx-auto">
            Your bank details have been saved securely. You&apos;re all set to start
            earning commissions.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout currentStep={2}>
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"
        >
          <CreditCard className="h-8 w-8 text-orange-600" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Payment Setup
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto">
          Tell us where to send your commission payments. We use secure ACH transfers
          to deposit funds directly into your account.
        </p>
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900">Bank-level security</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your information is encrypted with AES-256 encryption - the same standard
              used by major banks. We never share your financial information.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Existing Details Notice */}
      {existingDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6"
        >
          <h3 className="font-medium text-gray-900 mb-2">Current Bank Account</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Bank:</span> {existingDetails.bankName}</p>
            <p><span className="font-medium">Account:</span> ****{existingDetails.accountNumberLast4}</p>
            <p><span className="font-medium">Type:</span> {existingDetails.accountType}</p>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Submitting new details will replace the current account.
          </p>
        </motion.div>
      )}

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Bank Account Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="accountHolderName" className="text-sm font-medium">
                  Account Holder Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="accountHolderName"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="Name exactly as it appears on your account"
                  className={fieldErrors.accountHolderName ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {fieldErrors.accountHolderName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.accountHolderName}
                  </p>
                )}
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-sm font-medium">
                  Bank Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="e.g., Chase, Bank of America, Wells Fargo"
                  className={fieldErrors.bankName ? 'border-red-500 focus:ring-red-500' : ''}
                />
                {fieldErrors.bankName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.bankName}
                  </p>
                )}
              </div>

              {/* Routing Number */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="routingNumber" className="text-sm font-medium">
                    Routing Number <span className="text-red-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowRoutingHelp(!showRoutingHelp)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <HelpCircle className="h-3 w-3" />
                    Where do I find this?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="routingNumber"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleInputChange}
                    placeholder="9-digit routing number"
                    maxLength={9}
                    className={`pr-10 ${fieldErrors.routingNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {showRoutingHelp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-50 rounded-lg p-3 text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-600">
                        The 9-digit routing number is found at the bottom left of your checks,
                        or in your bank&apos;s online banking portal under account details.
                      </p>
                    </div>
                  </motion.div>
                )}
                {fieldErrors.routingNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.routingNumber}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber" className="text-sm font-medium">
                  Account Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    type="password"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Your account number"
                    maxLength={17}
                    className={`pr-10 ${fieldErrors.accountNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {fieldErrors.accountNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.accountNumber}
                  </p>
                )}
              </div>

              {/* Confirm Account Number */}
              <div className="space-y-2">
                <Label htmlFor="confirmAccountNumber" className="text-sm font-medium">
                  Confirm Account Number <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmAccountNumber"
                    name="confirmAccountNumber"
                    type="password"
                    value={formData.confirmAccountNumber}
                    onChange={handleInputChange}
                    placeholder="Re-enter account number"
                    maxLength={17}
                    className={`pr-10 ${fieldErrors.confirmAccountNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {fieldErrors.confirmAccountNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {fieldErrors.confirmAccountNumber}
                  </p>
                )}
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Account Type <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, accountType: 'checking' }))}
                    className={`p-4 border rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                      formData.accountType === 'checking'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">🏦</span>
                    Checking
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, accountType: 'savings' }))}
                    className={`p-4 border rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                      formData.accountType === 'savings'
                        ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">💰</span>
                    Savings
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">There was a problem</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={submitting}
                  size="lg"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-xl shadow-lg shadow-orange-500/30"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Saving securely...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500 leading-relaxed">
                By submitting, you authorize A Startup Biz to initiate ACH transfers to this
                account for commission payments. You can update your payment details at any time.
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </OnboardingLayout>
  )
}
