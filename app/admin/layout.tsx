import { redirect } from 'next/navigation';
import { checkRole, requireAuth } from '@/lib/auth';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  Briefcase,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Services',
    href: '/admin/services',
    icon: Briefcase,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Ensure user is authenticated
  await requireAuth('/sign-in');

  // Check if user has admin role
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/dashboard');
  }

  const { sessionClaims } = await auth();
  const userName = (sessionClaims?.firstName as string | undefined) || 'Admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-800 transition-transform">
        <div className="flex h-full flex-col overflow-y-auto border-r border-gray-700">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-700 px-6">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ASB</span>
              </div>
              <span className="text-lg font-bold text-white">Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white group"
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-orange-500" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User info at bottom */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <UserButton afterSignOutUrl="/" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-400 truncate">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-200 bg-white px-6 shadow-sm">
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] p-6">{children}</main>
      </div>
    </div>
  );
}
