# Real-Time Chat System Documentation

Complete real-time chat system built with Next.js 16, React 19, Supabase Realtime, and Clerk authentication.

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Setup Instructions](#setup-instructions)
5. [Components](#components)
6. [API Routes](#api-routes)
7. [Hooks](#hooks)
8. [Usage Examples](#usage-examples)
9. [Customization](#customization)
10. [Troubleshooting](#troubleshooting)

## Overview

This chat system provides a production-ready, real-time messaging solution with support for:

- Multiple chat room types (support, private, group)
- Real-time message delivery
- Typing indicators
- Presence tracking
- Message history
- File attachments
- Dark mode
- Mobile responsive design

## Features

### Real-Time Communication
- Powered by Supabase Realtime for instant message delivery
- WebSocket-based connections for low latency
- Automatic reconnection on network issues
- Optimistic updates for instant feedback

### User Experience
- Typing indicators show when others are composing
- Presence tracking displays who's online
- Read receipts (optional)
- Message timestamps
- Avatar support
- Smooth animations

### Message Types
- Text messages
- Image attachments
- File attachments
- System notifications

### Persistence
- All messages stored in PostgreSQL
- Message history with pagination
- Room metadata storage
- User preferences

### Authentication & Security
- Clerk integration for user management
- Row-level security
- XSS protection
- CSRF protection

### Design
- Tailwind CSS styling
- Dark mode support
- Responsive design
- Customizable themes

## Architecture

### Tech Stack

```
Frontend:
- Next.js 16.1.0
- React 19.2.3
- TypeScript 5+
- Tailwind CSS 4.1.9
- shadcn/ui components

Backend:
- Next.js API Routes
- Neon PostgreSQL
- Supabase Realtime

Authentication:
- Clerk (@clerk/nextjs 6.36.5)

Real-time:
- Supabase Realtime (@supabase/supabase-js 2.89.0)
```

### Database Schema

```sql
-- Chat Rooms
chat_rooms (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,  -- 'support' | 'private' | 'group'
  description TEXT,
  participants TEXT[] NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Messages
chat_messages (
  id VARCHAR(255) PRIMARY KEY,
  room_id VARCHAR(255) REFERENCES chat_rooms(id),
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50),  -- 'text' | 'image' | 'file' | 'system'
  metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Notifications
chat_notifications (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  room_id VARCHAR(255) REFERENCES chat_rooms(id),
  message_id VARCHAR(255) REFERENCES chat_messages(id),
  type VARCHAR(50),
  content TEXT,
  metadata JSONB,
  read BOOLEAN,
  created_at TIMESTAMP
)
```

## Setup Instructions

### 1. Environment Variables

Add to `.env.local`:

```bash
# Supabase (Required for real-time features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (Required for message storage)
DATABASE_URL=your_postgresql_connection_string

# Clerk (Required for authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 2. Database Setup

Run the setup script:

```bash
npm run db:chat
# or
tsx scripts/setup-chat-db.ts
```

This creates:
- `chat_rooms` table with indexes
- `chat_messages` table with indexes
- `chat_notifications` table with indexes
- Auto-update triggers for timestamps

### 3. Supabase Configuration

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from Settings > API
3. Enable Realtime in Database > Replication (optional)
4. No additional configuration needed - broadcast channels work out of the box

### 4. Install Dependencies

Already included in package.json:

```bash
@supabase/supabase-js@^2.89.0
@clerk/nextjs@^6.36.5
@neondatabase/serverless@^1.0.2
```

## Components

### ChatWidget

Floating chat widget similar to Intercom.

**File:** `/components/chat/ChatWidget.tsx`

```tsx
import { ChatWidget } from '@/components/chat';

<ChatWidget
  position="bottom-right"
  defaultOpen={false}
  minimizable={true}
  welcomeMessage="Hi! How can we help you today?"
  title="Support Chat"
/>
```

**Props:**
- `position`: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
- `defaultOpen`: boolean - Start with widget open
- `minimizable`: boolean - Allow minimizing
- `theme`: 'light' | 'dark' | 'auto'
- `accentColor`: string - Custom accent color
- `welcomeMessage`: string - Initial greeting
- `title`: string - Widget header title

### ChatRoom

Full chat room interface.

**File:** `/components/chat/ChatRoom.tsx`

```tsx
import { ChatRoom } from '@/components/chat';

<ChatRoom
  roomId="general-chat"
  roomName="General Chat"
  roomType="group"
  maxHeight="600px"
  showHeader={true}
  onClose={() => {}}
  onMinimize={() => {}}
/>
```

**Props:**
- `roomId`: string - Unique room identifier
- `roomName`: string - Display name
- `roomType`: 'support' | 'private' | 'group'
- `maxHeight`: string - CSS height value
- `showHeader`: boolean - Show/hide header
- `onClose`: () => void - Close callback
- `onMinimize`: () => void - Minimize callback
- `className`: string - Additional CSS classes

### ChatMessage

Individual message component.

**File:** `/components/chat/ChatMessage.tsx`

```tsx
import { ChatMessage } from '@/components/chat';

<ChatMessage
  message={messageData}
  isOwn={true}
  showAvatar={true}
  userName="John Doe"
  userAvatar="https://..."
/>
```

**Props:**
- `message`: ChatMessage - Message data
- `isOwn`: boolean - Is current user's message
- `showAvatar`: boolean - Display avatar
- `userName`: string - User's display name
- `userAvatar`: string - Avatar URL

### ChatInput

Message input with typing indicators.

**File:** `/components/chat/ChatInput.tsx`

```tsx
import { ChatInput } from '@/components/chat';

<ChatInput
  onSendMessage={(content) => console.log(content)}
  onTyping={(isTyping) => console.log(isTyping)}
  disabled={false}
  placeholder="Type a message..."
  maxLength={2000}
  showAttachments={true}
/>
```

**Props:**
- `onSendMessage`: (content: string, type?: 'text' | 'image' | 'file') => void
- `onTyping`: (isTyping: boolean) => void
- `disabled`: boolean
- `placeholder`: string
- `maxLength`: number
- `showAttachments`: boolean

### ChatHeader

Room header with actions.

**File:** `/components/chat/ChatHeader.tsx`

```tsx
import { ChatHeader } from '@/components/chat';

<ChatHeader
  title="Chat Room"
  subtitle="5 participants"
  onlineCount={5}
  participants={[...]}
  onClose={() => {}}
  onMinimize={() => {}}
  onInfo={() => {}}
/>
```

## API Routes

### POST /api/chat/rooms

Create a new chat room.

**Request:**
```typescript
{
  id: string;
  name: string;
  type: 'support' | 'private' | 'group';
  participants: string[];
  metadata?: object;
}
```

**Response:**
```typescript
{
  room: ChatRoom;
  message: string;
}
```

### GET /api/chat/rooms

List chat rooms for current user.

**Query Params:**
- `type`: 'support' | 'private' | 'group' (optional)
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response:**
```typescript
{
  rooms: ChatRoom[];
  total: number;
}
```

### PATCH /api/chat/rooms

Update a chat room.

**Request:**
```typescript
{
  id: string;
  name?: string;
  participants?: string[];
  metadata?: object;
}
```

### DELETE /api/chat/rooms

Delete a chat room.

**Query Params:**
- `id`: string (required)

### POST /api/chat/messages

Store a new message.

**Request:**
```typescript
{
  room_id: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'system';
  metadata?: object;
}
```

**Response:**
```typescript
{
  message: ChatMessage;
}
```

### GET /api/chat/messages

Get messages for a room.

**Query Params:**
- `roomId`: string (required)
- `limit`: number (default: 100)
- `offset`: number (default: 0)
- `before`: ISO timestamp (for pagination)

**Response:**
```typescript
{
  messages: ChatMessage[];
  total: number;
  hasMore: boolean;
}
```

## Hooks

### useChatRoom

Manage a single chat room.

**File:** `/hooks/use-chat-room.ts`

```tsx
import { useChatRoom } from '@/hooks/use-chat-room';

const {
  messages,
  isLoading,
  isConnected,
  error,
  typingUsers,
  onlineUsers,
  sendMessage,
  sendTyping,
  deleteMessage,
  editMessage,
  loadMore,
  hasMore,
} = useChatRoom({
  roomId: 'general',
  autoConnect: true,
  loadHistory: true,
  historyLimit: 100,
});
```

### useChatRooms

Manage multiple chat rooms.

**File:** `/hooks/use-chat-rooms.ts`

```tsx
import { useChatRooms } from '@/hooks/use-chat-rooms';

const {
  rooms,
  isLoading,
  error,
  createRoom,
  updateRoom,
  deleteRoom,
  refresh,
} = useChatRooms({
  type: 'group',
  autoLoad: true,
  limit: 50,
});
```

## Usage Examples

### Example 1: Site-wide Support Widget

Add to your root layout:

```tsx
// app/layout.tsx
import { ChatWidgetProvider } from '@/components/chat/ChatWidgetProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidgetProvider
          enabled={true}
          position="bottom-right"
          welcomeMessage="Hi! Need help? We're here for you."
          title="Support"
        />
      </body>
    </html>
  );
}
```

### Example 2: Standalone Chat Page

```tsx
// app/chat/page.tsx
import { ChatRoom } from '@/components/chat';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Team Chat</h1>
      <ChatRoom
        roomId="team-general"
        roomName="General"
        roomType="group"
        maxHeight="calc(100vh - 200px)"
      />
    </div>
  );
}
```

### Example 3: Private Chat

```tsx
import { createPrivateRoomId } from '@/lib/realtime-chat';
import { ChatRoom } from '@/components/chat';

const roomId = createPrivateRoomId(currentUserId, otherUserId);

<ChatRoom
  roomId={roomId}
  roomName={otherUserName}
  roomType="private"
/>
```

### Example 4: Using Hooks

```tsx
'use client';

import { useChatRoom } from '@/hooks/use-chat-room';

export function CustomChat() {
  const {
    messages,
    sendMessage,
    typingUsers,
    onlineUsers,
  } = useChatRoom({
    roomId: 'custom-room',
  });

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.currentTarget.value);
          }
        }}
      />
    </div>
  );
}
```

## Customization

### Styling

All components use Tailwind CSS and can be customized:

```tsx
<ChatRoom
  className="border-2 border-primary"
  // Custom styles applied
/>
```

### Message Types

Add custom message types:

```typescript
// In ChatMessage component
case 'custom':
  return <YourCustomRenderer />;
```

### Themes

Components respect your app's theme:

```tsx
// Uses next-themes
<ThemeProvider>
  <ChatWidget /> {/* Auto dark mode */}
</ThemeProvider>
```

## Troubleshooting

### Chat Not Connecting

1. Check Supabase credentials in `.env.local`
2. Verify Realtime is enabled in Supabase dashboard
3. Check browser console for WebSocket errors
4. Ensure `isRealtimeConfigured()` returns true

### Messages Not Persisting

1. Verify `DATABASE_URL` is correct
2. Run database setup script
3. Check API route errors in server logs
4. Verify Clerk authentication is working

### Typing Indicators Not Working

1. Ensure Supabase Realtime is configured
2. Check that broadcast is enabled
3. Verify channel subscription successful
4. Check for WebSocket connection errors

### Performance Issues

1. Limit message history (default 100)
2. Implement pagination for old messages
3. Use message virtualization for large lists
4. Optimize image/file uploads

## File Structure

```
/Users/julianbradley/github-repos/a-startup-biz/
├── components/chat/
│   ├── ChatWidget.tsx          # Floating support widget
│   ├── ChatRoom.tsx            # Full chat interface
│   ├── ChatMessage.tsx         # Individual message
│   ├── ChatInput.tsx           # Message input
│   ├── ChatHeader.tsx          # Room header
│   ├── ChatWidgetProvider.tsx  # Provider wrapper
│   ├── index.ts                # Exports
│   └── README.md               # Component docs
├── app/api/chat/
│   ├── rooms/route.ts          # Room CRUD operations
│   └── messages/route.ts       # Message CRUD operations
├── app/chat/
│   └── page.tsx                # Chat demo page
├── app/examples/chat/
│   ├── page.tsx                # Examples page
│   └── ChatRoomExample.tsx     # Interactive demo
├── lib/
│   ├── realtime-chat.ts        # Core chat library
│   └── chat-types.ts           # TypeScript types
├── hooks/
│   ├── use-chat-room.ts        # Single room hook
│   └── use-chat-rooms.ts       # Multiple rooms hook
└── scripts/
    └── setup-chat-db.ts        # Database setup
```

## Next Steps

1. Add push notifications
2. Implement message reactions
3. Add voice/video calling
4. Create message threads
5. Add file upload to cloud storage
6. Implement message search
7. Add @mentions
8. Create admin moderation tools

## License

MIT
