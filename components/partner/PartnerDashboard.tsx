"use client"

import { motion } from "framer-motion"
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
} from "lucide-react"

interface PartnerDashboardProps {
  stats: {
    totalReferrals: number
    pendingReferrals: number
    completedReferrals: number
    totalEarnings: number
    pendingEarnings: number
    paidEarnings: number
  }
  recentActivity?: Array<{
    id: string
    type: string
    description: string
    timestamp: Date
  }>
}

export default function PartnerDashboard({ stats, recentActivity = [] }: PartnerDashboardProps) {
  const statCards = [
    {
      label: "Total Referrals",
      value: stats.totalReferrals.toString(),
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Pending",
      value: stats.pendingReferrals.toString(),
      change: "Awaiting approval",
      trend: "neutral",
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Completed",
      value: stats.completedReferrals.toString(),
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total Earnings",
      value: `$${stats.totalEarnings.toLocaleString()}`,
      change: `$${stats.paidEarnings.toLocaleString()} paid`,
      trend: "up",
      icon: DollarSign,
      color: "from-[#ff6a1a] to-[#e55f17]",
    },
  ]

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, Partner!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your referrals today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.trend === "up" && (
                    <div className="flex items-center text-green-600 text-sm font-medium">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                {stat.trend === "neutral" && (
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Activity
            </h2>
            <a
              href="/partner-portal/referrals"
              className="text-sm font-semibold text-[#ff6a1a] hover:text-[#e55f17] flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.type}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
