'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Lock,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/partner-portal')
      }, 2000)
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Onboarding Complete!
          </h1>
          <p className="text-gray-600 mb-6">
            Your bank details have been saved securely. You&apos;re all set to start
            receiving commissions from your microsite leads.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <CreditCard className="h-8 w-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Details
          </h1>
          <p className="text-gray-600">
            Enter your bank account information to receive commission payments.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Your information is secure</h3>
              <p className="text-sm text-blue-700 mt-1">
                All bank details are encrypted with AES-256 encryption and stored
                securely. We never share your financial information with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Details Notice */}
        {existingDetails && (
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Current Bank Account</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Bank:</span> {existingDetails.bankName}</p>
              <p><span className="font-medium">Account:</span> ****{existingDetails.accountNumberLast4}</p>
              <p><span className="font-medium">Type:</span> {existingDetails.accountType}</p>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Submitting new details will replace the current account.
            </p>
          </div>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Bank Account Information
            </CardTitle>
            <CardDescription>
              We use ACH transfers to send your commission payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Account Holder Name */}
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                <Input
                  id="accountHolderName"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="Name on the bank account"
                  className={fieldErrors.accountHolderName ? 'border-red-500' : ''}
                />
                {fieldErrors.accountHolderName && (
                  <p className="text-sm text-red-500">{fieldErrors.accountHolderName}</p>
                )}
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="e.g., Chase, Bank of America"
                  className={fieldErrors.bankName ? 'border-red-500' : ''}
                />
                {fieldErrors.bankName && (
                  <p className="text-sm text-red-500">{fieldErrors.bankName}</p>
                )}
              </div>

              {/* Routing Number */}
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number *</Label>
                <div className="relative">
                  <Input
                    id="routingNumber"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleInputChange}
                    placeholder="9-digit routing number"
                    maxLength={9}
                    className={fieldErrors.routingNumber ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {fieldErrors.routingNumber && (
                  <p className="text-sm text-red-500">{fieldErrors.routingNumber}</p>
                )}
                <p className="text-xs text-gray-500">
                  Found on the bottom left of your checks
                </p>
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number *</Label>
                <div className="relative">
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    type="password"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Your account number"
                    maxLength={17}
                    className={fieldErrors.accountNumber ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {fieldErrors.accountNumber && (
                  <p className="text-sm text-red-500">{fieldErrors.accountNumber}</p>
                )}
              </div>

              {/* Confirm Account Number */}
              <div className="space-y-2">
                <Label htmlFor="confirmAccountNumber">Confirm Account Number *</Label>
                <div className="relative">
                  <Input
                    id="confirmAccountNumber"
                    name="confirmAccountNumber"
                    type="password"
                    value={formData.confirmAccountNumber}
                    onChange={handleInputChange}
                    placeholder="Re-enter account number"
                    maxLength={17}
                    className={fieldErrors.confirmAccountNumber ? 'border-red-500 pr-10' : 'pr-10'}
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {fieldErrors.confirmAccountNumber && (
                  <p className="text-sm text-red-500">{fieldErrors.confirmAccountNumber}</p>
                )}
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <Label>Account Type *</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, accountType: 'checking' }))}
                    className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                      formData.accountType === 'checking'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Checking
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, accountType: 'savings' }))}
                    className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                      formData.accountType === 'savings'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Savings
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Bank Details'
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                By submitting, you authorize us to initiate ACH transfers to this account
                for commission payments.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
