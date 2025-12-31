# BarChartAnimation Component

A high-performance, scroll-triggered animated bar chart component built with GSAP 3.14.2 and React.

## Features

- ✨ Smooth GSAP scroll-triggered animations
- 📊 Auto-scaling bars based on data values
- 🎨 Orange gradient fills with customizable colors
- 📱 Fully responsive (mobile-first design)
- 🎯 Q4 bar emphasis with pulse effect
- 🔢 Animated counter for percentage labels
- ⚡ Performance-optimized with useGSAP hook
- 🎭 Staggered entrance animations (0.15s delay)

## Installation

```bash
# Dependencies already installed in a-startup-biz
npm install gsap@3.14.2 @gsap/react@2.1.2
```

## Basic Usage

```tsx
import { BarChartAnimation } from '@/components/infographics/BarChartAnimation';

function MyPage() {
  const data = [
    { label: 'Q1', value: 10.1 },
    { label: 'Q2', value: 15.2 },
    { label: 'Q3', value: 22.4 },
    { label: 'Q4', value: 30.6 },
  ];

  return (
    <BarChartAnimation
      data={data}
      title="Q4 2023 Acceleration"
      duration={1.5}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartDataPoint[]` | **Required** | Array of `{label, value}` objects |
| `title` | `string` | **Required** | Chart title displayed at top |
| `duration` | `number` | `1.5` | Animation duration in seconds |
| `className` | `string` | `''` | Additional Tailwind classes |

### ChartDataPoint Interface

```typescript
interface ChartDataPoint {
  label: string;  // Quarter label (e.g., "Q1", "Q2")
  value: number;  // Percentage value (e.g., 10.1)
}
```

## Animation Details

### Timeline Sequence

1. **Title fade-in** (0-0.8s): Y-axis slide + opacity
2. **Bars grow** (staggered 0.15s): Scale from 0 to target height
3. **Counter animation**: Numbers count up to final values
4. **Q4 emphasis** (after bars): Subtle pulse effect on last bar
5. **Labels fade-in**: Quarter labels appear below bars

### Scroll Trigger

- **Trigger point**: When chart is 80% from top of viewport
- **Start**: `top 80%`
- **Toggle actions**: `play none none reverse`
- Animations reverse when scrolling back up

## Styling

### Color Scheme

- **Bar gradient**: `#ff6a1a` → `#ff8a4a` (orange)
- **Q4 highlight**: Brighter gradient + shadow
- **Labels**: White (`#ffffff`)
- **Grid lines**: Gray-700 with 30% opacity
- **Background**: Transparent (parent controls)

### Responsive Design

```css
/* Mobile (< 768px) */
- Smaller gaps between bars (16px)
- Font sizes: title 3xl, labels base
- Reduced padding (16px)

/* Desktop (>= 768px) */
- Larger gaps between bars (32px)
- Font sizes: title 4xl, labels xl
- Increased padding (32px)
```

## Performance Optimizations

1. **useGSAP hook**: Auto-cleanup of animations
2. **GSAP context**: Scoped animations prevent memory leaks
3. **ScrollTrigger**: Only animates when in viewport
4. **Transform-based animations**: GPU-accelerated
5. **Minimal re-renders**: Optimized state updates

## Advanced Examples

### Custom Colors

```tsx
<BarChartAnimation
  data={data}
  title="Custom Chart"
  className="bg-gradient-to-b from-gray-900 to-black"
/>
```

### Faster Animation

```tsx
<BarChartAnimation
  data={data}
  title="Quick Animation"
  duration={1}  // Faster at 1 second
/>
```

### More Data Points

```tsx
const monthlyData = [
  { label: 'Jan', value: 12.5 },
  { label: 'Feb', value: 18.3 },
  { label: 'Mar', value: 24.7 },
  { label: 'Apr', value: 31.2 },
  { label: 'May', value: 28.9 },
  { label: 'Jun', value: 35.6 },
];

<BarChartAnimation
  data={monthlyData}
  title="Monthly Growth"
  duration={2}
/>
```

## Technical Notes

### GSAP Plugins

The component auto-registers:
- `ScrollTrigger` - Scroll-based animations
- Uses `useGSAP` for React integration

### Browser Support

- Modern browsers with ES6+ support
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Mobile: iOS 14+, Android Chrome 90+

### Accessibility

- Semantic HTML structure
- ARIA-friendly labels
- Keyboard navigation support (inherent)
- Screen reader compatible

## Troubleshooting

### Animations not triggering

```tsx
// Ensure parent has proper scroll container
<div className="overflow-y-auto h-screen">
  <BarChartAnimation ... />
</div>
```

### Bars not showing

```tsx
// Check data values are positive numbers
const data = [
  { label: 'Q1', value: 10.1 }, // ✅ Correct
  { label: 'Q2', value: '15.2' }, // ❌ Wrong (string)
];
```

### Performance issues

```tsx
// Reduce duration for faster animations
<BarChartAnimation
  duration={1}  // Instead of 2
/>
```

## File Structure

```
components/infographics/
├── BarChartAnimation.tsx       # Main component
├── BarChartAnimation.example.tsx  # Usage examples
├── types.ts                    # TypeScript definitions
└── README.md                   # This file
```

## Integration Example

```tsx
// app/interactive/page.tsx
import { BarChartAnimation } from '@/components/infographics/BarChartAnimation';

export default function InteractivePage() {
  const q4Data = [
    { label: 'Q1', value: 10.1 },
    { label: 'Q2', value: 15.2 },
    { label: 'Q3', value: 22.4 },
    { label: 'Q4', value: 30.6 },
  ];

  return (
    <main className="bg-gray-900 min-h-screen">
      <section className="container mx-auto py-20">
        <BarChartAnimation
          data={q4Data}
          title="Q4 2023 Acceleration"
          duration={1.5}
        />
      </section>
    </main>
  );
}
```

## License

Part of A Startup Biz project. All rights reserved.
