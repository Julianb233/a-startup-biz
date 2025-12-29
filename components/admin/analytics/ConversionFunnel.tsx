'use client'

import { useMemo } from 'react'
import {
  FunnelChart,
  Funnel,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface FunnelStage {
  stage: string
  count: number
  label: string
}

export interface ConversionFunnelProps {
  data: FunnelStage[]
  title?: string
  description?: string
  colors?: string[]
  showConversionRates?: boolean
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
]

export function ConversionFunnel({
  data,
  title = 'Conversion Funnel',
  description = 'Track user journey from visits to customers',
  colors = DEFAULT_COLORS,
  showConversionRates = true,
}: ConversionFunnelProps) {
  // Calculate conversion rates between stages
  const enhancedData = useMemo(() => {
    return data.map((stage, index) => {
      const previousCount = index > 0 ? data[index - 1].count : stage.count
      const conversionRate = previousCount > 0 ? (stage.count / previousCount) * 100 : 100
      const dropOffRate = 100 - conversionRate
      const dropOffCount = previousCount - stage.count

      return {
        ...stage,
        name: stage.label,
        value: stage.count,
        conversionRate: conversionRate.toFixed(1),
        dropOffRate: dropOffRate.toFixed(1),
        dropOffCount,
        fill: colors[index % colors.length],
      }
    })
  }, [data, colors])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              Count: <span className="font-semibold">{data.value.toLocaleString()}</span>
            </p>
            {showConversionRates && data.stage !== data.stage[0] && (
              <>
                <p className="text-green-600 dark:text-green-400">
                  Conversion: <span className="font-semibold">{data.conversionRate}%</span>
                </p>
                <p className="text-red-600 dark:text-red-400">
                  Drop-off: <span className="font-semibold">{data.dropOffCount.toLocaleString()}</span> (
                  {data.dropOffRate}%)
                </p>
              </>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Recharts Funnel Visualization */}
          <ResponsiveContainer width="100%" height={400}>
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel dataKey="value" data={enhancedData} isAnimationActive>
                <LabelList
                  position="right"
                  fill="#000"
                  stroke="none"
                  dataKey="name"
                  className="text-sm font-medium"
                />
                {enhancedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>

          {/* Conversion Rate Metrics */}
          {showConversionRates && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Stage-by-Stage Conversion
              </h4>
              <div className="grid gap-3">
                {enhancedData.map((stage, index) => {
                  if (index === 0) return null // Skip first stage
                  return (
                    <div
                      key={stage.stage}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stage.fill }}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {enhancedData[index - 1].name} → {stage.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                          {stage.conversionRate}%
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {stage.dropOffCount.toLocaleString()} lost
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Overall Conversion Rate */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 rounded-lg">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Overall Conversion Rate
                  </span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {data.length > 0
                      ? ((data[data.length - 1].count / data[0].count) * 100).toFixed(2)
                      : '0.00'}
                    %
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
