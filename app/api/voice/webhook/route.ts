import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { WebhookReceiver } from 'livekit-server-sdk';
import { updateAgentStatus, removeAgent } from '@/lib/voice-agent';
import {
  createVoiceCall,
  updateVoiceCallStatus,
  addCallParticipant,
  updateCallParticipantLeft,
  getVoiceCallByRoom,
  setCallRecordingUrl,
} from '@/lib/db-queries';
import { startRecording, stopRecording, isRecordingConfigured } from '@/lib/voice-recording';

export const dynamic = 'force-dynamic';

// LiveKit webhook handler
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    // Verify webhook signature (enabled by default, opt-out with VALIDATE_WEBHOOKS=false)
    const shouldValidate = process.env.VALIDATE_WEBHOOKS !== 'false';
    let body;
    const rawBody = await request.text();

    if (apiKey && apiSecret && authHeader) {
      try {
        const receiver = new WebhookReceiver(apiKey, apiSecret);
        body = await receiver.receive(rawBody, authHeader);
      } catch (verifyError) {
        // LiveKit webhook verification failed
        if (shouldValidate) {
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
        // Only continue with unverified body if explicitly opted out
        body = JSON.parse(rawBody);
      }
    } else if (shouldValidate && !apiKey) {
      // Missing credentials in validated mode
      // LiveKit credentials missing
      return NextResponse.json({ error: 'Webhook configuration error' }, { status: 500 });
    } else {
      body = JSON.parse(rawBody);
    }

    const { event, room, participant, track, egressInfo } = body;

    // LiveKit webhook event received

    switch (event) {
      case 'room_started':
        // Room is ready - call record should already be created by token endpoint
        // Start recording if configured
        if (room?.name && isRecordingConfigured()) {
          try {
            await startRecording({ roomName: room.name });
          } catch (recError) {
            // Recording auto-start failed - non-critical
          }
        }
        break;

      case 'room_finished':
        if (room?.name) {
          // Stop recording and get URL
          let recordingUrl: string | undefined;
          if (isRecordingConfigured()) {
            try {
              const result = await stopRecording(room.name);
              recordingUrl = result.url;
            } catch (recError) {
              // Recording stop failed - non-critical
            }
          }

          // Calculate duration from room metadata if available
          const duration = room.creationTime
            ? Math.floor((Date.now() - new Date(room.creationTime).getTime()) / 1000)
            : undefined;

          // Update call record to completed
          await updateVoiceCallStatus(room.name, 'completed', {
            endedAt: true,
            durationSeconds: duration,
            recordingUrl,
          });

          // Clean up agent session
          await removeAgent(room.name);
        }
        break;

      case 'participant_joined':
        if (room?.name && participant?.identity) {
          // Check if this is an AI agent
          const isAgent = participant.identity.startsWith('ai-agent-');

          if (isAgent) {
            updateAgentStatus(room.name, 'active');
          } else {
            // Human participant joined
            // Get or create call record
            let call = await getVoiceCallByRoom(room.name);

            if (!call) {
              // Create call record if webhook beat token endpoint
              call = await createVoiceCall({
                roomName: room.name,
                callerId: participant.identity,
                callType: 'support',
              });
            }

            // Add participant to call
            await addCallParticipant({
              callId: call.id,
              userId: participant.identity,
              participantName: participant.name,
            });

            // Update call status to connected if first real participant
            if (call.status === 'pending') {
              await updateVoiceCallStatus(room.name, 'connected', { connectedAt: true });
            }
          }
        }
        break;

      case 'participant_left':
        if (room?.name && participant?.identity) {
          const agentLeft = participant.identity.startsWith('ai-agent-');

          if (agentLeft) {
            updateAgentStatus(room.name, 'disconnected');
          } else {
            // Update participant record
            const call = await getVoiceCallByRoom(room.name);
            if (call) {
              await updateCallParticipantLeft(call.id, participant.identity);
            }
          }
        }
        break;

      case 'track_published':
        // Track published event - no action needed
        break;

      case 'track_unpublished':
        // Track unpublished event - no action needed
        break;

      case 'egress_started':
        // Recording started - no action needed
        break;

      case 'egress_ended':
        // Update recording URL from egress info
        if (room?.name && egressInfo?.fileResults?.[0]?.location) {
          await setCallRecordingUrl(room.name, egressInfo.fileResults[0].location);
        }
        break;

      default:
        // Unhandled event - silently ignore
    }

    return NextResponse.json({ received: true, event });
  } catch (error) {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ready',
    endpoint: '/api/voice/webhook',
    events: [
      'room_started',
      'room_finished',
      'participant_joined',
      'participant_left',
      'track_published',
      'track_unpublished',
    ],
  });
}
