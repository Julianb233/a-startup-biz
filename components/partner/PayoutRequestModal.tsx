'use client'

import { useState } from 'react'
import { Loader2, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { BalanceResponse, PayoutSummary } from '@/lib/types/stripe-connect'

interface PayoutRequestModalProps {
  isOpen: boolean
  onClose: () => void
  balance: BalanceResponse | null
  onSubmit: (amount: number) => Promise<PayoutSummary>
}

export function PayoutRequestModal({
  isOpen,
  onClose,
  balance,
  onSubmit,
}: PayoutRequestModalProps) {
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<PayoutSummary | null>(null)

  if (!isOpen) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '')
    setAmount(value)
    setError(null)
  }

  const handleWithdrawAll = () => {
    if (balance) {
      setAmount(balance.availableBalance.toFixed(2))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const numAmount = parseFloat(amount)

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (balance && numAmount < balance.minimumPayoutThreshold) {
      setError(`Minimum payout is ${formatCurrency(balance.minimumPayoutThreshold)}`)
      return
    }

    if (balance && numAmount > balance.availableBalance) {
      setError(`Amount exceeds available balance of ${formatCurrency(balance.availableBalance)}`)
      return
    }

    setIsSubmitting(true)

    try {
      const payout = await onSubmit(numAmount)
      setSuccess(payout)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payout')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setAmount('')
    setError(null)
    setSuccess(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        {success ? (
          // Success state
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Payout Requested!
            </h3>
            <p className="text-gray-600 mb-4">
              Your payout of {formatCurrency(success.amount)} is being processed.
            </p>
            {success.arrivalDate && (
              <p className="text-sm text-gray-500 mb-4">
                Expected arrival: {new Date(success.arrivalDate).toLocaleDateString()}
              </p>
            )}
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          // Request form
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Request Payout
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Transfer your earnings to your bank account
            </p>

            {balance && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Available Balance</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(balance.availableBalance)}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="pl-8"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="mt-1 flex justify-between">
                  <span className="text-xs text-gray-500">
                    Min: {formatCurrency(balance?.minimumPayoutThreshold || 50)}
                  </span>
                  <button
                    type="button"
                    onClick={handleWithdrawAll}
                    className="text-xs text-orange-600 hover:text-orange-700"
                    disabled={isSubmitting}
                  >
                    Withdraw all
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !amount}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Request Payout'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
