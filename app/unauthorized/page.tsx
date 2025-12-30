import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-6">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <ShieldX className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.
          If you believe this is an error, please contact an administrator.
        </p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
