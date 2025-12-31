# Quick Integration Guide: BarChartAnimation

## Step 1: Import the Component

```tsx
// app/interactive/page.tsx
import { BarChartAnimation } from '@/components/infographics/BarChartAnimation';
```

## Step 2: Prepare Your Data

```tsx
const q4AccelerationData = [
  { label: 'Q1', value: 10.1 },
  { label: 'Q2', value: 15.2 },
  { label: 'Q3', value: 22.4 },
  { label: 'Q4', value: 30.6 },
];
```

## Step 3: Add to Your Page

```tsx
export default function InteractivePage() {
  const q4AccelerationData = [
    { label: 'Q1', value: 10.1 },
    { label: 'Q2', value: 15.2 },
    { label: 'Q3', value: 22.4 },
    { label: 'Q4', value: 30.6 },
  ];

  return (
    <main className="bg-gray-900">
      {/* Your existing sections */}

      <section className="py-20">
        <BarChartAnimation
          data={q4AccelerationData}
          title="Q4 2023 Acceleration"
          duration={1.5}
          className="container mx-auto"
        />
      </section>

      {/* More sections */}
    </main>
  );
}
```

## Complete Example with Context

```tsx
'use client';

import { BarChartAnimation } from '@/components/infographics/BarChartAnimation';

export default function InteractivePage() {
  const q4Data = [
    { label: 'Q1', value: 10.1 },
    { label: 'Q2', value: 15.2 },
    { label: 'Q3', value: 22.4 },
    { label: 'Q4', value: 30.6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">
          Interactive Experience
        </h1>
      </section>

      {/* Chart Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {/* Optional intro text */}
          <div className="text-center mb-12">
            <p className="text-xl text-gray-300">
              Our unprecedented growth trajectory
            </p>
          </div>

          {/* Bar Chart */}
          <BarChartAnimation
            data={q4Data}
            title="Q4 2023 Acceleration"
            duration={1.5}
          />

          {/* Optional follow-up text */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-400">
              Scroll down to see our roadmap
            </p>
          </div>
        </div>
      </section>

      {/* More sections */}
    </div>
  );
}
```

## Customization Options

### Faster Animation

```tsx
<BarChartAnimation
  data={q4Data}
  title="Q4 2023 Acceleration"
  duration={1}  // 1 second instead of 1.5
/>
```

### With Custom Styling

```tsx
<BarChartAnimation
  data={q4Data}
  title="Q4 2023 Acceleration"
  className="bg-black/50 rounded-2xl p-8"
/>
```

### Multiple Charts

```tsx
function InteractivePage() {
  const revenueData = [
    { label: 'Q1', value: 10.1 },
    { label: 'Q2', value: 15.2 },
    { label: 'Q3', value: 22.4 },
    { label: 'Q4', value: 30.6 },
  ];

  const growthData = [
    { label: 'Jan', value: 12.5 },
    { label: 'Feb', value: 18.3 },
    { label: 'Mar', value: 24.7 },
    { label: 'Apr', value: 31.2 },
  ];

  return (
    <div>
      <BarChartAnimation
        data={revenueData}
        title="Q4 2023 Acceleration"
      />

      <div className="h-40" /> {/* Spacer */}

      <BarChartAnimation
        data={growthData}
        title="Monthly Growth Rate"
      />
    </div>
  );
}
```

## Troubleshooting

### Chart not animating?

Make sure your page has scroll capability:

```tsx
<div className="overflow-y-auto h-screen">
  <BarChartAnimation ... />
</div>
```

### TypeScript errors?

Import the types:

```tsx
import type { ChartDataPoint } from '@/components/infographics/types';

const data: ChartDataPoint[] = [
  { label: 'Q1', value: 10.1 },
];
```

### Mobile display issues?

The component is already mobile-responsive, but ensure parent container allows proper width:

```tsx
<div className="w-full px-4 md:px-8">
  <BarChartAnimation ... />
</div>
```

## Next Steps

1. Add the component to your interactive page
2. Test scroll animations
3. Customize colors if needed
4. Add surrounding content for context

## Support

See `README.md` for full documentation and advanced features.
