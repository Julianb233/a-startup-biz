'use client'

import { CheckCircle2, Clock, XCircle, ArrowDownRight, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TransferSummary, TransferStatus, TransferSourceType } from '@/lib/types/stripe-connect'

interface TransferHistoryProps {
  transfers: TransferSummary[]
  isLoading?: boolean
}

export function TransferHistory({ transfers, isLoading = false }: TransferHistoryProps) {
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

  const getStatusIcon = (status: TransferStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
      case 'reversed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getSourceLabel = (sourceType: TransferSourceType) => {
    switch (sourceType) {
      case 'commission':
        return 'Commission'
      case 'bonus':
        return 'Bonus'
      case 'adjustment':
        return 'Adjustment'
      case 'refund':
        return 'Refund'
      default:
        return sourceType
    }
  }

  const getStatusColor = (status: TransferStatus) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 bg-green-50'
      case 'pending':
      case 'processing':
        return 'text-yellow-700 bg-yellow-50'
      case 'failed':
      case 'reversed':
        return 'text-red-700 bg-red-50'
      default:
        return 'text-gray-700 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Earnings</CardTitle>
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
        <CardTitle>Recent Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        {transfers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No earnings yet</p>
            <p className="text-sm mt-1">Your commission earnings will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transfers.map((transfer) => (
              <div
                key={transfer.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ArrowDownRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        +{formatCurrency(transfer.amount)}
                      </p>
                      {getStatusIcon(transfer.status)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {getSourceLabel(transfer.sourceType)} &bull; {formatDate(transfer.createdAt)}
                    </p>
                    {transfer.description && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {transfer.description}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transfer.status)}`}
                >
                  {transfer.status === 'paid' ? 'Received' : transfer.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
