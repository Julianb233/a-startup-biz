import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

// LiveKit configuration
const livekitHost = process.env.LIVEKIT_HOST || 'wss://your-livekit-server.livekit.cloud';
const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

// Check if LiveKit is configured
export function isLiveKitConfigured(): boolean {
  return !!(apiKey && apiSecret);
}

// Create room service client
function getRoomServiceClient(): RoomServiceClient | null {
  if (!apiKey || !apiSecret) {
    console.warn('LiveKit not configured');
    return null;
  }
  return new RoomServiceClient(livekitHost.replace('wss://', 'https://'), apiKey, apiSecret);
}

// Generate access token for a participant
export async function generateToken(
  roomName: string,
  participantName: string,
  options?: {
    canPublish?: boolean;
    canSubscribe?: boolean;
    canPublishData?: boolean;
    metadata?: string;
    ttl?: number; // Time to live in seconds
  }
): Promise<string | null> {
  if (!apiKey || !apiSecret) {
    console.warn('LiveKit not configured - token not generated');
    return null;
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantName,
    name: participantName,
    ttl: options?.ttl || 3600, // Default 1 hour
    metadata: options?.metadata,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: options?.canPublish ?? true,
    canSubscribe: options?.canSubscribe ?? true,
    canPublishData: options?.canPublishData ?? true,
  });

  return await at.toJwt();
}

// Create a new room
export async function createRoom(
  roomName: string,
  options?: {
    emptyTimeout?: number; // Seconds to wait before closing empty room
    maxParticipants?: number;
    metadata?: string;
  }
): Promise<{ success: boolean; room?: any; error?: string }> {
  const client = getRoomServiceClient();
  if (!client) {
    return { success: false, error: 'LiveKit not configured' };
  }

  try {
    const room = await client.createRoom({
      name: roomName,
      emptyTimeout: options?.emptyTimeout || 600, // 10 minutes default
      maxParticipants: options?.maxParticipants || 10,
      metadata: options?.metadata,
    });

    return { success: true, room };
  } catch (error) {
    console.error('Failed to create room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// List active rooms
export async function listRooms(): Promise<{ success: boolean; rooms?: any[]; error?: string }> {
  const client = getRoomServiceClient();
  if (!client) {
    return { success: false, error: 'LiveKit not configured' };
  }

  try {
    const rooms = await client.listRooms();
    return { success: true, rooms };
  } catch (error) {
    console.error('Failed to list rooms:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Delete a room
export async function deleteRoom(roomName: string): Promise<{ success: boolean; error?: string }> {
  const client = getRoomServiceClient();
  if (!client) {
    return { success: false, error: 'LiveKit not configured' };
  }

  try {
    await client.deleteRoom(roomName);
    return { success: true };
  } catch (error) {
    console.error('Failed to delete room:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Get participants in a room
export async function getParticipants(
  roomName: string
): Promise<{ success: boolean; participants?: any[]; error?: string }> {
  const client = getRoomServiceClient();
  if (!client) {
    return { success: false, error: 'LiveKit not configured' };
  }

  try {
    const participants = await client.listParticipants(roomName);
    return { success: true, participants };
  } catch (error) {
    console.error('Failed to get participants:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Remove a participant from a room
export async function removeParticipant(
  roomName: string,
  participantIdentity: string
): Promise<{ success: boolean; error?: string }> {
  const client = getRoomServiceClient();
  if (!client) {
    return { success: false, error: 'LiveKit not configured' };
  }

  try {
    await client.removeParticipant(roomName, participantIdentity);
    return { success: true };
  } catch (error) {
    console.error('Failed to remove participant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Mute a participant
export async function muteParticipant(
  roomName: string,
  participantIdentity: string,
  trackSid: string,
  muted: boolean
): Promise<{ success: boolean; error?: string }> {
  const client = getRoomServiceClient();
  if (!client) {
    return { success: false, error: 'LiveKit not configured' };
  }

  try {
    await client.mutePublishedTrack(roomName, participantIdentity, trackSid, muted);
    return { success: true };
  } catch (error) {
    console.error('Failed to mute participant:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Send data to participants in a room
export async function sendData(
  roomName: string,
  data: Uint8Array,
  kind: 'RELIABLE' | 'LOSSY' = 'RELIABLE',
  destinationIdentities?: string[]
): Promise<{ success: boolean; error?: string }> {
  const client = getRoomServiceClient();
  if (!client) {
    return { success: false, error: 'LiveKit not configured' };
  }

  try {
    await client.sendData(roomName, data, kind as any, { destinationIdentities });
    return { success: true };
  } catch (error) {
    console.error('Failed to send data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Generate a unique room name for support calls
export function generateSupportRoomName(userId: string): string {
  const timestamp = Date.now();
  return `support-${userId}-${timestamp}`;
}

// Generate room name for user-to-user calls
export function generateCallRoomName(callerId: string, calleeId: string): string {
  const sorted = [callerId, calleeId].sort();
  return `call-${sorted[0]}-${sorted[1]}-${Date.now()}`;
}
