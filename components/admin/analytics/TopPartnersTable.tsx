'use client'

import { useTableSort } from '@/hooks/useTableSort'
import { SortableHeader } from '@/components/admin/SortableHeader'

interface PartnerData {
  name: string
  leads: number
  converted: number
  commission: number
  conversionRate?: number
}

interface TopPartnersTableProps {
  data: PartnerData[]
}

export function TopPartnersTable({ data }: TopPartnersTableProps) {
  // Add computed conversion rate if not present
  const dataWithConversion = data.map(partner => ({
    ...partner,
    conversionRate: partner.conversionRate ??
      (partner.leads > 0 ? Math.round((partner.converted / partner.leads) * 100) : 0)
  }))

  const { sortedData, requestSort, getSortIcon } = useTableSort(dataWithConversion)

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
        No partner data available
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-2 text-gray-600 dark:text-gray-400 font-medium">
              Partner
            </th>
            <SortableHeader
              label="Leads"
              sortKey="leads"
              currentSort={getSortIcon('leads')}
              onSort={requestSort}
              align="right"
              className="py-2"
            />
            <SortableHeader
              label="Conv %"
              sortKey="conversionRate"
              currentSort={getSortIcon('conversionRate')}
              onSort={requestSort}
              align="right"
              className="py-2"
            />
            <SortableHeader
              label="Commission"
              sortKey="commission"
              currentSort={getSortIcon('commission')}
              onSort={requestSort}
              align="right"
              className="py-2"
            />
          </tr>
        </thead>
        <tbody>
          {sortedData.map((partner, idx) => (
            <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
              <td className="py-3 text-gray-900 dark:text-white">{partner.name}</td>
              <td className="py-3 text-right text-gray-600 dark:text-gray-400">
                {partner.converted}/{partner.leads}
              </td>
              <td className="py-3 text-right">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  partner.conversionRate >= 30
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : partner.conversionRate >= 15
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {partner.conversionRate}%
                </span>
              </td>
              <td className="py-3 text-right font-medium text-green-600 dark:text-green-400">
                {formatCurrency(partner.commission)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
