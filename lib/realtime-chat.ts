import { createClient, RealtimeChannel } from '@supabase/supabase-js';

// Supabase client for realtime features
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client only if credentials are available
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'support' | 'private' | 'group';
  participants: string[];
  created_at: string;
  updated_at: string;
}

export interface TypingIndicator {
  user_id: string;
  user_name: string;
  room_id: string;
  is_typing: boolean;
}

// Check if realtime is configured
export function isRealtimeConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// Subscribe to a chat room
export function subscribeToChatRoom(
  roomId: string,
  callbacks: {
    onMessage?: (message: ChatMessage) => void;
    onTyping?: (indicator: TypingIndicator) => void;
    onPresence?: (presence: { joins: any; leaves: any }) => void;
    onError?: (error: Error) => void;
  }
): RealtimeChannel | null {
  if (!supabase) {
    console.warn('Supabase not configured - chat subscription not created');
    return null;
  }

  const channel = supabase.channel(`chat:${roomId}`, {
    config: {
      presence: {
        key: roomId,
      },
    },
  });

  // Listen for new messages
  channel.on(
    'broadcast',
    { event: 'message' },
    (payload) => {
      if (callbacks.onMessage) {
        callbacks.onMessage(payload.payload as ChatMessage);
      }
    }
  );

  // Listen for typing indicators
  channel.on(
    'broadcast',
    { event: 'typing' },
    (payload) => {
      if (callbacks.onTyping) {
        callbacks.onTyping(payload.payload as TypingIndicator);
      }
    }
  );

  // Listen for presence changes
  channel.on('presence', { event: 'sync' }, () => {
    const state = channel.presenceState();
    console.log('Presence state:', state);
  });

  channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
    if (callbacks.onPresence) {
      callbacks.onPresence({ joins: newPresences, leaves: [] });
    }
  });

  channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    if (callbacks.onPresence) {
      callbacks.onPresence({ joins: [], leaves: leftPresences });
    }
  });

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log(`Subscribed to chat room: ${roomId}`);
    } else if (status === 'CHANNEL_ERROR') {
      if (callbacks.onError) {
        callbacks.onError(new Error('Failed to subscribe to chat room'));
      }
    }
  });

  return channel;
}

// Send a message to a chat room
export async function sendMessage(
  channel: RealtimeChannel,
  message: Omit<ChatMessage, 'id' | 'created_at'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const fullMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    await channel.send({
      type: 'broadcast',
      event: 'message',
      payload: fullMessage,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Send typing indicator
export async function sendTypingIndicator(
  channel: RealtimeChannel,
  indicator: TypingIndicator
): Promise<void> {
  try {
    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: indicator,
    });
  } catch (error) {
    console.error('Failed to send typing indicator:', error);
  }
}

// Track presence in a room
export async function trackPresence(
  channel: RealtimeChannel,
  userId: string,
  userData: { name: string; avatar?: string; status?: string }
): Promise<void> {
  try {
    await channel.track({
      user_id: userId,
      ...userData,
      online_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to track presence:', error);
  }
}

// Unsubscribe from a chat room
export function unsubscribeFromChatRoom(channel: RealtimeChannel): void {
  channel.unsubscribe();
}

// Create a support chat room
export function createSupportRoomId(userId: string): string {
  return `support-${userId}-${Date.now()}`;
}

// Create a private chat room between two users
export function createPrivateRoomId(userId1: string, userId2: string): string {
  const sorted = [userId1, userId2].sort();
  return `private-${sorted[0]}-${sorted[1]}`;
}

export { supabase };
