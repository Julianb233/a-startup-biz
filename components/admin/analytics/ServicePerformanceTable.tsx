'use client'

import { useTableSort } from '@/hooks/useTableSort'
import { SortableHeader } from '@/components/admin/SortableHeader'

interface ServiceData {
  service: string
  orders: number
  revenue: number
  avgValue: number
}

interface ServicePerformanceTableProps {
  data: ServiceData[]
}

export function ServicePerformanceTable({ data }: ServicePerformanceTableProps) {
  const { sortedData, requestSort, getSortIcon } = useTableSort(data)

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No service data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 text-gray-600 dark:text-gray-400 font-medium">
              Service
            </th>
            <SortableHeader
              label="Orders"
              sortKey="orders"
              currentSort={getSortIcon('orders')}
              onSort={requestSort}
              align="right"
              className="py-2"
            />
            <SortableHeader
              label="Revenue"
              sortKey="revenue"
              currentSort={getSortIcon('revenue')}
              onSort={requestSort}
              align="right"
              className="py-2"
            />
            <SortableHeader
              label="Avg Value"
              sortKey="avgValue"
              currentSort={getSortIcon('avgValue')}
              onSort={requestSort}
              align="right"
              className="py-2"
            />
          </tr>
        </thead>
        <tbody>
          {sortedData.map((service, idx) => (
            <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
              <td className="py-3 text-gray-900 dark:text-white">{service.service}</td>
              <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                {service.orders.toLocaleString()}
              </td>
              <td className="py-3 text-right font-medium text-gray-900 dark:text-white">
                {formatCurrency(service.revenue)}
              </td>
              <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                {formatCurrency(service.avgValue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
