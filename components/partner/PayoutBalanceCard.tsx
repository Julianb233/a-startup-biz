'use client'

import { DollarSign, Clock, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { BalanceResponse } from '@/lib/types/stripe-connect'

interface PayoutBalanceCardProps {
  balance: BalanceResponse | null
  onRequestPayout: () => void
  isLoading?: boolean
}

export function PayoutBalanceCard({
  balance,
  onRequestPayout,
  isLoading = false,
}: PayoutBalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (!balance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-700">
          Your Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Available Balance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available for Payout</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(balance.availableBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Pending Balance */}
        {balance.pendingBalance > 0 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
            <Clock className="h-4 w-4 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-700">
                {formatCurrency(balance.pendingBalance)} pending
              </p>
            </div>
          </div>
        )}

        {/* Minimum Threshold Notice */}
        {balance.availableBalance < balance.minimumPayoutThreshold && (
          <p className="text-sm text-gray-500">
            Minimum payout: {formatCurrency(balance.minimumPayoutThreshold)}
          </p>
        )}

        {/* Payout Button */}
        <Button
          onClick={onRequestPayout}
          disabled={!balance.canRequestPayout || isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          Request Payout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {!balance.canRequestPayout && balance.availableBalance > 0 && (
          <p className="text-xs text-center text-gray-500">
            Connect your Stripe account to request payouts
          </p>
        )}
      </CardContent>
    </Card>
  )
}
