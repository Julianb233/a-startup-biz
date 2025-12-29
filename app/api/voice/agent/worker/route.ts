import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  VoiceAgentWorker,
  VoiceAgentWorkerConfig,
  isOpenAIConfigured,
} from '@/lib/voice-agent-worker';
import { getAgentSession, updateAgentStatus } from '@/lib/voice-agent';
import { isLiveKitConfigured } from '@/lib/livekit';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max for serverless function

/**
 * POST /api/voice/agent/worker
 * Start a voice agent worker process
 *
 * This endpoint is designed to be called from a separate worker process or
 * long-running service. In production, you might want to:
 * 1. Deploy this as a separate worker service (not serverless)
 * 2. Use a job queue (like BullMQ) to manage worker processes
 * 3. Deploy on a platform that supports WebSockets and long connections
 *
 * For development/testing, this endpoint can spawn a worker that will
 * run for up to the maxDuration limit.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate configuration
    if (!isLiveKitConfigured()) {
      return NextResponse.json(
        { error: 'LiveKit not configured' },
        { status: 503 }
      );
    }

    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        { error: 'OpenAI not configured. Set OPENAI_API_KEY environment variable.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { roomName, systemPrompt, voice, debug } = body;

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Get agent session details
    const session = getAgentSession(roomName);
    if (!session) {
      return NextResponse.json(
        { error: 'No agent session found for this room. Call POST /api/voice/agent first.' },
        { status: 404 }
      );
    }

    // Prepare worker configuration
    const workerConfig: VoiceAgentWorkerConfig = {
      serverUrl: process.env.LIVEKIT_HOST || '',
      token: session.token,
      systemPrompt: systemPrompt || session.metadata?.systemPrompt || 'You are a helpful AI assistant.',
      voice: voice || session.metadata?.voice || 'alloy',
      debug: debug || false,
    };

    // Update agent status to active
    updateAgentStatus(roomName, 'active');

    // Spawn worker (this will run asynchronously)
    spawnWorkerAsync(workerConfig, roomName).catch((error) => {
      console.error('[VoiceAgentWorker] Worker error:', error);
      updateAgentStatus(roomName, 'disconnected');
    });

    return NextResponse.json({
      success: true,
      message: 'Voice agent worker started',
      roomName,
      agentIdentity: session.agentIdentity,
      note: 'Worker is running in background. Monitor status via GET /api/voice/agent',
    });

  } catch (error) {
    console.error('Error starting voice agent worker:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/agent/worker
 * Get worker status and health check
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const roomName = searchParams.get('roomName');

    if (!roomName) {
      return NextResponse.json({
        success: true,
        message: 'Voice agent worker API is available',
        livekitConfigured: isLiveKitConfigured(),
        openaiConfigured: isOpenAIConfigured(),
      });
    }

    const session = getAgentSession(roomName);

    if (!session) {
      return NextResponse.json({
        success: true,
        running: false,
        message: 'No worker found for this room',
      });
    }

    return NextResponse.json({
      success: true,
      running: session.status === 'active',
      roomName: session.roomName,
      agentIdentity: session.agentIdentity,
      status: session.status,
      createdAt: session.createdAt,
    });

  } catch (error) {
    console.error('Error getting worker status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/voice/agent/worker
 * Stop a voice agent worker
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

    // Update status to disconnected
    updateAgentStatus(roomName, 'disconnected');

    return NextResponse.json({
      success: true,
      message: 'Voice agent worker stop signal sent',
      note: 'Worker will disconnect gracefully',
    });

  } catch (error) {
    console.error('Error stopping worker:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Spawn worker asynchronously
 *
 * In production, this should be replaced with a proper worker queue
 * or a dedicated worker service that runs outside the serverless environment.
 */
async function spawnWorkerAsync(
  config: VoiceAgentWorkerConfig,
  roomName: string
): Promise<void> {
  let worker: VoiceAgentWorker | null = null;

  try {
    console.log(`[VoiceAgentWorker] Starting worker for room: ${roomName}`);

    worker = new VoiceAgentWorker(config);
    await worker.start();

    console.log(`[VoiceAgentWorker] Worker started successfully for room: ${roomName}`);

    // Keep worker running until it's disconnected or errors out
    // Note: In serverless environment, this will be limited by maxDuration
    await new Promise<void>((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const state = worker?.getState();
        if (state === 'disconnected' || state === 'error') {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);

      // Cleanup after max duration (slightly less than maxDuration to allow graceful shutdown)
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 290000); // 4 minutes 50 seconds
    });

  } catch (error) {
    console.error(`[VoiceAgentWorker] Worker error for room ${roomName}:`, error);
    updateAgentStatus(roomName, 'disconnected');
    throw error;

  } finally {
    // Clean up worker
    if (worker) {
      await worker.stop();
    }
    console.log(`[VoiceAgentWorker] Worker stopped for room: ${roomName}`);
  }
}
