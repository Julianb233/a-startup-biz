import Link from 'next/link';
import {
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  Users,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { getAdminStats, getRecentOrders, getUpcomingConsultations } from '@/lib/db-queries';

// Extended order type for admin display (includes user info)
interface AdminOrder {
  id: string;
  user_name: string;
  user_email: string;
  total: number;
  status: string;
  created_at: Date;
  items: { name: string; quantity: number; price: number }[];
}

interface AdminConsultation {
  id: string;
  user_name: string;
  user_email: string;
  service_type: string;
  status: string;
  scheduled_at: Date | null;
  created_at: Date;
}

// Mock data fallback
const mockStats = {
  revenue: { total_revenue: 45000, revenue_this_month: 12500, revenue_this_week: 3200 },
  orders: { total: 48, pending: 5, processing: 8, completed: 35 },
  consultations: { total: 24, pending: 3, scheduled: 6, completed: 15 },
  users: { total: 156, new_this_week: 8, new_this_month: 24 },
};

const mockOrders: AdminOrder[] = [
  {
    id: '1',
    user_name: 'John Smith',
    user_email: 'john@example.com',
    total: 2500,
    status: 'paid',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2),
    items: [{ name: 'Website Package', quantity: 1, price: 2500 }],
  },
  {
    id: '2',
    user_name: 'Sarah Johnson',
    user_email: 'sarah@example.com',
    total: 1200,
    status: 'processing',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    items: [{ name: 'SEO Audit', quantity: 1, price: 1200 }],
  },
];

const mockConsultations: AdminConsultation[] = [
  {
    id: '1',
    user_name: 'Mike Davis',
    user_email: 'mike@example.com',
    service_type: 'Website Consultation',
    status: 'scheduled',
    scheduled_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    created_at: new Date(),
  },
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

function getStatusBadge(status: string) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    refunded: 'bg-red-100 text-red-800 border-red-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  return styles[status as keyof typeof styles] || styles.pending;
}

export default async function AdminDashboard() {
  // Try to fetch real data, fallback to mock
  let stats = mockStats;
  let recentOrders: AdminOrder[] = mockOrders;
  let upcomingConsultations: AdminConsultation[] = mockConsultations;

  try {
    const [adminStats, dbOrders, dbConsultations] = await Promise.all([
      getAdminStats(),
      getRecentOrders(10),
      getUpcomingConsultations(7)
    ]);

    stats = adminStats;

    // Map database orders to AdminOrder format
    if (dbOrders && dbOrders.length > 0) {
      recentOrders = dbOrders.map((order: any) => ({
        id: order.id,
        user_name: order.user_name || 'Guest User',
        user_email: order.user_email || 'N/A',
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        items: order.items || [],
      }));
    }

    // Map database consultations to AdminConsultation format
    if (dbConsultations && dbConsultations.length > 0) {
      upcomingConsultations = dbConsultations.map((consultation: any) => ({
        id: consultation.id,
        user_name: consultation.user_name || 'Guest User',
        user_email: consultation.user_email || 'N/A',
        service_type: consultation.service_type,
        status: consultation.status,
        scheduled_at: consultation.scheduled_at,
        created_at: consultation.created_at,
      }));
    }
  } catch (error) {
    console.log('Using mock data - database not available:', error);
  }

  // Display data
  const displayOrders = recentOrders;
  const displayConsultations = upcomingConsultations;

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.revenue?.total_revenue || mockStats.revenue.total_revenue),
      change: formatCurrency(stats.revenue?.revenue_this_month || mockStats.revenue.revenue_this_month),
      changeLabel: 'This month',
      icon: DollarSign,
      color: 'blue',
    },
    {
      title: 'Active Orders',
      value: (stats.orders?.processing || mockStats.orders.processing).toString(),
      change: `${stats.orders?.pending || mockStats.orders.pending} pending`,
      changeLabel: 'Needs attention',
      icon: ShoppingCart,
      color: 'orange',
    },
    {
      title: 'Pending Consultations',
      value: (stats.consultations?.pending || mockStats.consultations.pending).toString(),
      change: `${stats.consultations?.scheduled || mockStats.consultations.scheduled} scheduled`,
      changeLabel: 'Coming up',
      icon: Calendar,
      color: 'purple',
    },
    {
      title: 'New Users',
      value: (stats.users?.new_this_week || mockStats.users.new_this_week).toString(),
      change: `${stats.users?.total || mockStats.users.total} total`,
      changeLabel: 'This week',
      icon: Users,
      color: 'green',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Monitor your business performance and recent activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="relative overflow-hidden rounded-lg bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900">
                      {stat.change}
                    </p>
                    <p className="text-xs text-gray-500">{stat.changeLabel}</p>
                  </div>
                </div>
                <div
                  className={`rounded-full p-3 ${
                    stat.color === 'blue'
                      ? 'bg-blue-100'
                      : stat.color === 'orange'
                      ? 'bg-orange-100'
                      : stat.color === 'purple'
                      ? 'bg-purple-100'
                      : 'bg-green-100'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      stat.color === 'blue'
                        ? 'text-blue-600'
                        : stat.color === 'orange'
                        ? 'text-orange-600'
                        : stat.color === 'purple'
                        ? 'text-purple-600'
                        : 'text-green-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {displayOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.user_name || 'Guest User'}
                      </p>
                      <p className="text-sm text-gray-500">{order.user_email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            ))}
            {displayOrders.length === 0 && (
              <p className="text-center text-gray-500 py-8">No recent orders</p>
            )}
          </div>
        </div>

        {/* Upcoming Consultations */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Upcoming Consultations
            </h2>
            <Link
              href="/admin/consultations"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {displayConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {consultation.user_name || 'Guest User'}
                  </p>
                  <p className="text-sm text-gray-500">{consultation.service_type}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                        consultation.status
                      )}`}
                    >
                      {consultation.status}
                    </span>
                    {consultation.scheduled_at && (
                      <span className="text-xs text-gray-500">
                        {formatDateTime(consultation.scheduled_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {displayConsultations.length === 0 && (
              <p className="text-center text-gray-500 py-8">No upcoming consultations</p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Performance Summary
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-blue-900">
                This Month Revenue
              </p>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(stats.revenue?.revenue_this_month || mockStats.revenue.revenue_this_month)}
            </p>
            <p className="mt-1 text-sm text-blue-700">
              From {stats.orders?.total || mockStats.orders.total} total orders
            </p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-purple-900">
                Completed Orders
              </p>
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {stats.orders?.completed || mockStats.orders.completed}
            </p>
            <p className="mt-1 text-sm text-purple-700">
              {((((stats.orders?.completed || mockStats.orders.completed) / (stats.orders?.total || mockStats.orders.total)) * 100).toFixed(1))}% completion rate
            </p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-900">
                Active Users
              </p>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {stats.users?.total || mockStats.users.total}
            </p>
            <p className="mt-1 text-sm text-green-700">
              +{stats.users?.new_this_week || mockStats.users.new_this_week} this week
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
