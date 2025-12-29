"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  Phone,
  PhoneOff,
  PhoneIncoming,
  PhoneMissed,
  Clock,
  Play,
  Download,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface VoiceCall {
  id: string
  room_name: string
  caller_id: string
  callee_id: string | null
  call_type: "support" | "user-to-user" | "conference"
  status: "pending" | "ringing" | "connected" | "completed" | "missed" | "failed"
  started_at: string | null
  connected_at: string | null
  ended_at: string | null
  duration_seconds: number | null
  recording_url: string | null
  transcript: string | null
  metadata: Record<string, any>
  created_at: string
  formattedDuration?: string
  participants?: any[]
}

interface CallStats {
  totalCalls: number
  completedCalls: number
  missedCalls: number
  averageDuration: number
  formattedAverageDuration: string
}

export default function AdminCallsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [calls, setCalls] = useState<VoiceCall[]>([])
  const [stats, setStats] = useState<CallStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  })

  const fetchCalls = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
        includeStats: "true",
        allUsers: "true",
      })

      if (statusFilter) {
        params.append("status", statusFilter)
      }

      const response = await fetch(`/api/voice/history?${params}`)
      const data = await response.json()

      if (data.success) {
        setCalls(data.calls)
        setStats(data.stats)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch calls:", error)
    } finally {
      setLoading(false)
    }
  }, [pagination.limit, pagination.offset, statusFilter])

  useEffect(() => {
    if (isLoaded && user) {
      fetchCalls()
    }
  }, [isLoaded, user, fetchCalls])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Phone className="w-4 h-4 text-green-500" />
      case "connected":
        return <PhoneIncoming className="w-4 h-4 text-blue-500 animate-pulse" />
      case "missed":
      case "failed":
        return <PhoneMissed className="w-4 h-4 text-red-500" />
      case "pending":
      case "ringing":
        return <Phone className="w-4 h-4 text-yellow-500 animate-bounce" />
      default:
        return <PhoneOff className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      connected: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      missed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      ringing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString()
  }

  const filteredCalls = calls.filter((call) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    return (
      call.room_name.toLowerCase().includes(searchLower) ||
      call.caller_id.toLowerCase().includes(searchLower) ||
      call.metadata?.participantName?.toLowerCase().includes(searchLower)
    )
  })

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Call History</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Monitor and manage voice calls
          </p>
        </div>
        <button
          onClick={fetchCalls}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff6a1a] hover:bg-[#ea580c] text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Calls</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedCalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <PhoneMissed className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Missed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.missedCalls}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Duration</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.formattedAverageDuration}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search calls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff6a1a]"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="connected">In Progress</option>
            <option value="missed">Missed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Caller
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    No calls found
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(call.status)}
                        {getStatusBadge(call.status)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {call.metadata?.participantName || call.caller_id.slice(0, 12)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {call.room_name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                        {call.call_type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-700 dark:text-gray-300">
                      {call.formattedDuration || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(call.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {call.recording_url && (
                          <>
                            <button
                              onClick={() => window.open(call.recording_url!, "_blank")}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Play Recording"
                            >
                              <Play className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <a
                              href={call.recording_url}
                              download
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              title="Download Recording"
                            >
                              <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </a>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination((p) => ({ ...p, offset: Math.max(0, p.offset - p.limit) }))}
                disabled={pagination.offset === 0}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, offset: p.offset + p.limit }))}
                disabled={!pagination.hasMore}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
