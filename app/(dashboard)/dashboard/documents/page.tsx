"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  FolderOpen,
  File,
  FileCheck,
  Clock,
  Lock,
  ChevronRight
} from "lucide-react"

// Mock documents data - will be replaced with real database queries
const documents = [
  {
    id: 1,
    name: "LLC Certificate of Formation",
    type: "Legal Document",
    category: "business_formation",
    uploadDate: "2024-12-15",
    size: "245 KB",
    status: "available",
    service: "Business Formation Package"
  },
  {
    id: 2,
    name: "Operating Agreement",
    type: "Legal Document",
    category: "business_formation",
    uploadDate: "2024-12-15",
    size: "1.2 MB",
    status: "available",
    service: "Business Formation Package"
  },
  {
    id: 3,
    name: "EIN Confirmation Letter",
    type: "Tax Document",
    category: "business_formation",
    uploadDate: "2024-12-15",
    size: "89 KB",
    status: "available",
    service: "Business Formation Package"
  },
  {
    id: 4,
    name: "Website Design Mockups",
    type: "Design Asset",
    category: "website",
    uploadDate: "2024-12-22",
    size: "8.5 MB",
    status: "available",
    service: "Website Development - Starter"
  },
  {
    id: 5,
    name: "Brand Guidelines",
    type: "Design Asset",
    category: "branding",
    uploadDate: "2024-12-20",
    size: "3.2 MB",
    status: "pending",
    service: "Website Development - Starter"
  },
  {
    id: 6,
    name: "Business Strategy Session Notes",
    type: "Consultation Notes",
    category: "consultation",
    uploadDate: "2025-01-05",
    size: "156 KB",
    status: "upcoming",
    service: "Clarity Call - Business Strategy"
  }
]

const categories = [
  { id: "all", name: "All Documents", icon: FolderOpen },
  { id: "business_formation", name: "Business Formation", icon: FileCheck },
  { id: "website", name: "Website & Design", icon: File },
  { id: "branding", name: "Branding", icon: FileText },
  { id: "consultation", name: "Consultation Notes", icon: FileText }
]

const statusConfig = {
  available: {
    label: "Available",
    color: "bg-green-100 text-green-800",
    icon: FileCheck
  },
  pending: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock
  },
  upcoming: {
    label: "Upcoming",
    color: "bg-blue-100 text-blue-800",
    icon: Lock
  }
}

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const availableCount = documents.filter(d => d.status === "available").length
  const pendingCount = documents.filter(d => d.status === "pending" || d.status === "upcoming").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-montserrat text-2xl font-bold text-gray-900">My Documents</h1>
        <p className="text-gray-600 mt-1">Access and download your business documents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">{availableCount}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-[#ff6a1a]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-[#ff6a1a] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-montserrat text-lg font-semibold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Documents from your services will appear here"}
            </p>
          </div>
        ) : (
          filteredDocuments.map((doc, index) => {
            const status = statusConfig[doc.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-gray-900">
                        {doc.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {doc.type} • {doc.size}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        From: {doc.service}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                      <StatusIcon className="h-4 w-4" />
                      {status.label}
                    </span>

                    <div className="flex gap-2">
                      {doc.status === "available" && (
                        <>
                          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6a1a] text-white rounded-lg text-sm font-medium hover:bg-[#ea580c] transition-colors">
                            <Download className="h-4 w-4" />
                            Download
                          </button>
                        </>
                      )}
                      {doc.status === "pending" && (
                        <span className="text-sm text-gray-500 italic">
                          Processing...
                        </span>
                      )}
                      {doc.status === "upcoming" && (
                        <span className="text-sm text-gray-500 italic">
                          Available after session
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-montserrat font-semibold text-gray-900 mb-1">
              Need a document?
            </h3>
            <p className="text-gray-600">
              If you need additional copies or have questions about your documents, our team is here to help.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors whitespace-nowrap">
            Contact Support
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
