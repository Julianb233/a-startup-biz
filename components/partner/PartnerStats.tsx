"use client"

import { motion } from "framer-motion"
import {
  Users,
  TrendingUp,
  Target,
  Award,
  Calendar,
  DollarSign,
} from "lucide-react"

interface PartnerStatsProps {
  stats: {
    totalReferrals: number
    activeLeads: number
    conversionRate: number
    averageCommission: number
    topPerformingService: string
    memberSince: Date
    rank?: string
  }
}

export default function PartnerStats({ stats }: PartnerStatsProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(date))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const keyMetrics = [
    {
      label: "Active Leads",
      value: stats.activeLeads.toString(),
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: Target,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
    },
    {
      label: "Avg Commission",
      value: formatCurrency(stats.averageCommission),
      icon: DollarSign,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
    },
    {
      label: "Partner Since",
      value: formatDate(stats.memberSince),
      icon: Calendar,
      color: "gray",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      borderColor: "border-gray-200",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Partner Rank Badge */}
      {stats.rank && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-800 mb-1">Partner Rank</p>
              <h3 className="text-2xl font-bold text-yellow-900">
                {stats.rank}
              </h3>
              <p className="text-xs text-yellow-700 mt-1">
                Based on performance and referrals
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${metric.bgColor} rounded-lg p-4 border ${metric.borderColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-xl font-bold text-gray-900">{metric.value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Top Performing Service */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">
              Top Performing Service
            </p>
            <p className="text-xl font-bold text-gray-900">
              {stats.topPerformingService}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Performance Overview
        </h3>
        <div className="space-y-4">
          {/* Total Referrals Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Total Referrals</span>
              <span className="font-semibold text-gray-900">
                {stats.totalReferrals}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stats.totalReferrals / 100) * 100, 100)}%` }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-gradient-to-r from-[#ff6a1a] to-[#e55f17] h-2 rounded-full"
              />
            </div>
          </div>

          {/* Conversion Rate Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-semibold text-gray-900">
                {stats.conversionRate.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.conversionRate}%` }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
