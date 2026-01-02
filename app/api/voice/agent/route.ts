import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/clerk-server-safe';
import {
  spawnAgent,
  getAgentSession,
  removeAgent,
  updateAgentStatus,
  listActiveSessions,
  isAgentAvailable,
} from '@/lib/voice-agent';
import { isLiveKitConfigured } from '@/lib/livekit';

export const dynamic = 'force-dynamic';

/**
 * POST /api/voice/agent
 * Spawn an AI agent for a voice call room
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isLiveKitConfigured()) {
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { roomName, systemPrompt, voice } = body;

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Check if agent already exists for this room
    const existingSession = getAgentSession(roomName);
    if (existingSession && existingSession.status !== 'disconnected') {
      return NextResponse.json({
        success: true,
        message: 'Agent already active for this room',
        session: {
          roomName: existingSession.roomName,
          agentIdentity: existingSession.agentIdentity,
          status: existingSession.status,
          createdAt: existingSession.createdAt,
        },
      });
    }

    // Spawn new agent
    const session = await spawnAgent({
      roomName,
      systemPrompt,
      voice: voice || 'alloy',
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Failed to spawn agent' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agent spawned successfully',
      session: {
        roomName: session.roomName,
        agentIdentity: session.agentIdentity,
        status: session.status,
        createdAt: session.createdAt,
        // Token included for worker processes to connect
        token: session.token,
        serverUrl: process.env.LIVEKIT_HOST,
      },
    });
  } catch (error) {
    console.error('Error spawning agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/agent
 * Get agent status or list active agents
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('roomName');
    const listAll = searchParams.get('listAll') === 'true';

    // List all active sessions (admin only in production)
    if (listAll) {
      const sessions = listActiveSessions();
      return NextResponse.json({
        success: true,
        count: sessions.length,
        sessions: sessions.map((s) => ({
          roomName: s.roomName,
          agentIdentity: s.agentIdentity,
          status: s.status,
          createdAt: s.createdAt,
        })),
      });
    }

    // Get specific room agent status
    if (roomName) {
      const session = getAgentSession(roomName);

      if (!session) {
        return NextResponse.json({
          success: true,
          available: false,
          message: 'No agent active for this room',
        });
      }

      return NextResponse.json({
        success: true,
        available: isAgentAvailable(roomName),
        session: {
          roomName: session.roomName,
          agentIdentity: session.agentIdentity,
          status: session.status,
          createdAt: session.createdAt,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Use ?roomName=xxx to check specific room or ?listAll=true for all sessions',
    });
  } catch (error) {
    console.error('Error getting agent status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/voice/agent
 * Update agent status
 */
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { roomName, status } = body;

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    if (!['pending', 'active', 'disconnected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, active, or disconnected' },
        { status: 400 }
      );
    }

    updateAgentStatus(roomName, status);

    return NextResponse.json({
      success: true,
      message: `Agent status updated to ${status}`,
    });
  } catch (error) {
    console.error('Error updating agent status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/voice/agent
 * Remove agent from room
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('roomName');

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    const removed = await removeAgent(roomName);

    if (!removed) {
      return NextResponse.json({
        success: false,
        message: 'No agent found for this room',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Agent removed successfully',
    });
  } catch (error) {
    console.error('Error removing agent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
