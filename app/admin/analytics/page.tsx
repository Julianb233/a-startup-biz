import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Deep insights into your business performance
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">24.5%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">$2,340</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer LTV</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">$8,920</p>
            </div>
            <PieChart className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Rate</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">87%</p>
            </div>
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Advanced Analytics Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Comprehensive analytics dashboard with charts, reports, and insights will be available in the next release.
          </p>
          <div className="space-y-2 text-sm text-left bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900">Planned Features:</p>
            <ul className="text-blue-700 space-y-1 ml-4">
              <li>• Revenue and sales trend charts</li>
              <li>• Customer acquisition analytics</li>
              <li>• Service performance metrics</li>
              <li>• Cohort analysis and retention</li>
              <li>• Custom date range reports</li>
              <li>• Export to CSV/PDF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
