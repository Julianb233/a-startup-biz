'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  ChatMessage as ChatMessageType,
  TypingIndicator,
  subscribeToChatRoom,
  sendMessage,
  sendTypingIndicator,
  trackPresence,
  unsubscribeFromChatRoom,
  isRealtimeConfigured,
} from '@/lib/realtime-chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ChatRoomProps {
  roomId: string;
  roomName: string;
  roomType?: 'support' | 'private' | 'group';
  onClose?: () => void;
  onMinimize?: () => void;
  className?: string;
  showHeader?: boolean;
  maxHeight?: string;
}

export function ChatRoom({
  roomId,
  roomName,
  roomType = 'group',
  onClose,
  onMinimize,
  className,
  showHeader = true,
  maxHeight = '600px',
}: ChatRoomProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load message history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (err) {
        console.error('Failed to load message history:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [roomId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user || !isRealtimeConfigured()) {
      setError('Real-time chat is not configured');
      setIsLoading(false);
      return;
    }

    const channel = subscribeToChatRoom(roomId, {
      onMessage: (message) => {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
        scrollToBottom();
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
        avatar: user.imageUrl,
        status: 'online',
      });
    }

    return () => {
      if (channelRef.current) {
        unsubscribeFromChatRoom(channelRef.current);
      }
    };
  }, [roomId, user, scrollToBottom]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!user || !channelRef.current) return;

    const message: Omit<ChatMessageType, 'id' | 'created_at'> = {
      room_id: roomId,
      user_id: user.id,
      user_name: user.fullName || user.username || 'Anonymous',
      content,
      type,
    };

    // Optimistically add message
    const optimisticMessage: ChatMessageType = {
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
      setError(result.error || 'Failed to send message');
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
  };

  const handleTyping = (isTyping: boolean) => {
    if (!user || !channelRef.current) return;

    sendTypingIndicator(channelRef.current, {
      user_id: user.id,
      user_name: user.fullName || user.username || 'Anonymous',
      room_id: roomId,
      is_typing: isTyping,
    });
  };

  if (!isRealtimeConfigured()) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            Real-time chat is not configured. Please set up Supabase credentials.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col bg-background rounded-lg border', className)}>
      {showHeader && (
        <ChatHeader
          title={roomName}
          subtitle={roomType === 'support' ? 'Support Team' : undefined}
          onlineCount={onlineUsers.size}
          onClose={onClose}
          onMinimize={onMinimize}
        />
      )}

      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 px-4"
        style={{ height: maxHeight }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-muted-foreground">No messages yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start the conversation by sending a message
            </p>
          </div>
        ) : (
          <div className="py-4">
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const showAvatar =
                !prevMessage || prevMessage.user_id !== message.user_id;

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwn={message.user_id === user?.id}
                  showAvatar={showAvatar}
                  userName={message.user_name}
                />
              );
            })}
            {typingUsers.size > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground px-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>
                  {Array.from(typingUsers).join(', ')}{' '}
                  {typingUsers.size === 1 ? 'is' : 'are'} typing...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!isConnected}
        placeholder={
          isConnected ? 'Type a message...' : 'Connecting...'
        }
      />
    </div>
  );
}
