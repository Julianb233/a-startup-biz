"use client"

import { useState, useEffect } from "react"
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
  Filter,
  Loader2,
  RefreshCw
} from "lucide-react"
import Link from "next/link"

interface OrderItem {
  name: string
  price: number
  quantity?: number
}

interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: string
  paymentIntentId?: string
  stripeSessionId?: string
  couponCode?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle
  },
  paid: {
    label: "Paid",
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
  refunded: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-800",
    icon: AlertCircle
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterStatus !== "all") {
        params.set("status", filterStatus)
      }

      const response = await fetch(`/api/orders?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Unable to load orders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filterStatus])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item =>
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    return matchesSearch
  })

  const totalSpent = orders
    .filter(o => o.status === "completed" || o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0)

  const completedCount = orders.filter(
    o => o.status === "completed" || o.status === "paid"
  ).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff6a1a] mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Error Loading Orders</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6a1a] text-white rounded-lg hover:bg-[#ea580c] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

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
                {completedCount}
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
            <option value="paid">Paid</option>
            <option value="processing">In Progress</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
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
            const statusKey = order.status as keyof typeof statusConfig
            const status = statusConfig[statusKey] || statusConfig.pending
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
                          Order #{order.id.slice(0, 8)}...
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
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
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                        >
                          <span className="text-gray-700">{item.name || "Service"}</span>
                          <span className="font-medium text-gray-900">
                            ${(item.price || 0).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No item details available</p>
                    )}
                  </div>

                  {/* Discount if applicable */}
                  {order.discount > 0 && (
                    <div className="flex justify-between items-center mb-4 text-green-600">
                      <span>Discount Applied</span>
                      <span>-${order.discount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    {(order.status === "completed" || order.status === "paid") && (
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
