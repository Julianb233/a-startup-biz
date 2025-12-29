import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

/**
 * Voice AI Agent Service
 *
 * Manages AI voice agents that join LiveKit rooms to provide
 * automated support conversations.
 */

interface AgentConfig {
  roomName: string;
  agentName?: string;
  systemPrompt?: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
}

interface AgentSession {
  roomName: string;
  agentIdentity: string;
  token: string;
  createdAt: Date;
  status: 'pending' | 'active' | 'disconnected';
}

// Store active agent sessions (in production, use Redis/database)
const activeSessions = new Map<string, AgentSession>();

// LiveKit configuration
const livekitHost = process.env.LIVEKIT_HOST || '';
const apiKey = process.env.LIVEKIT_API_KEY || '';
const apiSecret = process.env.LIVEKIT_API_SECRET || '';

/**
 * Generate token for AI agent to join room
 */
export async function generateAgentToken(config: AgentConfig): Promise<string | null> {
  if (!apiKey || !apiSecret) {
    console.error('LiveKit not configured for agent');
    return null;
  }

  const agentIdentity = config.agentName || `ai-agent-${Date.now()}`;

  const at = new AccessToken(apiKey, apiSecret, {
    identity: agentIdentity,
    name: 'AI Support Assistant',
    ttl: 7200, // 2 hours for agent sessions
    metadata: JSON.stringify({
      type: 'ai_agent',
      voice: config.voice || 'alloy',
      systemPrompt: config.systemPrompt || getDefaultSystemPrompt(),
    }),
  });

  at.addGrant({
    room: config.roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: false,
  });

  return await at.toJwt();
}

/**
 * Spawn an AI agent for a room
 */
export async function spawnAgent(config: AgentConfig): Promise<AgentSession | null> {
  try {
    const token = await generateAgentToken(config);
    if (!token) {
      return null;
    }

    const agentIdentity = config.agentName || `ai-agent-${Date.now()}`;

    const session: AgentSession = {
      roomName: config.roomName,
      agentIdentity,
      token,
      createdAt: new Date(),
      status: 'pending',
    };

    activeSessions.set(config.roomName, session);

    // In production, this would trigger a separate agent worker process
    // For now, we return the token that can be used by a frontend/worker
    console.log(`[VoiceAgent] Agent spawned for room: ${config.roomName}`);

    return session;
  } catch (error) {
    console.error('[VoiceAgent] Failed to spawn agent:', error);
    return null;
  }
}

/**
 * Get agent session for a room
 */
export function getAgentSession(roomName: string): AgentSession | null {
  return activeSessions.get(roomName) || null;
}

/**
 * Update agent session status
 */
export function updateAgentStatus(
  roomName: string,
  status: 'pending' | 'active' | 'disconnected'
): void {
  const session = activeSessions.get(roomName);
  if (session) {
    session.status = status;
    if (status === 'disconnected') {
      // Clean up after a delay
      setTimeout(() => {
        activeSessions.delete(roomName);
      }, 60000); // Keep for 1 minute for potential reconnection
    }
  }
}

/**
 * Remove agent from room
 */
export async function removeAgent(roomName: string): Promise<boolean> {
  try {
    const session = activeSessions.get(roomName);
    if (!session) {
      return false;
    }

    // Use RoomServiceClient to remove participant
    if (apiKey && apiSecret && livekitHost) {
      const client = new RoomServiceClient(
        livekitHost.replace('wss://', 'https://'),
        apiKey,
        apiSecret
      );

      await client.removeParticipant(roomName, session.agentIdentity);
    }

    activeSessions.delete(roomName);
    console.log(`[VoiceAgent] Agent removed from room: ${roomName}`);

    return true;
  } catch (error) {
    console.error('[VoiceAgent] Failed to remove agent:', error);
    return false;
  }
}

/**
 * List all active agent sessions
 */
export function listActiveSessions(): AgentSession[] {
  return Array.from(activeSessions.values());
}

/**
 * Default system prompt for the AI support agent
 */
function getDefaultSystemPrompt(): string {
  return `You are a helpful AI support assistant for A Startup Biz, a business consulting and services company.

Your role:
- Help users with questions about our services (business consulting, web development, marketing)
- Assist with scheduling consultations and appointments
- Answer general business inquiries
- Provide information about our partner program
- Help troubleshoot common issues

Guidelines:
- Be friendly, professional, and concise
- If you don't know something, offer to connect them with a human agent
- Keep responses focused and avoid unnecessary filler
- Acknowledge the user's needs before providing information
- For complex issues, recommend scheduling a consultation

Services we offer:
1. Business Strategy Consulting - $750/hour
2. Web Development - $1,500-$7,500 per project
3. Marketing Services - $1,500/month retainer
4. SEO Optimization - Starting at $500/month

For emergencies or urgent matters, recommend calling our main line or emailing support@astartupbiz.com.`;
}

/**
 * Custom system prompt builder
 */
export function buildSystemPrompt(options: {
  companyName?: string;
  services?: string[];
  additionalContext?: string;
}): string {
  const base = getDefaultSystemPrompt();

  if (options.additionalContext) {
    return `${base}\n\nAdditional Context:\n${options.additionalContext}`;
  }

  return base;
}

/**
 * Check if an agent is available for a room
 */
export function isAgentAvailable(roomName: string): boolean {
  const session = activeSessions.get(roomName);
  return session?.status === 'active';
}

/**
 * Get agent connection details for workers
 */
export function getAgentConnectionDetails(roomName: string): {
  serverUrl: string;
  token: string;
} | null {
  const session = activeSessions.get(roomName);
  if (!session) {
    return null;
  }

  return {
    serverUrl: livekitHost,
    token: session.token,
  };
}
