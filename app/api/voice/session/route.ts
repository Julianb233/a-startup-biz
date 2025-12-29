import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { generateToken, generateSupportRoomName, isLiveKitConfigured } from '@/lib/livekit';
import { spawnAgent, getAgentSession, removeAgent, updateAgentStatus } from '@/lib/voice-agent';
import {
  createVoiceCall,
  getVoiceCallByRoom,
  updateVoiceCallStatus,
  getVoiceCallHistory,
} from '@/lib/db-queries';
import { startRecording, isRecordingConfigured } from '@/lib/voice-recording';

export const dynamic = 'force-dynamic';

/**
 * POST /api/voice/session
 * Start a new voice call session
 *
 * Creates a LiveKit room, generates tokens, spawns AI agent if needed,
 * and optionally starts recording.
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

    const user = await currentUser();
    const body = await request.json();
    const {
      callType = 'support',
      roomName: customRoomName,
      calleeId,
      enableRecording = true,
      enableAiAgent = true,
      systemPrompt,
      voice = 'alloy',
    } = body;

    // Validate call type
    if (!['support', 'user-to-user', 'conference'].includes(callType)) {
      return NextResponse.json(
        { error: 'Invalid call type. Must be support, user-to-user, or conference' },
        { status: 400 }
      );
    }

    // Generate room name
    const roomName = customRoomName || generateSupportRoomName(userId);

    // Check if room already exists
    const existingCall = await getVoiceCallByRoom(roomName);
    if (existingCall && ['pending', 'ringing', 'connected'].includes(existingCall.status)) {
      return NextResponse.json(
        { error: 'An active session already exists for this room' },
        { status: 409 }
      );
    }

    // Create call record
    const call = await createVoiceCall({
      roomName,
      callerId: userId,
      calleeId,
      callType: callType as 'support' | 'user-to-user' | 'conference',
      metadata: {
        callerName: user?.fullName || user?.firstName || `user-${userId.slice(-6)}`,
        callerEmail: user?.emailAddresses?.[0]?.emailAddress,
        enableRecording,
        enableAiAgent,
        initiatedAt: new Date().toISOString(),
      },
    });

    // Generate participant name
    const participantName =
      user?.fullName ||
      user?.firstName ||
      `user-${userId.slice(-6)}`;

    // Generate LiveKit token
    const token = await generateToken(roomName, participantName, {
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      metadata: JSON.stringify({
        userId,
        callId: call.id,
        callType,
        joinedAt: new Date().toISOString(),
      }),
      ttl: 7200, // 2 hours
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Failed to generate access token' },
        { status: 500 }
      );
    }

    // Spawn AI agent for support calls
    let agentSpawned = false;
    let agentSession = null;
    if (enableAiAgent && callType === 'support') {
      try {
        agentSession = await spawnAgent({
          roomName,
          systemPrompt,
          voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
        });
        agentSpawned = !!agentSession;

        if (agentSpawned) {
          console.log(`[Session] AI agent spawned for room ${roomName}`);
        }
      } catch (agentError) {
        console.error('[Session] Failed to spawn AI agent:', agentError);
        // Continue without agent - don't fail the session creation
      }
    }

    // Start recording if configured and enabled
    let recordingStarted = false;
    if (enableRecording && isRecordingConfigured()) {
      try {
        const recordingSession = await startRecording({ roomName });
        recordingStarted = !!recordingSession;

        if (recordingStarted) {
          console.log(`[Session] Recording started for room ${roomName}`);
        }
      } catch (recordingError) {
        console.error('[Session] Failed to start recording:', recordingError);
        // Continue without recording - don't fail the session creation
      }
    }

    // Update call status to ringing
    await updateVoiceCallStatus(roomName, 'ringing', { startedAt: true });

    return NextResponse.json({
      success: true,
      message: 'Voice session created successfully',
      session: {
        callId: call.id,
        roomName,
        participantName,
        token,
        livekitHost: process.env.LIVEKIT_HOST || 'wss://your-livekit-server.livekit.cloud',
        callType,
        status: 'ringing',
        agentSpawned,
        agentStatus: agentSession?.status || 'unavailable',
        recordingEnabled: recordingStarted,
        createdAt: call.created_at,
      },
    });
  } catch (error) {
    console.error('[Session] Error creating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/session
 * Get session status or list user's sessions
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
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get specific session
    if (roomName) {
      const call = await getVoiceCallByRoom(roomName);

      if (!call) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }

      // Verify user has access
      if (call.caller_id !== userId && call.callee_id !== userId) {
        return NextResponse.json(
          { error: 'Access denied to this session' },
          { status: 403 }
        );
      }

      // Get agent status
      const agentSession = getAgentSession(roomName);

      return NextResponse.json({
        success: true,
        session: {
          callId: call.id,
          roomName: call.room_name,
          callType: call.call_type,
          status: call.status,
          startedAt: call.started_at,
          connectedAt: call.connected_at,
          endedAt: call.ended_at,
          duration: call.duration_seconds,
          recordingUrl: call.recording_url,
          transcript: call.transcript,
          metadata: call.metadata,
          agentStatus: agentSession?.status || 'unavailable',
          agentAvailable: agentSession?.status === 'active',
        },
      });
    }

    // List user's sessions
    const calls = await getVoiceCallHistory({
      userId,
      status: status as 'pending' | 'ringing' | 'connected' | 'completed' | 'missed' | 'failed' | undefined,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      count: calls.data.length,
      total: calls.total,
      limit,
      offset,
      sessions: calls.data.map((call) => ({
        callId: call.id,
        roomName: call.room_name,
        callType: call.call_type,
        status: call.status,
        startedAt: call.started_at,
        connectedAt: call.connected_at,
        endedAt: call.ended_at,
        duration: call.duration_seconds,
        hasRecording: !!call.recording_url,
        hasTranscript: !!call.transcript,
        createdAt: call.created_at,
      })),
    });
  } catch (error) {
    console.error('[Session] Error getting session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/voice/session
 * Update session status or metadata
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { roomName, status: newStatus, agentStatus } = body;

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
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (call.caller_id !== userId && call.callee_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied to this session' },
        { status: 403 }
      );
    }

    // Update call status if provided
    if (newStatus) {
      if (!['pending', 'ringing', 'connected', 'completed', 'missed', 'failed'].includes(newStatus)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }

      const updateOptions: any = {};
      if (newStatus === 'connected' && !call.connected_at) {
        updateOptions.connectedAt = true;
      } else if (newStatus === 'completed' && !call.ended_at) {
        updateOptions.endedAt = true;
        if (call.connected_at) {
          updateOptions.durationSeconds = Math.floor(
            (Date.now() - new Date(call.connected_at).getTime()) / 1000
          );
        }
      }

      await updateVoiceCallStatus(roomName, newStatus as any, updateOptions);
    }

    // Update agent status if provided
    if (agentStatus) {
      if (!['pending', 'active', 'disconnected'].includes(agentStatus)) {
        return NextResponse.json(
          { error: 'Invalid agent status' },
          { status: 400 }
        );
      }

      updateAgentStatus(roomName, agentStatus);
    }

    return NextResponse.json({
      success: true,
      message: 'Session updated successfully',
    });
  } catch (error) {
    console.error('[Session] Error updating session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/voice/session
 * End a voice call session
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
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Verify user has access
    if (call.caller_id !== userId && call.callee_id !== userId) {
      return NextResponse.json(
        { error: 'Access denied to this session' },
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

    // Remove AI agent
    try {
      await removeAgent(roomName);
      console.log(`[Session] AI agent removed from room ${roomName}`);
    } catch (agentError) {
      console.warn('[Session] Failed to remove agent:', agentError);
    }

    return NextResponse.json({
      success: true,
      message: 'Session ended successfully',
      duration,
    });
  } catch (error) {
    console.error('[Session] Error ending session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
