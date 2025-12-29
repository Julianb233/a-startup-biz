"use client"

import { useState, useEffect, useCallback } from "react"
import { Phone, X, Headphones, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { VoiceCallInterface } from "./voice-call-interface"
import "@livekit/components-styles"

interface FloatingCallButtonProps {
  voiceApiUrl?: string
}

interface LiveKitCredentials {
  token: string
  roomName: string
  participantName: string
  livekitHost: string
}

export function FloatingCallButton({ voiceApiUrl = "/api/voice/token" }: FloatingCallButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { isSignedIn, user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isInCall, setIsInCall] = useState(false)
  const [credentials, setCredentials] = useState<LiveKitCredentials | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Ensure client-side only rendering to avoid SSR issues with Clerk
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent body scroll when call panel is open
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      document.body.style.overflow = "hidden"
    } else if (typeof window !== "undefined") {
      document.body.style.overflow = ""
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.style.overflow = ""
      }
    }
  }, [isOpen])

  const handleStartCall = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      // Check for microphone permission first
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (permError) {
          throw new Error("Microphone access denied. Please allow microphone access to make calls.")
        }
      }

      // Request LiveKit token from the API
      const response = await fetch(voiceApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantName: user?.fullName || user?.firstName || `User ${user?.id}`,
          roomType: "support",
          spawnAiAgent: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (response.status === 503) {
          throw new Error("Voice service is temporarily unavailable. Please try again later.")
        }
        throw new Error(errorData.error || "Unable to start call. Please try again.")
      }

      const data = await response.json()

      if (!data.token || !data.livekitHost) {
        throw new Error("Invalid response from voice service. Please contact support.")
      }

      setCredentials({
        token: data.token,
        roomName: data.roomName,
        participantName: data.participantName,
        livekitHost: data.livekitHost,
      })

      setIsInCall(true)
      setIsConnecting(false)
    } catch (error) {
      console.error("Failed to start call:", error)
      setError(error instanceof Error ? error.message : "Failed to connect to voice service")
      setIsConnecting(false)
      setIsInCall(false)
    }
  }, [voiceApiUrl, user])

  const handleEndCall = useCallback(() => {
    setIsInCall(false)
    setCredentials(null)
    setError(null)
    // Keep panel open to show disconnection confirmation
    setTimeout(() => {
      setIsOpen(false)
    }, 1500)
  }, [])

  // Handle escape key to close panel (when not in call)
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen && !isInCall) {
        setIsOpen(false)
      }
    }

    if (isOpen && typeof window !== "undefined") {
      window.addEventListener("keydown", handleEscapeKey)
      return () => window.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, isInCall])

  const handleError = useCallback((error: Error) => {
    console.error("LiveKit error:", error)
    setError(error.message)
    setIsInCall(false)
    setCredentials(null)
  }, [])

  // Only show for signed-in users on client side
  if (!mounted || !isSignedIn) return null

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isInCall && setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="panel"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-[calc(100vw-2rem)] max-w-sm border border-gray-100 dark:border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#ff6a1a] to-[#ea580c] rounded-full flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      Support Call
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isInCall ? "In Progress" : "Talk to our AI assistant"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !isInCall && setIsOpen(false)}
                  disabled={isInCall}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Call Interface */}
              {isInCall && credentials ? (
                <VoiceCallInterface
                  token={credentials.token}
                  serverUrl={credentials.livekitHost}
                  roomName={credentials.roomName}
                  participantName={credentials.participantName}
                  onDisconnect={handleEndCall}
                  onError={handleError}
                />
              ) : error ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-6">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      Connection Failed
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setError(null)
                      handleStartCall()
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Hi {user?.firstName || "there"}! Need help? Start a voice call with our AI assistant.
                  </p>
                  <button
                    onClick={handleStartCall}
                    disabled={isConnecting}
                    className="w-full py-3 bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Phone className="w-5 h-5" />
                        Start Voice Call
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-gray-400">
                    Available 24/7 for instant support
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.button
              key="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#ff6a1a] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] rounded-full shadow-lg flex items-center justify-center transition-all group touch-manipulation"
              aria-label="Open voice call"
            >
              <Headphones className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" />

              {/* Pulse animation */}
              <span className="absolute flex h-full w-full">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6a1a] opacity-30"></span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
