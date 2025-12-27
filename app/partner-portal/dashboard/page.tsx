"use client"

import { motion } from "framer-motion"
import PartnerLayout from "@/components/partner-layout"
import {
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  ArrowRight,
  FileText,
  Plus,
} from "lucide-react"

export default function PartnerDashboard() {
  const stats = [
    {
      label: "Total Referrals",
      value: "127",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Pending",
      value: "23",
      change: "5 this week",
      trend: "neutral",
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Completed",
      value: "94",
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Earnings",
      value: "$12,450",
      change: "+$1,200",
      trend: "up",
      icon: DollarSign,
      color: "from-[#ff6a1a] to-[#e55f17]",
    },
  ]

  const recentReferrals = [
    {
      id: 1,
      client: "Acme Ventures LLC",
      service: "EIN Filing",
      provider: "TaxPro Solutions",
      status: "Completed",
      commission: "$150",
      date: "2024-01-15",
    },
    {
      id: 2,
      client: "Tech Startup Inc",
      service: "Legal Formation",
      provider: "LegalEase Partners",
      status: "Pending",
      commission: "$300",
      date: "2024-01-14",
    },
    {
      id: 3,
      client: "Fitness Co",
      service: "Website Design",
      provider: "WebCraft Studios",
      status: "In Progress",
      commission: "$500",
      date: "2024-01-13",
    },
    {
      id: 4,
      client: "Restaurant Group",
      service: "Accounting Setup",
      provider: "NumbersFirst CPA",
      status: "Completed",
      commission: "$200",
      date: "2024-01-12",
    },
  ]

  const quickActions = [
    {
      label: "New Referral",
      icon: Plus,
      href: "/partner-portal/providers",
      color: "bg-[#ff6a1a]",
    },
    {
      label: "View Providers",
      icon: Users,
      href: "/partner-portal/providers",
      color: "bg-blue-500",
    },
    {
      label: "All Referrals",
      icon: FileText,
      href: "/partner-portal/referrals",
      color: "bg-green-500",
    },
    {
      label: "Earnings Report",
      icon: DollarSign,
      href: "/partner-portal/earnings",
      color: "bg-purple-500",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <PartnerLayout>
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
          {stats.map((stat, index) => {
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.a
                  key={action.label}
                  href={action.href}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all group"
                >
                  <div
                    className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-[#ff6a1a] transition-colors">
                      {action.label}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff6a1a] transition-colors" />
                </motion.a>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Referrals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Referrals
            </h2>
            <a
              href="/partner-portal/referrals"
              className="text-sm font-semibold text-[#ff6a1a] hover:text-[#e55f17] flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentReferrals.map((referral, index) => (
                  <motion.tr
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">
                        {referral.client}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">
                        {referral.service}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-600">
                        {referral.provider}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          referral.status
                        )}`}
                      >
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-green-600">
                        {referral.commission}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-500">{referral.date}</p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </PartnerLayout>
  )
}
