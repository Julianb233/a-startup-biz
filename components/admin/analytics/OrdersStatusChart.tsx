'use client'

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface OrdersStatusChartProps {
  data: Array<{
    status: string
    count: number
    value: number
  }>
}

const COLORS = {
  pending: '#f59e0b',
  paid: '#10b981',
  processing: '#3b82f6',
  completed: '#8b5cf6',
  refunded: '#ef4444',
}

export function OrdersStatusChart({ data }: OrdersStatusChartProps) {
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
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            {payload[0].name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Count: {payload[0].payload.count}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Value: {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.status as keyof typeof COLORS] || '#6b7280'}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
