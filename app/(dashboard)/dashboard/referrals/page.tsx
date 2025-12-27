"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Gift,
  Users,
  DollarSign,
  Link2,
  Copy,
  Check,
  Share2,
  TrendingUp,
  ChevronRight,
  Mail,
  MessageSquare,
} from "lucide-react"

interface ReferralStats {
  total: number
  signed_up: number
  converted: number
  paid: number
  total_earned: number
}

interface ReferralLink {
  id: string
  code: string
  clicks: number
  active: boolean
  created_at: Date
}

interface Referral {
  id: string
  referred_email: string
  status: 'pending' | 'signed_up' | 'converted' | 'paid'
  commission_rate: number
  commission_amount?: number
  commission_paid: boolean
  created_at: Date
  converted_at?: Date
}

// Mock data
const mockStats: ReferralStats = {
  total: 12,
  signed_up: 8,
  converted: 5,
  paid: 3,
  total_earned: 750,
}

const mockLink: ReferralLink = {
  id: '1',
  code: 'FRIEND-ABC123',
  clicks: 45,
  active: true,
  created_at: new Date(),
}

const mockReferrals: Referral[] = [
  {
    id: '1',
    referred_email: 'mike@example.com',
    status: 'paid',
    commission_rate: 10,
    commission_amount: 250,
    commission_paid: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    converted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
  },
  {
    id: '2',
    referred_email: 'sarah@example.com',
    status: 'converted',
    commission_rate: 10,
    commission_amount: 300,
    commission_paid: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    converted_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: '3',
    referred_email: 'john@example.com',
    status: 'signed_up',
    commission_rate: 10,
    commission_paid: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: '4',
    referred_email: 'lisa@example.com',
    status: 'pending',
    commission_rate: 10,
    commission_paid: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
]

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

function getStatusBadge(status: string) {
  const styles = {
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Invited' },
    signed_up: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Signed Up' },
    converted: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Converted' },
    paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
  }
  return styles[status as keyof typeof styles] || styles.pending
}

export default function ReferralsPage() {
  const [stats, setStats] = useState<ReferralStats>(mockStats)
  const [referralLink, setReferralLink] = useState<ReferralLink | null>(mockLink)
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        const response = await fetch('/api/dashboard/referrals')
        if (response.ok) {
          const data = await response.json()
          if (data.stats) setStats(data.stats)
          if (data.link) setReferralLink(data.link)
          if (data.referrals) setReferrals(data.referrals)
        }
      } catch (error) {
        console.log('Using mock data - API not available')
      } finally {
        setLoading(false)
      }
    }

    fetchReferralData()
  }, [])

  const copyLink = () => {
    if (referralLink) {
      const link = `${window.location.origin}?ref=${referralLink.code}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareViaEmail = () => {
    if (referralLink) {
      const link = `${window.location.origin}?ref=${referralLink.code}`
      const subject = encodeURIComponent("Check out A Startup Biz - They helped me grow my business!")
      const body = encodeURIComponent(`Hey!\n\nI've been working with A Startup Biz and they've been amazing for my business. I thought you might be interested too.\n\nUse my referral link to get started: ${link}\n\nLet me know if you have any questions!`)
      window.open(`mailto:?subject=${subject}&body=${body}`)
    }
  }

  const statCards = [
    {
      title: 'Total Referrals',
      value: stats.total,
      icon: Users,
      color: 'blue',
      description: 'People you\'ve referred',
    },
    {
      title: 'Signed Up',
      value: stats.signed_up,
      icon: TrendingUp,
      color: 'purple',
      description: 'Created accounts',
    },
    {
      title: 'Converted',
      value: stats.converted,
      icon: Gift,
      color: 'orange',
      description: 'Became customers',
    },
    {
      title: 'Total Earned',
      value: formatCurrency(stats.total_earned),
      icon: DollarSign,
      color: 'green',
      description: 'Commission earned',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading referral data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-600 mt-1">
          Earn 10% commission for every client you refer who becomes a customer
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    stat.color === 'blue'
                      ? 'bg-blue-100'
                      : stat.color === 'purple'
                      ? 'bg-purple-100'
                      : stat.color === 'orange'
                      ? 'bg-orange-100'
                      : 'bg-green-100'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      stat.color === 'blue'
                        ? 'text-blue-600'
                        : stat.color === 'purple'
                        ? 'text-purple-600'
                        : stat.color === 'orange'
                        ? 'text-orange-600'
                        : 'text-green-600'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Referral Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Link2 className="w-6 h-6" />
              <h2 className="text-xl font-bold">Your Referral Link</h2>
            </div>
            <p className="text-orange-100 max-w-md">
              Share this link with friends and colleagues. When they sign up and make a purchase, you earn 10% commission!
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Link Display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-orange-100 mb-1">Your unique link:</p>
                <p className="font-mono text-white truncate">
                  {referralLink ? `${typeof window !== 'undefined' ? window.location.origin : ''}?ref=${referralLink.code}` : 'No link available'}
                </p>
              </div>
              <button
                onClick={copyLink}
                className="flex-shrink-0 p-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-300" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="flex gap-3">
              <button
                onClick={shareViaEmail}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Copy Link
              </button>
            </div>

            {referralLink && (
              <p className="text-sm text-orange-100 text-center">
                {referralLink.clicks} total clicks
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">1</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Share Your Link</h3>
              <p className="text-sm text-gray-600 mt-1">
                Send your unique referral link to friends, family, or colleagues who could benefit from our services.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">2</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">They Sign Up & Purchase</h3>
              <p className="text-sm text-gray-600 mt-1">
                When they create an account using your link and make their first purchase, we track it automatically.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">You Earn Commission</h3>
              <p className="text-sm text-gray-600 mt-1">
                Earn 10% of their first order value. Commissions are paid out monthly to your preferred payment method.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Referral History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Referrals</h2>
          <p className="text-sm text-gray-600 mt-1">Track the status of everyone you've referred</p>
        </div>

        {referrals.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No referrals yet</h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Share your referral link with friends and colleagues to start earning commissions!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {referrals.map((referral) => {
              const statusStyle = getStatusBadge(referral.status)
              return (
                <div
                  key={referral.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-600 font-medium">
                          {referral.referred_email[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {referral.referred_email}
                        </p>
                        <p className="text-sm text-gray-500">
                          Referred {formatDate(referral.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
                    >
                      {statusStyle.label}
                    </span>

                    {referral.commission_amount && (
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(referral.commission_amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {referral.commission_paid ? 'Paid' : 'Pending'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-50 rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">When do I get paid?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Commissions are processed monthly. Once your referral's order is marked as paid, your commission will be included in the next payout cycle.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Is there a limit to how many people I can refer?</h3>
            <p className="text-sm text-gray-600 mt-1">
              No limit! Refer as many people as you'd like. The more successful referrals, the more you earn.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">How long does my referral link stay active?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Your referral link never expires. Once someone clicks it, they're tracked to you for 30 days, so even if they don't sign up immediately, you'll still get credit.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
