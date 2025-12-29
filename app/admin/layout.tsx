import { redirect } from 'next/navigation';
import { checkRole, requireAuth } from '@/lib/auth';
import { auth } from '@/lib/clerk-server-safe';
import Link from 'next/link';
import { AdminSidebar } from './admin-sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Ensure user is authenticated
  await requireAuth('/login');

  // Check if user has admin role
  const isAdmin = await checkRole('admin');

  if (!isAdmin) {
    redirect('/dashboard');
  }

  const { sessionClaims } = await auth();
  const userName = (sessionClaims?.firstName as string | undefined) || 'Admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile-responsive Sidebar */}
      <AdminSidebar userName={userName} />

      {/* Main content - responsive padding */}
      <div className="md:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center border-b border-gray-200 bg-white px-4 md:px-6 shadow-sm">
          <div className="flex flex-1 items-center justify-between">
            {/* Spacer for mobile menu button */}
            <div className="w-10 md:w-0" />

            <div className="flex-1 md:flex-none">
              <h1 className="text-lg md:text-xl font-semibold text-gray-900 text-center md:text-left">
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

        {/* Page content - responsive padding */}
        <main className="min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
