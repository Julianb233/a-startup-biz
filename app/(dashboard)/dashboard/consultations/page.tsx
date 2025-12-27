"use client"

import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Plus,
  ArrowRight,
  CheckCircle,
  XCircle,
  CalendarClock,
} from "lucide-react"
import {
  getUpcomingConsultations,
  getPastConsultations,
  formatConsultationDate,
  getStatusColor,
  getTypeColor,
  type Consultation,
} from "@/lib/consultations-data"

export default function ConsultationsPage() {
  const upcomingConsultations = getUpcomingConsultations()
  const pastConsultations = getPastConsultations()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Consultations
          </h1>
          <p className="text-gray-600">
            Manage your upcoming and past consultations
          </p>
        </div>
        <motion.a
          href="/book-call"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-colors shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-5 h-5" />
          Book New Consultation
        </motion.a>
      </motion.div>

      {/* Upcoming Consultations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <CalendarClock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Upcoming Consultations
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
            {upcomingConsultations.length}
          </span>
        </div>

        {upcomingConsultations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingConsultations.map((consultation, index) => (
              <ConsultationCard
                key={consultation.id}
                consultation={consultation}
                index={index}
                isUpcoming={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No upcoming consultations"
            description="Schedule your next consultation to continue growing your business"
            actionLabel="Book a Consultation"
            actionHref="/book-call"
          />
        )}
      </motion.div>

      {/* Past Consultations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Past Consultations
          </h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-semibold rounded-full">
            {pastConsultations.length}
          </span>
        </div>

        {pastConsultations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pastConsultations.map((consultation, index) => (
              <ConsultationCard
                key={consultation.id}
                consultation={consultation}
                index={index}
                isUpcoming={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No past consultations yet</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

interface ConsultationCardProps {
  consultation: Consultation
  index: number
  isUpcoming: boolean
}

function ConsultationCard({
  consultation,
  index,
  isUpcoming,
}: ConsultationCardProps) {
  const statusIcon = {
    Scheduled: CalendarClock,
    Completed: CheckCircle,
    Cancelled: XCircle,
    Rescheduled: Calendar,
  }[consultation.status]

  const StatusIcon = statusIcon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Card Header with Gradient */}
      <div
        className={`bg-gradient-to-br ${getTypeColor(
          consultation.type
        )} p-4 text-white`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{consultation.type}</h3>
            <div className="flex items-center gap-4 text-sm text-white/90">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatConsultationDate(consultation.date)}
              </div>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${
              consultation.status === "Scheduled"
                ? "bg-white/20 text-white border-white/30"
                : consultation.status === "Completed"
                  ? "bg-white/20 text-white border-white/30"
                  : "bg-red-500/20 text-white border-white/30"
            }`}
          >
            {consultation.status}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-4">
        {/* Time and Duration */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">
              {consultation.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">•</span>
            <span>{consultation.duration} minutes</span>
          </div>
        </div>

        {/* Consultant Info */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-full flex items-center justify-center text-white font-bold">
            {consultation.consultant.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {consultation.consultant.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {consultation.consultant.title}
            </p>
          </div>
        </div>

        {/* Notes Preview */}
        {consultation.notes && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-gray-700 line-clamp-2">
              {consultation.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          {isUpcoming && consultation.meetingUrl ? (
            <>
              <motion.a
                href={consultation.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-colors"
              >
                <Video className="w-4 h-4" />
                Join Meeting
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Reschedule
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-[#ff6a1a] hover:text-[#ff6a1a] transition-all group"
            >
              <FileText className="w-4 h-4" />
              View Full Notes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface EmptyStateProps {
  title: string
  description: string
  actionLabel: string
  actionHref: string
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center"
    >
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <motion.a
          href={actionHref}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-colors shadow-lg shadow-orange-500/20"
        >
          <Plus className="w-5 h-5" />
          {actionLabel}
        </motion.a>
      </div>
    </motion.div>
  )
}
