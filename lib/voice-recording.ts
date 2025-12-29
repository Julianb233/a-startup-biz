import { EgressClient, EncodedFileOutput, EncodedFileType, S3Upload } from 'livekit-server-sdk';

/**
 * Voice Recording Service
 *
 * Manages call recording using LiveKit Egress API.
 * Recordings are saved to configured S3/GCS bucket.
 */

interface RecordingConfig {
  roomName: string;
  outputPath?: string;
  fileType?: 'mp4' | 'ogg';
}

interface RecordingSession {
  egressId: string;
  roomName: string;
  startedAt: Date;
  status: 'starting' | 'active' | 'stopping' | 'completed' | 'failed';
}

// Track active recording sessions
const activeRecordings = new Map<string, RecordingSession>();

// LiveKit configuration
const livekitHost = process.env.LIVEKIT_HOST || '';
const apiKey = process.env.LIVEKIT_API_KEY || '';
const apiSecret = process.env.LIVEKIT_API_SECRET || '';

// Storage configuration (S3 or GCS)
const s3Bucket = process.env.LIVEKIT_RECORDING_BUCKET;
const s3Region = process.env.LIVEKIT_RECORDING_REGION || 'us-east-1';
const s3AccessKey = process.env.AWS_ACCESS_KEY_ID;
const s3SecretKey = process.env.AWS_SECRET_ACCESS_KEY;

/**
 * Check if recording is configured
 */
export function isRecordingConfigured(): boolean {
  return !!(apiKey && apiSecret && livekitHost && s3Bucket && s3AccessKey && s3SecretKey);
}

/**
 * Get egress client
 */
function getEgressClient(): EgressClient | null {
  if (!apiKey || !apiSecret || !livekitHost) {
    console.warn('[Recording] LiveKit not configured');
    return null;
  }

  return new EgressClient(
    livekitHost.replace('wss://', 'https://'),
    apiKey,
    apiSecret
  );
}

/**
 * Start recording a room
 */
export async function startRecording(config: RecordingConfig): Promise<RecordingSession | null> {
  const client = getEgressClient();
  if (!client) {
    console.error('[Recording] Egress client not available');
    return null;
  }

  if (!isRecordingConfigured()) {
    console.warn('[Recording] Storage not configured, skipping recording');
    return null;
  }

  try {
    // Generate output path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = config.outputPath || `recordings/${config.roomName}/${timestamp}`;
    const fileExtension = config.fileType === 'ogg' ? 'ogg' : 'mp4';

    // Create S3 upload configuration
    const s3Config = new S3Upload({
      bucket: s3Bucket!,
      region: s3Region,
      accessKey: s3AccessKey!,
      secret: s3SecretKey!,
    });

    // Create encoded file output configuration
    const fileOutput = new EncodedFileOutput({
      fileType: config.fileType === 'ogg' ? EncodedFileType.OGG : EncodedFileType.MP4,
      filepath: `${outputPath}.${fileExtension}`,
      output: {
        case: 's3',
        value: s3Config,
      },
    });

    // Start room composite egress (audio only for voice calls)
    const egressInfo = await client.startRoomCompositeEgress(
      config.roomName,
      {
        file: fileOutput,
      },
      {
        audioOnly: true, // Voice calls don't need video
      }
    );

    const session: RecordingSession = {
      egressId: egressInfo.egressId,
      roomName: config.roomName,
      startedAt: new Date(),
      status: 'active',
    };

    activeRecordings.set(config.roomName, session);

    console.log(`[Recording] Started for room ${config.roomName}, egress: ${egressInfo.egressId}`);

    return session;
  } catch (error) {
    console.error('[Recording] Failed to start:', error);
    return null;
  }
}

/**
 * Stop recording a room
 */
export async function stopRecording(roomName: string): Promise<{ success: boolean; url?: string; error?: string }> {
  const session = activeRecordings.get(roomName);
  if (!session) {
    return { success: false, error: 'No active recording for this room' };
  }

  const client = getEgressClient();
  if (!client) {
    return { success: false, error: 'Egress client not available' };
  }

  try {
    session.status = 'stopping';

    await client.stopEgress(session.egressId);

    // Get egress info to get the output URL
    const egressList = await client.listEgress({ roomName });
    const egress = egressList.find(e => e.egressId === session.egressId);

    session.status = 'completed';
    activeRecordings.delete(roomName);

    // Extract file URL from egress info
    const fileResult = egress?.fileResults?.[0];
    const recordingUrl = fileResult?.location;

    console.log(`[Recording] Stopped for room ${roomName}, URL: ${recordingUrl}`);

    return {
      success: true,
      url: recordingUrl,
    };
  } catch (error) {
    console.error('[Recording] Failed to stop:', error);
    session.status = 'failed';
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get recording status for a room
 */
export function getRecordingStatus(roomName: string): RecordingSession | null {
  return activeRecordings.get(roomName) || null;
}

/**
 * List all active recordings
 */
export function listActiveRecordings(): RecordingSession[] {
  return Array.from(activeRecordings.values());
}

/**
 * Check if room is being recorded
 */
export function isRecording(roomName: string): boolean {
  const session = activeRecordings.get(roomName);
  return session?.status === 'active';
}

/**
 * Get recording URL after egress completes
 */
export async function getRecordingUrl(roomName: string, egressId: string): Promise<string | null> {
  const client = getEgressClient();
  if (!client) {
    return null;
  }

  try {
    const egressList = await client.listEgress({ roomName });
    const egress = egressList.find(e => e.egressId === egressId);

    return egress?.fileResults?.[0]?.location || null;
  } catch (error) {
    console.error('[Recording] Failed to get URL:', error);
    return null;
  }
}
