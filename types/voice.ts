/**
 * Voice API Type Definitions
 *
 * Comprehensive TypeScript types for the voice AI system endpoints.
 */

// ============================================
// Core Voice Types
// ============================================

export type VoiceType = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export type CallType = 'support' | 'user-to-user' | 'conference';

export type CallStatus =
  | 'pending'
  | 'ringing'
  | 'connected'
  | 'completed'
  | 'missed'
  | 'failed';

export type AgentStatus = 'pending' | 'active' | 'disconnected';

export type RecordingStatus =
  | 'starting'
  | 'active'
  | 'stopping'
  | 'completed'
  | 'failed';

export type FileType = 'mp4' | 'ogg';

// ============================================
// Database Models
// ============================================

export interface VoiceCall {
  id: string;
  room_name: string;
  caller_id: string;
  callee_id: string | null;
  call_type: CallType;
  status: CallStatus;
  started_at: Date | null;
  connected_at: Date | null;
  ended_at: Date | null;
  duration_seconds: number | null;
  recording_url: string | null;
  transcript: string | null;
  metadata: Record<string, any>;
  created_at: Date;
}

export interface CallParticipant {
  id: number;
  call_id: string;
  user_id: string;
  participant_name: string | null;
  joined_at: Date;
  left_at: Date | null;
  duration_seconds: number | null;
  is_muted: boolean;
}

// ============================================
// Agent Session Types
// ============================================

export interface AgentConfig {
  roomName: string;
  agentName?: string;
  systemPrompt?: string;
  voice?: VoiceType;
}

export interface AgentSession {
  roomName: string;
  agentIdentity: string;
  token: string;
  createdAt: Date;
  status: AgentStatus;
}

// ============================================
// Recording Types
// ============================================

export interface RecordingConfig {
  roomName: string;
  outputPath?: string;
  fileType?: FileType;
}

export interface RecordingSession {
  egressId: string;
  roomName: string;
  startedAt: Date;
  status: RecordingStatus;
}

// ============================================
// API Request/Response Types - Session
// ============================================

export interface CreateSessionRequest {
  callType?: CallType;
  roomName?: string;
  calleeId?: string;
  enableRecording?: boolean;
  enableAiAgent?: boolean;
  systemPrompt?: string;
  voice?: VoiceType;
}

export interface CreateSessionResponse {
  success: boolean;
  message: string;
  session: {
    callId: string;
    roomName: string;
    participantName: string;
    token: string;
    livekitHost: string;
    callType: CallType;
    status: CallStatus;
    agentSpawned: boolean;
    agentStatus: AgentStatus | 'unavailable';
    recordingEnabled: boolean;
    createdAt: Date;
  };
}

export interface GetSessionQuery {
  roomName?: string;
  status?: CallStatus;
  limit?: number;
  offset?: number;
}

export interface SessionDetails {
  callId: string;
  roomName: string;
  callType: CallType;
  status: CallStatus;
  startedAt: Date | null;
  connectedAt: Date | null;
  endedAt: Date | null;
  duration: number | null;
  recordingUrl: string | null;
  transcript: string | null;
  metadata: Record<string, any>;
  agentStatus: AgentStatus | 'unavailable';
  agentAvailable: boolean;
}

export interface GetSessionResponse {
  success: boolean;
  session: SessionDetails;
}

export interface ListSessionsResponse {
  success: boolean;
  count: number;
  total: number;
  limit: number;
  offset: number;
  sessions: Array<{
    callId: string;
    roomName: string;
    callType: CallType;
    status: CallStatus;
    startedAt: Date | null;
    connectedAt: Date | null;
    endedAt: Date | null;
    duration: number | null;
    hasRecording: boolean;
    hasTranscript: boolean;
    createdAt: Date;
  }>;
}

export interface UpdateSessionRequest {
  roomName: string;
  status?: CallStatus;
  agentStatus?: AgentStatus;
}

export interface UpdateSessionResponse {
  success: boolean;
  message: string;
}

export interface EndSessionResponse {
  success: boolean;
  message: string;
  duration?: number;
}

// ============================================
// API Request/Response Types - Realtime
// ============================================

export interface InitRealtimeRequest {
  roomName: string;
  model?: string;
}

export interface RealtimeConfiguration {
  modalities: string[];
  instructions?: string;
  voice: VoiceType;
  input_audio_format: string;
  output_audio_format: string;
  input_audio_transcription: {
    model: string;
  };
  turn_detection: {
    type: string;
    threshold: number;
    prefix_padding_ms: number;
    silence_duration_ms: number;
  };
}

export interface InitRealtimeResponse {
  success: boolean;
  roomName: string;
  model: string;
  agentIdentity: string;
  configuration: RealtimeConfiguration;
  livekit: {
    serverUrl: string;
    roomName: string;
  };
}

export interface RealtimeStatusResponse {
  success: boolean;
  roomName: string;
  callStatus: CallStatus;
  agentStatus: AgentStatus | 'unavailable';
  agentAvailable: boolean;
  duration: number | null;
  connectedAt: Date | null;
  metadata: Record<string, any>;
}

export interface EndRealtimeResponse {
  success: boolean;
  message: string;
  duration?: number;
}

// ============================================
// API Request/Response Types - Recording
// ============================================

export interface StartRecordingRequest {
  roomName: string;
  outputPath?: string;
  fileType?: FileType;
}

export interface StartRecordingResponse {
  success: boolean;
  message: string;
  recording: {
    egressId: string;
    roomName: string;
    startedAt: Date;
    status: RecordingStatus;
  };
}

export interface RecordingDetails {
  egressId: string;
  roomName: string;
  startedAt: Date;
  status: RecordingStatus;
  isActive: boolean;
}

export interface GetRecordingResponse {
  success: boolean;
  recording: RecordingDetails | null;
  recordingUrl?: string;
  message?: string;
}

export interface GetRecordingUrlResponse {
  success: boolean;
  recordingUrl: string;
}

export interface ListRecordingsResponse {
  success: boolean;
  count: number;
  recordings: Array<{
    egressId: string;
    roomName: string;
    startedAt: Date;
    status: RecordingStatus;
  }>;
}

export interface StopRecordingResponse {
  success: boolean;
  message: string;
  recordingUrl?: string;
}

export interface UpdateRecordingRequest {
  roomName: string;
  transcript?: string;
  recordingUrl?: string;
}

export interface UpdateRecordingResponse {
  success: boolean;
  message: string;
}

// ============================================
// API Request/Response Types - Agent
// ============================================

export interface SpawnAgentRequest {
  roomName: string;
  systemPrompt?: string;
  voice?: VoiceType;
}

export interface SpawnAgentResponse {
  success: boolean;
  message: string;
  session: {
    roomName: string;
    agentIdentity: string;
    status: AgentStatus;
    createdAt: Date;
    token: string;
    serverUrl: string;
  };
}

export interface GetAgentResponse {
  success: boolean;
  available: boolean;
  session?: {
    roomName: string;
    agentIdentity: string;
    status: AgentStatus;
    createdAt: Date;
  };
  message?: string;
}

export interface ListAgentsResponse {
  success: boolean;
  count: number;
  sessions: Array<{
    roomName: string;
    agentIdentity: string;
    status: AgentStatus;
    createdAt: Date;
  }>;
}

export interface UpdateAgentRequest {
  roomName: string;
  status: AgentStatus;
}

export interface UpdateAgentResponse {
  success: boolean;
  message: string;
}

export interface RemoveAgentResponse {
  success: boolean;
  message: string;
}

// ============================================
// API Request/Response Types - Token
// ============================================

export interface GenerateTokenRequest {
  roomName?: string;
  participantName?: string;
  roomType?: CallType;
  spawnAiAgent?: boolean;
}

export interface GenerateTokenResponse {
  token: string;
  roomName: string;
  participantName: string;
  livekitHost: string;
  agentSpawned: boolean;
  callId?: string;
}

// ============================================
// Error Response Types
// ============================================

export interface VoiceApiError {
  error: string;
  message?: string;
  details?: any;
}

export interface RateLimitError extends VoiceApiError {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
}

// ============================================
// LiveKit Types
// ============================================

export interface LiveKitTokenOptions {
  canPublish?: boolean;
  canSubscribe?: boolean;
  canPublishData?: boolean;
  metadata?: string;
  ttl?: number;
}

export interface LiveKitRoom {
  name: string;
  creationTime?: number;
  metadata?: string;
}

export interface LiveKitParticipant {
  identity: string;
  name?: string;
  metadata?: string;
}

export interface LiveKitTrack {
  type: 'audio' | 'video' | 'data';
  sid: string;
}

// ============================================
// Webhook Event Types
// ============================================

export type WebhookEvent =
  | 'room_started'
  | 'room_finished'
  | 'participant_joined'
  | 'participant_left'
  | 'track_published'
  | 'track_unpublished'
  | 'egress_started'
  | 'egress_ended';

export interface WebhookPayload {
  event: WebhookEvent;
  room?: LiveKitRoom;
  participant?: LiveKitParticipant;
  track?: LiveKitTrack;
  egressInfo?: {
    egressId: string;
    roomName: string;
    fileResults?: Array<{
      location: string;
      size: number;
      duration: number;
    }>;
  };
}

// ============================================
// Utility Types
// ============================================

export interface VoiceCallFilters {
  status?: CallStatus;
  callType?: CallType;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}
