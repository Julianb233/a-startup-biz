import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  // Column widths for more realistic appearance
  const columnWidths = [
    'w-1/4', // First column - wider for names
    'w-1/6', // Second column
    'w-1/6', // Third column
    'w-1/6', // Fourth column
    'w-1/6', // Fifth column
    'w-1/12', // Last column - narrower for actions
  ];

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header Skeleton */}
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th
                  key={`header-${colIndex}`}
                  className="px-6 py-3 text-left"
                >
                  <Skeleton className="h-4 w-24" />
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Skeleton */}
          <tbody className="divide-y divide-gray-200 bg-white">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={`row-${rowIndex}`} className="hover:bg-gray-50">
                {Array.from({ length: columns }).map((_, colIndex) => {
                  // Vary skeleton widths for more realistic appearance
                  const isFirstColumn = colIndex === 0;
                  const isLastColumn = colIndex === columns - 1;

                  return (
                    <td key={`cell-${rowIndex}-${colIndex}`} className="px-6 py-4">
                      {isFirstColumn ? (
                        // First column: Two lines (name + email style)
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ) : isLastColumn ? (
                        // Last column: Button-like skeleton
                        <div className="flex justify-end">
                          <Skeleton className="h-8 w-16" />
                        </div>
                      ) : colIndex === 1 ? (
                        // Status badge style
                        <Skeleton className="h-6 w-20 rounded-full" />
                      ) : (
                        // Regular data cells with varying widths
                        <div className="space-y-1">
                          <Skeleton className={`h-4 ${colIndex % 2 === 0 ? 'w-16' : 'w-20'}`} />
                          {colIndex === 2 && <Skeleton className="h-3 w-12" />}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}
