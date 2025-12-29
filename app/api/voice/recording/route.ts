import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  startRecording,
  stopRecording,
  getRecordingStatus,
  listActiveRecordings,
  isRecording,
  isRecordingConfigured,
  getRecordingUrl,
} from '@/lib/voice-recording';
import {
  getVoiceCallByRoom,
  setCallRecordingUrl,
  updateVoiceCallStatus,
} from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

/**
 * POST /api/voice/recording
 * Start recording a voice call
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

    if (!isRecordingConfigured()) {
      return NextResponse.json(
        { error: 'Recording service not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { roomName, outputPath, fileType = 'mp4' } = body;

    if (!roomName) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!['mp4', 'ogg'].includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be mp4 or ogg' },
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

    // Check if already recording
    if (isRecording(roomName)) {
      return NextResponse.json(
        { error: 'Recording already in progress for this room' },
        { status: 409 }
      );
    }

    // Verify call is active
    if (!['ringing', 'connected'].includes(call.status)) {
      return NextResponse.json(
        { error: 'Call must be active to start recording' },
        { status: 400 }
      );
    }

    // Start recording
    const recordingSession = await startRecording({
      roomName,
      outputPath,
      fileType: fileType as 'mp4' | 'ogg',
    });

    if (!recordingSession) {
      return NextResponse.json(
        { error: 'Failed to start recording' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Recording started successfully',
      recording: {
        egressId: recordingSession.egressId,
        roomName: recordingSession.roomName,
        startedAt: recordingSession.startedAt,
        status: recordingSession.status,
      },
    });
  } catch (error) {
    console.error('[Recording] Error starting recording:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/voice/recording
 * Get recording status or list recordings
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
    const egressId = searchParams.get('egressId');
    const listAll = searchParams.get('listAll') === 'true';

    // List all active recordings (admin only in production)
    if (listAll) {
      if (!isRecordingConfigured()) {
        return NextResponse.json(
          { error: 'Recording service not configured' },
          { status: 503 }
        );
      }

      const recordings = listActiveRecordings();

      return NextResponse.json({
        success: true,
        count: recordings.length,
        recordings: recordings.map((rec) => ({
          egressId: rec.egressId,
          roomName: rec.roomName,
          startedAt: rec.startedAt,
          status: rec.status,
        })),
      });
    }

    // Get recording URL by egressId
    if (egressId && roomName) {
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

      // Try to get recording URL
      const url = await getRecordingUrl(roomName, egressId);

      if (!url) {
        return NextResponse.json(
          { error: 'Recording URL not available yet' },
          { status: 404 }
        );
      }

      // Save URL to database
      await setCallRecordingUrl(roomName, url);

      return NextResponse.json({
        success: true,
        recordingUrl: url,
      });
    }

    // Get recording status for specific room
    if (roomName) {
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

      const recordingSession = getRecordingStatus(roomName);

      if (!recordingSession && !call.recording_url) {
        return NextResponse.json({
          success: true,
          recording: null,
          message: 'No recording for this room',
        });
      }

      return NextResponse.json({
        success: true,
        recording: recordingSession
          ? {
              egressId: recordingSession.egressId,
              roomName: recordingSession.roomName,
              startedAt: recordingSession.startedAt,
              status: recordingSession.status,
              isActive: recordingSession.status === 'active',
            }
          : null,
        recordingUrl: call.recording_url,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Use ?roomName=xxx to check specific room or ?listAll=true for all recordings',
    });
  } catch (error) {
    console.error('[Recording] Error getting recording:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/voice/recording
 * Stop recording a voice call
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

    if (!isRecordingConfigured()) {
      return NextResponse.json(
        { error: 'Recording service not configured' },
        { status: 503 }
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

    // Check if recording is active
    if (!isRecording(roomName)) {
      return NextResponse.json(
        { error: 'No active recording for this room' },
        { status: 404 }
      );
    }

    // Stop recording
    const result = await stopRecording(roomName);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to stop recording' },
        { status: 500 }
      );
    }

    // Save recording URL to database
    if (result.url) {
      await setCallRecordingUrl(roomName, result.url);
    }

    return NextResponse.json({
      success: true,
      message: 'Recording stopped successfully',
      recordingUrl: result.url,
    });
  } catch (error) {
    console.error('[Recording] Error stopping recording:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/voice/recording
 * Update recording metadata (e.g., add transcript)
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
    const { roomName, transcript, recordingUrl } = body;

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

    // Update recording metadata
    const updateData: any = {};
    if (transcript !== undefined) {
      updateData.transcript = transcript;
    }
    if (recordingUrl) {
      updateData.recordingUrl = recordingUrl;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No update data provided' },
        { status: 400 }
      );
    }

    // Update call with additional data
    await updateVoiceCallStatus(roomName, call.status, updateData);

    return NextResponse.json({
      success: true,
      message: 'Recording metadata updated successfully',
    });
  } catch (error) {
    console.error('[Recording] Error updating recording:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
