"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PartnerLayout from "@/components/partner-layout"
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
} from "lucide-react"

export default function ReferralsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const statuses = ["All", "Pending", "In Progress", "Completed", "Cancelled"]

  const referrals = [
    {
      id: "REF-2401",
      client: "Acme Ventures LLC",
      email: "contact@acmeventures.com",
      service: "EIN Filing",
      provider: "TaxPro Solutions",
      status: "Completed",
      commission: "$150",
      date: "2024-01-15",
      completedDate: "2024-01-20",
      notes: "Client was very satisfied with the quick turnaround",
    },
    {
      id: "REF-2402",
      client: "Tech Startup Inc",
      email: "info@techstartup.com",
      service: "Legal Formation",
      provider: "LegalEase Partners",
      status: "Pending",
      commission: "$300",
      date: "2024-01-14",
      completedDate: null,
      notes: "Waiting for client to submit required documents",
    },
    {
      id: "REF-2403",
      client: "Fitness Co",
      email: "hello@fitnessco.com",
      service: "Website Design",
      provider: "WebCraft Studios",
      status: "In Progress",
      commission: "$500",
      date: "2024-01-13",
      completedDate: null,
      notes: "Design phase completed, development in progress",
    },
    {
      id: "REF-2404",
      client: "Restaurant Group",
      email: "admin@restaurantgroup.com",
      service: "Accounting Setup",
      provider: "NumbersFirst CPA",
      status: "Completed",
      commission: "$200",
      date: "2024-01-12",
      completedDate: "2024-01-18",
      notes: "Setup completed successfully",
    },
    {
      id: "REF-2405",
      client: "Retail Store LLC",
      email: "owner@retailstore.com",
      service: "Marketing Campaign",
      provider: "GrowthHub Marketing",
      status: "In Progress",
      commission: "$400",
      date: "2024-01-11",
      completedDate: null,
      notes: "Campaign launched, monitoring performance",
    },
    {
      id: "REF-2406",
      client: "Construction Co",
      email: "info@constructionco.com",
      service: "Business Insurance",
      provider: "CoverRight Insurance",
      status: "Completed",
      commission: "$250",
      date: "2024-01-10",
      completedDate: "2024-01-16",
      notes: "Policy activated",
    },
    {
      id: "REF-2407",
      client: "Coffee Shop Inc",
      email: "hello@coffeeshop.com",
      service: "Business Banking",
      provider: "BizBank Pro",
      status: "Pending",
      commission: "$175",
      date: "2024-01-09",
      completedDate: null,
      notes: "Application submitted, awaiting approval",
    },
    {
      id: "REF-2408",
      client: "SaaS Startup",
      email: "team@saasstartup.com",
      service: "HR Services",
      provider: "HireWise HR",
      status: "Cancelled",
      commission: "$0",
      date: "2024-01-08",
      completedDate: null,
      notes: "Client decided to handle internally",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />
      case "Pending":
        return <Clock className="w-4 h-4" />
      case "In Progress":
        return <TrendingUp className="w-4 h-4" />
      case "Cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      referral.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      referral.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "All" || referral.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    All: referrals.length,
    Pending: referrals.filter((r) => r.status === "Pending").length,
    "In Progress": referrals.filter((r) => r.status === "In Progress").length,
    Completed: referrals.filter((r) => r.status === "Completed").length,
    Cancelled: referrals.filter((r) => r.status === "Cancelled").length,
  }

  const totalEarnings = referrals
    .filter((r) => r.status === "Completed")
    .reduce((sum, r) => sum + parseInt(r.commission.replace("$", "")), 0)

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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-all shadow-lg shadow-orange-500/20"
          >
            <Download className="w-5 h-5" />
            Export Report
          </motion.button>
        </motion.div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Referrals",
              value: referrals.length,
              color: "from-blue-500 to-blue-600",
            },
            {
              label: "Completed",
              value: statusCounts.Completed,
              color: "from-green-500 to-green-600",
            },
            {
              label: "In Progress",
              value: statusCounts["In Progress"],
              color: "from-yellow-500 to-yellow-600",
            },
            {
              label: "Total Earned",
              value: `$${totalEarnings.toLocaleString()}`,
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
                placeholder="Search by client, service, provider, or ID..."
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
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? "bg-[#ff6a1a] text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status}
                  <span className="ml-2 text-xs opacity-75">
                    ({statusCounts[status as keyof typeof statusCounts]})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredReferrals.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {referrals.length}
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
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Provider
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
                {filteredReferrals.map((referral, index) => (
                  <motion.tr
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-mono font-semibold text-gray-900">
                        {referral.id}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {referral.client}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">
                        {referral.service}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700">
                        {referral.provider}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          referral.status
                        )}`}
                      >
                        {getStatusIcon(referral.status)}
                        {referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p
                        className={`text-sm font-semibold ${
                          referral.status === "Completed"
                            ? "text-green-600"
                            : referral.status === "Cancelled"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {referral.commission}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {referral.date}
                      </div>
                      {referral.completedDate && (
                        <p className="text-xs text-green-600 mt-1">
                          Done: {referral.completedDate}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
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
          {filteredReferrals.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No referrals found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("All")
                }}
                className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </PartnerLayout>
  )
}
