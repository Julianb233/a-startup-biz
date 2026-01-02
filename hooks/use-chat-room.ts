'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/components/clerk-safe';
import {
  ChatMessage,
  TypingIndicator,
  subscribeToChatRoom,
  sendMessage,
  sendTypingIndicator,
  trackPresence,
  unsubscribeFromChatRoom,
  isRealtimeConfigured,
} from '@/lib/realtime-chat';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseChatRoomOptions {
  roomId: string;
  autoConnect?: boolean;
  loadHistory?: boolean;
  historyLimit?: number;
}

export function useChatRoom({
  roomId,
  autoConnect = true,
  loadHistory = true,
  historyLimit = 100,
}: UseChatRoomOptions) {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [hasMore, setHasMore] = useState(false);

  // Load message history
  const loadMessages = useCallback(async (before?: string) => {
    if (!loadHistory) {
      setIsLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        roomId,
        limit: historyLimit.toString(),
      });

      if (before) {
        params.append('before', before);
      }

      const response = await fetch(`/api/chat/messages?${params}`);
      if (response.ok) {
        const data = await response.json();
        if (before) {
          setMessages((prev) => [...data.messages, ...prev]);
        } else {
          setMessages(data.messages || []);
        }
        setHasMore(data.hasMore || false);
      }
    } catch (err) {
      console.error('Failed to load message history:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, [roomId, loadHistory, historyLimit]);

  // Load more messages (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || messages.length === 0) return;

    const oldestMessage = messages[0];
    await loadMessages(oldestMessage.created_at);
  }, [hasMore, messages, loadMessages]);

  // Connect to realtime
  useEffect(() => {
    if (!autoConnect || !user || !isRealtimeConfigured()) {
      if (!isRealtimeConfigured()) {
        setError('Real-time chat is not configured');
      }
      setIsLoading(false);
      return;
    }

    loadMessages();

    const channel = subscribeToChatRoom(roomId, {
      onMessage: (message) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      },
      onTyping: (indicator) => {
        if (indicator.user_id === user.id) return;

        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (indicator.is_typing) {
            next.add(indicator.user_name);
          } else {
            next.delete(indicator.user_name);
          }
          return next;
        });
      },
      onPresence: ({ joins, leaves }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          joins.forEach((presence: any) => {
            next.add(presence.user_id);
          });
          leaves.forEach((presence: any) => {
            next.delete(presence.user_id);
          });
          return next;
        });
      },
      onError: (error) => {
        setError(error.message);
        setIsConnected(false);
      },
    });

    if (channel) {
      channelRef.current = channel;
      setIsConnected(true);

      // Track presence
      trackPresence(channel, user.id, {
        name: user.fullName || user.username || 'Anonymous',
        avatar: user.imageUrl ?? undefined,
        status: 'online',
      });
    }

    return () => {
      if (channelRef.current) {
        unsubscribeFromChatRoom(channelRef.current);
      }
    };
  }, [roomId, user, autoConnect, loadMessages]);

  // Send message
  const sendChatMessage = useCallback(
    async (content: string, type: ChatMessage['type'] = 'text') => {
      if (!user || !channelRef.current) {
        throw new Error('Not connected');
      }

      const message: Omit<ChatMessage, 'id' | 'created_at'> = {
        room_id: roomId,
        user_id: user.id,
        user_name: user.fullName || user.username || 'Anonymous',
        content,
        type,
      };

      // Optimistically add message
      const optimisticMessage: ChatMessage = {
        ...message,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      // Send to channel
      const result = await sendMessage(channelRef.current, message);

      if (!result.success) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
        throw new Error(result.error || 'Failed to send message');
      } else {
        // Save to database
        try {
          await fetch('/api/chat/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
          });
        } catch (err) {
          console.error('Failed to save message:', err);
        }
      }
    },
    [user, roomId]
  );

  // Send typing indicator
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!user || !channelRef.current) return;

      sendTypingIndicator(channelRef.current, {
        user_id: user.id,
        user_name: user.fullName || user.username || 'Anonymous',
        room_id: roomId,
        is_typing: isTyping,
      });
    },
    [user, roomId]
  );

  // Delete message
  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        const response = await fetch(`/api/chat/messages?id=${messageId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId
                ? { ...m, content: 'This message was deleted', metadata: { ...m.metadata, deleted: true } }
                : m
            )
          );
        }
      } catch (err) {
        console.error('Failed to delete message:', err);
        throw err;
      }
    },
    []
  );

  // Edit message
  const editMessage = useCallback(
    async (messageId: string, content: string) => {
      try {
        const response = await fetch('/api/chat/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: messageId, content }),
        });

        if (response.ok) {
          const { message } = await response.json();
          setMessages((prev) =>
            prev.map((m) => (m.id === messageId ? message : m))
          );
        }
      } catch (err) {
        console.error('Failed to edit message:', err);
        throw err;
      }
    },
    []
  );

  return {
    messages,
    isLoading,
    isConnected,
    error,
    typingUsers: Array.from(typingUsers),
    onlineUsers: Array.from(onlineUsers),
    sendMessage: sendChatMessage,
    sendTyping,
    deleteMessage,
    editMessage,
    loadMore,
    hasMore,
  };
}
