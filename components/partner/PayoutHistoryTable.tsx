'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react'
import type { PayoutSummary, PayoutStatus } from '@/lib/types/stripe-connect'

interface PayoutHistoryTableProps {
  payouts: PayoutSummary[]
  isLoading?: boolean
  onExportCSV?: () => void
}

export function PayoutHistoryTable({
  payouts,
  isLoading = false,
  onExportCSV
}: PayoutHistoryTableProps) {
  const [dateFilter, setDateFilter] = useState<'all' | '30' | '90' | '180'>('all')
  const [showFilterMenu, setShowFilterMenu] = useState(false)

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

  const getStatusBadge = (status: PayoutStatus) => {
    const variants = {
      paid: 'success',
      pending: 'secondary',
      in_transit: 'secondary',
      failed: 'destructive',
      canceled: 'destructive',
    } as const

    const labels = {
      paid: 'Completed',
      pending: 'Pending',
      in_transit: 'In Transit',
      failed: 'Failed',
      canceled: 'Canceled',
    }

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    )
  }

  const filterPayouts = (payouts: PayoutSummary[]) => {
    if (dateFilter === 'all') return payouts

    const now = new Date()
    const daysAgo = parseInt(dateFilter)
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    return payouts.filter(payout => {
      const payoutDate = new Date(payout.createdAt)
      return payoutDate >= cutoffDate
    })
  }

  const handleExportCSV = () => {
    if (onExportCSV) {
      onExportCSV()
      return
    }

    // Default CSV export implementation
    const filteredPayouts = filterPayouts(payouts)
    const csvContent = [
      ['Date', 'Amount', 'Status', 'Destination', 'Reference'].join(','),
      ...filteredPayouts.map(payout => [
        formatDate(payout.createdAt),
        payout.amount.toString(),
        payout.status,
        payout.destinationLast4 ? `****${payout.destinationLast4}` : 'N/A',
        payout.id,
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `payout-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredPayouts = filterPayouts(payouts)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6a1a]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payout History</CardTitle>
          <div className="flex items-center gap-2">
            {/* Date Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>
                  {dateFilter === 'all' ? 'All Time' : `Last ${dateFilter} Days`}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFilterMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => { setDateFilter('all'); setShowFilterMenu(false) }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg"
                  >
                    All Time
                  </button>
                  <button
                    onClick={() => { setDateFilter('30'); setShowFilterMenu(false) }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Last 30 Days
                  </button>
                  <button
                    onClick={() => { setDateFilter('90'); setShowFilterMenu(false) }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                  >
                    Last 90 Days
                  </button>
                  <button
                    onClick={() => { setDateFilter('180'); setShowFilterMenu(false) }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 last:rounded-b-lg"
                  >
                    Last 180 Days
                  </button>
                </div>
              )}
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={filteredPayouts.length === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#ff6a1a] rounded-lg hover:bg-[#e55f17] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPayouts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No payouts yet</p>
            <p className="text-sm text-gray-400 mt-1">Your payout history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Destination</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payout.status)}
                        <span className="text-sm text-gray-900">
                          {formatDate(payout.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(payout.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(payout.status)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {payout.destinationLast4 ? `****${payout.destinationLast4}` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-mono text-gray-500">
                        {payout.id.slice(0, 12)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
