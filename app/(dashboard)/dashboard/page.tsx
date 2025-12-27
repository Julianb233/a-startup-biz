import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  FolderOpen,
  Calendar,
  TrendingUp,
  Download,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Users,
} from "lucide-react"
import { getUpcomingConsultations, getPastConsultations } from "@/lib/consultations-data"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user

  const upcomingConsultations = getUpcomingConsultations()
  const pastConsultations = getPastConsultations()

  // Stats with real consultation data
  const stats = [
    {
      label: "Total Consultations",
      value: (upcomingConsultations.length + pastConsultations.length).toString(),
      icon: Calendar,
      change: `+${pastConsultations.filter(c => c.status === "Completed").length} completed`,
      changeType: "positive" as const
    },
    {
      label: "Upcoming Sessions",
      value: upcomingConsultations.length.toString(),
      icon: Clock,
      change: upcomingConsultations.length > 0 ? "Next: " + upcomingConsultations[0]?.date.split("-").slice(1).join("/") : "None scheduled",
      changeType: "neutral" as const
    },
    {
      label: "Resources Accessed",
      value: "12",
      icon: FolderOpen,
      change: "+3 this week",
      changeType: "positive" as const
    },
    {
      label: "Success Rate",
      value: "92%",
      icon: CheckCircle,
      change: "Above average",
      changeType: "positive" as const
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "download",
      title: "Downloaded One-Page Business Plan Template",
      time: "2 hours ago",
      icon: Download
    },
    {
      id: 2,
      type: "consultation",
      title: "Consultation scheduled for Feb 28",
      time: "1 day ago",
      icon: Calendar
    },
    {
      id: 3,
      type: "resource",
      title: "Viewed Financial Projection Model",
      time: "3 days ago",
      icon: FolderOpen
    },
    {
      id: 4,
      type: "download",
      title: "Downloaded SWOT Analysis Worksheet",
      time: "5 days ago",
      icon: Download
    }
  ]

  const quickActions = [
    {
      title: "View Consultations",
      description: "Manage your upcoming and past sessions",
      href: "/dashboard/consultations",
      icon: Calendar,
      color: "from-[#ff6a1a] to-[#ea580c]"
    },
    {
      title: "Update Profile",
      description: "Keep your information current",
      href: "/dashboard/profile",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Browse Resources",
      description: "Access templates, guides, and tools",
      href: "/dashboard/resources",
      icon: FolderOpen,
      color: "from-green-500 to-green-600"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-gradient-to-br from-[#ff6a1a] via-[#ea580c] to-[#c2410c] rounded-2xl p-8 text-white shadow-xl shadow-orange-500/20">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                Your Dashboard
              </span>
            </div>
            <h1 className="font-montserrat text-3xl font-bold mb-2">
              Welcome, {user?.name?.split(" ")[0] || user?.email || "User"}!
            </h1>
            <p className="text-orange-100 text-lg max-w-2xl">
              Ready to turn your business ideas into reality? Access your resources,
              track your progress, and get the guidance you need to succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <stat.icon className="h-6 w-6 text-[#ff6a1a]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="font-montserrat text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
              <p className={`text-sm ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : stat.changeType === "neutral"
                  ? "text-gray-600"
                  : "text-red-600"
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-montserrat text-xl font-bold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${action.color} mb-4`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-montserrat font-semibold text-lg text-gray-900 mb-2 group-hover:text-[#ff6a1a] transition-colors">
                {action.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {action.description}
              </p>
              <div className="flex items-center text-[#ff6a1a] font-medium text-sm group-hover:gap-2 transition-all">
                <span>Get started</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-montserrat text-xl font-bold text-gray-900">
            Recent Activity
          </h2>
          <Link
            href="/dashboard/activity"
            className="text-sm font-medium text-[#ff6a1a] hover:text-[#ea580c] transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <activity.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-montserrat text-2xl font-bold mb-2">
              Ready to take your business to the next level?
            </h3>
            <p className="text-gray-300">
              Schedule a one-on-one consultation and get personalized strategies for growth.
            </p>
          </div>
          <Link
            href="/book-call"
            className="whitespace-nowrap px-8 py-4 bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200"
          >
            Book Your Call
          </Link>
        </div>
      </div>
    </div>
  )
}
