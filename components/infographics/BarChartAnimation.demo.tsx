/**
 * BarChartAnimation Demo Page
 *
 * Use this as a standalone demo or copy into your interactive page
 */

'use client';

import React from 'react';
import { BarChartAnimation } from './BarChartAnimation';

export function BarChartDemo() {
  // Q4 2023 Acceleration Data
  const q4Data = [
    { label: 'Q1', value: 10.1 },
    { label: 'Q2', value: 15.2 },
    { label: 'Q3', value: 22.4 },
    { label: 'Q4', value: 30.6 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Hero Spacer */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4">
            Scroll Down
          </h1>
          <p className="text-xl text-gray-400">
            Watch the chart animate as you scroll
          </p>
          <div className="mt-8 animate-bounce">
            <svg
              className="w-8 h-8 mx-auto text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Context Text */}
          <div className="text-center mb-12">
            <p className="text-2xl text-gray-300 mb-4">
              Our unprecedented growth trajectory
            </p>
            <p className="text-lg text-gray-400">
              Revenue acceleration across 2023
            </p>
          </div>

          {/* The Chart */}
          <BarChartAnimation
            data={q4Data}
            title="Q4 2023 Acceleration"
            duration={1.5}
          />

          {/* Follow-up Text */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-400 mb-4">
              Q4 saw our strongest performance yet
            </p>
            <div className="flex justify-center gap-8 text-sm text-gray-500">
              <div>
                <span className="block text-2xl font-bold text-orange-400">3x</span>
                <span>Growth Rate</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-orange-400">30.6%</span>
                <span>Peak Quarter</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-orange-400">203%</span>
                <span>YoY Increase</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Spacer */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            What's Next?
          </h2>
          <p className="text-xl text-gray-400">
            Continue building momentum in 2024
          </p>
        </div>
      </div>
    </div>
  );
}

export default BarChartDemo;
