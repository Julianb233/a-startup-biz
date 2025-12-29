'use client'

import { useState } from 'react'

export type DateRange = '7d' | '30d' | '90d' | 'all'

interface DateRangeFilterProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const ranges: Array<{ value: DateRange; label: string }> = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: 'all', label: 'All Time' },
  ]

  return (
    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            value === range.value
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
