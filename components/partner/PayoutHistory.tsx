'use client'

import { CheckCircle2, Clock, XCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PayoutSummary, PayoutStatus } from '@/lib/types/stripe-connect'

interface PayoutHistoryProps {
  payouts: PayoutSummary[]
  isLoading?: boolean
}

export function PayoutHistory({ payouts, isLoading = false }: PayoutHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getStatusIcon = (status: PayoutStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'pending':
      case 'in_transit':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusLabel = (status: PayoutStatus) => {
    switch (status) {
      case 'paid':
        return 'Completed'
      case 'pending':
        return 'Pending'
      case 'in_transit':
        return 'In Transit'
      case 'failed':
        return 'Failed'
      case 'canceled':
        return 'Canceled'
      default:
        return status
    }
  }

  const getStatusColor = (status: PayoutStatus) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 bg-green-50'
      case 'pending':
      case 'in_transit':
        return 'text-yellow-700 bg-yellow-50'
      case 'failed':
      case 'canceled':
        return 'text-red-700 bg-red-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout History</CardTitle>
      </CardHeader>
      <CardContent>
        {payouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No payouts yet</p>
            <p className="text-sm mt-1">Your payout history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(payout.status)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(payout.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(payout.createdAt)}
                      {payout.destinationLast4 && (
                        <span> &bull; ****{payout.destinationLast4}</span>
                      )}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payout.status)}`}
                >
                  {getStatusLabel(payout.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
