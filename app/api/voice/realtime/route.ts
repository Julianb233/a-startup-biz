import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isLiveKitConfigured } from '@/lib/livekit';
import { getVoiceCallByRoom, updateVoiceCallStatus } from '@/lib/db-queries';
import { getAgentSession } from '@/lib/voice-agent';

export const dynamic = 'force-dynamic';

/**
 * POST /api/voice/realtime
 * Initialize OpenAI Realtime API session for voice interaction
 *
 * This endpoint provides the necessary configuration to connect
 * to OpenAI's Realtime API for WebSocket-based voice streaming.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isLiveKitConfigured()) {
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { roomName, model = 'gpt-4o-realtime-preview-2024-12-17' } = body;

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Verify the call exists
    const call = await getVoiceCallByRoom(roomName);
    if (!call) {
      return NextResponse.json(
        { error: 'Call session not found' },
        { status: 404 }
      );
    }

    // Verify user has access to this call
    if (call.caller_id !== userId && call.callee_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied to this call' },
        { status: 403 }
      );
    }

    // Check if agent is available
    const agentSession = getAgentSession(roomName);
    if (!agentSession) {
      return NextResponse.json(
        { error: 'AI agent not available for this room' },
        { status: 404 }
      );
    }

    if (agentSession.status !== 'active') {
      return NextResponse.json(
        { error: `AI agent is ${agentSession.status}, not ready yet` },
        { status: 503 }
      );
    }

    // Update call status to connected if pending
    if (call.status === 'pending') {
      await updateVoiceCallStatus(roomName, 'connected', { connectedAt: true });
    }

    // Return realtime configuration
    // Note: In production, you'd integrate with OpenAI Realtime API here
    return NextResponse.json({
      success: true,
      roomName,
      model,
      agentIdentity: agentSession.agentIdentity,
      configuration: {
        // OpenAI Realtime API configuration
        modalities: ['text', 'audio'],
        instructions: agentSession.status === 'active'
          ? 'You are a helpful AI assistant for A Startup Biz.'
          : undefined,
        voice: 'alloy',
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        input_audio_transcription: {
          model: 'whisper-1',
        },
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
      },
      // LiveKit room details for WebRTC connection
      livekit: {
        serverUrl: process.env.LIVEKIT_HOST,
        roomName,
      },
    });
  } catch (error) {
    console.error('[Realtime] Error initializing session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/realtime
 * Get realtime session status
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('roomName');

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Get call details
    const call = await getVoiceCallByRoom(roomName);
    if (!call) {
      return NextResponse.json(
        { error: 'Call session not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (call.caller_id !== userId && call.callee_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied to this call' },
        { status: 403 }
      );
    }

    // Get agent status
    const agentSession = getAgentSession(roomName);

    return NextResponse.json({
      success: true,
      roomName,
      callStatus: call.status,
      agentStatus: agentSession?.status || 'unavailable',
      agentAvailable: agentSession?.status === 'active',
      duration: call.duration_seconds,
      connectedAt: call.connected_at,
      metadata: call.metadata,
    });
  } catch (error) {
    console.error('[Realtime] Error getting session status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/voice/realtime
 * End realtime session
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('roomName');

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Verify the call exists
    const call = await getVoiceCallByRoom(roomName);
    if (!call) {
      return NextResponse.json(
        { error: 'Call session not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (call.caller_id !== userId && call.callee_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied to this call' },
        { status: 403 }
      );
    }

    // Calculate duration if call was connected
    const duration = call.connected_at
      ? Math.floor((Date.now() - new Date(call.connected_at).getTime()) / 1000)
      : undefined;

    // Update call status to completed
    await updateVoiceCallStatus(roomName, 'completed', {
      endedAt: true,
      durationSeconds: duration,
    });

    return NextResponse.json({
      success: true,
      message: 'Realtime session ended',
      duration,
    });
  } catch (error) {
    console.error('[Realtime] Error ending session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
