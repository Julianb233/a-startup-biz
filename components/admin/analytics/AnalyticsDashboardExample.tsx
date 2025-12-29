'use client'

/**
 * Example Analytics Dashboard Component
 *
 * This demonstrates how to integrate the new analytics components:
 * - ConversionFunnel: Visual funnel chart with conversion rates
 * - DateRangeSelector: Date range picker with presets
 * - Database queries for fetching funnel metrics
 *
 * Usage:
 * Import this component in your admin dashboard page
 * or use the individual components separately.
 */

import { useState, useEffect } from 'react'
import { ConversionFunnel, FunnelStage } from './ConversionFunnel'
import { DateRangeSelector, DateRangeValue } from './DateRangeSelector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Example: Server action or API call to fetch data
async function fetchFunnelData(startDate: Date, endDate: Date): Promise<FunnelStage[]> {
  try {
    const response = await fetch(
      `/api/analytics/funnel?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch funnel data')
    }

    const data = await response.json()

    // Transform API response to funnel format
    return [
      { stage: 'visits', count: data.visits || 0, label: 'Website Visits' },
      { stage: 'leads', count: data.leads || 0, label: 'Leads Generated' },
      { stage: 'qualified', count: data.qualified || 0, label: 'Qualified Leads' },
      { stage: 'consultation', count: data.consultation || 0, label: 'Consultation Booked' },
      { stage: 'customer', count: data.customer || 0, label: 'Customers' },
    ]
  } catch (error) {
    console.error('Error fetching funnel data:', error)
    // Return mock data for development
    return [
      { stage: 'visits', count: 10000, label: 'Website Visits' },
      { stage: 'leads', count: 1500, label: 'Leads Generated' },
      { stage: 'qualified', count: 750, label: 'Qualified Leads' },
      { stage: 'consultation', count: 300, label: 'Consultation Booked' },
      { stage: 'customer', count: 150, label: 'Customers' },
    ]
  }
}

export function AnalyticsDashboardExample() {
  // State for date range
  const [dateRange, setDateRange] = useState<DateRangeValue>({
    preset: '30d',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  })

  // State for funnel data
  const [funnelData, setFunnelData] = useState<FunnelStage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch data when date range changes
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const data = await fetchFunnelData(dateRange.startDate, dateRange.endDate)
        setFunnelData(data)
      } catch (err) {
        setError('Failed to load analytics data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [dateRange])

  // Calculate summary metrics
  const totalVisits = funnelData[0]?.count || 0
  const totalCustomers = funnelData[funnelData.length - 1]?.count || 0
  const overallConversion = totalVisits > 0
    ? ((totalCustomers / totalVisits) * 100).toFixed(2)
    : '0.00'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your conversion funnel and customer journey metrics
        </p>
      </div>

      {/* Date Range Selector */}
      <DateRangeSelector
        value={dateRange}
        onChange={setDateRange}
        showLabels={true}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Visits</CardDescription>
            <CardTitle className="text-3xl">{totalVisits.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Top of funnel traffic
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Customers</CardDescription>
            <CardTitle className="text-3xl">{totalCustomers.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Completed conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-3xl">{overallConversion}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Visit to customer conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="pt-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6a1a]"></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversion Funnel Chart */}
      {!loading && !error && funnelData.length > 0 && (
        <ConversionFunnel
          data={funnelData}
          title="Customer Journey Funnel"
          description="Visualize how users move through your conversion funnel"
          showConversionRates={true}
          colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
        />
      )}

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Recommendations based on funnel analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#ff6a1a]">•</span>
              <span>
                Focus on improving the biggest drop-off points in your funnel
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff6a1a]">•</span>
              <span>
                Test different CTAs at each stage to improve conversion rates
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ff6a1a]">•</span>
              <span>
                Monitor date-over-date changes to identify trends early
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
