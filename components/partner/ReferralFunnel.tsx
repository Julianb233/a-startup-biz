"use client"

import { motion } from "framer-motion"
import {
  Users,
  Phone,
  CheckCircle2,
  Trophy,
  XCircle,
  ArrowDown,
  TrendingUp,
} from "lucide-react"

interface FunnelStage {
  id: string
  label: string
  count: number
  color: string
  bgColor: string
  icon: React.ElementType
}

interface ReferralFunnelProps {
  stats: {
    totalReferrals: number
    pendingReferrals: number
    contactedReferrals?: number
    qualifiedReferrals?: number
    completedReferrals: number
    lostReferrals?: number
  }
}

export default function ReferralFunnel({ stats }: ReferralFunnelProps) {
  // Calculate stage values
  const contacted = stats.contactedReferrals || Math.floor(stats.totalReferrals * 0.75)
  const qualified = stats.qualifiedReferrals || Math.floor(contacted * 0.6)
  const lost = stats.lostReferrals || stats.totalReferrals - stats.completedReferrals - stats.pendingReferrals - (contacted - qualified)

  const stages: FunnelStage[] = [
    {
      id: "total",
      label: "Total Referrals",
      count: stats.totalReferrals,
      color: "text-blue-600",
      bgColor: "bg-blue-500",
      icon: Users,
    },
    {
      id: "contacted",
      label: "Contacted",
      count: contacted,
      color: "text-purple-600",
      bgColor: "bg-purple-500",
      icon: Phone,
    },
    {
      id: "qualified",
      label: "Qualified",
      count: qualified,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500",
      icon: CheckCircle2,
    },
    {
      id: "converted",
      label: "Converted",
      count: stats.completedReferrals,
      color: "text-green-600",
      bgColor: "bg-green-500",
      icon: Trophy,
    },
  ]

  // Calculate percentages relative to total
  const getPercentage = (count: number) => {
    if (stats.totalReferrals === 0) return 0
    return (count / stats.totalReferrals) * 100
  }

  // Calculate drop-off rates between stages
  const getDropOffRate = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((previous - current) / previous) * 100
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Referral Funnel</h3>
            <p className="text-sm text-gray-600 mt-1">
              Track your referral conversion journey
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
            <TrendingUp className="w-4 h-4" />
            {getPercentage(stats.completedReferrals).toFixed(1)}% overall conversion
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Funnel Visualization */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            const percentage = getPercentage(stage.count)
            const previousStage = index > 0 ? stages[index - 1] : null
            const dropOff = previousStage
              ? getDropOffRate(stage.count, previousStage.count)
              : 0

            return (
              <div key={stage.id}>
                {/* Drop-off indicator */}
                {index > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-center my-2"
                  >
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <ArrowDown className="w-4 h-4" />
                      <span>{dropOff.toFixed(1)}% drop-off</span>
                    </div>
                  </motion.div>
                )}

                {/* Stage Bar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${stage.bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {stage.label}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {stage.count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{
                          delay: 0.2 + index * 0.1,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        className={`h-full ${stage.bgColor} flex items-center justify-end pr-3`}
                        style={{ minWidth: percentage > 0 ? "3rem" : 0 }}
                      >
                        {percentage >= 10 && (
                          <span className="text-xs font-semibold text-white">
                            {stage.count}
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>

        {/* Lost Leads */}
        {lost > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Lost Referrals</p>
                <p className="text-xs text-red-600">
                  {lost} referrals ({getPercentage(lost).toFixed(1)}%) did not convert
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Conversion Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100"
        >
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            Improve Your Funnel
          </h4>
          <ul className="space-y-1 text-xs text-blue-700">
            {getDropOffRate(contacted, stats.totalReferrals) > 30 && (
              <li>
                - High drop-off at contact stage. Ensure referrals have accurate contact info.
              </li>
            )}
            {getDropOffRate(qualified, contacted) > 40 && (
              <li>
                - Many leads not qualifying. Focus on higher-quality referral sources.
              </li>
            )}
            {getDropOffRate(stats.completedReferrals, qualified) > 50 && (
              <li>
                - Low conversion from qualified leads. Follow up more frequently.
              </li>
            )}
            {getPercentage(stats.completedReferrals) < 20 && (
              <li>
                - Overall conversion below 20%. Consider reviewing your referral criteria.
              </li>
            )}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}
