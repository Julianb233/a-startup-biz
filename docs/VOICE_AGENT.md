# Voice Agent System Documentation

## Overview

The Voice Agent system provides real-time AI-powered voice conversations using LiveKit for WebRTC infrastructure and OpenAI for speech processing.

## Architecture

```
┌─────────────┐      WebRTC       ┌──────────────┐
│   Browser   │◄─────────────────►│   LiveKit    │
│   (User)    │                   │    Server    │
└─────────────┘                   └──────┬───────┘
                                         │
                                         │ WebRTC
                                         │
                                    ┌────▼──────┐
                                    │  Voice    │
                                    │  Agent    │
                                    │  Worker   │
                                    └─────┬─────┘
                                          │
                                          │ HTTPS
                                          │
                                    ┌─────▼─────┐
                                    │  OpenAI   │
                                    │    API    │
                                    └───────────┘
```

### Components

1. **Voice Agent Service** (`lib/voice-agent.ts`)
   - Manages agent sessions
   - Generates LiveKit tokens
   - Tracks agent status

2. **Voice Agent Worker** (`lib/voice-agent-worker.ts`)
   - Connects to LiveKit rooms
   - Processes audio streams
   - Integrates with OpenAI APIs

3. **API Endpoints**
   - `POST /api/voice/agent` - Spawn an agent session
   - `POST /api/voice/agent/worker` - Start the worker process
   - `GET /api/voice/agent` - Check agent status
   - `DELETE /api/voice/agent` - Remove agent from room

4. **UI Component** (`components/voice-call-interface.tsx`)
   - User interface for voice calls
   - Audio controls and status display

## Setup

### 1. Environment Variables

Add the following to your `.env.local`:

```bash
# LiveKit Configuration
LIVEKIT_HOST=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxx

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxx
```

### 2. Install Dependencies

The required dependencies are already in `package.json`:

```json
{
  "dependencies": {
    "livekit-client": "^2.16.1",
    "livekit-server-sdk": "^2.15.0",
    "@livekit/components-react": "^2.9.17"
  }
}
```

### 3. LiveKit Setup

1. Create account at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Copy API credentials to environment variables

### 4. OpenAI Setup

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Ensure your account has access to:
   - Whisper API (speech-to-text)
   - GPT-4 API (conversation)
   - TTS API (text-to-speech)

## Usage

### Starting a Voice Call

```typescript
// 1. Create a LiveKit room token for the user
const userToken = await createRoomToken({
  roomName: 'support-room-123',
  participantName: 'User',
});

// 2. Spawn an AI agent for the room
const agentResponse = await fetch('/api/voice/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    roomName: 'support-room-123',
    systemPrompt: 'You are a helpful support assistant...',
    voice: 'alloy',
  }),
});

const { session } = await agentResponse.json();

// 3. Start the agent worker
await fetch('/api/voice/agent/worker', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    roomName: 'support-room-123',
  }),
});

// 4. Connect user to the room
<VoiceCallInterface
  token={userToken}
  serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_HOST}
  roomName="support-room-123"
  participantName="User"
  onDisconnect={() => {}}
/>
```

### Monitoring Agent Status

```typescript
const statusResponse = await fetch('/api/voice/agent?roomName=support-room-123');
const { session, available } = await statusResponse.json();

console.log('Agent status:', session.status); // 'pending' | 'active' | 'disconnected'
console.log('Agent available:', available);
```

### Stopping an Agent

```typescript
await fetch('/api/voice/agent?roomName=support-room-123', {
  method: 'DELETE',
});
```

## Voice Agent Worker Details

### Audio Processing Pipeline

1. **Audio Capture**
   - Captures audio from LiveKit remote participants
   - Converts to 16kHz PCM format (required by Whisper)
   - Buffers audio in 3-second chunks

2. **Speech-to-Text (Whisper)**
   - Sends audio chunks to OpenAI Whisper API
   - Returns text transcription
   - Language: English (configurable)

3. **Conversation Processing (GPT-4)**
   - Maintains conversation history
   - Sends user message + context to GPT-4
   - Returns AI-generated response
   - Max tokens: 150 (concise for voice)

4. **Text-to-Speech (TTS)**
   - Converts AI response to speech using OpenAI TTS
   - Voice options: alloy, echo, fable, onyx, nova, shimmer
   - Format: MP3
   - Publishes audio to LiveKit room

### State Machine

```
initializing → ready → listening ⇄ processing → speaking → listening
                ↓                                              ↓
         disconnected                                   disconnected
                ↓                                              ↓
              error                                          error
```

### Configuration Options

```typescript
interface VoiceAgentWorkerConfig {
  serverUrl: string;          // LiveKit WebSocket URL
  token: string;              // JWT authentication token
  systemPrompt: string;       // AI system prompt
  voice?: OpenAIVoice;        // TTS voice selection
  openaiApiKey?: string;      // OpenAI API key (optional)
  debug?: boolean;            // Enable debug logging
}
```

### Error Handling

The worker implements comprehensive error handling:

- Network errors (auto-retry with exponential backoff)
- OpenAI API errors (logged and reported)
- Audio processing errors (skipped chunks)
- Connection loss (automatic reconnection via LiveKit)

## System Prompt

The default system prompt is defined in `lib/voice-agent.ts`:

```typescript
You are a helpful AI support assistant for A Startup Biz.

Your role:
- Help users with questions about our services
- Assist with scheduling consultations
- Answer general business inquiries
- Provide information about our partner program
- Help troubleshoot common issues

Guidelines:
- Be friendly, professional, and concise
- If you don't know something, offer to connect them with a human
- Keep responses focused and avoid unnecessary filler
- Acknowledge the user's needs before providing information
```

You can customize this per-session when spawning an agent.

## Production Considerations

### Current Limitations

1. **Serverless Environment**
   - Workers run in Next.js API routes with `maxDuration: 300` (5 minutes)
   - Not ideal for long-running connections
   - Better suited for short support calls

2. **In-Memory Session Storage**
   - Sessions stored in `Map` (resets on deployment)
   - Production should use Redis or database

3. **Single Worker Per Room**
   - Current implementation assumes one agent per room
   - No horizontal scaling

### Recommended Production Setup

1. **Separate Worker Service**
   ```
   - Deploy workers as standalone Node.js services
   - Use process managers (PM2, Docker, Kubernetes)
   - Remove maxDuration limits
   ```

2. **Job Queue System**
   ```typescript
   // Use BullMQ or similar
   import { Queue, Worker } from 'bullmq';

   const agentQueue = new Queue('voice-agents');

   // In API route
   await agentQueue.add('spawn-agent', {
     roomName,
     systemPrompt,
     voice,
   });

   // In worker service
   const worker = new Worker('voice-agents', async (job) => {
     const { roomName, systemPrompt, voice } = job.data;
     const agent = new VoiceAgentWorker({ ... });
     await agent.start();
   });
   ```

3. **Persistent Storage**
   ```typescript
   // Replace in-memory Map with Redis
   import { Redis } from '@upstash/redis';

   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_REST_URL,
     token: process.env.UPSTASH_REDIS_REST_TOKEN,
   });

   // Store session
   await redis.set(`agent:${roomName}`, JSON.stringify(session), {
     ex: 7200, // 2 hours TTL
   });
   ```

4. **Monitoring & Logging**
   ```typescript
   // Add to worker
   import * as Sentry from '@sentry/node';

   // Track metrics
   worker.on('stats', (stats) => {
     console.log('Agent stats:', stats);
     // Send to monitoring service
   });

   // Error tracking
   worker.on('error', (error) => {
     Sentry.captureException(error);
   });
   ```

5. **Load Balancing**
   - Deploy multiple worker instances
   - Use room-based routing (hash room name)
   - Implement health checks

6. **Cost Optimization**
   ```typescript
   // Cache common responses
   const responseCache = new Map<string, string>();

   // Use GPT-3.5-turbo for simple queries
   const model = isComplexQuery(userMessage)
     ? 'gpt-4-turbo-preview'
     : 'gpt-3.5-turbo';

   // Batch audio processing
   const minBufferDuration = 2.0; // seconds
   const maxBufferDuration = 5.0; // seconds
   ```

## API Reference

### POST /api/voice/agent

Spawn an AI agent for a room.

**Request:**
```json
{
  "roomName": "string",
  "systemPrompt": "string (optional)",
  "voice": "alloy | echo | fable | onyx | nova | shimmer (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agent spawned successfully",
  "session": {
    "roomName": "string",
    "agentIdentity": "string",
    "status": "pending",
    "createdAt": "ISO timestamp",
    "token": "JWT token",
    "serverUrl": "wss://..."
  }
}
```

### POST /api/voice/agent/worker

Start the voice agent worker process.

**Request:**
```json
{
  "roomName": "string",
  "systemPrompt": "string (optional)",
  "voice": "string (optional)",
  "debug": "boolean (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Voice agent worker started",
  "roomName": "string",
  "agentIdentity": "string",
  "note": "Worker is running in background"
}
```

### GET /api/voice/agent

Get agent status.

**Query Parameters:**
- `roomName` - Room to check (optional)
- `listAll` - List all active agents (boolean, optional)

**Response:**
```json
{
  "success": true,
  "available": true,
  "session": {
    "roomName": "string",
    "agentIdentity": "string",
    "status": "active",
    "createdAt": "ISO timestamp"
  }
}
```

### DELETE /api/voice/agent

Remove agent from room.

**Query Parameters:**
- `roomName` - Room to remove agent from (required)

**Response:**
```json
{
  "success": true,
  "message": "Agent removed successfully"
}
```

## Testing

### Local Testing

```bash
# 1. Start Next.js dev server
npm run dev

# 2. Open browser console and test API
const response = await fetch('/api/voice/agent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    roomName: 'test-room',
    voice: 'alloy',
  }),
});

console.log(await response.json());

# 3. Start worker
await fetch('/api/voice/agent/worker', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ roomName: 'test-room' }),
});
```

### Debug Mode

Enable debug logging:

```typescript
const worker = new VoiceAgentWorker({
  serverUrl,
  token,
  systemPrompt,
  debug: true, // Enable debug logs
});
```

## Troubleshooting

### Common Issues

1. **Worker doesn't connect to LiveKit**
   - Check `LIVEKIT_HOST`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
   - Verify token is valid (not expired)
   - Check firewall/network settings

2. **OpenAI API errors**
   - Verify `OPENAI_API_KEY` is set
   - Check API quota and billing
   - Ensure API access to Whisper, GPT-4, and TTS

3. **Audio not processing**
   - Check browser microphone permissions
   - Verify audio tracks are being published
   - Enable debug mode to see logs

4. **Worker stops after 5 minutes**
   - This is expected in serverless environment
   - Deploy as standalone service for production
   - Use job queue for long-running workers

### Debug Commands

```typescript
// Check worker status
const status = await worker.getStats();
console.log('Stats:', status);

// Get conversation history
const history = worker.getConversationHistory();
console.log('History:', history);

// Get current state
const state = worker.getState();
console.log('State:', state);
```

## Performance Metrics

Expected performance:

- **Transcription latency**: 500ms - 1s (Whisper API)
- **GPT-4 response**: 1s - 3s (depending on context)
- **TTS generation**: 500ms - 1s (per sentence)
- **Total round-trip**: 2s - 5s (user speaks → AI responds)

Optimize by:
- Using GPT-3.5-turbo for simple queries
- Implementing response caching
- Streaming TTS output (if OpenAI supports)
- Reducing conversation history size

## Cost Estimates

Per minute of conversation (approximate):

- **Whisper**: $0.006 per minute
- **GPT-4**: $0.03 - $0.06 per minute (depending on context)
- **TTS**: $0.015 per minute
- **Total**: ~$0.05 per minute per user

Reduce costs by:
- Using GPT-3.5-turbo instead of GPT-4
- Caching common responses
- Limiting conversation history
- Implementing intelligent buffering

## Security

1. **Authentication**
   - All endpoints require Clerk authentication
   - JWT tokens for LiveKit rooms
   - API keys stored in environment variables

2. **Authorization**
   - Verify user owns the room before spawning agent
   - Implement rate limiting on agent creation
   - Validate room names and parameters

3. **Data Privacy**
   - Conversation history stored in memory (not persisted)
   - Audio streams not recorded by default
   - Use encryption for sensitive prompts

## Future Enhancements

- [ ] Support for multiple languages
- [ ] Voice activity detection (VAD)
- [ ] Interrupt handling (user can interrupt AI)
- [ ] Streaming responses (faster TTFB)
- [ ] Custom wake words
- [ ] Sentiment analysis
- [ ] Call recording and transcription
- [ ] Multi-agent conversations
- [ ] Integration with CRM systems
- [ ] Voice biometrics for authentication

## Support

For issues or questions:
- Check this documentation first
- Review error logs in console
- Contact: support@astartupbiz.com
