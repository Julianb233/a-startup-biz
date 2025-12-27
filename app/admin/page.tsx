import Link from 'next/link';
import {
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  TrendingUp,
  Eye,
} from 'lucide-react';
import {
  mockDashboardStats,
  getRecentOrders,
  formatCurrency,
  formatDate,
  getStatusColor,
} from '@/lib/admin-data';

export default function AdminDashboard() {
  const stats = mockDashboardStats;
  const recentOrders = getRecentOrders(5);

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'orange',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'green',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      change: '-5.1%',
      changeType: 'negative' as const,
      icon: Clock,
      color: 'yellow',
    },
  ];

  const quickActions = [
    {
      title: 'View All Orders',
      description: 'Manage and track all orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Services',
      description: 'Update service offerings',
      href: '/admin/services',
      icon: TrendingUp,
    },
    {
      title: 'View Site',
      description: 'Visit public website',
      href: '/',
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.changeType === 'positive';

          return (
            <div
              key={stat.title}
              className="relative overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`mt-2 flex items-center text-sm font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <ArrowUpRight
                      className={`mr-1 h-4 w-4 ${
                        !isPositive ? 'rotate-90' : ''
                      }`}
                    />
                    {stat.change} from last month
                  </p>
                </div>
                <div
                  className={`rounded-full p-3 ${
                    stat.color === 'orange'
                      ? 'bg-orange-100'
                      : stat.color === 'blue'
                      ? 'bg-blue-100'
                      : stat.color === 'green'
                      ? 'bg-green-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      stat.color === 'orange'
                        ? 'text-orange-600'
                        : stat.color === 'blue'
                        ? 'text-blue-600'
                        : stat.color === 'green'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const statusColors = getStatusColor(order.status);
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4 hover:border-orange-200 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.customer.name}
                        </p>
                        <p className="text-sm text-gray-500">{order.service}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(order.date)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="grid gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex items-center rounded-lg border border-gray-200 p-4 transition-all hover:border-orange-500 hover:bg-orange-50 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-orange-100">
                    <Icon className="h-5 w-5 text-gray-600 group-hover:text-orange-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-orange-900">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500 group-hover:text-orange-700">
                      {action.description}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          This Month Performance
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-6">
            <p className="text-sm font-medium text-orange-900">
              Monthly Revenue
            </p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {formatCurrency(stats.monthlyRevenue)}
            </p>
            <p className="mt-1 text-sm text-orange-700">
              From {stats.monthlyOrders} orders
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <p className="text-sm font-medium text-blue-900">Active Users</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {stats.activeUsers}
            </p>
            <p className="mt-1 text-sm text-blue-700">
              {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of
              total
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6">
            <p className="text-sm font-medium text-green-900">
              Conversion Rate
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats.conversionRate}%
            </p>
            <p className="mt-1 text-sm text-green-700">Above target 20%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
