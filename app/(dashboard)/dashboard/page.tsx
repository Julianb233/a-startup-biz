"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import NextStepsGuide from "@/components/next-steps-guide"
import {
  Briefcase,
  Calendar,
  FileText,
  Download,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  MapPin,
  Bell,
  Upload,
  FileSignature,
  Phone,
  MessageSquare,
  TrendingUp,
  Target,
  Rocket,
  Building2,
  Globe,
  CreditCard,
  PartyPopper,
  Users,
  Share2,
  Gift,
  Loader2
} from "lucide-react"

// Types
interface DashboardData {
  orders: Order[]
  ordersWithProgress: OrderWithProgress[]
  consultations: Consultation[]
  documents: Document[]
  actionItems: ActionItem[]
  onboarding: OnboardingSubmission | null
  referralStats: {
    link: ReferralLink | null
    stats: {
      total: number
      signed_up: number
      converted: number
      paid: number
      total_earned: number
    }
  }
  stats: {
    activeOrders: number
    completedOrders: number
    pendingActions: number
    upcomingConsultations: number
    documentsReady: number
  }
}

interface Order {
  id: string
  status: string
  items: any
  total: number
  created_at: string
}

interface OrderWithProgress extends Order {
  progress: ServiceProgress[]
}

interface ServiceProgress {
  id: string
  milestone: string
  status: string
  completed_at: string | null
}

interface Consultation {
  id: string
  status: string
  scheduled_at: string | null
  service_type: string
}

interface Document {
  id: string
  name: string
  type: string
  status: string
}

interface ActionItem {
  id: string
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: string | null
}

interface OnboardingSubmission {
  id: string
  status: string
}

interface ReferralLink {
  code: string
  clicks: number
}

// Mock data for fallback when database is empty
const mockActiveServices = [
  {
    id: "1",
    name: "Business Formation Package",
    status: "completed",
    progress: 100,
    icon: Building2,
    completedDate: "Dec 15, 2024",
    color: "green"
  },
  {
    id: "2",
    name: "Website Development",
    status: "in_progress",
    progress: 65,
    icon: Globe,
    nextMilestone: "Development phase completion",
    estimatedCompletion: "Jan 15, 2025",
    color: "blue"
  },
  {
    id: "3",
    name: "Clarity Call - Strategy",
    status: "scheduled",
    progress: 0,
    icon: Phone,
    scheduledDate: "Jan 5, 2025 at 2:00 PM",
    color: "purple"
  }
]

const mockActionItems = [
  {
    id: "1",
    title: "Complete business questionnaire",
    description: "Help us understand your brand better",
    type: "form",
    priority: "high" as const,
    icon: FileSignature,
    href: "/onboarding/intake",
    dueDate: "Due in 2 days"
  },
  {
    id: "2",
    title: "Upload logo files",
    description: "PNG and SVG formats preferred",
    type: "upload",
    priority: "medium" as const,
    icon: Upload,
    href: "/dashboard/documents",
    dueDate: "Due in 5 days"
  },
  {
    id: "3",
    title: "Schedule strategy call",
    description: "Discuss your website goals",
    type: "schedule",
    priority: "medium" as const,
    icon: Calendar,
    href: "/book-call",
    dueDate: "This week"
  }
]

const mockDocumentsReady = [
  { id: "1", name: "LLC Certificate of Formation", type: "Legal Document" },
  { id: "2", name: "Operating Agreement", type: "Legal Document" },
  { id: "3", name: "EIN Confirmation Letter", type: "Tax Document" }
]

const mockJourneyMilestones = [
  {
    id: "1",
    title: "Started Your Journey",
    description: "Signed up for Business Formation",
    date: "Dec 1, 2024",
    status: "completed",
    icon: Rocket
  },
  {
    id: "2",
    title: "LLC Formed",
    description: "Business officially registered",
    date: "Dec 10, 2024",
    status: "completed",
    icon: Building2
  },
  {
    id: "3",
    title: "EIN Received",
    description: "Tax ID confirmed by IRS",
    date: "Dec 15, 2024",
    status: "completed",
    icon: FileText
  },
  {
    id: "4",
    title: "Website Development",
    description: "Building your online presence",
    date: "In Progress",
    status: "in_progress",
    icon: Globe
  },
  {
    id: "5",
    title: "Launch Ready",
    description: "Your business goes live",
    date: "Coming Soon",
    status: "upcoming",
    icon: PartyPopper
  }
]

const recommendedServices = [
  {
    id: "1",
    name: "Bookkeeping Setup",
    description: "Get your finances organized from day one",
    price: "$299",
    href: "/services/bookkeeping-setup"
  },
  {
    id: "2",
    name: "Brand Identity Package",
    description: "Logo, colors, and brand guidelines",
    price: "$799",
    href: "/services/brand-identity"
  }
]

const featuredResource = {
  name: "Central Florida SCORE",
  type: "Free Mentorship",
  description: "Connect with experienced business mentors",
  distance: "3.1 miles"
}

export default function DashboardPage() {
  const { user } = useUser()
  const [showAllActions, setShowAllActions] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const userName = user?.firstName || "there"

  // Fetch dashboard data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard")
        if (response.ok) {
          const data = await response.json()
          setDashboardData(data)
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Determine if we should use real data or mock data
  const hasRealData = dashboardData && (
    dashboardData.orders.length > 0 ||
    dashboardData.actionItems.length > 0 ||
    dashboardData.consultations.length > 0
  )

  // Use real data if available, otherwise fall back to mock
  const activeServices = hasRealData
    ? dashboardData.ordersWithProgress.map((order, index) => {
        const serviceName = order.items?.[0]?.name || `Service #${index + 1}`
        const totalMilestones = order.progress?.length || 4
        const completedMilestones = order.progress?.filter(p => p.status === 'completed').length || 0
        const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

        return {
          id: order.id,
          name: serviceName,
          status: order.status === 'completed' ? 'completed' :
                  order.status === 'processing' ? 'in_progress' : 'scheduled',
          progress,
          icon: order.status === 'completed' ? Building2 : Globe,
          completedDate: order.status === 'completed' ? new Date(order.created_at).toLocaleDateString() : undefined,
          nextMilestone: order.progress?.find(p => p.status === 'in_progress')?.milestone,
          estimatedCompletion: "Soon",
          color: order.status === 'completed' ? 'green' : order.status === 'processing' ? 'blue' : 'purple'
        }
      })
    : mockActiveServices

  const actionItems = hasRealData && dashboardData.actionItems.length > 0
    ? dashboardData.actionItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        type: "task",
        priority: item.priority,
        icon: item.priority === 'urgent' ? AlertCircle : item.priority === 'high' ? Bell : FileSignature,
        href: "/dashboard",
        dueDate: item.due_date ? new Date(item.due_date).toLocaleDateString() : "No due date"
      }))
    : mockActionItems

  const documentsReady = hasRealData && dashboardData.documents.length > 0
    ? dashboardData.documents
        .filter(d => d.status === 'ready')
        .map(d => ({
          id: d.id,
          name: d.name,
          type: d.type
        }))
    : mockDocumentsReady

  const stats = hasRealData
    ? dashboardData.stats
    : {
        activeOrders: mockActiveServices.filter(s => s.status !== 'completed').length,
        completedOrders: mockActiveServices.filter(s => s.status === 'completed').length,
        pendingActions: mockActionItems.length,
        upcomingConsultations: 1,
        documentsReady: mockDocumentsReady.length
      }

  const hasOnboarded = hasRealData ? !!dashboardData.onboarding : true
  const onboarding = hasRealData ? dashboardData.onboarding : null

  const upcomingConsultations = hasRealData
    ? dashboardData.consultations.filter(c =>
        c.status === 'scheduled' && c.scheduled_at && new Date(c.scheduled_at) > new Date()
      )
    : []

  const referralStats = hasRealData
    ? dashboardData.referralStats
    : { link: null, stats: { total: 0, signed_up: 0, converted: 0, paid: 0, total_earned: 0 } }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff6a1a]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Next Steps Guidance */}
      <NextStepsGuide
        hasOnboarded={hasOnboarded}
        onboarding={onboarding}
        activeOrders={activeServices.filter(s => s.status !== 'completed').map(s => ({
          id: s.id,
          status: s.status,
          items: [{ name: s.name }],
          created_at: new Date()
        }))}
        pendingActions={actionItems.map(a => ({
          id: a.id,
          title: a.title,
          description: a.description,
          priority: a.priority,
          due_date: null
        }))}
        upcomingConsultations={upcomingConsultations.map(c => ({
          id: c.id,
          status: c.status,
          scheduled_at: c.scheduled_at ? new Date(c.scheduled_at) : null,
          service_type: c.service_type
        }))}
        userName={userName}
      />

      {/* Welcome Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#ff6a1a] via-[#ea580c] to-[#c2410c] rounded-2xl p-8 text-white shadow-xl shadow-orange-500/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                Dashboard Overview
              </span>
            </div>
            <h1 className="font-montserrat text-3xl font-bold mb-2">
              Hi, {userName}!
            </h1>
            <p className="text-orange-100 text-lg max-w-xl">
              {stats.activeOrders > 0
                ? `You have ${stats.activeOrders} service${stats.activeOrders > 1 ? "s" : ""} in progress. Let's keep building your business!`
                : "Ready to take your business to the next level?"}
            </p>
          </div>

          {/* Quick Stats in Banner */}
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.completedOrders}</p>
              <p className="text-sm text-orange-100">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.activeOrders}</p>
              <p className="text-sm text-orange-100">In Progress</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.pendingActions}</p>
              <p className="text-sm text-orange-100">Action Items</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Services & Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Services Progress */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-montserrat text-xl font-bold text-gray-900">
                Your Services
              </h2>
              <Link
                href="/dashboard/services"
                className="text-sm font-medium text-[#ff6a1a] hover:text-[#ea580c] flex items-center gap-1"
              >
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {activeServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      service.color === "green" ? "bg-green-100" :
                      service.color === "blue" ? "bg-blue-100" :
                      "bg-purple-100"
                    }`}>
                      <service.icon className={`h-6 w-6 ${
                        service.color === "green" ? "text-green-600" :
                        service.color === "blue" ? "text-blue-600" :
                        "text-purple-600"
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-montserrat font-semibold text-gray-900">
                          {service.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : service.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}>
                          {service.status === "completed" ? "Completed" :
                           service.status === "in_progress" ? "In Progress" : "Scheduled"}
                        </span>
                      </div>

                      {service.status === "in_progress" && (
                        <>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">{service.nextMilestone || "Working on it..."}</span>
                            <span className="font-medium text-gray-900">{service.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${service.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-2">
                            Est. completion: {service.estimatedCompletion}
                          </p>
                        </>
                      )}

                      {service.status === "completed" && (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Completed on {service.completedDate}
                        </p>
                      )}

                      {service.status === "scheduled" && (
                        <p className="text-sm text-purple-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Scheduled
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {activeServices.length === 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-montserrat font-semibold text-gray-900 mb-2">No Active Services</h3>
                  <p className="text-gray-600 mb-4">Start your business journey today!</p>
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
                  >
                    Browse Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Business Journey Timeline */}
          <div>
            <h2 className="font-montserrat text-xl font-bold text-gray-900 mb-4">
              Your Business Journey
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="relative">
                {mockJourneyMilestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex gap-4 pb-8 last:pb-0">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${
                        milestone.status === "completed"
                          ? "bg-green-500"
                          : milestone.status === "in_progress"
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}>
                        <milestone.icon className={`h-4 w-4 ${
                          milestone.status === "upcoming" ? "text-gray-400" : "text-white"
                        }`} />
                      </div>
                      {index < mockJourneyMilestones.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-2 ${
                          milestone.status === "completed" ? "bg-green-300" : "bg-gray-200"
                        }`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${
                          milestone.status === "upcoming" ? "text-gray-400" : "text-gray-900"
                        }`}>
                          {milestone.title}
                        </h4>
                        <span className={`text-sm ${
                          milestone.status === "upcoming" ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {milestone.date}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        milestone.status === "upcoming" ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Widgets */}
        <div className="space-y-6">
          {/* Referral Widget */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-5 w-5" />
              <h3 className="font-montserrat font-bold">Refer & Earn</h3>
            </div>
            <p className="text-sm text-white/90 mb-4">
              Share your referral link and earn 10% commission on every purchase!
            </p>
            <div className="bg-white/20 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>Total Referrals</span>
                <span className="font-bold">{referralStats.stats.total}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span>Earned</span>
                <span className="font-bold">${referralStats.stats.total_earned.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/dashboard/referrals"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Get Referral Link
            </Link>
          </div>

          {/* Action Items */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-montserrat font-bold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#ff6a1a]" />
                Action Items
              </h3>
              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                {actionItems.length} pending
              </span>
            </div>

            <div className="space-y-3">
              {actionItems.slice(0, showAllActions ? undefined : 3).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="block p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      item.priority === "high" || item.priority === "urgent" ? "bg-red-100" : "bg-gray-100"
                    }`}>
                      <item.icon className={`h-4 w-4 ${
                        item.priority === "high" || item.priority === "urgent" ? "text-red-600" : "text-gray-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm group-hover:text-[#ff6a1a]">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      <p className="text-xs text-orange-600 mt-1">{item.dueDate}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#ff6a1a]" />
                  </div>
                </Link>
              ))}
            </div>

            {actionItems.length > 3 && (
              <button
                onClick={() => setShowAllActions(!showAllActions)}
                className="w-full mt-3 text-sm text-[#ff6a1a] font-medium hover:text-[#ea580c]"
              >
                {showAllActions ? "Show less" : `Show all ${actionItems.length} items`}
              </button>
            )}
          </div>

          {/* Documents Ready */}
          {documentsReady.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Download className="h-5 w-5 text-green-600" />
                <h3 className="font-montserrat font-bold text-gray-900">
                  Documents Ready
                </h3>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                {documentsReady.length} document{documentsReady.length > 1 ? "s" : ""} ready for download
              </p>

              <div className="space-y-2 mb-4">
                {documentsReady.slice(0, 2).map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700 truncate">{doc.name}</span>
                  </div>
                ))}
                {documentsReady.length > 2 && (
                  <p className="text-sm text-gray-500">
                    +{documentsReady.length - 2} more
                  </p>
                )}
              </div>

              <Link
                href="/dashboard/documents"
                className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download All
              </Link>
            </div>
          )}

          {/* Recommended Services */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-[#ff6a1a]" />
              <h3 className="font-montserrat font-bold text-gray-900">
                Recommended for You
              </h3>
            </div>

            <div className="space-y-3">
              {recommendedServices.map((service) => (
                <Link
                  key={service.id}
                  href={service.href}
                  className="block p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm group-hover:text-[#ff6a1a]">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{service.description}</p>
                    </div>
                    <span className="text-sm font-bold text-[#ff6a1a]">{service.price}</span>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/services"
              className="block w-full mt-4 text-center text-sm text-[#ff6a1a] font-medium hover:text-[#ea580c]"
            >
              Browse All Services
            </Link>
          </div>

          {/* Local Resource Highlight */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-purple-600" />
              <h3 className="font-montserrat font-bold text-gray-900">
                Local Resource
              </h3>
            </div>

            <p className="font-semibold text-gray-900">{featuredResource.name}</p>
            <p className="text-sm text-purple-600 mb-2">{featuredResource.type}</p>
            <p className="text-sm text-gray-600 mb-3">{featuredResource.description}</p>
            <p className="text-xs text-gray-500 mb-4">{featuredResource.distance} from you</p>

            <Link
              href="/dashboard/local-resources"
              className="inline-flex items-center gap-2 text-sm text-purple-700 font-medium hover:text-purple-800"
            >
              View All Resources
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Contact */}
          <div className="bg-gray-900 rounded-xl p-6 text-white">
            <h3 className="font-montserrat font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-gray-300 mb-4">
              Questions about your services? We're here for you.
            </p>
            <div className="flex gap-2">
              <Link
                href="/dashboard/support"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Support
              </Link>
              <Link
                href="/book-call"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#ff6a1a] text-white rounded-lg text-sm font-medium hover:bg-[#ea580c] transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
