# LiveKit Voice Call Setup Guide

This guide walks you through setting up LiveKit for voice calls in A Startup Biz.

## Quick Start

### 1. Create a LiveKit Cloud Account

1. Go to [LiveKit Cloud](https://cloud.livekit.io) and sign up
2. Create a new project
3. Note your project credentials:
   - **Host URL**: `wss://your-project.livekit.cloud`
   - **API Key**: `APIxxxxxxxx`
   - **API Secret**: `xxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Configure Environment Variables

Add to your `.env.local`:

```bash
# LiveKit (WebRTC Voice Calls)
LIVEKIT_HOST=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxx
LIVEKIT_API_SECRET=your-api-secret
```

### 3. Configure Webhook

In LiveKit Cloud dashboard:
1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/voice/webhook`
3. Enable events:
   - `room_started`
   - `room_finished`
   - `participant_joined`
   - `participant_left`
   - `egress_started`
   - `egress_ended`

### 4. Run Database Migration

```bash
# Apply voice calls schema
psql $DATABASE_URL -f scripts/migrations/010_voice_calls.sql
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │     FloatingCallButton → VoiceCallInterface     │    │
│  │              (LiveKit WebRTC Client)            │    │
│  └─────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  LiveKit Cloud Server                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   WebRTC     │  │   Signaling  │  │   Egress     │  │
│  │   Media      │  │   Server     │  │   (Record)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼ Webhooks
┌─────────────────────────────────────────────────────────┐
│                  A Startup Biz Backend                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ /api/voice/  │  │ /api/voice/  │  │ /api/voice/  │  │
│  │    token     │  │   webhook    │  │    agent     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│           │                │                │           │
│           ▼                ▼                ▼           │
│  ┌─────────────────────────────────────────────────┐   │
│  │              PostgreSQL Database                │   │
│  │   (voice_calls, call_participants tables)       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## API Endpoints

### POST /api/voice/token
Generate a LiveKit access token for joining a call.

**Request:**
```json
{
  "roomType": "support",
  "participantName": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "roomName": "support-user123-1704067200000",
  "participantName": "John Doe",
  "livekitHost": "wss://your-project.livekit.cloud",
  "agentSpawned": true,
  "callId": "uuid-here"
}
```

### POST /api/voice/agent
Spawn an AI agent for a room.

**Request:**
```json
{
  "roomName": "support-user123-1704067200000",
  "voice": "alloy",
  "systemPrompt": "Custom prompt..."
}
```

### GET /api/voice/history
Get call history with stats.

**Query params:**
- `callType` - Filter by type (support, user-to-user, conference)
- `status` - Filter by status (completed, missed, etc.)
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset
- `includeStats` - Include call statistics (true/false)
- `allUsers` - Show all users' calls (admin only)

### POST /api/voice/webhook
LiveKit webhook endpoint for real-time events.

## Call Recording (Optional)

### Enable Recording

1. Create an S3 bucket for recordings
2. Add environment variables:

```bash
LIVEKIT_RECORDING_BUCKET=my-recordings-bucket
LIVEKIT_RECORDING_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

3. Configure bucket CORS:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-domain.com"],
      "AllowedMethods": ["GET"],
      "AllowedHeaders": ["*"]
    }
  ]
}
```

### Recording Flow

1. Room starts → Webhook triggers recording start
2. Room ends → Webhook stops recording, saves URL
3. Admin can play/download from `/admin/calls`

## AI Voice Agent

The system includes an AI agent that can join calls and respond to users.

### How It Works

1. User requests a call token
2. Token endpoint spawns an AI agent for the room
3. Agent joins with LiveKit token
4. Agent uses configured system prompt to respond

### Customizing the Agent

Edit `lib/voice-agent.ts`:

```typescript
function getDefaultSystemPrompt(): string {
  return `You are a helpful AI support assistant...`;
}
```

### Voice Options

Available voices (OpenAI TTS):
- `alloy` (default)
- `echo`
- `fable`
- `onyx`
- `nova`
- `shimmer`

## Database Schema

### voice_calls table
```sql
- id: UUID (primary key)
- room_name: VARCHAR(255)
- caller_id: VARCHAR(255)
- callee_id: VARCHAR(255)
- call_type: VARCHAR(50) -- support, user-to-user, conference
- status: VARCHAR(50) -- pending, ringing, connected, completed, missed, failed
- started_at: TIMESTAMP
- connected_at: TIMESTAMP
- ended_at: TIMESTAMP
- duration_seconds: INTEGER
- recording_url: TEXT
- transcript: TEXT
- metadata: JSONB
- created_at: TIMESTAMP
```

### call_participants table
```sql
- id: SERIAL (primary key)
- call_id: UUID (foreign key)
- user_id: VARCHAR(255)
- participant_name: VARCHAR(255)
- joined_at: TIMESTAMP
- left_at: TIMESTAMP
- duration_seconds: INTEGER
- is_muted: BOOLEAN
```

## Troubleshooting

### "Voice service not configured"
- Check that all three env vars are set: `LIVEKIT_HOST`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`

### Calls not connecting
1. Verify LiveKit host URL starts with `wss://`
2. Check browser console for WebRTC errors
3. Ensure firewall allows WebSocket connections

### Webhook not receiving events
1. Verify webhook URL is publicly accessible
2. Check LiveKit dashboard for webhook delivery logs
3. Ensure HTTPS is configured correctly

### Recording not working
1. Verify S3 credentials are correct
2. Check bucket permissions
3. Enable Egress in LiveKit dashboard

## Testing

### Local Development

1. Use ngrok for webhook testing:
```bash
ngrok http 3000
```

2. Update webhook URL in LiveKit dashboard to ngrok URL

3. Test call flow:
   - Sign in to app
   - Click floating call button
   - Start call
   - Verify webhook events in console

### API Testing

```bash
# Check voice service status
curl http://localhost:3000/api/voice/token \
  -H "Content-Type: application/json" \
  -d '{"roomType": "support"}'

# Check webhook health
curl http://localhost:3000/api/voice/webhook
```

## Production Checklist

- [ ] LiveKit Cloud project created
- [ ] Environment variables configured
- [ ] Webhook URL registered
- [ ] Database migration applied
- [ ] SSL certificate valid
- [ ] CORS configured if needed
- [ ] (Optional) S3 bucket for recordings
- [ ] (Optional) OpenAI API key for AI agent

## Support

- [LiveKit Documentation](https://docs.livekit.io)
- [LiveKit Cloud Dashboard](https://cloud.livekit.io)
- [LiveKit Discord](https://livekit.io/discord)
