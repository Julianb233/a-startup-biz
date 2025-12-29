import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateToken, generateSupportRoomName, isLiveKitConfigured } from '@/lib/livekit';

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

    const body = await request.json();
    const { roomName, participantName, roomType = 'support' } = body;

    // Generate room name if not provided
    const finalRoomName = roomName || generateSupportRoomName(userId);
    const finalParticipantName = participantName || `user-${userId}`;

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

    return NextResponse.json({
      token,
      roomName: finalRoomName,
      participantName: finalParticipantName,
      livekitHost: process.env.LIVEKIT_HOST || 'wss://your-livekit-server.livekit.cloud',
    });
  } catch (error) {
    console.error('Error generating voice token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
