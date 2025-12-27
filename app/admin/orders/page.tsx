'use client';

import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  mockOrders,
  formatCurrency,
  formatDate,
  getStatusColor,
  type Order,
} from '@/lib/admin-data';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>(
    'all'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = mockOrders;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query) ||
          order.service.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Stats by status
  const stats = {
    all: mockOrders.length,
    pending: mockOrders.filter((o) => o.status === 'pending').length,
    processing: mockOrders.filter((o) => o.status === 'processing').length,
    completed: mockOrders.filter((o) => o.status === 'completed').length,
    cancelled: mockOrders.filter((o) => o.status === 'cancelled').length,
  };

  const statusTabs: Array<{
    label: string;
    value: Order['status'] | 'all';
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
        <button className="flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
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
              {currentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No orders found matching your criteria
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => {
                  const statusColors = getStatusColor(order.status);
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
              <span className="font-medium mx-1">{startIndex + 1}</span> to{' '}
              <span className="font-medium mx-1">
                {Math.min(endIndex, filteredOrders.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium mx-1">{filteredOrders.length}</span>{' '}
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
