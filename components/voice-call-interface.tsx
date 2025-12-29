"use client"

import { useEffect, useState, useCallback } from "react"
import {
  LiveKitRoom,
  useLocalParticipant,
  useRoomContext,
  useTracks,
  RoomAudioRenderer,
} from "@livekit/components-react"
import { Track, Room, RoomEvent, ConnectionState } from "livekit-client"
import { Mic, MicOff, Phone, Loader2, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface VoiceCallInterfaceProps {
  token: string
  serverUrl: string
  roomName: string
  participantName: string
  onDisconnect: () => void
  onError?: (error: Error) => void
}

export function VoiceCallInterface({
  token,
  serverUrl,
  roomName,
  participantName,
  onDisconnect,
  onError,
}: VoiceCallInterfaceProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected
  )

  const handleError = useCallback(
    (error: Error) => {
      console.error("LiveKit error:", error)
      onError?.(error)
    },
    [onError]
  )

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={true}
      video={false}
      onError={handleError}
      onDisconnected={onDisconnect}
      className="h-full"
    >
      <CallControls
        roomName={roomName}
        participantName={participantName}
        connectionState={connectionState}
        onConnectionStateChange={setConnectionState}
        onEndCall={onDisconnect}
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  )
}

interface CallControlsProps {
  roomName: string
  participantName: string
  connectionState: ConnectionState
  onConnectionStateChange: (state: ConnectionState) => void
  onEndCall: () => void
}

function CallControls({
  roomName,
  participantName,
  connectionState,
  onConnectionStateChange,
  onEndCall,
}: CallControlsProps) {
  const room = useRoomContext()
  const { isMicrophoneEnabled, microphoneTrack } = useLocalParticipant()
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  // Track remote audio participants
  const remoteTracks = useTracks(
    [
      { source: Track.Source.Microphone, withPlaceholder: false },
      { source: Track.Source.ScreenShareAudio, withPlaceholder: false },
    ],
    {
      onlySubscribed: true,
    }
  )

  const hasRemoteAudio = remoteTracks.length > 0

  // Monitor connection state
  useEffect(() => {
    if (!room) return

    const handleConnectionStateChange = (state: ConnectionState) => {
      onConnectionStateChange(state)
      setIsConnected(state === ConnectionState.Connected)
    }

    // Set initial state
    handleConnectionStateChange(room.state)

    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChange)

    return () => {
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChange)
    }
  }, [room, onConnectionStateChange])

  // Call duration timer
  useEffect(() => {
    if (!isConnected) {
      setCallDuration(0)
      return
    }

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isConnected])

  // Sync mute state with LiveKit
  useEffect(() => {
    setIsMuted(!isMicrophoneEnabled)
  }, [isMicrophoneEnabled])

  const toggleMute = useCallback(async () => {
    if (!room) return

    try {
      const newMutedState = !isMuted
      await room.localParticipant.setMicrophoneEnabled(!newMutedState)
      setIsMuted(newMutedState)
    } catch (error) {
      console.error("Failed to toggle microphone:", error)
    }
  }, [room, isMuted])

  const toggleSpeaker = useCallback(() => {
    if (!room) return

    try {
      const newMutedState = !isSpeakerMuted

      // Mute/unmute all remote audio tracks by controlling their media elements
      room.remoteParticipants.forEach((participant) => {
        participant.audioTrackPublications.forEach((publication) => {
          if (publication.track) {
            const audioElements = publication.track.attachedElements
            audioElements.forEach((element) => {
              if (element instanceof HTMLAudioElement) {
                element.muted = newMutedState
              }
            })
          }
        })
      })

      setIsSpeakerMuted(newMutedState)
    } catch (error) {
      console.error("Failed to toggle speaker:", error)
    }
  }, [room, isSpeakerMuted])

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getConnectionStatusText = () => {
    switch (connectionState) {
      case ConnectionState.Connecting:
        return "Connecting..."
      case ConnectionState.Connected:
        return "Connected"
      case ConnectionState.Reconnecting:
        return "Reconnecting..."
      case ConnectionState.Disconnected:
        return "Disconnected"
      default:
        return "Unknown"
    }
  }

  const getConnectionStatusColor = () => {
    switch (connectionState) {
      case ConnectionState.Connected:
        return "text-green-500"
      case ConnectionState.Connecting:
      case ConnectionState.Reconnecting:
        return "text-yellow-500"
      case ConnectionState.Disconnected:
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-center py-4 md:py-6">
        <div className="relative">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <AnimatePresence mode="wait">
              {connectionState === ConnectionState.Connecting ||
              connectionState === ConnectionState.Reconnecting ? (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Loader2 className="w-7 h-7 md:w-8 md:h-8 text-white animate-spin" />
                </motion.div>
              ) : (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Phone className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {isConnected && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3 md:h-4 md:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-green-500"></span>
            </span>
          )}
        </div>
      </div>

      {/* Call Info */}
      <div className="text-center space-y-1">
        <p className={`text-sm font-medium ${getConnectionStatusColor()}`}>
          {getConnectionStatusText()}
        </p>
        {isConnected && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-500 dark:text-gray-400 font-mono"
          >
            {formatDuration(callDuration)}
          </motion.p>
        )}
        {hasRemoteAudio && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            AI Assistant is speaking
          </motion.p>
        )}
      </div>

      {/* Audio Level Indicator */}
      <AnimatePresence>
        {isConnected && microphoneTrack && !isMuted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-1 py-2"
          >
            <div className="flex items-center gap-1 h-8">
              {[...Array(7)].map((_, i) => {
                const heights = [12, 20, 28, 32, 28, 20, 12]
                return (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-[#ff6a1a] to-[#ea580c] rounded-full"
                    animate={{
                      height: [heights[i], heights[i] * 1.5, heights[i]],
                    }}
                    transition={{
                      duration: 0.5 + i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Controls */}
      <div className="flex items-center justify-center gap-3 md:gap-4 px-2 md:px-4">
        {/* Microphone Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          disabled={connectionState !== ConnectionState.Connected}
          className={`p-3 md:p-4 rounded-full transition-all touch-manipulation ${
            isMuted
              ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
        >
          {isMuted ? (
            <MicOff className="w-5 h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <Mic className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-200" />
          )}
        </motion.button>

        {/* End Call */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEndCall}
          className="p-3 md:p-4 bg-red-500 hover:bg-red-600 rounded-full transition-all shadow-lg shadow-red-500/50 touch-manipulation"
          aria-label="End call"
        >
          <Phone className="w-5 h-5 md:w-6 md:h-6 text-white rotate-[135deg]" />
        </motion.button>

        {/* Speaker Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSpeaker}
          disabled={connectionState !== ConnectionState.Connected}
          className={`p-3 md:p-4 rounded-full transition-all touch-manipulation ${
            isSpeakerMuted
              ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isSpeakerMuted ? "Unmute speaker" : "Mute speaker"}
        >
          {isSpeakerMuted ? (
            <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-gray-700 dark:text-gray-200" />
          )}
        </motion.button>
      </div>

      {/* Connection Status Messages */}
      <AnimatePresence>
        {connectionState === ConnectionState.Reconnecting && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-center"
          >
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Connection lost. Attempting to reconnect...
            </p>
          </motion.div>
        )}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <p className="text-xs text-gray-600 dark:text-gray-300">
              You're connected with our AI support assistant
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
