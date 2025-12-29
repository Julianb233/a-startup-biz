'use client'

import { useState } from 'react'
import { Trophy, Medal, Award, TrendingUp, Users, DollarSign } from 'lucide-react'
import type { LeaderboardEntry } from '@/lib/db-queries-leaderboard'

interface PartnerLeaderboardProps {
  leaderboardByConversions: LeaderboardEntry[]
  leaderboardByEarnings: LeaderboardEntry[]
}

type SortMode = 'conversions' | 'earnings'

export default function PartnerLeaderboard({
  leaderboardByConversions,
  leaderboardByEarnings,
}: PartnerLeaderboardProps) {
  const [sortMode, setSortMode] = useState<SortMode>('conversions')

  const leaderboard = sortMode === 'conversions' ? leaderboardByConversions : leaderboardByEarnings

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <div className="w-6 h-6 flex items-center justify-center text-sm font-semibold text-gray-400">#{rank}</div>
  }

  const getTierBadge = (tier: 'bronze' | 'silver' | 'gold') => {
    const styles = {
      gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
      silver: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
      bronze: 'bg-gradient-to-r from-amber-600 to-amber-800 text-white',
    }

    const labels = {
      gold: 'Gold Partner',
      silver: 'Silver Partner',
      bronze: 'Bronze Partner',
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[tier]}`}>
        {labels[tier]}
      </span>
    )
  }

  const getRankRowStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
    if (rank === 2) return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
    if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200'
    return 'bg-white border-gray-100 hover:bg-gray-50'
  }

  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Partner Leaderboard
            </h2>
            <p className="text-sm text-gray-600 mt-1">Top performing partners</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setSortMode('conversions')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              sortMode === 'conversions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              By Conversions
            </div>
          </button>
          <button
            onClick={() => setSortMode('earnings')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              sortMode === 'earnings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-4 h-4" />
              By Earnings
            </div>
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="divide-y divide-gray-100">
        {leaderboard.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No partner data available yet</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.partner_id}
              className={`p-4 border-l-4 transition-colors ${getRankRowStyle(entry.rank)}`}
            >
              <div className="flex items-center gap-4">
                {/* Rank Icon */}
                <div className="flex-shrink-0">{getRankIcon(entry.rank)}</div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {entry.company_name}
                    </h3>
                    {getTierBadge(entry.tier)}
                  </div>
                  {entry.user_name && (
                    <p className="text-sm text-gray-500">{entry.user_name}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  {/* Conversions */}
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Conversions</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {entry.converted_leads}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.conversion_rate.toFixed(1)}% rate
                    </div>
                  </div>

                  {/* Earnings */}
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Earnings</span>
                    </div>
                    <div className="font-bold text-lg text-green-600">
                      {formatCurrency(entry.total_earnings)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.total_leads} leads
                    </div>
                  </div>

                  {/* Trend indicator for top 3 */}
                  {entry.rank <= 3 && (
                    <div className="flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {leaderboard.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                <span className="text-gray-600">Gold: $5,000+</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-500"></div>
                <span className="text-gray-600">Silver: $1,000 - $4,999</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-800"></div>
                <span className="text-gray-600">Bronze: $0 - $999</span>
              </div>
            </div>
            <span className="text-gray-500">
              Showing top {leaderboard.length} partners
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
