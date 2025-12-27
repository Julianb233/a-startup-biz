'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Calendar,
  ShoppingBag,
  DollarSign,
  Shield,
  User as UserIcon,
  Users as UsersIcon,
} from 'lucide-react';
import {
  mockUsers,
  formatCurrency,
  formatDate,
  getRoleColor,
  type User,
} from '@/lib/admin-data';

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let filtered = mockUsers;

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [roleFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Stats by role
  const stats = {
    all: mockUsers.length,
    admin: mockUsers.filter((u) => u.role === 'admin').length,
    moderator: mockUsers.filter((u) => u.role === 'moderator').length,
    user: mockUsers.filter((u) => u.role === 'user').length,
  };

  const roleTabs: Array<{
    label: string;
    value: User['role'] | 'all';
    count: number;
    icon: typeof UsersIcon;
  }> = [
    { label: 'All Users', value: 'all', count: stats.all, icon: UsersIcon },
    { label: 'Admins', value: 'admin', count: stats.admin, icon: Shield },
    {
      label: 'Moderators',
      value: 'moderator',
      count: stats.moderator,
      icon: UserIcon,
    },
    { label: 'Users', value: 'user', count: stats.user, icon: UserIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>
        <button className="flex items-center space-x-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex space-x-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
        {roleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = roleFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setRoleFilter(tab.value);
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

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-purple-100 p-3">
              <UsersIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-orange-100 p-3">
              <ShoppingBag className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {(
                  mockUsers.reduce((sum, u) => sum + u.orderCount, 0) /
                  mockUsers.length
                ).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  mockUsers.reduce((sum, u) => sum + u.totalSpent, 0) /
                    mockUsers.length
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.admin}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No users found matching your criteria
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const roleColors = getRoleColor(user.role);
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="mr-1 h-3 w-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${roleColors.bg} ${roleColors.text} ${roleColors.border}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          {formatDate(user.registeredAt)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.orderCount}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(user.totalSpent)}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {formatDate(user.lastActive)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
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
                {Math.min(endIndex, filteredUsers.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium mx-1">{filteredUsers.length}</span>{' '}
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
