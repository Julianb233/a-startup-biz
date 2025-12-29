import { StatCardGroupSkeleton } from '@/components/admin/StatCardSkeleton';
import { ActivityCardSkeleton } from '@/components/admin/ActivityCardSkeleton';
import { ChartCardSkeleton } from '@/components/admin/ChartSkeleton';

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-100 rounded mt-2 animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <StatCardGroupSkeleton count={4} />

      {/* Recent Activity Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityCardSkeleton title="Recent Orders" itemCount={5} />
        <ActivityCardSkeleton title="Upcoming Consultations" itemCount={5} />
      </div>

      {/* Performance Summary Skeleton */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <div className="h-6 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-8 w-24 bg-gray-300 rounded animate-pulse" />
              <div className="h-3 w-40 bg-gray-200 rounded mt-2 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Partner Leaderboard Skeleton */}
      <ChartCardSkeleton title="Partner Leaderboard" />
    </div>
  );
}
