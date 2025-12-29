import { useState, useMemo } from 'react'

export type SortDirection = 'asc' | 'desc' | null
export type SortConfig = { key: string; direction: SortDirection }

/**
 * A reusable hook for table sorting with client-side data
 * @param data - The array of data to sort
 * @param initialSort - Optional initial sort configuration
 * @returns Sorted data, sort config, and functions to manage sorting
 */
export function useTableSort<T extends Record<string, any>>(
  data: T[],
  initialSort?: SortConfig
) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(
    initialSort || { key: '', direction: null }
  )

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data
    }

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return 1
      if (bValue == null) return -1

      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      // Handle string values (case-insensitive)
      const aString = String(aValue).toLowerCase()
      const bString = String(bValue).toLowerCase()

      if (aString < bString) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aString > bString) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })

    return sorted
  }, [data, sortConfig])

  /**
   * Request a sort on a specific key
   * Cycles through: null -> asc -> desc -> null
   */
  const requestSort = (key: string) => {
    let direction: SortDirection = 'asc'

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'
      } else if (sortConfig.direction === 'desc') {
        direction = null
      }
    }

    setSortConfig({ key, direction })
  }

  /**
   * Get the sort icon name for a column
   * Returns 'asc' | 'desc' | null
   */
  const getSortIcon = (key: string): SortDirection => {
    if (sortConfig.key === key) {
      return sortConfig.direction
    }
    return null
  }

  return {
    sortedData,
    sortConfig,
    requestSort,
    getSortIcon,
  }
}
