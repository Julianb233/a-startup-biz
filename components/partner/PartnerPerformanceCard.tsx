'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, DollarSign, Users, Target, ArrowUpRight } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface PartnerPerformanceCardProps {
  stats: {
    totalReferrals: number
    conversions: number
    totalEarnings: number
    thisMonthEarnings: number
    lastMonthEarnings: number
  }
  trendData?: Array<{ value: number }>
}

export function PartnerPerformanceCard({ stats, trendData }: PartnerPerformanceCardProps) {
  const conversionRate = stats.totalReferrals > 0
    ? ((stats.conversions / stats.totalReferrals) * 100).toFixed(1)
    : '0.0'

  const monthOverMonthChange = stats.lastMonthEarnings > 0
    ? (((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings) * 100).toFixed(1)
    : '0.0'

  const isPositiveGrowth = parseFloat(monthOverMonthChange) >= 0

  // Generate default trend data if not provided
  const defaultTrendData = trendData || [
    { value: stats.lastMonthEarnings * 0.7 },
    { value: stats.lastMonthEarnings * 0.85 },
    { value: stats.lastMonthEarnings },
    { value: stats.thisMonthEarnings * 0.9 },
    { value: stats.thisMonthEarnings },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="border-2 border-gray-200 hover:border-[#ff6a1a] transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">Performance Overview</span>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveGrowth ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(parseFloat(monthOverMonthChange))}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Referrals */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-medium text-blue-900">Total Referrals</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{stats.totalReferrals}</p>
          </div>

          {/* Conversions */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-medium text-green-900">Conversions</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{stats.conversions}</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-medium text-purple-900">Total Earnings</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalEarnings)}</p>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-[#ff6a1a]">{conversionRate}%</p>
            </div>
            <div className="w-20 h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={defaultTrendData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff6a1a"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <p>{stats.conversions} of {stats.totalReferrals} referrals converted</p>
          </div>
        </div>

        {/* Month-over-Month Comparison */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Month-over-Month</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">This Month</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.thisMonthEarnings)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Month</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.lastMonthEarnings)}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              isPositiveGrowth ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <ArrowUpRight className={`w-3 h-3 ${!isPositiveGrowth && 'rotate-90'}`} />
              <span className="text-xs font-semibold">{Math.abs(parseFloat(monthOverMonthChange))}%</span>
            </div>
            <span className="text-xs text-gray-600">
              {isPositiveGrowth ? 'increase' : 'decrease'} from last month
            </span>
          </div>
        </div>

        {/* Trend Sparkline */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Earnings Trend</h4>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defaultTrendData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ff6a1a"
                  strokeWidth={3}
                  dot={{ fill: '#ff6a1a', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
