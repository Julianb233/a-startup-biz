/**
 * Type Definitions for Voice Agent System
 *
 * This file contains all TypeScript types and interfaces used across
 * the voice agent infrastructure.
 */

/**
 * OpenAI voice options
 */
export type OpenAIVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

/**
 * Agent state lifecycle
 */
export type AgentState =
  | 'initializing'  // Agent is starting up and connecting to LiveKit
  | 'ready'         // Agent is connected and ready to listen
  | 'listening'     // Agent is actively listening to user audio
  | 'processing'    // Agent is processing audio/generating response
  | 'speaking'      // Agent is speaking (TTS output)
  | 'disconnected'  // Agent has been disconnected
  | 'error';        // Agent encountered an error

/**
 * Configuration for spawning a voice agent
 */
export interface AgentConfig {
  /** Name of the LiveKit room to join */
  roomName: string;
  /** Custom identity for the agent (optional) */
  agentName?: string;
  /** System prompt for the AI agent */
  systemPrompt?: string;
  /** OpenAI voice to use for TTS */
  voice?: OpenAIVoice;
}

/**
 * Active agent session details
 */
export interface AgentSession {
  /** Room name where agent is active */
  roomName: string;
  /** Agent's unique identity in LiveKit */
  agentIdentity: string;
  /** JWT token for agent authentication */
  token: string;
  /** When the session was created */
  createdAt: Date;
  /** Current status of the agent */
  status: 'pending' | 'active' | 'disconnected';
  /** Agent metadata (prompts, voice settings) */
  metadata?: {
    systemPrompt: string;
    voice: string;
  };
}

/**
 * Configuration for the voice agent worker
 */
export interface VoiceAgentWorkerConfig {
  /** LiveKit server URL (wss://...) */
  serverUrl: string;
  /** JWT token for agent authentication */
  token: string;
  /** System prompt for the AI agent */
  systemPrompt: string;
  /** OpenAI voice model to use */
  voice?: OpenAIVoice;
  /** OpenAI API key (defaults to process.env.OPENAI_API_KEY) */
  openaiApiKey?: string;
  /** Enable debug logging */
  debug?: boolean;
}

/**
 * Message in a conversation
 */
export interface ConversationMessage {
  /** Role of the message sender */
  role: 'system' | 'user' | 'assistant';
  /** Message content */
  content: string;
  /** When the message was created */
  timestamp: Date;
}

/**
 * Agent performance statistics
 */
export interface AgentStats {
  /** Total number of messages processed */
  messagesProcessed: number;
  /** Total time spent speaking (seconds) */
  totalSpeechTime: number;
  /** Total time spent listening (seconds) */
  totalListenTime: number;
  /** Number of errors encountered */
  errors: number;
  /** When the connection was established */
  connectionStartTime: Date;
  /** Last time agent processed activity */
  lastActivityTime: Date;
}

/**
 * OpenAI Whisper transcription response
 */
export interface WhisperTranscriptionResponse {
  /** Transcribed text */
  text: string;
}

/**
 * OpenAI Chat Completion message
 */
export interface ChatCompletionMessage {
  /** Message role */
  role: 'system' | 'user' | 'assistant';
  /** Message content */
  content: string;
}

/**
 * OpenAI Chat Completion response
 */
export interface ChatCompletionResponse {
  /** Response ID */
  id: string;
  /** Object type */
  object: string;
  /** Creation timestamp */
  created: number;
  /** Model used */
  model: string;
  /** Generated choices */
  choices: Array<{
    /** Index of the choice */
    index: number;
    /** Message content */
    message: ChatCompletionMessage;
    /** Finish reason */
    finish_reason: string;
  }>;
  /** Token usage statistics */
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * API response for spawning an agent
 */
export interface SpawnAgentResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Response message */
  message: string;
  /** Agent session details */
  session?: {
    roomName: string;
    agentIdentity: string;
    status: string;
    createdAt: Date;
    token?: string;
    serverUrl?: string;
  };
  /** Error details (if any) */
  error?: string;
}

/**
 * API response for agent status
 */
export interface AgentStatusResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Whether agent is available */
  available?: boolean;
  /** Whether worker is running */
  running?: boolean;
  /** Response message */
  message?: string;
  /** Agent session details */
  session?: {
    roomName: string;
    agentIdentity: string;
    status: string;
    createdAt: Date;
  };
  /** Number of active sessions (for list operations) */
  count?: number;
  /** List of active sessions */
  sessions?: Array<{
    roomName: string;
    agentIdentity: string;
    status: string;
    createdAt: Date;
  }>;
  /** Error details (if any) */
  error?: string;
}

/**
 * API response for starting a worker
 */
export interface StartWorkerResponse {
  /** Whether the operation was successful */
  success: boolean;
  /** Response message */
  message: string;
  /** Room name */
  roomName?: string;
  /** Agent identity */
  agentIdentity?: string;
  /** Additional note */
  note?: string;
  /** Error details (if any) */
  error?: string;
}

/**
 * System prompt builder options
 */
export interface SystemPromptOptions {
  /** Company name to use in prompt */
  companyName?: string;
  /** List of services to include */
  services?: string[];
  /** Additional context to append */
  additionalContext?: string;
}

/**
 * Agent health check response
 */
export interface AgentHealthResponse {
  /** Whether the service is available */
  success: boolean;
  /** Response message */
  message: string;
  /** Whether LiveKit is configured */
  livekitConfigured: boolean;
  /** Whether OpenAI is configured */
  openaiConfigured: boolean;
}

/**
 * Error response
 */
export interface ErrorResponse {
  /** Error message */
  error: string;
  /** HTTP status code */
  status?: number;
  /** Additional error details */
  details?: unknown;
}
