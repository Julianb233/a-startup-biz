'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from 'lucide-react'
import { RevenueChart } from '@/components/admin/analytics/RevenueChart'
import { OrdersStatusChart } from '@/components/admin/analytics/OrdersStatusChart'
import { PartnerPerformanceChart } from '@/components/admin/analytics/PartnerPerformanceChart'
import { LeadFunnelChart } from '@/components/admin/analytics/LeadFunnelChart'
import { UserAcquisitionChart } from '@/components/admin/analytics/UserAcquisitionChart'
import { DateRangeFilter, DateRange } from '@/components/admin/analytics/DateRangeFilter'

interface AnalyticsData {
  revenueData: Array<{ date: string; revenue: number; orders: number }>
  ordersStatus: Array<{ status: string; count: number; value: number }>
  partnerPerformance: Array<{ name: string; leads: number; converted: number; commission: number }>
  leadFunnel: { total: number; contacted: number; qualified: number; converted: number; lost: number }
  userAcquisition: Array<{ date: string; users: number; cumulative: number }>
  keyMetrics: {
    totalRevenue: number
    totalOrders: number
    totalPartners: number
    conversionRate: number
    avgOrderValue: number
    revenueGrowth: number
  }
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`)

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data')
      }

      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Error Loading Analytics</h3>
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { keyMetrics, revenueData, ordersStatus, partnerPerformance, leadFunnel, userAcquisition } =
    data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time insights into your business performance
          </p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(keyMetrics.totalRevenue)}
              </p>
              <div
                className={`flex items-center gap-1 mt-2 text-sm ${
                  keyMetrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {keyMetrics.revenueGrowth >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {formatPercent(Math.abs(keyMetrics.revenueGrowth))} vs prev period
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {keyMetrics.totalOrders.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Avg: {formatCurrency(keyMetrics.avgOrderValue)}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Partners</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {keyMetrics.totalPartners.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Partner accounts</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatPercent(keyMetrics.conversionRate)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Lead to customer</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Over Time
          </h2>
          {revenueData.length > 0 ? (
            <RevenueChart data={revenueData} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Orders by Status
          </h2>
          {ordersStatus.length > 0 ? (
            <OrdersStatusChart data={ordersStatus} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No order data available
            </div>
          )}
        </div>

        {/* Partner Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Partner Performance
          </h2>
          {partnerPerformance.length > 0 ? (
            <PartnerPerformanceChart data={partnerPerformance} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No partner data available
            </div>
          )}
        </div>

        {/* Lead Conversion Funnel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lead Conversion Funnel
          </h2>
          <LeadFunnelChart data={leadFunnel} />
        </div>
      </div>

      {/* User Acquisition */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Acquisition Trend
        </h2>
        {userAcquisition.length > 0 ? (
          <UserAcquisitionChart data={userAcquisition} />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No user acquisition data available
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="grid gap-6 md:grid-cols-4 text-center">
          <div>
            <p className="text-blue-100 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(keyMetrics.totalRevenue)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Orders</p>
            <p className="text-3xl font-bold mt-1">{keyMetrics.totalOrders.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Active Partners</p>
            <p className="text-3xl font-bold mt-1">{keyMetrics.totalPartners.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Conversion Rate</p>
            <p className="text-3xl font-bold mt-1">{formatPercent(keyMetrics.conversionRate)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
