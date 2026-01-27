"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Briefcase,
  CheckCircle,
  Clock,
  Play,
  FileText,
  Calendar,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface Deliverable {
  id: string
  name: string
  status: 'pending' | 'in_progress' | 'completed'
}

interface ServiceDocument {
  id: string
  name: string
  url: string | null
}

interface Service {
  id: string
  order_id: string
  name: string
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed'
  progress: number
  start_date: string | null
  completed_date: string | null
  estimated_completion: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  next_milestone: string | null
  deliverables: Deliverable[]
  documents: ServiceDocument[]
}

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    progressColor: "bg-green-500"
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    progressColor: "bg-blue-500"
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    progressColor: "bg-purple-500"
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    progressColor: "bg-yellow-500"
  }
}

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    async function fetchServices() {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController()

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/user/services', {
          signal: abortControllerRef.current.signal
        })

        if (!response.ok) {
          throw new Error('Failed to fetch services')
        }

        const data = await response.json()
        setServices(data.services || [])
      } catch (err) {
        // Don't set error for aborted requests
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        console.error('Error fetching services:', err)
        setError('Unable to load services. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const completedServices = services.filter(s => s.status === "completed")
  const inProgressServices = services.filter(s => s.status === "in_progress" || s.status === "scheduled")

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat text-2xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600 mt-1">Track your active and completed services</p>
          </div>
          <div className="h-12 w-40 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-8 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-[#ff6a1a] animate-spin" />
          <span className="ml-2 text-gray-600">Loading services...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-montserrat text-2xl font-bold text-gray-900">My Services</h1>
            <p className="text-gray-600 mt-1">Track your active and completed services</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-montserrat text-2xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600 mt-1">Track your active and completed services</p>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Add New Service
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Play className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Services</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">
                {inProgressServices.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">
                {completedServices.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-[#ff6a1a]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">
                {services.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Services */}
      {inProgressServices.length > 0 && (
        <div>
          <h2 className="font-montserrat text-lg font-bold text-gray-900 mb-4">
            Active Services
          </h2>
          <div className="space-y-4">
            {inProgressServices.map((service, index) => {
              const status = statusConfig[service.status as keyof typeof statusConfig]
              const isExpanded = expandedService === service.id

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedService(isExpanded ? null : service.id)}
                    className="w-full p-6 text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                          <Briefcase className="h-6 w-6 text-[#ff6a1a]" />
                        </div>
                        <div>
                          <h3 className="font-montserrat font-semibold text-gray-900">
                            {service.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {service.status === "scheduled"
                              ? `Scheduled: ${service.scheduled_date ? new Date(service.scheduled_date).toLocaleDateString() : ''} at ${service.scheduled_time || ''}`
                              : service.start_date ? `Started: ${new Date(service.start_date).toLocaleDateString()}` : ""
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${status.color}`}>
                          {status.label}
                        </span>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {service.status === "in_progress" && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">{service.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${status.progressColor} transition-all duration-500`}
                            style={{ width: `${service.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-6 pb-6 border-t border-gray-100"
                    >
                      <div className="pt-4 space-y-4">
                        {/* Deliverables */}
                        {service.deliverables.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Deliverables</h4>
                            <div className="space-y-2">
                              {service.deliverables.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  {item.status === "completed" ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : item.status === "in_progress" ? (
                                    <Clock className="h-5 w-5 text-blue-500" />
                                  ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                                  )}
                                  <span className={item.status === "completed" ? "text-gray-600" : "text-gray-900"}>
                                    {item.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Next Milestone */}
                        {service.next_milestone && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                              <strong>Next Milestone:</strong> {service.next_milestone}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6a1a] text-white rounded-lg font-medium hover:bg-[#ea580c] transition-colors">
                            <MessageSquare className="h-4 w-4" />
                            Contact Support
                          </button>
                          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            <Calendar className="h-4 w-4" />
                            View Timeline
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Services */}
      {completedServices.length > 0 && (
        <div>
          <h2 className="font-montserrat text-lg font-bold text-gray-900 mb-4">
            Completed Services
          </h2>
          <div className="space-y-4">
            {completedServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-gray-900">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Completed: {service.completed_date ? new Date(service.completed_date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {service.documents.length > 0 && (
                      <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <FileText className="h-4 w-4" />
                        {service.documents.length} Documents
                      </button>
                    )}
                    <Link
                      href="/dashboard/documents"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6a1a] text-white rounded-lg text-sm font-medium hover:bg-[#ea580c] transition-colors"
                    >
                      View Files
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {services.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-montserrat text-lg font-semibold text-gray-900 mb-2">
            No services yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your business with our expert services
          </p>
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
  )
}
