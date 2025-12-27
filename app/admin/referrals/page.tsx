import { UserCheck, TrendingUp, DollarSign, Users } from 'lucide-react';

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referral Management</h1>
        <p className="text-gray-600 mt-1">
          Track and manage customer referrals and commissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">142</p>
            </div>
            <UserCheck className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-green-600 mt-1">87</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Commissions</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">$12,450</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Referrers</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">34</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <UserCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Referral Management Coming Soon
          </h2>
          <p className="text-gray-600 mb-6">
            Full referral tracking, commission management, and analytics will be available in the next release.
          </p>
          <div className="space-y-2 text-sm text-left bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900">Planned Features:</p>
            <ul className="text-blue-700 space-y-1 ml-4">
              <li>• Track all referral links and clicks</li>
              <li>• Automatic commission calculations</li>
              <li>• Referrer leaderboard and rankings</li>
              <li>• Commission payment processing</li>
              <li>• Detailed referral analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
