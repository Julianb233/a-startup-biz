'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

interface PartnerPerformanceChartProps {
  data: Array<{
    name: string
    leads: number
    converted: number
    commission: number
  }>
}

export function PartnerPerformanceChart({ data }: PartnerPerformanceChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {payload[0].payload.name}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Total Leads: {payload[0].value}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Converted: {payload[1].value}
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Commission: {formatCurrency(payload[0].payload.commission)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
        <XAxis
          dataKey="name"
          className="text-xs text-gray-600 dark:text-gray-400"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          className="text-xs text-gray-600 dark:text-gray-400"
          tick={{ fill: 'currentColor' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="leads" fill="#3b82f6" name="Total Leads" />
        <Bar dataKey="converted" fill="#10b981" name="Converted" />
      </BarChart>
    </ResponsiveContainer>
  )
}
