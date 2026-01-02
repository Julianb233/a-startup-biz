import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@/lib/clerk-server-safe';
import { generateToken, generateSupportRoomName, isLiveKitConfigured } from '@/lib/livekit';
import { spawnAgent } from '@/lib/voice-agent';
import { createVoiceCall } from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

// Generate LiveKit token for voice calls
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

    // Get user details for better participant naming
    const user = await currentUser();

    const body = await request.json();
    const { roomName, participantName, roomType = 'support', spawnAiAgent = true } = body;

    // Generate room name if not provided
    const finalRoomName = roomName || generateSupportRoomName(userId);

    // Use user's actual name if available
    const finalParticipantName =
      participantName ||
      user?.fullName ||
      user?.firstName ||
      `user-${userId.slice(-6)}`;

    // Generate token with appropriate permissions
    const token = await generateToken(finalRoomName, finalParticipantName, {
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      metadata: JSON.stringify({
        userId,
        roomType,
        joinedAt: new Date().toISOString(),
      }),
      ttl: 3600, // 1 hour
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Failed to generate token' },
        { status: 500 }
      );
    }

    // Create call record in database
    let callId: string | undefined;
    try {
      const call = await createVoiceCall({
        roomName: finalRoomName,
        callerId: userId,
        callType: roomType as 'support' | 'user-to-user' | 'conference',
        metadata: {
          participantName: finalParticipantName,
          userEmail: user?.emailAddresses?.[0]?.emailAddress,
          initiatedAt: new Date().toISOString(),
        },
      });
      callId = call.id;
      console.log(`[VoiceToken] Call record created: ${callId}`);
    } catch (dbError) {
      console.error('[VoiceToken] Failed to create call record:', dbError);
      // Continue without database record
    }

    // Spawn AI agent for support calls
    let agentSpawned = false;
    if (spawnAiAgent && roomType === 'support') {
      try {
        const agentSession = await spawnAgent({
          roomName: finalRoomName,
          voice: 'alloy', // Default voice
        });
        agentSpawned = !!agentSession;
        console.log(`[VoiceToken] AI agent spawned for room ${finalRoomName}: ${agentSpawned}`);
      } catch (agentError) {
        console.error('[VoiceToken] Failed to spawn AI agent:', agentError);
        // Don't fail the request if agent spawn fails
      }
    }

    return NextResponse.json({
      token,
      roomName: finalRoomName,
      participantName: finalParticipantName,
      livekitHost: process.env.LIVEKIT_HOST || 'wss://your-livekit-server.livekit.cloud',
      agentSpawned,
      callId,
    });
  } catch (error) {
    console.error('Error generating voice token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
