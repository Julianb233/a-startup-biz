/**
 * Voice Agent Integration Example
 *
 * This example demonstrates how to integrate the voice agent system
 * into your application with a complete user flow.
 */

'use client';

import { useState, useEffect } from 'react';
import { VoiceCallInterface } from '@/components/voice-call-interface';
import { createVoiceAgentClient, formatUptime, getAvailableVoices } from '@/lib/voice-agent-utils';
import type { OpenAIVoice } from '@/lib/voice-agent-types';

/**
 * Example: Complete Voice Agent Integration Component
 *
 * This component shows the full lifecycle of a voice agent:
 * 1. Initialize connection
 * 2. Spawn agent
 * 3. Start worker
 * 4. Connect user
 * 5. Handle disconnection
 */
export function VoiceAgentExample() {
  const [roomName] = useState(() => `support-${Date.now()}`);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<OpenAIVoice>('alloy');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful AI assistant for A Startup Biz. Be friendly, concise, and professional.'
  );

  const client = createVoiceAgentClient();
  const voices = getAvailableVoices();

  /**
   * Start a voice call with AI agent
   */
  const startVoiceCall = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Get user token from backend
      const tokenResponse = await fetch('/api/voice/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          participantName: 'User',
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get room token');
      }

      const tokenData = await tokenResponse.json();
      setUserToken(tokenData.token);
      setServerUrl(tokenData.serverUrl);

      // Step 2: Spawn AI agent and start worker
      const { spawnResponse, workerResponse } = await client.startVoiceAgent({
        roomName,
        systemPrompt,
        voice: selectedVoice,
        debug: true,
      });

      console.log('Agent spawned:', spawnResponse);
      console.log('Worker started:', workerResponse);

      // Step 3: Connect user to room (handled by VoiceCallInterface)
      setIsConnected(true);

    } catch (err) {
      console.error('Error starting voice call:', err);
      setError(err instanceof Error ? err.message : 'Failed to start voice call');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * End the voice call
   */
  const endVoiceCall = async () => {
    setIsLoading(true);

    try {
      // Remove agent from room
      await client.removeAgent(roomName);

      // Reset state
      setIsConnected(false);
      setUserToken(null);
      setServerUrl('');

    } catch (err) {
      console.error('Error ending voice call:', err);
      setError(err instanceof Error ? err.message : 'Failed to end voice call');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle errors from LiveKit
   */
  const handleLiveKitError = (error: Error) => {
    console.error('LiveKit error:', error);
    setError(error.message);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">AI Voice Assistant</h2>

        {!isConnected ? (
          <div className="space-y-4">
            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as OpenAIVoice)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                disabled={isLoading}
              >
                {voices.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium mb-2">
                System Prompt (Optional)
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                rows={4}
                disabled={isLoading}
                placeholder="Customize how the AI should behave..."
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Start Call Button */}
            <button
              onClick={startVoiceCall}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Connecting...
                </span>
              ) : (
                'Start Voice Call'
              )}
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Click to connect with our AI assistant. Make sure your microphone is enabled.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Voice Call Interface */}
            {userToken && serverUrl && (
              <VoiceCallInterface
                token={userToken}
                serverUrl={serverUrl}
                roomName={roomName}
                participantName="User"
                onDisconnect={endVoiceCall}
                onError={handleLiveKitError}
              />
            )}

            {/* Room Info */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-300 font-mono">
                Room: {roomName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Voice: {voices.find(v => v.value === selectedVoice)?.label}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Controls */}
      {isConnected && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Call Controls</h3>
          <button
            onClick={endVoiceCall}
            disabled={isLoading}
            className="w-full py-2 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            End Call
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Simple Quick Start Button
 *
 * Minimal integration for a "Talk to AI" button
 */
export function QuickStartVoiceButton() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callData, setCallData] = useState<{
    token: string;
    serverUrl: string;
    roomName: string;
  } | null>(null);

  const startCall = async () => {
    try {
      const roomName = `quick-${Date.now()}`;

      // Get token
      const tokenRes = await fetch('/api/voice/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName: 'User' }),
      });
      const tokenData = await tokenRes.json();

      // Start agent
      const client = createVoiceAgentClient();
      await client.startVoiceAgent({ roomName });

      setCallData({
        token: tokenData.token,
        serverUrl: tokenData.serverUrl,
        roomName,
      });
      setIsCallActive(true);

    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to start voice call');
    }
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallData(null);
  };

  if (isCallActive && callData) {
    return (
      <VoiceCallInterface
        token={callData.token}
        serverUrl={callData.serverUrl}
        roomName={callData.roomName}
        participantName="User"
        onDisconnect={endCall}
      />
    );
  }

  return (
    <button
      onClick={startCall}
      className="py-2 px-4 bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
    >
      Talk to AI Assistant
    </button>
  );
}

/**
 * Example: Agent Status Monitor
 *
 * Component to monitor agent status in real-time
 */
export function AgentStatusMonitor({ roomName }: { roomName: string }) {
  const [status, setStatus] = useState<string>('unknown');
  const [uptime, setUptime] = useState<string>('0s');

  useEffect(() => {
    const client = createVoiceAgentClient();

    const checkStatus = async () => {
      try {
        const response = await client.getAgentStatus(roomName);
        if (response.session) {
          setStatus(response.session.status);

          // Calculate uptime
          const createdAt = new Date(response.session.createdAt);
          const now = new Date();
          const seconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);
          setUptime(formatUptime(seconds));
        }
      } catch (error) {
        console.error('Failed to get status:', error);
      }
    };

    // Check status every 2 seconds
    const interval = setInterval(checkStatus, 2000);
    checkStatus(); // Initial check

    return () => clearInterval(interval);
  }, [roomName]);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'active'
            ? 'bg-green-500 animate-pulse'
            : status === 'pending'
            ? 'bg-yellow-500'
            : 'bg-gray-400'
        }`}
      />
      <span className="text-sm font-medium">
        {status} {status === 'active' && `(${uptime})`}
      </span>
    </div>
  );
}

/**
 * Example: Cost Estimator
 *
 * Show estimated cost for voice conversation
 */
export function VoiceCostEstimator({ durationMinutes }: { durationMinutes: number }) {
  const { totalCost, whisperCost, llmCost, ttsCost } = estimateConversationCost({
    durationMinutes,
    model: 'gpt-4',
  });

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h4 className="text-sm font-semibold mb-2">Estimated Cost</h4>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Transcription (Whisper):</span>
          <span className="font-mono">${whisperCost.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span>AI Response (GPT-4):</span>
          <span className="font-mono">${llmCost.toFixed(4)}</span>
        </div>
        <div className="flex justify-between">
          <span>Speech Synthesis (TTS):</span>
          <span className="font-mono">${ttsCost.toFixed(4)}</span>
        </div>
        <div className="flex justify-between font-semibold pt-1 border-t border-blue-200 dark:border-blue-700">
          <span>Total ({durationMinutes} min):</span>
          <span className="font-mono">${totalCost.toFixed(4)}</span>
        </div>
      </div>
    </div>
  );
}

// Export example helper to estimate conversation cost
import { estimateConversationCost } from '@/lib/voice-agent-utils';
