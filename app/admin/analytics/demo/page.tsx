'use client'

import { RevenueChart } from '@/components/admin/analytics/RevenueChart'
import { OrdersStatusChart } from '@/components/admin/analytics/OrdersStatusChart'
import { PartnerPerformanceChart } from '@/components/admin/analytics/PartnerPerformanceChart'
import { LeadFunnelChart } from '@/components/admin/analytics/LeadFunnelChart'
import { UserAcquisitionChart } from '@/components/admin/analytics/UserAcquisitionChart'
import { DateRangeFilter, DateRange } from '@/components/admin/analytics/DateRangeFilter'
import { useState } from 'react'

// Sample data for testing
const sampleRevenueData = [
  { date: 'Jan 01', revenue: 15000, orders: 45 },
  { date: 'Jan 08', revenue: 18000, orders: 52 },
  { date: 'Jan 15', revenue: 22000, orders: 61 },
  { date: 'Jan 22', revenue: 19000, orders: 48 },
  { date: 'Jan 29', revenue: 25000, orders: 68 },
  { date: 'Feb 05', revenue: 28000, orders: 72 },
  { date: 'Feb 12', revenue: 31000, orders: 79 },
]

const sampleOrdersStatus = [
  { status: 'pending', count: 12, value: 15000 },
  { status: 'paid', count: 45, value: 75000 },
  { status: 'processing', count: 28, value: 42000 },
  { status: 'completed', count: 89, value: 145000 },
  { status: 'refunded', count: 5, value: 6500 },
]

const samplePartnerPerformance = [
  { name: 'Acme Corp', leads: 45, converted: 22, commission: 8500 },
  { name: 'TechStart Inc', leads: 38, converted: 18, commission: 6200 },
  { name: 'Digital Pro', leads: 31, converted: 15, commission: 5400 },
  { name: 'WebSolutions', leads: 27, converted: 12, commission: 4100 },
  { name: 'CloudBiz', leads: 22, converted: 9, commission: 3200 },
]

const sampleLeadFunnel = {
  total: 100,
  contacted: 75,
  qualified: 45,
  converted: 28,
  lost: 22,
}

const sampleUserAcquisition = [
  { date: 'Jan 01', users: 12, cumulative: 12 },
  { date: 'Jan 08', users: 18, cumulative: 30 },
  { date: 'Jan 15', users: 22, cumulative: 52 },
  { date: 'Jan 22', users: 15, cumulative: 67 },
  { date: 'Jan 29', users: 28, cumulative: 95 },
  { date: 'Feb 05', users: 31, cumulative: 126 },
  { date: 'Feb 12', users: 24, cumulative: 150 },
]

export default function AnalyticsDemoPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Components Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Testing all chart components with sample data
          </p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Over Time
          </h2>
          <RevenueChart data={sampleRevenueData} />
        </div>

        {/* Orders Status Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Orders by Status
          </h2>
          <OrdersStatusChart data={sampleOrdersStatus} />
        </div>

        {/* Partner Performance Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Partner Performance
          </h2>
          <PartnerPerformanceChart data={samplePartnerPerformance} />
        </div>

        {/* Lead Funnel Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lead Conversion Funnel
          </h2>
          <LeadFunnelChart data={sampleLeadFunnel} />
        </div>
      </div>

      {/* User Acquisition Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Acquisition Trend
        </h2>
        <UserAcquisitionChart data={sampleUserAcquisition} />
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Current date range filter: <strong>{dateRange}</strong>
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          This demo shows all chart components with static sample data. The actual analytics page
          fetches real data from the database.
        </p>
      </div>
    </div>
  )
}
