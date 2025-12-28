"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PartnerLayout from "@/components/partner-layout"
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  CheckCircle,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function EarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("12m")

  const periods = [
    { label: "3M", value: "3m" },
    { label: "6M", value: "6m" },
    { label: "12M", value: "12m" },
    { label: "All", value: "all" },
  ]

  const earningsStats = [
    {
      label: "Total Earnings",
      value: "$47,850",
      change: "+22%",
      trend: "up",
      icon: DollarSign,
      color: "from-[#ff6a1a] to-[#e55f17]",
      subtitle: "Lifetime total",
    },
    {
      label: "This Month",
      value: "$4,200",
      change: "+15%",
      trend: "up",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      subtitle: "vs. last month",
    },
    {
      label: "Last Month",
      value: "$3,650",
      change: "-5%",
      trend: "down",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      subtitle: "Previous period",
    },
    {
      label: "Next Payout",
      value: "$4,200",
      change: "Jan 31",
      trend: "neutral",
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
      subtitle: "Scheduled payment",
    },
  ]

  const monthlyData = [
    { month: "Jan", amount: 3200 },
    { month: "Feb", amount: 3650 },
    { month: "Mar", amount: 4100 },
    { month: "Apr", amount: 3800 },
    { month: "May", amount: 4500 },
    { month: "Jun", amount: 3900 },
    { month: "Jul", amount: 4200 },
    { month: "Aug", amount: 3700 },
    { month: "Sep", amount: 4300 },
    { month: "Oct", amount: 3950 },
    { month: "Nov", amount: 4250 },
    { month: "Dec", amount: 4200 },
  ]

  const maxAmount = Math.max(...monthlyData.map((d) => d.amount))

  const payoutHistory = [
    { id: 1, date: "2024-01-01", amount: "$3,650", method: "Bank Transfer", status: "Completed", transactionId: "PAY-2401-001" },
    { id: 2, date: "2023-12-01", amount: "$4,250", method: "Bank Transfer", status: "Completed", transactionId: "PAY-2312-001" },
    { id: 3, date: "2023-11-01", amount: "$3,950", method: "Bank Transfer", status: "Completed", transactionId: "PAY-2311-001" },
    { id: 4, date: "2023-10-01", amount: "$4,300", method: "PayPal", status: "Completed", transactionId: "PAY-2310-001" },
    { id: 5, date: "2023-09-01", amount: "$3,700", method: "Bank Transfer", status: "Completed", transactionId: "PAY-2309-001" },
  ]

  const commissionBreakdown = [
    { service: "Legal Services", referrals: 45, commission: "$13,500", avgPerReferral: "$300", percentage: 28 },
    { service: "Accounting & Tax", referrals: 38, commission: "$11,400", avgPerReferral: "$300", percentage: 24 },
    { service: "Website Design", referrals: 24, commission: "$12,000", avgPerReferral: "$500", percentage: 25 },
    { service: "Marketing Services", referrals: 15, commission: "$6,000", avgPerReferral: "$400", percentage: 13 },
    { service: "Business Insurance", referrals: 20, commission: "$5,000", avgPerReferral: "$250", percentage: 10 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200"
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Processing": return "bg-blue-100 text-blue-800 border-blue-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <PartnerLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings Dashboard</h1>
            <p className="text-gray-600">Track your commissions and payout history</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-all shadow-lg shadow-orange-500/20"
          >
            <Download className="w-5 h-5" />
            Download Report
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {earningsStats.map((stat, index) => {
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
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {stat.trend === "up" && (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                        {stat.change}
                      </div>
                    )}
                    {stat.trend === "down" && (
                      <div className="flex items-center text-red-600 text-sm font-medium">
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Earnings Overview</h2>
              <p className="text-sm text-gray-600">Monthly commission earnings</p>
            </div>
            <div className="flex items-center gap-2">
              {periods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === period.value
                      ? "bg-[#ff6a1a] text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.amount / maxAmount) * 100}%` }}
                    transition={{ delay: 0.6 + index * 0.05, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#ff6a1a] to-[#e55f17] flex items-center justify-end pr-3"
                  >
                    <span className="text-xs font-semibold text-white">${data.amount.toLocaleString()}</span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Commission Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Commission Breakdown by Service</h2>
            <p className="text-sm text-gray-600">Your earnings distribution across different services</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Referrals</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg/Referral</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissionBreakdown.map((item, index) => (
                  <motion.tr
                    key={item.service}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{item.service}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{item.referrals}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-green-600">{item.commission}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700">{item.avgPerReferral}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[100px] bg-gray-100 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ delay: 0.8 + index * 0.05, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-[#ff6a1a] to-[#e55f17]"
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-900 min-w-[3rem]">{item.percentage}%</p>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Payout History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Payout History</h2>
            <p className="text-sm text-gray-600">Your recent commission payouts</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payoutHistory.map((payout, index) => (
                  <motion.tr
                    key={payout.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {payout.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">{payout.amount}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-700">{payout.method}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payout.status)}`}>
                        <CheckCircle className="w-3 h-3" />
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-mono text-gray-500">{payout.transactionId}</p>
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
