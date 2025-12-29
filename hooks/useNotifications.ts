"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useAuth } from "./use-auth"

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read: boolean
  read_at: Date | null
  created_at: Date
}

interface NotificationsResponse {
  notifications: Notification[]
  unreadCount: number
  total: number
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: Error | null
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refetch: () => Promise<void>
}

interface UseNotificationsOptions {
  /** Polling interval in milliseconds (default: 30000 = 30 seconds) */
  pollInterval?: number
  /** Only fetch unread notifications (default: false) */
  unreadOnly?: boolean
  /** Maximum number of notifications to fetch (default: 20) */
  limit?: number
  /** Disable automatic polling (default: false) */
  disablePolling?: boolean
}

/**
 * Real-time notification polling hook for authenticated users
 *
 * Features:
 * - Automatic polling every 30 seconds (configurable)
 * - Optimistic updates for better UX
 * - Only polls when user is authenticated
 * - Cleanup on unmount
 * - Mark individual or all notifications as read
 *
 * @example
 * ```tsx
 * const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
 *
 * return (
 *   <div>
 *     <Badge>{unreadCount}</Badge>
 *     {notifications.map(n => (
 *       <NotificationItem
 *         key={n.id}
 *         notification={n}
 *         onMarkRead={() => markAsRead(n.id)}
 *       />
 *     ))}
 *   </div>
 * )
 * ```
 */
export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const {
    pollInterval = 30000, // 30 seconds
    unreadOnly = false,
    limit = 20,
    disablePolling = false,
  } = options

  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  /**
   * Fetch notifications from the API
   */
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || authLoading) {
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        unreadOnly: unreadOnly.toString(),
      })

      const response = await fetch(`/api/notifications?${params}`)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - please sign in')
        }
        throw new Error(`Failed to fetch notifications: ${response.statusText}`)
      }

      const data: NotificationsResponse = await response.json()

      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications'
      if (isMountedRef.current) {
        setError(new Error(errorMessage))
        console.error('Error fetching notifications:', err)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [isAuthenticated, authLoading, limit, unreadOnly])

  /**
   * Mark a single notification as read with optimistic update
   */
  const markAsRead = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to mark notifications as read')
    }

    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true, read_at: new Date() } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      })

      if (!response.ok) {
        // Revert optimistic update on error
        await fetchNotifications()

        if (response.status === 401) {
          throw new Error('Unauthorized - please sign in')
        }
        if (response.status === 404) {
          throw new Error('Notification not found')
        }
        throw new Error('Failed to mark notification as read')
      }
    } catch (err) {
      // Revert optimistic update and refetch on error
      await fetchNotifications()
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark notification as read'
      throw new Error(errorMessage)
    }
  }, [isAuthenticated, fetchNotifications])

  /**
   * Mark all notifications as read with optimistic update
   */
  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to mark notifications as read')
    }

    // Store previous state for rollback
    const previousNotifications = [...notifications]
    const previousUnreadCount = unreadCount

    // Optimistic update
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true, read_at: new Date() }))
    )
    setUnreadCount(0)

    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        // Revert optimistic update on error
        setNotifications(previousNotifications)
        setUnreadCount(previousUnreadCount)

        if (response.status === 401) {
          throw new Error('Unauthorized - please sign in')
        }
        throw new Error('Failed to mark all notifications as read')
      }

      // Optionally refresh from server to ensure consistency
      await fetchNotifications()
    } catch (err) {
      // Revert optimistic update on error
      setNotifications(previousNotifications)
      setUnreadCount(previousUnreadCount)

      const errorMessage = err instanceof Error ? err.message : 'Failed to mark all notifications as read'
      throw new Error(errorMessage)
    }
  }, [isAuthenticated, notifications, unreadCount, fetchNotifications])

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  /**
   * Set up polling interval
   */
  useEffect(() => {
    // Clear any existing interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
      pollIntervalRef.current = null
    }

    // Don't poll if user is not authenticated or polling is disabled
    if (!isAuthenticated || authLoading || disablePolling) {
      return
    }

    // Initial fetch
    fetchNotifications()

    // Set up polling
    pollIntervalRef.current = setInterval(() => {
      fetchNotifications()
    }, pollInterval)

    // Cleanup function
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [isAuthenticated, authLoading, disablePolling, pollInterval, fetchNotifications])

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
        pollIntervalRef.current = null
      }
    }
  }, [])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  }
}
