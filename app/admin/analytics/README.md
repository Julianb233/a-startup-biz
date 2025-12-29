# Analytics Dashboard

A comprehensive analytics dashboard with real-time data visualization, date range filtering, and multiple chart types using Recharts.

## Features

### 1. Date Range Filtering
- **7 Days**: Last week's data
- **30 Days**: Last month's data
- **90 Days**: Last quarter's data
- **All Time**: Complete historical data

### 2. Key Metrics Cards
- **Total Revenue**: Shows total revenue with growth percentage vs previous period
- **Total Orders**: Order count with average order value
- **Active Partners**: Number of active partner accounts
- **Conversion Rate**: Lead to customer conversion percentage

### 3. Interactive Charts

#### Revenue Over Time (Line Chart)
- Daily revenue trends
- Order count overlay
- Interactive tooltips with currency formatting
- Responsive design for all screen sizes

#### Orders by Status (Pie Chart)
- Visual breakdown of order statuses
- Status distribution: pending, paid, processing, completed, refunded
- Shows both count and monetary value
- Color-coded for easy identification

#### Partner Performance (Bar Chart)
- Top 10 performing partners
- Total leads vs converted leads comparison
- Commission earned per partner
- Sortable by commission amount

#### Lead Conversion Funnel
- Multi-stage funnel visualization
- Stages: Total → Contacted → Qualified → Converted
- Drop-off percentage at each stage
- Lost leads tracking

#### User Acquisition Trend (Area Chart)
- New user signups over time
- Cumulative user count
- Growth trajectory visualization
- Gradient fill for visual appeal

### 4. Dark Mode Support
All charts and components fully support dark mode with appropriate color schemes.

### 5. Responsive Design
- Mobile-first approach
- Grid layouts adapt to screen size
- Touch-friendly chart interactions

## Technical Implementation

### Components

```
components/admin/analytics/
├── RevenueChart.tsx           # Line chart for revenue trends
├── OrdersStatusChart.tsx      # Pie chart for order status
├── PartnerPerformanceChart.tsx # Bar chart for partner metrics
├── LeadFunnelChart.tsx        # Custom funnel visualization
├── UserAcquisitionChart.tsx   # Area chart for user growth
└── DateRangeFilter.tsx        # Date range selector
```

### Database Queries

All analytics queries are in `lib/db-queries.ts`:

- `getRevenueByDate(days?)` - Revenue trends with date filtering
- `getOrdersByStatus(days?)` - Order status breakdown
- `getPartnerPerformanceData(days?, limit?)` - Top partners
- `getLeadFunnelData(days?)` - Conversion funnel metrics
- `getUserAcquisitionData(days?)` - User signup trends
- `getKeyMetrics(days?)` - Summary statistics

### API Routes

**Endpoint**: `/api/admin/analytics`

**Query Parameters**:
- `range`: `7d` | `30d` | `90d` | `all` (default: `30d`)

**Response**:
```json
{
  "revenueData": [...],
  "ordersStatus": [...],
  "partnerPerformance": [...],
  "leadFunnel": {...},
  "userAcquisition": [...],
  "keyMetrics": {...}
}
```

## Usage

### Viewing the Dashboard

Navigate to `/admin/analytics` to view the full analytics dashboard with real data.

### Testing Components

Visit `/admin/analytics/demo` to see all chart components with sample data for testing and development.

### Customization

#### Adding New Metrics

1. Create query function in `lib/db-queries.ts`:
```typescript
export async function getNewMetric(days?: number) {
  let dateFilter = sql``
  if (days) {
    dateFilter = sql`AND created_at >= NOW() - INTERVAL '1 day' * ${days}`
  }

  const result = await sql`
    SELECT ... FROM table WHERE ... ${dateFilter}
  `

  return result
}
```

2. Add to API route in `app/api/admin/analytics/route.ts`:
```typescript
const newMetric = await getNewMetric(days)
return NextResponse.json({ ..., newMetric })
```

3. Create chart component if needed:
```typescript
// components/admin/analytics/NewChart.tsx
export function NewChart({ data }: NewChartProps) {
  return <ResponsiveContainer>...</ResponsiveContainer>
}
```

4. Add to dashboard page:
```tsx
<NewChart data={data.newMetric} />
```

#### Styling Charts

All charts use Tailwind CSS classes and support dark mode:

```tsx
// Light mode colors
className="stroke-gray-200 dark:stroke-gray-700"

// Chart colors
stroke="#3b82f6"  // Blue
fill="#10b981"    // Green
```

#### Date Range Options

To add custom date ranges, update `DateRangeFilter.tsx`:

```typescript
const ranges = [
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  // ... add more
]
```

## Performance Optimizations

1. **Parallel Data Fetching**: All queries run simultaneously using `Promise.all()`
2. **Indexed Queries**: Database queries use indexed columns (`created_at`, `status`)
3. **Chart Memoization**: Recharts components are automatically optimized
4. **Lazy Loading**: Charts render only when data is available
5. **Client-Side Caching**: React state prevents unnecessary re-fetches

## Dependencies

- **recharts**: ^2.15.4 - Chart library
- **lucide-react**: ^0.454.0 - Icons
- **tailwindcss**: ^4.1.9 - Styling
- **@neondatabase/serverless**: ^1.0.2 - Database

## Database Schema Requirements

The analytics dashboard requires these tables:

- `orders` - Order data with `total`, `status`, `created_at`
- `partners` - Partner accounts with `status`
- `partner_leads` - Lead tracking with `status`, `commission`
- `users` - User accounts with `created_at`

## Troubleshooting

### Charts Not Displaying

1. Check browser console for errors
2. Verify API endpoint returns data
3. Ensure Recharts is installed: `npm list recharts`
4. Check dark mode CSS variables are defined

### Slow Loading

1. Add database indexes on `created_at` columns
2. Reduce date range for initial load
3. Consider implementing server-side caching
4. Use pagination for large datasets

### Data Inconsistencies

1. Verify database queries match schema
2. Check date range calculations
3. Ensure proper status filtering
4. Validate number formatting

## Future Enhancements

- [ ] Export charts as PNG/PDF
- [ ] Custom date range picker
- [ ] Real-time updates via WebSocket
- [ ] Comparison mode (period over period)
- [ ] Drill-down capabilities
- [ ] Custom metric builder
- [ ] Scheduled email reports
- [ ] Dashboard templates
- [ ] Advanced filtering (by partner, product, etc.)
- [ ] Predictive analytics
