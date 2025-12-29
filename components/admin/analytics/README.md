# Analytics Dashboard Enhancement Components

## Overview

This directory contains enhanced analytics components for your Next.js admin dashboard, featuring conversion funnel visualization, date range selection, database queries, and A/B testing capabilities.

## Files Created

### Components (`/components/admin/analytics/`)

1. **ConversionFunnel.tsx** (6.1KB)
   - Visual funnel chart using Recharts
   - Shows conversion rates between stages
   - Displays drop-off metrics
   - Fully customizable colors and labels
   - TypeScript typed with `FunnelStage` interface

2. **DateRangeSelector.tsx** (5.7KB)
   - Date range picker with presets: Today, 7d, 30d, 90d, Custom
   - Custom date range input with validation
   - Built with shadcn/ui components
   - TypeScript typed with `DateRangeValue` interface

3. **AnalyticsDashboardExample.tsx** (5.1KB)
   - Complete example integration
   - Shows how to use all components together
   - Includes loading and error states
   - Summary metrics cards

### Database Queries (`/lib/`)

4. **db-queries-funnel.ts** (8.6KB)
   - `getFunnelMetrics(startDate, endDate)` - Get overall funnel metrics
   - `getFunnelStageData(startDate, endDate)` - Get detailed stage data
   - `getFunnelMetricsBySource(startDate, endDate)` - Metrics by traffic source
   - Works with existing database schema
   - TypeScript interfaces: `FunnelMetrics`, `FunnelStageData`

5. **ab-testing.ts** (8.2KB)
   - Simple feature flag system
   - `getVariant(experimentId, userId)` - Deterministic variant assignment
   - `trackConversion(experimentId, userId, variant)` - Track conversions
   - `getExperimentResults(experimentId)` - Get experiment metrics
   - In-memory storage with database persistence
   - TypeScript types: `Experiment`, `VariantType`, `Conversion`

### Documentation

6. **INTEGRATION_GUIDE.md** (6.4KB)
   - Complete integration examples
   - API route patterns
   - Server action examples
   - TypeScript type definitions
   - Customization options

7. **README.md** (this file)
   - File overview and quick reference

## Quick Start

### 1. Import Components

```typescript
import { ConversionFunnel } from '@/components/admin/analytics/ConversionFunnel'
import { DateRangeSelector } from '@/components/admin/analytics/DateRangeSelector'
import { getFunnelMetrics } from '@/lib/db-queries-funnel'
```

### 2. Basic Usage

```typescript
'use client'

import { useState, useEffect } from 'react'
import { ConversionFunnel } from '@/components/admin/analytics/ConversionFunnel'
import { DateRangeSelector } from '@/components/admin/analytics/DateRangeSelector'

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({
    preset: '30d',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  })

  const funnelData = [
    { stage: 'visits', count: 10000, label: 'Visits' },
    { stage: 'leads', count: 1500, label: 'Leads' },
    { stage: 'qualified', count: 750, label: 'Qualified' },
    { stage: 'consultation', count: 300, label: 'Consultation' },
    { stage: 'customer', count: 150, label: 'Customer' },
  ]

  return (
    <div className="space-y-6">
      <DateRangeSelector
        value={dateRange}
        onChange={setDateRange}
      />

      <ConversionFunnel
        data={funnelData}
        showConversionRates={true}
      />
    </div>
  )
}
```

### 3. Fetch Real Data

```typescript
import { getFunnelMetrics } from '@/lib/db-queries-funnel'

// In server component or API route
const metrics = await getFunnelMetrics(startDate, endDate)

const funnelData = [
  { stage: 'visits', count: metrics.visits, label: 'Visits' },
  { stage: 'leads', count: metrics.leads, label: 'Leads' },
  { stage: 'qualified', count: metrics.qualified, label: 'Qualified' },
  { stage: 'consultation', count: metrics.consultation, label: 'Consultation' },
  { stage: 'customer', count: metrics.customer, label: 'Customer' },
]
```

### 4. A/B Testing

```typescript
import { getVariant, trackConversion } from '@/lib/ab-testing'

const variant = getVariant('my-experiment', userId)

// Show variant content
if (variant === 'variant_a') {
  // Show variant A
} else {
  // Show control
}

// Track conversion
trackConversion('my-experiment', userId, variant, 'signup')
```

## Dependencies

All required dependencies are already installed:

- **recharts** (2.15.4) - For funnel visualization
- **@radix-ui/** components - For UI elements
- **@neondatabase/serverless** - For database queries
- **lucide-react** - For icons

## Database Schema

The funnel queries use existing tables:

- `onboarding_submissions` - Tracks visits and leads
- `calendar_bookings` - Tracks consultations
- `orders` - Tracks customers

The A/B testing system creates its own table:

- `ab_test_conversions` - Stores conversion events

## TypeScript Types

### ConversionFunnel

```typescript
interface FunnelStage {
  stage: string
  count: number
  label: string
}

interface ConversionFunnelProps {
  data: FunnelStage[]
  title?: string
  description?: string
  colors?: string[]
  showConversionRates?: boolean
}
```

### DateRangeSelector

```typescript
type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'custom'

interface DateRangeValue {
  preset: DateRangePreset
  startDate: Date
  endDate: Date
}

interface DateRangeSelectorProps {
  value?: DateRangeValue
  onChange: (value: DateRangeValue) => void
  className?: string
  showLabels?: boolean
}
```

### Database Queries

```typescript
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
```

### A/B Testing

```typescript
type VariantType = 'control' | 'variant_a' | 'variant_b' | 'variant_c'

interface Experiment {
  id: string
  name: string
  variants: VariantType[]
  status: 'draft' | 'active' | 'paused' | 'completed'
  // ...
}
```

## Features

### ConversionFunnel
- ✅ Visual funnel chart with Recharts
- ✅ Stage-by-stage conversion rates
- ✅ Drop-off analysis
- ✅ Custom colors
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Interactive tooltips

### DateRangeSelector
- ✅ Preset ranges (Today, 7d, 30d, 90d)
- ✅ Custom date range picker
- ✅ Date validation
- ✅ Responsive layout
- ✅ shadcn/ui integration
- ✅ Dark mode support

### Database Queries
- ✅ Date range filtering
- ✅ Source/channel grouping
- ✅ Conversion rate calculations
- ✅ Type-safe queries
- ✅ Error handling

### A/B Testing
- ✅ Deterministic variant assignment
- ✅ Conversion tracking
- ✅ Experiment results
- ✅ Database persistence
- ✅ Multiple variants support

## Next Steps

1. **Add to your admin dashboard**
   - Import components in your admin layout
   - Create API routes for data fetching

2. **Customize for your needs**
   - Adjust funnel stages to match your business
   - Configure colors and styling
   - Add custom metrics

3. **Set up A/B tests**
   - Create experiments for key conversion points
   - Track conversions
   - Analyze results

4. **Monitor and optimize**
   - Watch for funnel drop-offs
   - Test improvements
   - Iterate based on data

## Support

- Full TypeScript support with proper types
- Works with existing database schema
- Uses shadcn/ui components (already installed)
- Recharts for visualizations (already installed)
- All components are "use client" marked for Next.js 15

## File Locations

```
/components/admin/analytics/
  ├── ConversionFunnel.tsx
  ├── DateRangeSelector.tsx
  ├── AnalyticsDashboardExample.tsx
  ├── INTEGRATION_GUIDE.md
  └── README.md

/lib/
  ├── db-queries-funnel.ts
  └── ab-testing.ts
```
