import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { SortDirection } from '@/hooks/useTableSort'

interface SortableHeaderProps {
  label: string
  sortKey: string
  currentSort: SortDirection
  onSort: (key: string) => void
  align?: 'left' | 'right' | 'center'
  className?: string
}

/**
 * A clickable table header component with sort indicators
 * Cycles through: null -> asc -> desc -> null on click
 */
export function SortableHeader({
  label,
  sortKey,
  currentSort,
  onSort,
  align = 'left',
  className = '',
}: SortableHeaderProps) {
  const alignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  }[align]

  const justifyClass = {
    left: 'justify-start',
    right: 'justify-end',
    center: 'justify-center',
  }[align]

  return (
    <th
      className={`px-6 py-3 ${alignClass} ${className}`}
    >
      <button
        onClick={() => onSort(sortKey)}
        className={`group inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700 transition-colors ${justifyClass}`}
      >
        <span>{label}</span>
        <span className="flex-shrink-0">
          {currentSort === 'asc' ? (
            <ChevronUp className="h-4 w-4 text-gray-700" />
          ) : currentSort === 'desc' ? (
            <ChevronDown className="h-4 w-4 text-gray-700" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          )}
        </span>
      </button>
    </th>
  )
}
