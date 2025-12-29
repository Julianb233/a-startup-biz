'use client'

interface LeadFunnelChartProps {
  data: {
    total: number
    contacted: number
    qualified: number
    converted: number
    lost: number
  }
}

export function LeadFunnelChart({ data }: LeadFunnelChartProps) {
  const stages = [
    { label: 'Total Leads', value: data.total, color: 'bg-blue-500' },
    { label: 'Contacted', value: data.contacted, color: 'bg-indigo-500' },
    { label: 'Qualified', value: data.qualified, color: 'bg-purple-500' },
    { label: 'Converted', value: data.converted, color: 'bg-green-500' },
  ]

  const maxValue = data.total || 1

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        const percentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0
        const dropoff = index > 0 ? stages[index - 1].value - stage.value : 0

        return (
          <div key={stage.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {stage.label}
              </span>
              <span className="text-gray-900 dark:text-white font-semibold">
                {stage.value}
              </span>
            </div>
            <div className="relative h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <div
                className={`${stage.color} h-full flex items-center justify-center text-white font-medium text-sm transition-all`}
                style={{ width: `${percentage}%` }}
              >
                {percentage > 15 && `${percentage.toFixed(1)}%`}
              </div>
            </div>
            {dropoff > 0 && (
              <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <span>↓ {dropoff} lost</span>
                <span className="text-gray-500">
                  ({((dropoff / stages[index - 1].value) * 100).toFixed(1)}% drop)
                </span>
              </div>
            )}
          </div>
        )
      })}
      {data.lost > 0 && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-600 dark:text-red-400 font-medium">Total Lost</span>
            <span className="text-red-600 dark:text-red-400 font-semibold">{data.lost}</span>
          </div>
        </div>
      )}
    </div>
  )
}
