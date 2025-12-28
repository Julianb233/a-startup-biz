"use client"

import { motion } from "framer-motion"
import { DollarSign, TrendingUp, Clock, CheckCircle2 } from "lucide-react"

interface CommissionData {
  totalEarned: number
  pendingCommission: number
  paidCommission: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  payoutSchedule: string
  nextPayoutDate: Date | null
}

interface CommissionCardProps {
  data: CommissionData
}

export default function CommissionCard({ data }: CommissionCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date))
  }

  const growthPercentage = data.lastMonthEarnings > 0
    ? ((data.thisMonthEarnings - data.lastMonthEarnings) / data.lastMonthEarnings) * 100
    : 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff6a1a] to-[#e55f17] p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Earnings</p>
            <h2 className="text-4xl font-bold">
              {formatCurrency(data.totalEarned)}
            </h2>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Commission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
        >
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-yellow-800 mb-1">Pending Commission</p>
            <p className="text-2xl font-bold text-yellow-900">
              {formatCurrency(data.pendingCommission)}
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Awaiting approval
            </p>
          </div>
        </motion.div>

        {/* Paid Commission */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-green-800 mb-1">Paid Commission</p>
            <p className="text-2xl font-bold text-green-900">
              {formatCurrency(data.paidCommission)}
            </p>
            <p className="text-xs text-green-700 mt-1">
              All-time total
            </p>
          </div>
        </motion.div>
      </div>

      {/* Monthly Performance */}
      <div className="px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              This Month's Earnings
            </h3>
            {growthPercentage !== 0 && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  growthPercentage > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                <TrendingUp
                  className={`w-4 h-4 ${
                    growthPercentage < 0 ? "rotate-180" : ""
                  }`}
                />
                {Math.abs(growthPercentage).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatCurrency(data.thisMonthEarnings)}
          </p>
          <p className="text-xs text-gray-600">
            Last month: {formatCurrency(data.lastMonthEarnings)}
          </p>
        </motion.div>
      </div>

      {/* Payout Info */}
      <div className="px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 mb-1">Next Payout</p>
              <p className="text-lg font-semibold text-blue-900">
                {data.nextPayoutDate
                  ? formatDate(data.nextPayoutDate)
                  : "Not scheduled"}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Schedule: {data.payoutSchedule}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
