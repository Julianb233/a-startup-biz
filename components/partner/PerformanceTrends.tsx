"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Calendar,
  BarChart3,
  LineChart,
  DollarSign,
  Users,
} from "lucide-react"

interface DataPoint {
  month: string
  referrals: number
  conversions: number
  earnings: number
}

interface PerformanceTrendsProps {
  data?: DataPoint[]
  thisMonthEarnings?: number
  lastMonthEarnings?: number
}

export default function PerformanceTrends({
  data,
  thisMonthEarnings = 0,
  lastMonthEarnings = 0,
}: PerformanceTrendsProps) {
  const [viewType, setViewType] = useState<"bar" | "line">("bar")
  const [metric, setMetric] = useState<"referrals" | "conversions" | "earnings">("earnings")

  // Default mock data if not provided
  const defaultData: DataPoint[] = [
    { month: "Jan", referrals: 12, conversions: 8, earnings: 3200 },
    { month: "Feb", referrals: 15, conversions: 10, earnings: 3650 },
    { month: "Mar", referrals: 18, conversions: 14, earnings: 4100 },
    { month: "Apr", referrals: 14, conversions: 9, earnings: 3800 },
    { month: "May", referrals: 22, conversions: 16, earnings: 4500 },
    { month: "Jun", referrals: 16, conversions: 11, earnings: 3900 },
    { month: "Jul", referrals: 19, conversions: 13, earnings: 4200 },
    { month: "Aug", referrals: 17, conversions: 12, earnings: 3700 },
    { month: "Sep", referrals: 21, conversions: 15, earnings: 4300 },
    { month: "Oct", referrals: 18, conversions: 12, earnings: 3950 },
    { month: "Nov", referrals: 20, conversions: 14, earnings: 4250 },
    { month: "Dec", referrals: 19, conversions: 13, earnings: thisMonthEarnings || 4200 },
  ]

  const chartData = data || defaultData

  const getMetricValue = (point: DataPoint) => {
    return point[metric]
  }

  const getMetricLabel = () => {
    switch (metric) {
      case "referrals":
        return "Referrals"
      case "conversions":
        return "Conversions"
      case "earnings":
        return "Earnings"
    }
  }

  const formatValue = (value: number) => {
    if (metric === "earnings") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
    return value.toString()
  }

  const maxValue = Math.max(...chartData.map(getMetricValue))
  const totalValue = chartData.reduce((sum, point) => sum + getMetricValue(point), 0)
  const averageValue = totalValue / chartData.length

  // Calculate trend
  const firstHalf = chartData.slice(0, 6).reduce((sum, p) => sum + getMetricValue(p), 0)
  const secondHalf = chartData.slice(6).reduce((sum, p) => sum + getMetricValue(p), 0)
  const trendPercentage = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0

  const getBarColor = (index: number) => {
    const colors = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600",
      "from-indigo-400 to-indigo-600",
      "from-pink-400 to-pink-600",
      "from-orange-400 to-orange-600",
      "from-green-400 to-green-600",
    ]
    return colors[index % colors.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Performance Trends</h3>
              <p className="text-sm text-gray-600">Monthly overview of your activity</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Selector */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {[
                { key: "earnings", icon: DollarSign, label: "Earnings" },
                { key: "referrals", icon: Users, label: "Referrals" },
                { key: "conversions", icon: TrendingUp, label: "Conversions" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setMetric(item.key as typeof metric)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    metric === item.key
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>

            {/* View Type Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType("bar")}
                className={`p-2 rounded-md transition-all ${
                  viewType === "bar"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewType("line")}
                className={`p-2 rounded-md transition-all ${
                  viewType === "line"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LineChart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-lg font-bold text-gray-900">{formatValue(totalValue)}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Average</p>
            <p className="text-lg font-bold text-gray-900">{formatValue(Math.round(averageValue))}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Trend</p>
            <p className={`text-lg font-bold ${trendPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trendPercentage >= 0 ? "+" : ""}{trendPercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-64">
          {viewType === "bar" ? (
            /* Bar Chart */
            <div className="flex items-end justify-between h-full gap-2 pt-6">
              {chartData.map((point, index) => {
                const height = (getMetricValue(point) / maxValue) * 100
                return (
                  <div
                    key={point.month}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.1 * index, duration: 0.5 }}
                      className={`w-full min-h-[4px] bg-gradient-to-t ${getBarColor(index)} rounded-t-md relative group cursor-pointer`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                          {formatValue(getMetricValue(point))}
                        </div>
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-500 font-medium">
                      {point.month}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Line Chart */
            <div className="relative h-full pt-6">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 200"
                preserveAspectRatio="none"
              >
                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 50}
                    x2="400"
                    y2={i * 50}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}

                {/* Line Path */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5 }}
                  d={chartData
                    .map((point, index) => {
                      const x = (index / (chartData.length - 1)) * 400
                      const y = 200 - (getMetricValue(point) / maxValue) * 180
                      return `${index === 0 ? "M" : "L"} ${x} ${y}`
                    })
                    .join(" ")}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff6a1a" />
                    <stop offset="100%" stopColor="#e55f17" />
                  </linearGradient>
                </defs>

                {/* Data Points */}
                {chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 400
                  const y = 200 - (getMetricValue(point) / maxValue) * 180
                  return (
                    <motion.circle
                      key={point.month}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      cx={x}
                      cy={y}
                      r="6"
                      fill="#ff6a1a"
                      stroke="white"
                      strokeWidth="2"
                      className="cursor-pointer hover:r-8"
                    />
                  )
                })}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                {chartData.map((point) => (
                  <span key={point.month} className="text-xs text-gray-500 font-medium">
                    {point.month}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#ff6a1a] to-[#e55f17]" />
            <span className="text-gray-600">{getMetricLabel()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">Last 12 months</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
