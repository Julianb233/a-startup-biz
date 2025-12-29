'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from '@/lib/admin-data';

// Database order type
interface DBOrder {
  id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'completed' | 'refunded';
  payment_intent_id: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

// Transform DB order to display format
function transformOrder(order: DBOrder) {
  return {
    id: order.id,
    orderNumber: `ORD-${order.id.slice(0, 8).toUpperCase()}`,
    customer: {
      id: order.user_id || 'guest',
      name: order.user_name || 'Guest User',
      email: order.user_email || 'N/A',
    },
    service: order.items?.[0]?.name || 'Service Package',
    amount: order.total,
    status: order.status === 'paid' ? 'processing' : order.status === 'refunded' ? 'cancelled' : order.status,
    date: new Date(order.created_at),
    paymentMethod: order.payment_method || 'Card',
  };
}

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'all';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  });
  const ordersPerPage = 10;

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: ordersPerPage.toString(),
        offset: ((currentPage - 1) * ordersPerPage).toString(),
      });
      if (statusFilter !== 'all') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        setTotal(data.total || 0);
      } else {
        console.error('Failed to fetch orders:', response.statusText);
      }

      // Fetch stats for all statuses
      const statsResponse = await fetch('/api/admin/orders?limit=1000');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        const allOrders = statsData.orders || [];
        setStats({
          all: allOrders.length,
          pending: allOrders.filter((o: DBOrder) => o.status === 'pending').length,
          processing: allOrders.filter((o: DBOrder) => o.status === 'processing' || o.status === 'paid').length,
          completed: allOrders.filter((o: DBOrder) => o.status === 'completed').length,
          cancelled: allOrders.filter((o: DBOrder) => o.status === 'refunded').length,
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Transform and filter orders for display
  const displayOrders = useMemo(() => {
    let transformed = orders.map(transformOrder);

    // Search filter (client-side for now)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      transformed = transformed.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.service.toLowerCase().includes(query)
      );
    }

    return transformed;
  }, [orders, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(total / ordersPerPage);

  const statusTabs: Array<{
    label: string;
    value: OrderStatus;
    count: number;
    icon: typeof Clock;
  }> = [
    { label: 'All Orders', value: 'all', count: stats.all, icon: Filter },
    {
      label: 'Pending',
      value: 'pending',
      count: stats.pending,
      icon: Clock,
    },
    {
      label: 'Processing',
      value: 'processing',
      count: stats.processing,
      icon: Loader,
    },
    {
      label: 'Completed',
      value: 'completed',
      count: stats.completed,
      icon: CheckCircle,
    },
    {
      label: 'Cancelled',
      value: 'cancelled',
      count: stats.cancelled,
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchOrders()}
            className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setCurrentPage(1);
              }}
              className={`flex items-center space-x-2 rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers, services..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                      <span className="ml-2 text-gray-500">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : displayOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    {orders.length === 0
                      ? 'No orders yet. Orders will appear here when customers make purchases.'
                      : 'No orders found matching your criteria'}
                  </td>
                </tr>
              ) : (
                displayOrders.map((order) => {
                  const statusColors = getStatusColor(order.status as any);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {order.service}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.paymentMethod}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.amount)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-orange-600 hover:text-orange-900 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium mx-1">{(currentPage - 1) * ordersPerPage + 1}</span> to{' '}
              <span className="font-medium mx-1">
                {Math.min(currentPage * ordersPerPage, total)}
              </span>{' '}
              of{' '}
              <span className="font-medium mx-1">{total}</span>{' '}
              results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-orange-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
