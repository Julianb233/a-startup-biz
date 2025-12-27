"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  FileText,
  Briefcase,
  UserCircle,
  Clock,
  Sparkles,
  MessageSquare,
  AlertCircle,
  ChevronRight,
  Rocket
} from "lucide-react"

interface ActionItem {
  id: string
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date: Date | null
}

interface Order {
  id: string
  status: string
  items: any
  created_at: Date
}

interface Consultation {
  id: string
  status: string
  scheduled_at: Date | null
  service_type: string
}

interface OnboardingSubmission {
  id: string
  status: string
}

interface NextStepsGuideProps {
  hasOnboarded: boolean
  onboarding?: OnboardingSubmission | null
  activeOrders: Order[]
  pendingActions: ActionItem[]
  upcomingConsultations: Consultation[]
  userName?: string
}

type UserState =
  | 'new_user'
  | 'needs_onboarding'
  | 'pending_action'
  | 'consultation_scheduled'
  | 'active_service'
  | 'all_complete'

function determineUserState(props: NextStepsGuideProps): UserState {
  const { hasOnboarded, pendingActions, upcomingConsultations, activeOrders } = props

  // New user who hasn't onboarded
  if (!hasOnboarded) {
    return 'new_user'
  }

  // Has urgent pending actions
  if (pendingActions.some(a => a.priority === 'urgent' || a.priority === 'high')) {
    return 'pending_action'
  }

  // Has upcoming consultation
  if (upcomingConsultations.length > 0) {
    return 'consultation_scheduled'
  }

  // Has active services in progress
  if (activeOrders.length > 0) {
    return 'active_service'
  }

  // Has pending actions (lower priority)
  if (pendingActions.length > 0) {
    return 'pending_action'
  }

  return 'all_complete'
}

function getGuideContent(state: UserState, props: NextStepsGuideProps) {
  const { pendingActions, upcomingConsultations, activeOrders, userName } = props

  switch (state) {
    case 'new_user':
      return {
        icon: Rocket,
        iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
        title: `Welcome${userName ? `, ${userName}` : ''}! Let's Get Started`,
        description: 'Complete your business onboarding to help us understand your goals and create a customized plan for your success.',
        primaryAction: {
          label: 'Complete Onboarding',
          href: '/onboarding',
          icon: ArrowRight
        },
        secondaryAction: {
          label: 'Browse Services',
          href: '/services'
        },
        tips: [
          'Takes about 5 minutes to complete',
          'Helps us create a personalized strategy',
          'Unlocks full dashboard features'
        ]
      }

    case 'pending_action':
      const urgentAction = pendingActions.find(a => a.priority === 'urgent')
      const highAction = pendingActions.find(a => a.priority === 'high')
      const topAction = urgentAction || highAction || pendingActions[0]
      return {
        icon: AlertCircle,
        iconBg: topAction?.priority === 'urgent' ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-yellow-500 to-orange-500',
        title: 'Action Required',
        description: topAction?.title || 'You have pending action items that need your attention.',
        details: topAction?.description,
        primaryAction: {
          label: 'View All Actions',
          href: '/dashboard',
          icon: CheckCircle2
        },
        badge: pendingActions.length > 1 ? `+${pendingActions.length - 1} more` : undefined,
        tips: [
          'Complete actions to keep your project moving',
          'High-priority items need attention first'
        ]
      }

    case 'consultation_scheduled':
      const nextConsultation = upcomingConsultations[0]
      const consultDate = nextConsultation?.scheduled_at
        ? new Date(nextConsultation.scheduled_at)
        : null
      return {
        icon: Calendar,
        iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
        title: 'Consultation Scheduled',
        description: consultDate
          ? `Your call with Tory is scheduled for ${consultDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })} at ${consultDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            })}`
          : 'You have an upcoming consultation scheduled.',
        primaryAction: {
          label: 'View Consultation Details',
          href: '/dashboard/consultations',
          icon: ChevronRight
        },
        tips: [
          'Prepare any questions you have',
          'Review your business goals beforehand',
          'Join 5 minutes early to test your connection'
        ]
      }

    case 'active_service':
      const activeOrder = activeOrders[0]
      const serviceName = activeOrder?.items?.[0]?.name || 'Your service'
      return {
        icon: Briefcase,
        iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
        title: 'Service In Progress',
        description: `${serviceName} is currently being worked on. Track progress and view updates in your services dashboard.`,
        primaryAction: {
          label: 'View Progress',
          href: '/dashboard/services',
          icon: ArrowRight
        },
        secondaryAction: {
          label: 'Contact Support',
          href: '/dashboard/support'
        },
        badge: activeOrders.length > 1 ? `${activeOrders.length} active services` : undefined,
        tips: [
          'Check for updates regularly',
          'Respond promptly to any requests',
          'Documents will appear when ready'
        ]
      }

    case 'all_complete':
      return {
        icon: Sparkles,
        iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
        title: "You're All Caught Up!",
        description: "Great job! You don't have any pending actions. Ready to take your business to the next level?",
        primaryAction: {
          label: 'Explore More Services',
          href: '/services',
          icon: Sparkles
        },
        secondaryAction: {
          label: 'Book a Strategy Call',
          href: '/book-call'
        },
        tips: [
          'Check back for new features',
          'Refer a friend to earn rewards',
          'Download your documents anytime'
        ]
      }

    default:
      return {
        icon: MessageSquare,
        iconBg: 'bg-gradient-to-br from-gray-500 to-gray-600',
        title: 'Need Help?',
        description: 'Our team is here to support you on your business journey.',
        primaryAction: {
          label: 'Contact Support',
          href: '/dashboard/support',
          icon: MessageSquare
        }
      }
  }
}

export default function NextStepsGuide(props: NextStepsGuideProps) {
  const state = determineUserState(props)
  const content = getGuideContent(state, props)
  const Icon = content.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          {/* Icon */}
          <div className={`flex-shrink-0 w-16 h-16 ${content.iconBg} rounded-2xl flex items-center justify-center shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-montserrat text-xl sm:text-2xl font-bold text-gray-900">
                  {content.title}
                </h2>
                {content.badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-2">
                    {content.badge}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 text-gray-600 text-base">
              {content.description}
            </p>

            {content.details && (
              <p className="mt-2 text-sm text-gray-500 italic">
                {content.details}
              </p>
            )}

            {/* Tips */}
            {content.tips && content.tips.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {content.tips.map((tip, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full text-xs text-gray-600"
                  >
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {tip}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {content.primaryAction && (
                <Link
                  href={content.primaryAction.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-xl hover:bg-[#ea580c] transition-all duration-200 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02]"
                >
                  {content.primaryAction.label}
                  {content.primaryAction.icon && (
                    <content.primaryAction.icon className="w-4 h-4" />
                  )}
                </Link>
              )}
              {content.secondaryAction && (
                <Link
                  href={content.secondaryAction.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {content.secondaryAction.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress indicator for active services */}
      {state === 'active_service' && props.activeOrders.length > 0 && (
        <div className="px-6 sm:px-8 pb-6">
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Active Projects</span>
              <span className="font-medium text-gray-900">{props.activeOrders.length}</span>
            </div>
            <div className="space-y-2">
              {props.activeOrders.slice(0, 3).map((order, index) => (
                <div key={order.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-sm text-gray-600 truncate">
                    {order.items?.[0]?.name || `Service #${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
