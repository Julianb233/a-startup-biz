/**
 * Chat System Type Definitions
 *
 * Centralized type definitions for the real-time chat system
 */

export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: {
    filename?: string;
    fileSize?: number;
    mimeType?: string;
    read?: boolean;
    deleted?: boolean;
    edited?: boolean;
    editedAt?: string;
    reactions?: ChatReaction[];
    replyTo?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'support' | 'private' | 'group';
  description?: string;
  participants: string[];
  metadata?: {
    avatar?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unreadCount?: number;
    isPinned?: boolean;
    isMuted?: boolean;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface TypingIndicator {
  user_id: string;
  user_name: string;
  room_id: string;
  is_typing: boolean;
  timestamp?: string;
}

export interface PresenceInfo {
  user_id: string;
  user_name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  online_at?: string;
  metadata?: Record<string, any>;
}

export interface ChatReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface ChatNotification {
  id: string;
  type: 'new_message' | 'mention' | 'room_invite' | 'user_joined' | 'user_left';
  room_id: string;
  message?: ChatMessage;
  actor?: ChatUser;
  timestamp: string;
  read: boolean;
}

export interface ChatSettings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    mentions: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
  privacy: {
    readReceipts: boolean;
    typingIndicators: boolean;
    lastSeen: boolean;
  };
}

export interface ChatError {
  code: string;
  message: string;
  details?: any;
}

export interface ChatRoomFilters {
  type?: 'support' | 'private' | 'group';
  search?: string;
  isPinned?: boolean;
  hasUnread?: boolean;
}

export interface MessageFilters {
  roomId: string;
  type?: 'text' | 'image' | 'file' | 'system';
  before?: string;
  after?: string;
  search?: string;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface ChatStats {
  totalMessages: number;
  totalRooms: number;
  activeUsers: number;
  messagesPerDay: number;
  averageResponseTime: number;
}

// API Response Types
export interface CreateRoomResponse {
  room: ChatRoom;
  message: string;
}

export interface GetRoomsResponse {
  rooms: ChatRoom[];
  total: number;
}

export interface CreateMessageResponse {
  message: ChatMessage;
}

export interface GetMessagesResponse {
  messages: ChatMessage[];
  total: number;
  hasMore: boolean;
}

// WebSocket Event Types
export type ChatEvent =
  | { type: 'message'; payload: ChatMessage }
  | { type: 'typing'; payload: TypingIndicator }
  | { type: 'presence'; payload: { joins: PresenceInfo[]; leaves: PresenceInfo[] } }
  | { type: 'room_updated'; payload: ChatRoom }
  | { type: 'message_deleted'; payload: { messageId: string; roomId: string } }
  | { type: 'message_edited'; payload: ChatMessage }
  | { type: 'error'; payload: ChatError };

// Hook Return Types
export interface UseChatRoomReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: ChatError | null;
  isConnected: boolean;
  typingUsers: string[];
  onlineUsers: string[];
  sendMessage: (content: string, type?: ChatMessage['type']) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export interface UseChatRoomsReturn {
  rooms: ChatRoom[];
  isLoading: boolean;
  error: ChatError | null;
  createRoom: (room: Partial<ChatRoom>) => Promise<ChatRoom>;
  updateRoom: (roomId: string, updates: Partial<ChatRoom>) => Promise<ChatRoom>;
  deleteRoom: (roomId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

// Component Props Types
export interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  defaultOpen?: boolean;
  minimizable?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  accentColor?: string;
  welcomeMessage?: string;
  title?: string;
  onOpen?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
}

export interface ChatRoomProps {
  roomId: string;
  roomName: string;
  roomType?: 'support' | 'private' | 'group';
  onClose?: () => void;
  onMinimize?: () => void;
  className?: string;
  showHeader?: boolean;
  maxHeight?: string;
}

export interface ChatMessageProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar?: boolean;
  userName?: string;
  userAvatar?: string;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export interface ChatInputProps {
  onSendMessage: (content: string, type?: ChatMessage['type']) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  showAttachments?: boolean;
  autoFocus?: boolean;
}

export interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  participants?: ChatUser[];
  onlineCount?: number;
  onClose?: () => void;
  onMinimize?: () => void;
  onInfo?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  showActions?: boolean;
  className?: string;
}
