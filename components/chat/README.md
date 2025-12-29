# Real-Time Chat System

A complete real-time chat system built with Next.js, Supabase Realtime, and Clerk authentication.

## Features

- **Real-time messaging** - Powered by Supabase Realtime for instant message delivery
- **Typing indicators** - See when other users are composing messages
- **Presence tracking** - Know who's online in the chat room
- **Message types** - Support for text, images, and file attachments
- **Message history** - All messages stored in PostgreSQL database
- **Dark mode** - Full support for light/dark themes
- **Responsive design** - Works on mobile, tablet, and desktop
- **Authentication** - Integrated with Clerk for user management
- **Optimistic updates** - Messages appear instantly before server confirmation

## Components

### ChatWidget

A floating chat widget similar to Intercom for support conversations.

```tsx
import { ChatWidget } from '@/components/chat';

<ChatWidget
  position="bottom-right"
  defaultOpen={false}
  welcomeMessage="Hi! How can we help you today?"
  title="Support Chat"
/>
```

Props:
- `position`: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
- `defaultOpen`: boolean
- `minimizable`: boolean
- `welcomeMessage`: string
- `title`: string

### ChatRoom

A full chat room interface for conversations.

```tsx
import { ChatRoom } from '@/components/chat';

<ChatRoom
  roomId="general-chat"
  roomName="General Chat"
  roomType="group"
  maxHeight="600px"
/>
```

Props:
- `roomId`: string (unique identifier)
- `roomName`: string
- `roomType`: 'support' | 'private' | 'group'
- `onClose`: () => void
- `onMinimize`: () => void
- `showHeader`: boolean
- `maxHeight`: string

### ChatMessage

Individual message component with different types.

```tsx
import { ChatMessage } from '@/components/chat';

<ChatMessage
  message={messageData}
  isOwn={true}
  showAvatar={true}
/>
```

### ChatInput

Message input with typing indicators and file attachments.

```tsx
import { ChatInput } from '@/components/chat';

<ChatInput
  onSendMessage={(content) => console.log(content)}
  onTyping={(isTyping) => console.log(isTyping)}
  placeholder="Type a message..."
/>
```

### ChatHeader

Room header with participant info and actions.

```tsx
import { ChatHeader } from '@/components/chat';

<ChatHeader
  title="Chat Room"
  onlineCount={5}
  onClose={() => {}}
/>
```

## Setup

### 1. Environment Variables

Add these to your `.env.local`:

```bash
# Supabase (for real-time features)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (for message storage)
DATABASE_URL=your_postgresql_url

# Clerk (for authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### 2. Database Setup

The API routes will automatically create the necessary tables:

- `chat_rooms` - Stores chat room information
- `chat_messages` - Stores message history

Tables are created on first API call.

### 3. Supabase Configuration

1. Create a Supabase project
2. Enable Realtime for your database
3. Get your project URL and anon key
4. Add to environment variables

No additional Supabase configuration needed - we use broadcast channels which work out of the box.

## Usage Examples

### Add Chat Widget to Your App

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
          welcomeMessage="Hi! How can we help?"
        />
      </body>
    </html>
  );
}
```

### Create a Standalone Chat Page

```tsx
// app/chat/page.tsx
import { ChatRoom } from '@/components/chat';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <ChatRoom
        roomId="general"
        roomName="General Chat"
        roomType="group"
      />
    </div>
  );
}
```

### Private Chat Between Users

```tsx
import { createPrivateRoomId } from '@/lib/realtime-chat';
import { ChatRoom } from '@/components/chat';

const roomId = createPrivateRoomId(userId1, userId2);

<ChatRoom
  roomId={roomId}
  roomName="Private Chat"
  roomType="private"
/>
```

## API Routes

### POST /api/chat/rooms

Create a new chat room.

```typescript
const response = await fetch('/api/chat/rooms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'room-123',
    name: 'My Room',
    type: 'group',
    participants: ['user1', 'user2'],
    metadata: {}
  })
});
```

### GET /api/chat/rooms

Get chat rooms for current user.

```typescript
const response = await fetch('/api/chat/rooms?type=support&limit=50');
const { rooms } = await response.json();
```

### POST /api/chat/messages

Store a new message.

```typescript
const response = await fetch('/api/chat/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    room_id: 'room-123',
    content: 'Hello world',
    type: 'text',
    metadata: {}
  })
});
```

### GET /api/chat/messages

Get messages for a room.

```typescript
const response = await fetch('/api/chat/messages?roomId=room-123&limit=100');
const { messages } = await response.json();
```

## Customization

### Styling

All components use Tailwind CSS and respect your design system:

- Uses `cn()` utility for class merging
- Supports dark mode via `next-themes`
- Uses shadcn/ui components (Avatar, Button, ScrollArea, etc.)
- Fully responsive with mobile-first design

### Message Types

Support for different message types:

- `text` - Regular text messages
- `image` - Image attachments
- `file` - File attachments
- `system` - System notifications

### Typing Indicators

Typing indicators automatically show when users are composing:

```typescript
// Triggered automatically by ChatInput
// Shows "User is typing..." for 2 seconds after last keystroke
```

### Presence Tracking

Track who's online in the room:

```typescript
// Automatically tracked when user joins room
// Updates in real-time via Supabase presence
```

## Performance

- **Optimistic updates** - Messages appear instantly
- **Auto-scroll** - Smooth scrolling to new messages
- **Message pagination** - Load older messages on demand
- **Connection management** - Auto-reconnect on network issues
- **Memory efficient** - Unsubscribes from channels on unmount

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Chat not connecting?

1. Check Supabase credentials in `.env.local`
2. Verify Realtime is enabled in Supabase
3. Check browser console for errors

### Messages not persisting?

1. Verify DATABASE_URL is set correctly
2. Check database connection
3. Look for API errors in server logs

### Typing indicators not working?

1. Ensure Supabase Realtime is configured
2. Check that broadcast is enabled
3. Verify channel subscription is successful

## Security

- All API routes require Clerk authentication
- Users can only access rooms they're participants in
- Message history requires room access verification
- XSS protection via proper escaping
- CSRF protection via Clerk tokens

## Future Enhancements

- [ ] Voice messages
- [ ] Video calls integration
- [ ] Message reactions/emojis
- [ ] Message threads/replies
- [ ] Read receipts
- [ ] Message search
- [ ] @mentions
- [ ] File upload to cloud storage
- [ ] Message encryption
- [ ] Push notifications

## License

MIT
