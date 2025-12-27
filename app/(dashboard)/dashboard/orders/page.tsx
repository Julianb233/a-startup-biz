"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  ArrowRight,
  Search,
  Filter
} from "lucide-react"
import Link from "next/link"

// Mock order data - will be replaced with real database queries
const orders = [
  {
    id: "ORD-2024-001",
    date: "2024-12-15",
    items: [
      { name: "Business Formation Package", price: 499 },
      { name: "EIN Filing Service", price: 99 }
    ],
    total: 598,
    status: "completed",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-2024-002",
    date: "2024-12-20",
    items: [
      { name: "Website Development - Starter", price: 2500 }
    ],
    total: 2500,
    status: "processing",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-2024-003",
    date: "2024-12-25",
    items: [
      { name: "Clarity Call - 1 Hour", price: 1000 }
    ],
    total: 1000,
    status: "pending",
    paymentMethod: "Pending"
  }
]

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle
  },
  processing: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    icon: Package
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle
  }
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const totalSpent = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-montserrat text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-1">View and manage your purchase history</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-[#ff6a1a]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">{orders.length}</p>
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
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">
                {orders.filter(o => o.status === "completed").length}
              </p>
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
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">
                ${totalSpent.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a] appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-montserrat text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't placed any orders yet"}
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
            >
              Browse Services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <Package className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-montserrat font-semibold text-gray-900">
                          {order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                      </span>
                      <span className="font-montserrat text-xl font-bold text-gray-900">
                        ${order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    {order.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                      >
                        <span className="text-gray-700">{item.name}</span>
                        <span className="font-medium text-gray-900">${item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    {order.status === "completed" && (
                      <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4" />
                        Download Invoice
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
