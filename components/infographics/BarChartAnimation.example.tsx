/**
 * BarChartAnimation Usage Example
 *
 * This file demonstrates how to use the BarChartAnimation component
 * in your interactive page or any other page.
 */

import { BarChartAnimation } from './BarChartAnimation';

export function InteractivePageExample() {
  // Q4 2023 Acceleration data
  const q4Data = [
    { label: 'Q1', value: 10.1 },
    { label: 'Q2', value: 15.2 },
    { label: 'Q3', value: 22.4 },
    { label: 'Q4', value: 30.6 },
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Other page content */}

      <BarChartAnimation
        data={q4Data}
        title="Q4 2023 Acceleration"
        duration={1.5}
        className="my-16"
      />

      {/* More page content */}
    </div>
  );
}

// Alternative: Custom data example
export function CustomDataExample() {
  const customData = [
    { label: 'Jan', value: 12.5 },
    { label: 'Feb', value: 18.3 },
    { label: 'Mar', value: 24.7 },
    { label: 'Apr', value: 31.2 },
    { label: 'May', value: 28.9 },
  ];

  return (
    <BarChartAnimation
      data={customData}
      title="Monthly Revenue Growth"
      duration={2}
      className="bg-black rounded-lg"
    />
  );
}

// Mobile-optimized example with fewer bars
export function MobileOptimizedExample() {
  const mobileData = [
    { label: 'Q1', value: 10.1 },
    { label: 'Q2', value: 15.2 },
    { label: 'Q3', value: 22.4 },
    { label: 'Q4', value: 30.6 },
  ];

  return (
    <div className="px-2 md:px-8">
      <BarChartAnimation
        data={mobileData}
        title="Quarterly Growth"
        duration={1.2}
      />
    </div>
  );
}
