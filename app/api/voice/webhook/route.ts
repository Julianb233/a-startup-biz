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

    // Verify webhook signature in production
    let body;
    if (apiKey && apiSecret && authHeader) {
      try {
        const receiver = new WebhookReceiver(apiKey, apiSecret);
        const rawBody = await request.text();
        body = await receiver.receive(rawBody, authHeader);
      } catch (verifyError) {
        console.warn('Webhook verification failed, using raw body:', verifyError);
        body = JSON.parse(await request.text());
      }
    } else {
      body = await request.json();
    }

    const { event, room, participant, track, egressInfo } = body;

    console.log('[LiveKit Webhook]', event, room?.name);

    switch (event) {
      case 'room_started':
        console.log(`[Room] Started: ${room?.name}`);
        // Room is ready - call record should already be created by token endpoint
        // Start recording if configured
        if (room?.name && isRecordingConfigured()) {
          try {
            await startRecording({ roomName: room.name });
            console.log(`[Recording] Auto-started for ${room.name}`);
          } catch (recError) {
            console.warn(`[Recording] Failed to auto-start:`, recError);
          }
        }
        break;

      case 'room_finished':
        console.log(`[Room] Finished: ${room?.name}`);

        if (room?.name) {
          // Stop recording and get URL
          let recordingUrl: string | undefined;
          if (isRecordingConfigured()) {
            try {
              const result = await stopRecording(room.name);
              recordingUrl = result.url;
              console.log(`[Recording] Stopped, URL: ${recordingUrl}`);
            } catch (recError) {
              console.warn(`[Recording] Failed to stop:`, recError);
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

          console.log(`[Room] Call record updated: ${room.name}, duration: ${duration}s`);
        }
        break;

      case 'participant_joined':
        console.log(`[Participant] Joined: ${participant?.identity} in ${room?.name}`);

        if (room?.name && participant?.identity) {
          // Check if this is an AI agent
          const isAgent = participant.identity.startsWith('ai-agent-');

          if (isAgent) {
            updateAgentStatus(room.name, 'active');
            console.log(`[Agent] Now active in room ${room.name}`);
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
        console.log(`[Participant] Left: ${participant?.identity} from ${room?.name}`);

        if (room?.name && participant?.identity) {
          const agentLeft = participant.identity.startsWith('ai-agent-');

          if (agentLeft) {
            updateAgentStatus(room.name, 'disconnected');
            console.log(`[Agent] Disconnected from room ${room.name}`);
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
        console.log(`[Track] Published: ${track?.type} by ${participant?.identity}`);
        break;

      case 'track_unpublished':
        console.log(`[Track] Unpublished: ${track?.type} by ${participant?.identity}`);
        break;

      case 'egress_started':
        console.log(`[Egress] Recording started for ${room?.name}, egress: ${egressInfo?.egressId}`);
        break;

      case 'egress_ended':
        console.log(`[Egress] Recording ended for ${room?.name}`);
        // Update recording URL from egress info
        if (room?.name && egressInfo?.fileResults?.[0]?.location) {
          await setCallRecordingUrl(room.name, egressInfo.fileResults[0].location);
          console.log(`[Egress] Recording URL saved: ${egressInfo.fileResults[0].location}`);
        }
        break;

      default:
        console.log(`[Webhook] Unhandled event: ${event}`);
    }

    return NextResponse.json({ received: true, event });
  } catch (error) {
    console.error('[Webhook] Error processing:', error);
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
