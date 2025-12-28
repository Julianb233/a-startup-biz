import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import PartnerDashboard from '@/components/partner/PartnerDashboard'
import LeadTable from '@/components/partner/LeadTable'
import { ArrowRight, Plus, FileText } from 'lucide-react'
import Link from 'next/link'

// Mock data fallback
const mockStats = {
  totalReferrals: 127,
  pendingReferrals: 23,
  completedReferrals: 94,
  totalEarnings: 12450,
  pendingEarnings: 2300,
  paidEarnings: 10150,
}

const mockLeads = [
  {
    id: '1',
    clientName: 'Acme Ventures LLC',
    clientEmail: 'contact@acme.com',
    service: 'EIN Filing',
    status: 'converted' as const,
    commission: 150,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: '2',
    clientName: 'Tech Startup Inc',
    clientEmail: 'info@techstartup.com',
    service: 'Legal Formation',
    status: 'pending' as const,
    commission: 300,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: '3',
    clientName: 'Fitness Co',
    clientEmail: 'hello@fitness.co',
    service: 'Website Design',
    status: 'qualified' as const,
    commission: 500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
]

async function getPartnerData(userId: string) {
  try {
    // Try to fetch real data from API
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const [statsRes, leadsRes] = await Promise.all([
      fetch(`${baseUrl}/api/partner/stats`, {
        cache: 'no-store',
        headers: {
          'x-user-id': userId,
        },
      }),
      fetch(`${baseUrl}/api/partner/leads?limit=10`, {
        cache: 'no-store',
        headers: {
          'x-user-id': userId,
        },
      }),
    ])

    if (statsRes.ok && leadsRes.ok) {
      const stats = await statsRes.json()
      const leadsData = await leadsRes.json()

      return {
        stats: {
          totalReferrals: stats.stats.totalReferrals,
          pendingReferrals: stats.stats.pendingReferrals,
          completedReferrals: stats.stats.completedReferrals,
          totalEarnings: stats.stats.totalEarnings,
          pendingEarnings: stats.stats.pendingEarnings,
          paidEarnings: stats.stats.paidEarnings,
        },
        leads: leadsData.leads,
        partner: stats.partner,
      }
    }
  } catch (error) {
    console.error('Failed to fetch partner data:', error)
  }

  // Fallback to mock data
  return {
    stats: mockStats,
    leads: mockLeads,
    partner: null,
  }
}

export default async function PartnerDashboardPage() {
  // Ensure user is authenticated
  const userId = await requireAuth('/partner-portal')

  // Fetch partner data
  const { stats, leads, partner } = await getPartnerData(userId)

  // Check if partner application is pending
  if (partner && partner.status === 'pending') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Pending
          </h2>
          <p className="text-gray-600 mb-6">
            Your partner application is currently under review. We will notify you once it has been approved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-colors"
          >
            Back to Home
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Overview */}
      <PartnerDashboard
        stats={stats}
        recentActivity={[
          {
            id: '1',
            type: 'New Lead',
            description: 'Acme Ventures LLC referred for EIN Filing',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          },
          {
            id: '2',
            type: 'Lead Converted',
            description: 'Tech Startup Inc completed Legal Formation',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
        ]}
      />

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/partner-portal/referrals"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-[#ff6a1a] hover:bg-orange-50 transition-all group"
          >
            <div className="w-10 h-10 bg-[#ff6a1a] rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-[#ff6a1a] transition-colors">
                New Referral
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#ff6a1a] transition-colors" />
          </Link>

          <Link
            href="/partner-portal/providers"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                View Providers
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </Link>

          <Link
            href="/partner-portal/referrals"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                All Referrals
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
          </Link>

          <Link
            href="/partner-portal/earnings"
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
          >
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                Earnings Report
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Recent Leads
          </h2>
          <Link
            href="/partner-portal/referrals"
            className="text-sm font-semibold text-[#ff6a1a] hover:text-[#e55f17] flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-6">
          <LeadTable leads={leads.slice(0, 5)} />
        </div>
      </div>
    </div>
  )
}
