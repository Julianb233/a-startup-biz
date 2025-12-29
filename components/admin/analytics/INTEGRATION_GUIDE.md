# Analytics Dashboard Enhancement - Integration Guide

This guide shows how to use the new analytics components in your admin dashboard.

## Components Created

### 1. ConversionFunnel.tsx
A visual funnel chart showing conversion rates between stages using Recharts.

### 2. DateRangeSelector.tsx
A date range picker with presets (Today, 7d, 30d, 90d, Custom) using shadcn/ui components.

### 3. Database Queries (lib/db-queries-funnel.ts)
Functions to fetch funnel metrics from the database:
- `getFunnelMetrics(startDate, endDate)` - Get overall funnel metrics
- `getFunnelStageData(startDate, endDate)` - Get detailed stage data
- `getFunnelMetricsBySource(startDate, endDate)` - Get metrics by traffic source

### 4. A/B Testing System (lib/ab-testing.ts)
Simple feature flag and A/B testing implementation:
- `getVariant(experimentId, userId)` - Get user's variant assignment
- `trackConversion(experimentId, userId, variant)` - Track conversions
- `getExperimentResults(experimentId)` - Get experiment metrics

## Example Usage

### Basic Funnel Chart

```typescript
'use client'

import { useState, useEffect } from 'react'
import { ConversionFunnel } from '@/components/admin/analytics/ConversionFunnel'
import { DateRangeSelector, DateRangeValue } from '@/components/admin/analytics/DateRangeSelector'
import { getFunnelMetrics } from '@/lib/db-queries-funnel'

export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRangeValue>({
    preset: '30d',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  })
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    async function loadMetrics() {
      const data = await getFunnelMetrics(dateRange.startDate, dateRange.endDate)

      // Transform for ConversionFunnel component
      const funnelData = [
        { stage: 'visits', count: data.visits, label: 'Visits' },
        { stage: 'leads', count: data.leads, label: 'Leads' },
        { stage: 'qualified', count: data.qualified, label: 'Qualified' },
        { stage: 'consultation', count: data.consultation, label: 'Consultation' },
        { stage: 'customer', count: data.customer, label: 'Customers' },
      ]

      setMetrics(funnelData)
    }

    loadMetrics()
  }, [dateRange])

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      {/* Date Range Selector */}
      <DateRangeSelector
        value={dateRange}
        onChange={setDateRange}
      />

      {/* Conversion Funnel */}
      {metrics && (
        <ConversionFunnel
          data={metrics}
          title="Customer Journey Funnel"
          description="Track conversion from visits to customers"
          showConversionRates={true}
        />
      )}
    </div>
  )
}
```

### A/B Testing Example

```typescript
import { getVariant, trackConversion } from '@/lib/ab-testing'

// In your component or API route
export function MyComponent({ userId }: { userId: string }) {
  // Get user's variant for this experiment
  const variant = getVariant('homepage-cta-test', userId)

  // Show different content based on variant
  const ctaText = variant === 'control'
    ? 'Get Started'
    : 'Start Free Trial'

  const handleConversion = () => {
    // Track when user converts
    trackConversion(
      'homepage-cta-test',
      userId,
      variant,
      'signup',
      100 // Optional: value in dollars
    )
  }

  return (
    <button onClick={handleConversion}>
      {ctaText}
    </button>
  )
}
```

### Server Action for Fetching Metrics

```typescript
// app/admin/actions.ts
'use server'

import { getFunnelMetrics, getFunnelMetricsBySource } from '@/lib/db-queries-funnel'

export async function getAnalyticsData(startDate: Date, endDate: Date) {
  const metrics = await getFunnelMetrics(startDate, endDate)
  const metricsBySource = await getFunnelMetricsBySource(startDate, endDate)

  return {
    metrics,
    metricsBySource,
  }
}
```

## API Integration

If you prefer to use API routes instead of server actions:

```typescript
// app/api/analytics/funnel/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getFunnelMetrics } from '@/lib/db-queries-funnel'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const startDate = new Date(searchParams.get('startDate') || Date.now() - 30 * 24 * 60 * 60 * 1000)
  const endDate = new Date(searchParams.get('endDate') || Date.now())

  try {
    const metrics = await getFunnelMetrics(startDate, endDate)
    return NextResponse.json(metrics)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
```

## Database Setup

The funnel queries work with existing tables:
- `onboarding_submissions` - Tracks leads
- `calendar_bookings` - Tracks consultations
- `orders` - Tracks customers

For A/B testing, a table is auto-created:
- `ab_test_conversions` - Stores conversion events

## Customization

### Custom Funnel Colors

```typescript
<ConversionFunnel
  data={funnelData}
  colors={['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
/>
```

### Custom Date Ranges

```typescript
<DateRangeSelector
  value={dateRange}
  onChange={setDateRange}
  showLabels={true}
  className="max-w-2xl"
/>
```

## TypeScript Types

All components are fully typed. Key interfaces:

```typescript
// ConversionFunnel
interface FunnelStage {
  stage: string
  count: number
  label: string
}

// DateRangeSelector
interface DateRangeValue {
  preset: DateRangePreset
  startDate: Date
  endDate: Date
}

// Database Queries
interface FunnelMetrics {
  visits: number
  leads: number
  qualified: number
  consultation: number
  customer: number
  conversionRates: {
    visitsToLeads: number
    leadsToQualified: number
    qualifiedToConsultation: number
    consultationToCustomer: number
    overall: number
  }
}

// A/B Testing
type VariantType = 'control' | 'variant_a' | 'variant_b' | 'variant_c'
```

## Next Steps

1. Add these components to your admin dashboard layout
2. Create an API route or server action to fetch data
3. Implement A/B tests for key conversion points
4. Monitor funnel performance and optimize drop-off stages

## Support

All components use:
- **Recharts** for visualizations (already installed)
- **shadcn/ui** for UI components (already installed)
- **Neon Database** via existing `@/lib/db` connection
- **TypeScript** for type safety
