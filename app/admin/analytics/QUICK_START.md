# Analytics Dashboard - Quick Start Guide

## What Was Built

A comprehensive analytics dashboard with **5 interactive charts**, **4 key metric cards**, and **date range filtering**.

## File Structure

```
app/admin/analytics/
├── page.tsx                    # Main dashboard (NEW)
├── page-old.tsx               # Backup of original
├── demo/
│   └── page.tsx               # Test page with sample data
└── README.md                  # Full documentation

components/admin/analytics/
├── RevenueChart.tsx           # Line chart (revenue over time)
├── OrdersStatusChart.tsx      # Pie chart (order breakdown)
├── PartnerPerformanceChart.tsx # Bar chart (partner metrics)
├── LeadFunnelChart.tsx        # Funnel (conversion stages)
├── UserAcquisitionChart.tsx   # Area chart (user growth)
└── DateRangeFilter.tsx        # Date selector (7d/30d/90d/all)

app/api/admin/analytics/
└── route.ts                   # API endpoint for data

lib/
└── db-queries.ts              # Added 6 new query functions
```

## Quick Access

### Main Dashboard
```
URL: http://localhost:3000/admin/analytics
```
Shows real data from your database.

### Demo Page
```
URL: http://localhost:3000/admin/analytics/demo
```
Shows all components with sample data (no database required).

## Features

### 📊 Charts (5 total)

1. **Revenue Over Time** - Line chart showing daily revenue trends
2. **Orders by Status** - Pie chart with status breakdown
3. **Partner Performance** - Bar chart comparing partner metrics
4. **Lead Funnel** - Conversion funnel with drop-off rates
5. **User Acquisition** - Area chart showing user growth

### 📈 Key Metrics (4 cards)

1. **Total Revenue** - With growth % vs previous period
2. **Total Orders** - With average order value
3. **Active Partners** - Partner count
4. **Conversion Rate** - Lead to customer %

### 🔍 Date Filters

- 7 Days
- 30 Days (default)
- 90 Days
- All Time

### 🌙 Dark Mode

All components fully support dark mode.

## How It Works

```
┌─────────────────┐
│   User Clicks   │
│   Date Filter   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Fetch from API Route   │
│  /api/admin/analytics   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   6 Database Queries    │
│   (run in parallel)     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Render Charts with    │
│   Real Data             │
└─────────────────────────┘
```

## Database Queries

All new queries support optional date filtering:

```typescript
// Revenue trends
getRevenueByDate(days?)

// Order status breakdown
getOrdersByStatus(days?)

// Top partners
getPartnerPerformanceData(days?, limit?)

// Conversion funnel
getLeadFunnelData(days?)

// User signups
getUserAcquisitionData(days?)

// Summary metrics
getKeyMetrics(days?)
```

## API Usage

### Request
```
GET /api/admin/analytics?range=30d
```

### Response
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

## Testing

### 1. Test Components (No Database)
```bash
# Visit demo page with sample data
open http://localhost:3000/admin/analytics/demo
```

### 2. Test with Real Data
```bash
# Visit main dashboard
open http://localhost:3000/admin/analytics
```

### 3. Test API Directly
```bash
# Test API endpoint
curl http://localhost:3000/api/admin/analytics?range=7d
```

## Customization

### Change Chart Colors

Edit the component file:
```typescript
// Example: OrdersStatusChart.tsx
const COLORS = {
  pending: '#f59e0b',   // Change to your color
  paid: '#10b981',
  // ...
}
```

### Add New Date Range

Edit `DateRangeFilter.tsx`:
```typescript
const ranges = [
  { value: '24h', label: '24 Hours' },  // Add new range
  { value: '7d', label: '7 Days' },
  // ...
]
```

### Add New Chart

1. Create component: `/components/admin/analytics/NewChart.tsx`
2. Add query: `lib/db-queries.ts`
3. Update API: `/app/api/admin/analytics/route.ts`
4. Add to page: `/app/admin/analytics/page.tsx`

## Troubleshooting

### Charts Not Showing?

1. **Check browser console** for errors
2. **Verify Recharts is installed**: `npm list recharts`
3. **Test API endpoint**: Visit `/api/admin/analytics?range=30d`
4. **Check database connection**: Ensure `DATABASE_URL` is set

### API Returns Empty Data?

1. **Check if you have data** in the database (orders, partners, etc.)
2. **Test queries directly** in your database client
3. **Check date ranges** - data might be outside selected range
4. **Verify table names and columns** match schema

### Dark Mode Issues?

1. Ensure `next-themes` is configured
2. Check Tailwind CSS dark mode is enabled
3. Verify theme provider wraps your app

## Next Steps

1. ✅ Dashboard is ready to use at `/admin/analytics`
2. ✅ Test with demo at `/admin/analytics/demo`
3. ✅ Customize colors and styling as needed
4. ✅ Add more charts or metrics
5. ✅ Deploy to production

## Need More Help?

- **Full Documentation**: `/app/admin/analytics/README.md`
- **Implementation Details**: `/ANALYTICS_IMPLEMENTATION.md`
- **Component Code**: `/components/admin/analytics/`
- **Database Queries**: `/lib/db-queries.ts`

---

**Built with**: Recharts, Next.js 16, React 19, TypeScript, Tailwind CSS
