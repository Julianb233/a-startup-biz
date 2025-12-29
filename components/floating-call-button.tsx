"use client"

import { useState, useEffect } from "react"
import { Phone, X, Headphones } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@clerk/nextjs"

interface FloatingCallButtonProps {
  voiceApiUrl?: string
}

export function FloatingCallButton({ voiceApiUrl }: FloatingCallButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { isSignedIn, user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isInCall, setIsInCall] = useState(false)

  // Ensure client-side only rendering to avoid SSR issues with Clerk
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only show for signed-in users on client side
  if (!mounted || !isSignedIn) return null

  const handleStartCall = async () => {
    setIsConnecting(true)

    try {
      // TODO: Integrate with voice-agent-platform
      // This will connect to the Voice API to get a LiveKit token
      // and establish a WebRTC connection

      // For now, show a placeholder
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsInCall(true)
      setIsConnecting(false)
    } catch (error) {
      console.error("Failed to start call:", error)
      setIsConnecting(false)
    }
  }

  const handleEndCall = () => {
    setIsInCall(false)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="panel"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 w-72 border border-gray-100 dark:border-gray-700"
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
                      {isInCall ? "Connected" : "Talk to our AI assistant"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Call Status */}
              {isInCall ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center py-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <Phone className="w-8 h-8 text-white" />
                      </div>
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                      </span>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                    You're connected with our AI support assistant
                  </p>
                  <button
                    onClick={handleEndCall}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                  >
                    End Call
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
              className="w-14 h-14 bg-gradient-to-br from-[#ff6a1a] to-[#ea580c] hover:from-[#ea580c] hover:to-[#dc2626] rounded-full shadow-lg flex items-center justify-center transition-all group"
            >
              <Headphones className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />

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
