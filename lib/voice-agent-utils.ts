/**
 * Voice Agent Utility Functions
 *
 * Helper functions for working with the voice agent system.
 */

import type {
  AgentSession,
  SpawnAgentResponse,
  AgentStatusResponse,
  StartWorkerResponse,
  OpenAIVoice,
} from './voice-agent-types';

/**
 * Client-side API wrapper for voice agent operations
 */
export class VoiceAgentClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Spawn a new voice agent for a room
   */
  async spawnAgent(params: {
    roomName: string;
    systemPrompt?: string;
    voice?: OpenAIVoice;
  }): Promise<SpawnAgentResponse> {
    const response = await fetch(`${this.baseUrl}/api/voice/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to spawn agent');
    }

    return response.json();
  }

  /**
   * Start the voice agent worker
   */
  async startWorker(params: {
    roomName: string;
    systemPrompt?: string;
    voice?: OpenAIVoice;
    debug?: boolean;
  }): Promise<StartWorkerResponse> {
    const response = await fetch(`${this.baseUrl}/api/voice/agent/worker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to start worker');
    }

    return response.json();
  }

  /**
   * Get agent status for a specific room
   */
  async getAgentStatus(roomName: string): Promise<AgentStatusResponse> {
    const response = await fetch(
      `${this.baseUrl}/api/voice/agent?roomName=${encodeURIComponent(roomName)}`
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get agent status');
    }

    return response.json();
  }

  /**
   * List all active agent sessions
   */
  async listActiveSessions(): Promise<AgentStatusResponse> {
    const response = await fetch(`${this.baseUrl}/api/voice/agent?listAll=true`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to list sessions');
    }

    return response.json();
  }

  /**
   * Remove agent from a room
   */
  async removeAgent(roomName: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${this.baseUrl}/api/voice/agent?roomName=${encodeURIComponent(roomName)}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove agent');
    }

    return response.json();
  }

  /**
   * Check worker health
   */
  async checkWorkerHealth(): Promise<{
    success: boolean;
    message: string;
    livekitConfigured: boolean;
    openaiConfigured: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/api/voice/agent/worker`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to check worker health');
    }

    return response.json();
  }

  /**
   * Convenience method: Spawn agent and start worker in one call
   */
  async startVoiceAgent(params: {
    roomName: string;
    systemPrompt?: string;
    voice?: OpenAIVoice;
    debug?: boolean;
  }): Promise<{
    spawnResponse: SpawnAgentResponse;
    workerResponse: StartWorkerResponse;
  }> {
    const spawnResponse = await this.spawnAgent({
      roomName: params.roomName,
      systemPrompt: params.systemPrompt,
      voice: params.voice,
    });

    if (!spawnResponse.success) {
      throw new Error(spawnResponse.message || 'Failed to spawn agent');
    }

    const workerResponse = await this.startWorker({
      roomName: params.roomName,
      systemPrompt: params.systemPrompt,
      voice: params.voice,
      debug: params.debug,
    });

    return { spawnResponse, workerResponse };
  }
}

/**
 * Format agent session for display
 */
export function formatAgentSession(session: AgentSession): string {
  const status = session.status.toUpperCase();
  const created = new Date(session.createdAt).toLocaleString();
  const voice = session.metadata?.voice || 'unknown';

  return `Agent ${session.agentIdentity} in room ${session.roomName}
Status: ${status}
Voice: ${voice}
Created: ${created}`;
}

/**
 * Calculate agent uptime in seconds
 */
export function getAgentUptime(session: AgentSession): number {
  const now = new Date();
  const created = new Date(session.createdAt);
  return Math.floor((now.getTime() - created.getTime()) / 1000);
}

/**
 * Format uptime as human-readable string
 */
export function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Check if agent is active
 */
export function isAgentActive(session: AgentSession | null): boolean {
  return session?.status === 'active';
}

/**
 * Check if agent needs restart
 */
export function shouldRestartAgent(session: AgentSession | null, maxUptimeSeconds: number = 3600): boolean {
  if (!session || session.status !== 'active') {
    return false;
  }

  const uptime = getAgentUptime(session);
  return uptime > maxUptimeSeconds;
}

/**
 * Validate room name
 */
export function validateRoomName(roomName: string): { valid: boolean; error?: string } {
  if (!roomName || roomName.trim().length === 0) {
    return { valid: false, error: 'Room name is required' };
  }

  if (roomName.length > 100) {
    return { valid: false, error: 'Room name must be less than 100 characters' };
  }

  // Allow alphanumeric, hyphens, underscores
  if (!/^[a-zA-Z0-9-_]+$/.test(roomName)) {
    return { valid: false, error: 'Room name can only contain letters, numbers, hyphens, and underscores' };
  }

  return { valid: true };
}

/**
 * Validate system prompt
 */
export function validateSystemPrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: 'System prompt is required' };
  }

  if (prompt.length > 2000) {
    return { valid: false, error: 'System prompt must be less than 2000 characters' };
  }

  return { valid: true };
}

/**
 * Get voice display name
 */
export function getVoiceDisplayName(voice: OpenAIVoice): string {
  const names: Record<OpenAIVoice, string> = {
    alloy: 'Alloy (Neutral)',
    echo: 'Echo (Male)',
    fable: 'Fable (British)',
    onyx: 'Onyx (Deep)',
    nova: 'Nova (Female)',
    shimmer: 'Shimmer (Soft)',
  };

  return names[voice] || voice;
}

/**
 * Get all available voices
 */
export function getAvailableVoices(): Array<{ value: OpenAIVoice; label: string }> {
  const voices: OpenAIVoice[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

  return voices.map(voice => ({
    value: voice,
    label: getVoiceDisplayName(voice),
  }));
}

/**
 * Estimate API cost for a conversation
 */
export function estimateConversationCost(params: {
  durationMinutes: number;
  messagesPerMinute?: number;
  model?: 'gpt-4' | 'gpt-3.5-turbo';
}): {
  whisperCost: number;
  llmCost: number;
  ttsCost: number;
  totalCost: number;
} {
  const { durationMinutes, messagesPerMinute = 2, model = 'gpt-4' } = params;

  // Pricing (approximate, as of 2024)
  const whisperCostPerMinute = 0.006;
  const ttsCostPerMinute = 0.015;
  const gpt4CostPerMessage = 0.02; // Rough estimate
  const gpt35CostPerMessage = 0.002;

  const totalMessages = durationMinutes * messagesPerMinute;
  const llmCostPerMessage = model === 'gpt-4' ? gpt4CostPerMessage : gpt35CostPerMessage;

  const whisperCost = durationMinutes * whisperCostPerMinute;
  const llmCost = totalMessages * llmCostPerMessage;
  const ttsCost = durationMinutes * ttsCostPerMinute;
  const totalCost = whisperCost + llmCost + ttsCost;

  return {
    whisperCost: parseFloat(whisperCost.toFixed(4)),
    llmCost: parseFloat(llmCost.toFixed(4)),
    ttsCost: parseFloat(ttsCost.toFixed(4)),
    totalCost: parseFloat(totalCost.toFixed(4)),
  };
}

/**
 * Parse error message from API response
 */
export function parseApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'error' in error) {
    return String((error as { error: unknown }).error);
  }

  return 'An unknown error occurred';
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    factor?: number;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
  } = options;

  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * factor, maxDelay);
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Create default voice agent client
 */
export function createVoiceAgentClient(): VoiceAgentClient {
  return new VoiceAgentClient();
}
