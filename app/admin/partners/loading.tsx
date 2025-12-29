import { StatCardGroupSkeleton } from '@/components/admin/StatCardSkeleton';
import { TableSkeleton } from '@/components/admin/TableSkeleton';

export default function PartnersLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-100 rounded mt-2 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <StatCardGroupSkeleton count={4} />

      {/* Filters Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-10 w-full max-w-md bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-10 w-96 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Partners Table Skeleton */}
      <TableSkeleton rows={5} columns={7} />
    </div>
  );
}
