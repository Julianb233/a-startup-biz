"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  BarChart3,
  Activity,
  Zap,
} from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ElementType
  color: string
  bgColor: string
  delay?: number
}

function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color,
  bgColor,
  delay = 0,
}: MetricCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            {change > 0 ? "+" : ""}
            {change.toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {changeLabel && (
        <p className="text-xs text-gray-500 mt-2">{changeLabel}</p>
      )}
    </motion.div>
  )
}

interface AnalyticsWidgetProps {
  stats: {
    totalReferrals: number
    pendingReferrals: number
    completedReferrals: number
    totalEarnings: number
    pendingEarnings: number
    paidEarnings: number
    thisMonthEarnings?: number
    lastMonthEarnings?: number
    conversionRate?: number
    activeLeads?: number
  }
  showDetailed?: boolean
}

export default function AnalyticsWidget({ stats, showDetailed = false }: AnalyticsWidgetProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate month-over-month change
  const monthChange = stats.lastMonthEarnings && stats.thisMonthEarnings
    ? ((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings) * 100
    : 0

  // Calculate completion rate
  const completionRate = stats.totalReferrals > 0
    ? (stats.completedReferrals / stats.totalReferrals) * 100
    : 0

  const primaryMetrics = [
    {
      title: "Total Referrals",
      value: stats.totalReferrals,
      change: 12.5,
      changeLabel: "vs last month",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Earnings",
      value: formatCurrency(stats.totalEarnings),
      change: monthChange,
      changeLabel: `${formatCurrency(stats.paidEarnings)} paid`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Conversion Rate",
      value: `${(stats.conversionRate || completionRate).toFixed(1)}%`,
      change: 3.2,
      changeLabel: `${stats.completedReferrals} converted`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Leads",
      value: stats.activeLeads || stats.pendingReferrals,
      change: stats.pendingReferrals > 5 ? 8.4 : -2.1,
      changeLabel: "In pipeline",
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const detailedMetrics = [
    {
      title: "Pending Earnings",
      value: formatCurrency(stats.pendingEarnings),
      changeLabel: "Awaiting conversion",
      icon: BarChart3,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "This Month",
      value: formatCurrency(stats.thisMonthEarnings || 0),
      change: monthChange,
      changeLabel: `Last month: ${formatCurrency(stats.lastMonthEarnings || 0)}`,
      icon: Zap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryMetrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Detailed Metrics (Optional) */}
      {showDetailed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {detailedMetrics.map((metric, index) => (
            <MetricCard
              key={metric.title}
              {...metric}
              delay={0.4 + index * 0.1}
            />
          ))}
        </div>
      )}

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white"
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#ff6a1a]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Performance Summary</p>
              <p className="text-lg font-semibold">
                {stats.completedReferrals} of {stats.totalReferrals} referrals converted
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#ff6a1a]">
                {completionRate.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-400">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(stats.totalEarnings / Math.max(stats.completedReferrals, 1))}
              </p>
              <p className="text-xs text-gray-400">Avg. Commission</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {stats.pendingReferrals}
              </p>
              <p className="text-xs text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
