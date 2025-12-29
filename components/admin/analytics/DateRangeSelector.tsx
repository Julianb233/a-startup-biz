'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'custom'

export interface DateRangeValue {
  preset: DateRangePreset
  startDate: Date
  endDate: Date
}

export interface DateRangeSelectorProps {
  value?: DateRangeValue
  onChange: (value: DateRangeValue) => void
  className?: string
  showLabels?: boolean
}

const PRESET_OPTIONS: Array<{
  value: DateRangePreset
  label: string
  days?: number
}> = [
  { value: 'today', label: 'Today', days: 0 },
  { value: '7d', label: '7 Days', days: 7 },
  { value: '30d', label: '30 Days', days: 30 },
  { value: '90d', label: '90 Days', days: 90 },
  { value: 'custom', label: 'Custom' },
]

function getDateRange(preset: DateRangePreset, customStart?: Date, customEnd?: Date): DateRangeValue {
  const endDate = new Date()
  endDate.setHours(23, 59, 59, 999)

  let startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  switch (preset) {
    case 'today':
      // Start and end are same day
      break
    case '7d':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30d':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '90d':
      startDate.setDate(startDate.getDate() - 90)
      break
    case 'custom':
      if (customStart && customEnd) {
        startDate = new Date(customStart)
        return { preset, startDate, endDate: new Date(customEnd) }
      }
      break
  }

  return { preset, startDate, endDate }
}

export function DateRangeSelector({
  value,
  onChange,
  className,
  showLabels = true,
}: DateRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>(
    value?.preset || '30d'
  )
  const [customStartDate, setCustomStartDate] = useState<string>(
    value?.startDate ? value.startDate.toISOString().split('T')[0] : ''
  )
  const [customEndDate, setCustomEndDate] = useState<string>(
    value?.endDate ? value.endDate.toISOString().split('T')[0] : ''
  )

  const handlePresetChange = (preset: DateRangePreset) => {
    setSelectedPreset(preset)
    if (preset !== 'custom') {
      const range = getDateRange(preset)
      onChange(range)
    }
  }

  const handleCustomDateChange = () => {
    if (customStartDate && customEndDate) {
      const range = getDateRange(
        'custom',
        new Date(customStartDate),
        new Date(customEndDate)
      )
      onChange(range)
    }
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {showLabels && (
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <Label className="text-base font-semibold">Date Range</Label>
            </div>
          )}

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {PRESET_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={selectedPreset === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePresetChange(option.value)}
                className={cn(
                  'transition-all',
                  selectedPreset === option.value &&
                    'bg-[#ff6a1a] hover:bg-[#e55f17] text-white'
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Inputs */}
          {selectedPreset === 'custom' && (
            <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date" className="text-sm">
                    Start Date
                  </Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={customEndDate || new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date" className="text-sm">
                    End Date
                  </Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    min={customStartDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </div>
              </div>
              <Button
                onClick={handleCustomDateChange}
                disabled={!customStartDate || !customEndDate}
                className="w-full sm:w-auto"
                size="sm"
              >
                Apply Custom Range
              </Button>
            </div>
          )}

          {/* Selected Range Display */}
          {value && (
            <div className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-medium">Selected Range: </span>
              {value.startDate.toLocaleDateString()} - {value.endDate.toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
