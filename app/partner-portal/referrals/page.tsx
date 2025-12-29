"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import PartnerLayout from "@/components/partner-layout"
import ReferralLinkGenerator from "@/components/partner/ReferralLinkGenerator"
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Loader2,
  RefreshCw,
  Phone,
  Mail,
} from "lucide-react"

interface Lead {
  id: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  service: string
  status: string
  commission: number
  commissionPaid: boolean
  createdAt: string
  convertedAt?: string
}

interface LeadsResponse {
  leads: Lead[]
  total: number
  limit: number
  offset: number
}

export default function ReferralsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [leads, setLeads] = useState<Lead[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const statuses = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "converted", label: "Converted" },
    { value: "lost", label: "Lost" },
  ]

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (statusFilter !== "all") {
        params.set("status", statusFilter)
      }
      params.set("limit", "100")

      const response = await fetch(`/api/partner/leads?${params.toString()}`)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your referrals")
        }
        if (response.status === 403) {
          throw new Error("Your partner account is not active")
        }
        if (response.status === 404) {
          throw new Error("Partner account not found")
        }
        throw new Error("Failed to fetch referrals")
      }

      const data: LeadsResponse = await response.json()
      setLeads(data.leads)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "converted":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "contacted":
      case "qualified":
        return <TrendingUp className="w-4 h-4" />
      case "lost":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "converted":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "contacted":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "qualified":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "lost":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateString))
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const statusCounts = {
    all: leads.length,
    pending: leads.filter((l) => l.status === "pending").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  }

  const totalEarnings = leads
    .filter((l) => l.status === "converted")
    .reduce((sum, l) => sum + l.commission, 0)

  const pendingEarnings = leads
    .filter((l) => l.status === "converted" && !l.commissionPaid)
    .reduce((sum, l) => sum + l.commission, 0)

  const handleExport = () => {
    const csv = [
      ["ID", "Client", "Email", "Phone", "Service", "Status", "Commission", "Date", "Converted Date"].join(","),
      ...filteredLeads.map((lead) =>
        [
          lead.id,
          `"${lead.clientName}"`,
          lead.clientEmail,
          lead.clientPhone || "",
          `"${lead.service}"`,
          lead.status,
          lead.commission,
          formatDate(lead.createdAt),
          lead.convertedAt ? formatDate(lead.convertedAt) : "",
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `referrals-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <PartnerLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-[#ff6a1a]" />
        </div>
      </PartnerLayout>
    )
  }

  if (error) {
    return (
      <PartnerLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-800 mb-2">Error Loading Referrals</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchLeads}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </PartnerLayout>
    )
  }

  return (
    <PartnerLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Referrals
            </h1>
            <p className="text-gray-600">
              Track and manage all your client referrals
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchLeads}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-all shadow-lg shadow-orange-500/20"
            >
              <Download className="w-5 h-5" />
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* Referral Link Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ReferralLinkGenerator />
        </motion.div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Referrals",
              value: total,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Converted",
              value: statusCounts.converted,
              color: "from-green-500 to-green-600",
            },
            {
              label: "In Progress",
              value: statusCounts.contacted + statusCounts.qualified,
              color: "from-yellow-500 to-yellow-600",
            },
            {
              label: "Total Earned",
              value: formatCurrency(totalEarnings),
              subtitle: pendingEarnings > 0 ? `${formatCurrency(pendingEarnings)} pending` : undefined,
              color: "from-[#ff6a1a] to-[#e55f17]",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by client, service, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {statuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    statusFilter === status.value
                      ? "bg-[#ff6a1a] text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.label}
                  <span className="ml-2 text-xs opacity-75">
                    ({statusCounts[status.value as keyof typeof statusCounts]})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredLeads.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {total}
            </span>{" "}
            referrals
          </div>
        </motion.div>

        {/* Referrals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {lead.clientName}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" />
                            {lead.clientEmail}
                          </span>
                          {lead.clientPhone && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              {lead.clientPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">
                        {lead.service}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {getStatusIcon(lead.status)}
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            lead.status === "converted"
                              ? "text-green-600"
                              : lead.status === "lost"
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {formatCurrency(lead.commission)}
                        </p>
                        {lead.status === "converted" && (
                          <p className={`text-xs mt-0.5 ${lead.commissionPaid ? "text-green-600" : "text-yellow-600"}`}>
                            {lead.commissionPaid ? "Paid" : "Pending payout"}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(lead.createdAt)}
                      </div>
                      {lead.convertedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Converted: {formatDate(lead.convertedAt)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedLead(lead)}
                          className="p-2 text-gray-400 hover:text-[#ff6a1a] rounded-lg hover:bg-gray-100 transition-all"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredLeads.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {leads.length === 0 ? "No referrals yet" : "No referrals found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {leads.length === 0
                  ? "Start sharing your referral link to earn commissions!"
                  : "Try adjusting your search or filters"}
              </p>
              {leads.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                  }}
                  className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-all"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Lead Detail Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedLead(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Referral Details</h3>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedLead.clientName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedLead.clientEmail}</p>
                  </div>
                  {selectedLead.clientPhone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">{selectedLead.clientPhone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="text-sm text-gray-900">{selectedLead.service}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(
                        selectedLead.status
                      )}`}
                    >
                      {getStatusIcon(selectedLead.status)}
                      {selectedLead.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Commission</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(selectedLead.commission)}
                    </p>
                    {selectedLead.status === "converted" && (
                      <p className={`text-xs ${selectedLead.commissionPaid ? "text-green-600" : "text-yellow-600"}`}>
                        {selectedLead.commissionPaid ? "Paid" : "Pending payout"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedLead.createdAt)}</p>
                  </div>
                  {selectedLead.convertedAt && (
                    <div>
                      <p className="text-sm text-gray-500">Converted</p>
                      <p className="text-sm text-green-600">{formatDate(selectedLead.convertedAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </PartnerLayout>
  )
}
