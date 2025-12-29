import { Skeleton } from '@/components/ui/skeleton';

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Label */}
          <Skeleton className="h-4 w-24" />

          {/* Value */}
          <Skeleton className="h-8 w-32" />

          {/* Change info */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Icon */}
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  );
}

interface StatCardGroupSkeletonProps {
  count?: number;
}

export function StatCardGroupSkeleton({ count = 4 }: StatCardGroupSkeletonProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}
