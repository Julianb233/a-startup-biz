/**
 * Mock data for admin dashboard
 * This provides sample data for development and testing
 */

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  service: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: Date;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'moderator';
  registeredAt: Date;
  orderCount: number;
  totalSpent: number;
  lastActive: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  pendingOrders: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  activeUsers: number;
  conversionRate: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'u1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
    },
    service: 'Business Formation - LLC',
    amount: 1299,
    status: 'completed',
    date: new Date('2024-12-20'),
    paymentMethod: 'Credit Card',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'u2',
      name: 'Michael Chen',
      email: 'michael@example.com',
    },
    service: 'Tax Consultation Package',
    amount: 899,
    status: 'processing',
    date: new Date('2024-12-22'),
    paymentMethod: 'PayPal',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: 'u3',
      name: 'Emily Rodriguez',
      email: 'emily@example.com',
    },
    service: 'Legal Advisory - Monthly',
    amount: 2499,
    status: 'pending',
    date: new Date('2024-12-23'),
    paymentMethod: 'Bank Transfer',
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    customer: {
      id: 'u4',
      name: 'David Kim',
      email: 'david@example.com',
    },
    service: 'Trademark Registration',
    amount: 1799,
    status: 'completed',
    date: new Date('2024-12-18'),
    paymentMethod: 'Credit Card',
  },
  {
    id: '5',
    orderNumber: 'ORD-2024-005',
    customer: {
      id: 'u5',
      name: 'Jennifer Martinez',
      email: 'jennifer@example.com',
    },
    service: 'Business Plan Development',
    amount: 3499,
    status: 'processing',
    date: new Date('2024-12-21'),
    paymentMethod: 'Credit Card',
  },
  {
    id: '6',
    orderNumber: 'ORD-2024-006',
    customer: {
      id: 'u6',
      name: 'Robert Taylor',
      email: 'robert@example.com',
    },
    service: 'Website Development - Starter',
    amount: 4999,
    status: 'completed',
    date: new Date('2024-12-15'),
    paymentMethod: 'Wire Transfer',
  },
  {
    id: '7',
    orderNumber: 'ORD-2024-007',
    customer: {
      id: 'u7',
      name: 'Amanda White',
      email: 'amanda@example.com',
    },
    service: 'Marketing Strategy Session',
    amount: 599,
    status: 'pending',
    date: new Date('2024-12-24'),
    paymentMethod: 'PayPal',
  },
  {
    id: '8',
    orderNumber: 'ORD-2024-008',
    customer: {
      id: 'u8',
      name: 'James Wilson',
      email: 'james@example.com',
    },
    service: 'Annual Compliance Package',
    amount: 1999,
    status: 'cancelled',
    date: new Date('2024-12-19'),
    paymentMethod: 'Credit Card',
  },
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'user',
    registeredAt: new Date('2024-10-15'),
    orderCount: 3,
    totalSpent: 4597,
    lastActive: new Date('2024-12-20'),
  },
  {
    id: 'u2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'user',
    registeredAt: new Date('2024-11-02'),
    orderCount: 2,
    totalSpent: 1798,
    lastActive: new Date('2024-12-22'),
  },
  {
    id: 'u3',
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    role: 'user',
    registeredAt: new Date('2024-09-20'),
    orderCount: 5,
    totalSpent: 8995,
    lastActive: new Date('2024-12-23'),
  },
  {
    id: 'u4',
    name: 'David Kim',
    email: 'david@example.com',
    role: 'user',
    registeredAt: new Date('2024-10-30'),
    orderCount: 1,
    totalSpent: 1799,
    lastActive: new Date('2024-12-18'),
  },
  {
    id: 'u5',
    name: 'Jennifer Martinez',
    email: 'jennifer@example.com',
    role: 'moderator',
    registeredAt: new Date('2024-08-15'),
    orderCount: 7,
    totalSpent: 12499,
    lastActive: new Date('2024-12-21'),
  },
  {
    id: 'u6',
    name: 'Robert Taylor',
    email: 'robert@example.com',
    role: 'user',
    registeredAt: new Date('2024-11-10'),
    orderCount: 2,
    totalSpent: 6998,
    lastActive: new Date('2024-12-15'),
  },
  {
    id: 'u7',
    name: 'Amanda White',
    email: 'amanda@example.com',
    role: 'user',
    registeredAt: new Date('2024-12-01'),
    orderCount: 1,
    totalSpent: 599,
    lastActive: new Date('2024-12-24'),
  },
  {
    id: 'u8',
    name: 'James Wilson',
    email: 'james@example.com',
    role: 'user',
    registeredAt: new Date('2024-09-05'),
    orderCount: 4,
    totalSpent: 7996,
    lastActive: new Date('2024-12-19'),
  },
];

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalOrders: 156,
  totalRevenue: 234567,
  totalUsers: 342,
  pendingOrders: 12,
  monthlyRevenue: 45789,
  monthlyOrders: 28,
  activeUsers: 89,
  conversionRate: 24.5,
};

// Mock revenue data for charts
export const mockRevenueData: RevenueData[] = [
  { month: 'Jul', revenue: 32400, orders: 18 },
  { month: 'Aug', revenue: 38900, orders: 22 },
  { month: 'Sep', revenue: 42100, orders: 25 },
  { month: 'Oct', revenue: 39800, orders: 23 },
  { month: 'Nov', revenue: 44500, orders: 26 },
  { month: 'Dec', revenue: 45789, orders: 28 },
];

// Helper functions
export function getOrdersByStatus(status: Order['status']): Order[] {
  return mockOrders.filter((order) => order.status === status);
}

export function getUsersByRole(role: User['role']): User[] {
  return mockUsers.filter((user) => user.role === role);
}

export function getRecentOrders(limit: number = 5): Order[] {
  return [...mockOrders]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}

export function getTopCustomers(limit: number = 5): User[] {
  return [...mockUsers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function getStatusColor(
  status: Order['status']
): { bg: string; text: string; border: string } {
  const colors = {
    pending: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    processing: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
    completed: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    cancelled: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
  };

  return colors[status];
}

export function getRoleColor(
  role: User['role']
): { bg: string; text: string; border: string } {
  const colors = {
    admin: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200',
    },
    moderator: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
    },
    user: {
      bg: 'bg-gray-50',
      text: 'text-gray-700',
      border: 'border-gray-200',
    },
  };

  return colors[role];
}
