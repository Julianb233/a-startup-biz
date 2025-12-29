import { BarChart3, TrendingUp, PieChart, Activity, Users, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import {
  getAnalyticsStats,
  getMonthlyRevenueTrend,
  getServicePerformance,
  getTopPartnerPerformance,
  getDailyOrdersTrend,
} from '@/lib/db-queries'

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format percentage
function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export default async function AnalyticsPage() {
  // Fetch all analytics data in parallel
  const [stats, monthlyRevenue, servicePerformance, topPartners, dailyOrders] = await Promise.all([
    getAnalyticsStats(),
    getMonthlyRevenueTrend(),
    getServicePerformance(),
    getTopPartnerPerformance(5),
    getDailyOrdersTrend(),
  ])

  // Calculate trend (compare last 2 months)
  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1]?.revenue || 0
  const prevMonth = monthlyRevenue[monthlyRevenue.length - 2]?.revenue || 0
  const revenueTrend = prevMonth > 0 ? ((currentMonth - prevMonth) / prevMonth) * 100 : 0
  const revenueTrendUp = revenueTrend >= 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Real-time insights into your business performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatPercent(stats.conversionRate)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {formatCurrency(stats.avgOrderValue)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer LTV</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {formatCurrency(stats.customerLTV)}
              </p>
            </div>
            <PieChart className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Rate</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                {stats.activeRate}%
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className={`ml-auto flex items-center text-sm ${revenueTrendUp ? 'text-green-600' : 'text-red-600'}`}>
              {revenueTrendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {formatPercent(Math.abs(revenueTrend))}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Customers</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {stats.totalCustomers.toLocaleString()}
              </p>
            </div>
            <div className="ml-auto text-sm text-green-600">
              +{stats.newCustomersThisMonth} this month
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Revenue Trend
          </h2>
          {monthlyRevenue.length > 0 ? (
            <div className="space-y-3">
              {monthlyRevenue.slice(-6).map((month, idx) => {
                const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue))
                const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-20">{month.month}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-24 text-right">
                      {formatCurrency(month.revenue)}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No revenue data available</div>
          )}
        </div>

        {/* Daily Orders Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Daily Orders (Last 30 Days)
          </h2>
          {dailyOrders.length > 0 ? (
            <div className="flex items-end gap-1 h-40">
              {dailyOrders.slice(-30).map((day, idx) => {
                const maxOrders = Math.max(...dailyOrders.map(d => d.orders))
                const height = maxOrders > 0 ? (day.orders / maxOrders) * 100 : 0
                return (
                  <div
                    key={idx}
                    className="flex-1 bg-gradient-to-t from-orange-500 to-orange-400 rounded-t hover:from-orange-600 hover:to-orange-500 transition-colors cursor-pointer group relative"
                    style={{ height: `${Math.max(height, 4)}%` }}
                    title={`${day.date}: ${day.orders} orders (${formatCurrency(day.revenue)})`}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No order data available</div>
          )}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Service Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Service Performance
          </h2>
          {servicePerformance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-600 dark:text-gray-400 font-medium">Service</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">Orders</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">Revenue</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {servicePerformance.map((service, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="py-3 text-gray-900 dark:text-white">{service.service}</td>
                      <td className="py-3 text-right text-gray-600 dark:text-gray-400">{service.orders}</td>
                      <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(service.revenue)}
                      </td>
                      <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                        {formatCurrency(service.avgValue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No service data available</div>
          )}
        </div>

        {/* Top Partners */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Partner Performance
          </h2>
          {topPartners.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-600 dark:text-gray-400 font-medium">Partner</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">Leads</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">Conv %</th>
                    <th className="text-right py-2 text-gray-600 dark:text-gray-400 font-medium">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {topPartners.map((partner, idx) => (
                    <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="py-3 text-gray-900 dark:text-white">{partner.companyName}</td>
                      <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                        {partner.convertedLeads}/{partner.totalLeads}
                      </td>
                      <td className="py-3 text-right">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          partner.conversionRate >= 30
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : partner.conversionRate >= 15
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {partner.conversionRate}%
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(partner.totalCommission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No partner data available</div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="grid gap-6 md:grid-cols-4 text-center">
          <div>
            <p className="text-blue-100 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Orders</p>
            <p className="text-3xl font-bold mt-1">{stats.totalOrders.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Customers</p>
            <p className="text-3xl font-bold mt-1">{stats.totalCustomers.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm">Conversion Rate</p>
            <p className="text-3xl font-bold mt-1">{formatPercent(stats.conversionRate)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
