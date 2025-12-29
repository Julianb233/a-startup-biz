import { Skeleton } from '@/components/ui/skeleton';

interface ChartSkeletonProps {
  variant?: 'bar' | 'line' | 'area';
  height?: string;
}

export function ChartSkeleton({ variant = 'bar', height = 'h-64' }: ChartSkeletonProps) {
  return (
    <div className={`w-full ${height} flex items-end justify-between gap-2 p-4`}>
      {variant === 'bar' ? (
        // Bar chart skeleton
        <>
          {Array.from({ length: 7 }).map((_, index) => {
            // Random-ish heights for more realistic appearance
            const heights = ['h-3/4', 'h-1/2', 'h-2/3', 'h-4/5', 'h-1/3', 'h-3/5', 'h-2/4'];
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton className={`w-full ${heights[index]} rounded-t`} />
                <Skeleton className="h-3 w-8" />
              </div>
            );
          })}
        </>
      ) : variant === 'line' ? (
        // Line chart skeleton
        <div className="w-full h-full relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pr-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-8" />
            ))}
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full flex flex-col">
            <div className="flex-1 flex items-center">
              <Skeleton className="w-full h-32" />
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between pt-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-10" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Area chart skeleton (similar to line)
        <div className="w-full h-full relative">
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pr-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-3 w-8" />
            ))}
          </div>

          <div className="ml-12 h-full flex flex-col">
            <div className="flex-1 flex items-end">
              <Skeleton className="w-full h-40 rounded-t-lg" />
            </div>

            <div className="flex justify-between pt-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-10" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ChartCardSkeleton({ title }: { title?: string }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        {title ? (
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        ) : (
          <Skeleton className="h-6 w-32" />
        )}
        <Skeleton className="h-4 w-16" />
      </div>

      {/* Chart */}
      <ChartSkeleton variant="bar" />
    </div>
  );
}
