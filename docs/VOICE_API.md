# Voice AI System API Documentation

Comprehensive API documentation for the voice AI system endpoints.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Session Management](#session-management)
  - [Realtime API](#realtime-api)
  - [Recording Management](#recording-management)
  - [Agent Management](#agent-management)
  - [Token Generation](#token-generation)
  - [Webhooks](#webhooks)

## Overview

The Voice AI system provides real-time voice communication with AI agents using LiveKit and OpenAI Realtime API. It supports:

- AI-powered voice support calls
- User-to-user voice calls
- Conference calls
- Call recording with transcription
- Real-time audio streaming
- Session management and history

**Base URL**: `/api/voice`

## Authentication

All endpoints require authentication using Clerk. Include the session token in your requests:

```typescript
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
```

**Error Response** (401):
```json
{
  "error": "Unauthorized"
}
```

## Rate Limiting

Rate limits are enforced per user/IP address:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| Session Creation | 10 requests | 1 hour |
| Realtime Connections | 30 requests | 1 hour |
| Recording Operations | 20 requests | 1 hour |
| Read Operations | 100 requests | 15 minutes |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1640995200
Retry-After: 3600
```

**Error Response** (429):
```json
{
  "error": "Too many requests",
  "message": "Please try again later",
  "retryAfter": 3600,
  "limit": 10,
  "remaining": 0,
  "reset": 1640995200
}
```

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {}
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

## Endpoints

### Session Management

#### POST /api/voice/session

Start a new voice call session.

**Request Body**:
```typescript
{
  callType?: 'support' | 'user-to-user' | 'conference'; // default: 'support'
  roomName?: string; // auto-generated if not provided
  calleeId?: string; // required for user-to-user calls
  enableRecording?: boolean; // default: true
  enableAiAgent?: boolean; // default: true for support calls
  systemPrompt?: string; // custom AI system prompt
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'; // default: 'alloy'
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Voice session created successfully",
  "session": {
    "callId": "uuid",
    "roomName": "support-user123-1640995200",
    "participantName": "John Doe",
    "token": "eyJhbGc...",
    "livekitHost": "wss://your-livekit-server.livekit.cloud",
    "callType": "support",
    "status": "ringing",
    "agentSpawned": true,
    "agentStatus": "active",
    "recordingEnabled": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Error Responses**:
- `400` - Invalid call type
- `409` - Active session already exists for this room
- `500` - Failed to create session
- `503` - Voice service not configured

---

#### GET /api/voice/session

Get session details or list user's sessions.

**Query Parameters**:
```
roomName?: string        # Get specific session
status?: string          # Filter by status
limit?: number          # Results per page (default: 10)
offset?: number         # Pagination offset (default: 0)
```

**Get Specific Session**:
```
GET /api/voice/session?roomName=support-user123-1640995200
```

**Success Response** (200):
```json
{
  "success": true,
  "session": {
    "callId": "uuid",
    "roomName": "support-user123-1640995200",
    "callType": "support",
    "status": "connected",
    "startedAt": "2024-01-01T00:00:00Z",
    "connectedAt": "2024-01-01T00:00:30Z",
    "endedAt": null,
    "duration": 45,
    "recordingUrl": null,
    "transcript": null,
    "metadata": {},
    "agentStatus": "active",
    "agentAvailable": true
  }
}
```

**List User Sessions**:
```
GET /api/voice/session?status=completed&limit=20&offset=0
```

**Success Response** (200):
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "limit": 20,
  "offset": 0,
  "sessions": [
    {
      "callId": "uuid",
      "roomName": "support-user123-1640995200",
      "callType": "support",
      "status": "completed",
      "startedAt": "2024-01-01T00:00:00Z",
      "connectedAt": "2024-01-01T00:00:30Z",
      "endedAt": "2024-01-01T00:10:30Z",
      "duration": 600,
      "hasRecording": true,
      "hasTranscript": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Error Responses**:
- `403` - Access denied to this session
- `404` - Session not found

---

#### PATCH /api/voice/session

Update session status or metadata.

**Request Body**:
```typescript
{
  roomName: string;
  status?: 'pending' | 'ringing' | 'connected' | 'completed' | 'missed' | 'failed';
  agentStatus?: 'pending' | 'active' | 'disconnected';
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Session updated successfully"
}
```

**Error Responses**:
- `400` - Invalid status or missing roomName
- `403` - Access denied
- `404` - Session not found

---

#### DELETE /api/voice/session

End a voice call session.

**Query Parameters**:
```
roomName: string        # Required
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Session ended successfully",
  "duration": 600
}
```

**Error Responses**:
- `400` - Missing roomName
- `403` - Access denied
- `404` - Session not found

---

### Realtime API

#### POST /api/voice/realtime

Initialize OpenAI Realtime API session for voice interaction.

**Request Body**:
```typescript
{
  roomName: string;
  model?: string; // default: 'gpt-4o-realtime-preview-2024-12-17'
}
```

**Success Response** (200):
```json
{
  "success": true,
  "roomName": "support-user123-1640995200",
  "model": "gpt-4o-realtime-preview-2024-12-17",
  "agentIdentity": "ai-agent-1640995200",
  "configuration": {
    "modalities": ["text", "audio"],
    "instructions": "You are a helpful AI assistant...",
    "voice": "alloy",
    "input_audio_format": "pcm16",
    "output_audio_format": "pcm16",
    "input_audio_transcription": {
      "model": "whisper-1"
    },
    "turn_detection": {
      "type": "server_vad",
      "threshold": 0.5,
      "prefix_padding_ms": 300,
      "silence_duration_ms": 500
    }
  },
  "livekit": {
    "serverUrl": "wss://your-livekit-server.livekit.cloud",
    "roomName": "support-user123-1640995200"
  }
}
```

**Error Responses**:
- `400` - Missing roomName
- `403` - Access denied
- `404` - Call session or agent not found
- `503` - AI agent not ready

---

#### GET /api/voice/realtime

Get realtime session status.

**Query Parameters**:
```
roomName: string        # Required
```

**Success Response** (200):
```json
{
  "success": true,
  "roomName": "support-user123-1640995200",
  "callStatus": "connected",
  "agentStatus": "active",
  "agentAvailable": true,
  "duration": 120,
  "connectedAt": "2024-01-01T00:00:30Z",
  "metadata": {}
}
```

---

#### DELETE /api/voice/realtime

End realtime session.

**Query Parameters**:
```
roomName: string        # Required
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Realtime session ended",
  "duration": 600
}
```

---

### Recording Management

#### POST /api/voice/recording

Start recording a voice call.

**Request Body**:
```typescript
{
  roomName: string;
  outputPath?: string;
  fileType?: 'mp4' | 'ogg'; // default: 'mp4'
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Recording started successfully",
  "recording": {
    "egressId": "EG_abc123",
    "roomName": "support-user123-1640995200",
    "startedAt": "2024-01-01T00:00:30Z",
    "status": "active"
  }
}
```

**Error Responses**:
- `400` - Invalid file type or call not active
- `403` - Access denied
- `404` - Call session not found
- `409` - Recording already in progress
- `503` - Recording service not configured

---

#### GET /api/voice/recording

Get recording status or retrieve recording URL.

**Query Parameters**:
```
roomName?: string       # Get recording for specific room
egressId?: string      # Get recording URL by egress ID (requires roomName)
listAll?: boolean      # List all active recordings (admin)
```

**Get Recording Status**:
```
GET /api/voice/recording?roomName=support-user123-1640995200
```

**Success Response** (200):
```json
{
  "success": true,
  "recording": {
    "egressId": "EG_abc123",
    "roomName": "support-user123-1640995200",
    "startedAt": "2024-01-01T00:00:30Z",
    "status": "active",
    "isActive": true
  },
  "recordingUrl": "https://s3.amazonaws.com/bucket/recordings/..."
}
```

**Get Recording URL**:
```
GET /api/voice/recording?roomName=support-user123-1640995200&egressId=EG_abc123
```

**Success Response** (200):
```json
{
  "success": true,
  "recordingUrl": "https://s3.amazonaws.com/bucket/recordings/..."
}
```

---

#### DELETE /api/voice/recording

Stop recording a voice call.

**Query Parameters**:
```
roomName: string        # Required
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Recording stopped successfully",
  "recordingUrl": "https://s3.amazonaws.com/bucket/recordings/..."
}
```

**Error Responses**:
- `400` - Missing roomName
- `403` - Access denied
- `404` - No active recording or call not found
- `503` - Recording service not configured

---

#### PATCH /api/voice/recording

Update recording metadata (e.g., add transcript).

**Request Body**:
```typescript
{
  roomName: string;
  transcript?: string;
  recordingUrl?: string;
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Recording metadata updated successfully"
}
```

---

### Agent Management

#### POST /api/voice/agent

Spawn an AI agent for a voice call room.

**Request Body**:
```typescript
{
  roomName: string;
  systemPrompt?: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'; // default: 'alloy'
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Agent spawned successfully",
  "session": {
    "roomName": "support-user123-1640995200",
    "agentIdentity": "ai-agent-1640995200",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z",
    "token": "eyJhbGc...",
    "serverUrl": "wss://your-livekit-server.livekit.cloud"
  }
}
```

**Error Responses**:
- `400` - Missing roomName
- `500` - Failed to spawn agent
- `503` - Voice service not configured

---

#### GET /api/voice/agent

Get agent status or list active agents.

**Query Parameters**:
```
roomName?: string       # Get agent for specific room
listAll?: boolean      # List all active agents
```

**Success Response** (200):
```json
{
  "success": true,
  "available": true,
  "session": {
    "roomName": "support-user123-1640995200",
    "agentIdentity": "ai-agent-1640995200",
    "status": "active",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### PATCH /api/voice/agent

Update agent status.

**Request Body**:
```typescript
{
  roomName: string;
  status: 'pending' | 'active' | 'disconnected';
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Agent status updated to active"
}
```

---

#### DELETE /api/voice/agent

Remove agent from room.

**Query Parameters**:
```
roomName: string        # Required
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Agent removed successfully"
}
```

---

### Token Generation

#### POST /api/voice/token

Generate LiveKit token for voice calls.

**Request Body**:
```typescript
{
  roomName?: string;
  participantName?: string;
  roomType?: 'support' | 'user-to-user' | 'conference'; // default: 'support'
  spawnAiAgent?: boolean; // default: true
}
```

**Success Response** (200):
```json
{
  "token": "eyJhbGc...",
  "roomName": "support-user123-1640995200",
  "participantName": "John Doe",
  "livekitHost": "wss://your-livekit-server.livekit.cloud",
  "agentSpawned": true,
  "callId": "uuid"
}
```

---

### Webhooks

#### POST /api/voice/webhook

Receive LiveKit webhook events.

**Webhook Events**:
- `room_started` - Room is ready
- `room_finished` - Room closed
- `participant_joined` - Participant joined
- `participant_left` - Participant left
- `track_published` - Audio/video track published
- `track_unpublished` - Track unpublished
- `egress_started` - Recording started
- `egress_ended` - Recording completed

**Webhook Payload**:
```json
{
  "event": "participant_joined",
  "room": {
    "name": "support-user123-1640995200",
    "creationTime": 1640995200
  },
  "participant": {
    "identity": "user123",
    "name": "John Doe"
  }
}
```

**Success Response** (200):
```json
{
  "received": true,
  "event": "participant_joined"
}
```

---

## Usage Examples

### TypeScript/React Example

```typescript
import { CreateSessionRequest, CreateSessionResponse } from '@/types/voice';

async function startVoiceCall() {
  const request: CreateSessionRequest = {
    callType: 'support',
    enableRecording: true,
    enableAiAgent: true,
    voice: 'alloy',
  };

  const response = await fetch('/api/voice/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const data: CreateSessionResponse = await response.json();

  // Connect to LiveKit room with token
  connectToLiveKit(data.session.token, data.session.roomName);
}

async function endVoiceCall(roomName: string) {
  await fetch(`/api/voice/session?roomName=${roomName}`, {
    method: 'DELETE',
  });
}
```

### Next.js API Route Example

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Authenticate
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Apply rate limiting
  const rateLimitResult = await rateLimit('voiceSession', userId);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      },
      { status: 429 }
    );
  }

  // Handle request...
}
```

---

## Environment Variables

```bash
# LiveKit Configuration
LIVEKIT_HOST=wss://your-livekit-server.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# Recording Configuration (S3/GCS)
LIVEKIT_RECORDING_BUCKET=your-bucket-name
LIVEKIT_RECORDING_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Rate Limiting (Optional - Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

---

## Best Practices

1. **Always check rate limits** before making requests
2. **Handle errors gracefully** with appropriate user feedback
3. **Use proper authentication** for all endpoints
4. **Clean up resources** by ending sessions when done
5. **Monitor webhook events** for real-time updates
6. **Use TypeScript types** for type safety
7. **Implement retries** with exponential backoff for failed requests
8. **Cache session tokens** to avoid unnecessary API calls
9. **Test in development** before deploying to production
10. **Monitor usage** to stay within rate limits

---

## Support

For issues or questions:
- Check the [troubleshooting guide](./TROUBLESHOOTING.md)
- Review [TypeScript types](../types/voice.ts)
- Contact support: support@astartupbiz.com
