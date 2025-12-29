import { Skeleton } from '@/components/ui/skeleton';

interface ActivityCardSkeletonProps {
  title?: string;
  itemCount?: number;
}

export function ActivityCardSkeleton({ title, itemCount = 5 }: ActivityCardSkeletonProps) {
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

      {/* Activity Items */}
      <div className="space-y-4">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                {/* Avatar or Icon */}
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

                <div className="space-y-2">
                  {/* Name */}
                  <Skeleton className="h-4 w-32" />

                  {/* Email or subtitle */}
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>

              {/* Status and date */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>

            {/* Value or action */}
            <div className="text-right">
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
