# Chat System Quick Start Guide

Get your real-time chat system up and running in 5 minutes.

## Step 1: Environment Setup (2 minutes)

Add these variables to your `.env.local` file:

```bash
# Supabase - For real-time features
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Database - For message storage (already configured if using Neon)
DATABASE_URL=postgresql://user:pass@host/database

# Clerk - For authentication (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Get Supabase Credentials:

1. Go to https://supabase.com
2. Create a new project (or use existing)
3. Go to Settings > API
4. Copy your Project URL and anon/public key
5. Paste into `.env.local`

That's it! No other Supabase configuration needed.

## Step 2: Database Setup (1 minute)

Run the setup script to create tables:

```bash
npm run db:chat
```

This creates:
- `chat_rooms` table
- `chat_messages` table
- `chat_notifications` table
- All necessary indexes and triggers

## Step 3: Add Chat Widget (1 minute)

Add the support widget to your root layout:

```tsx
// app/layout.tsx
import { ChatWidgetProvider } from '@/components/chat/ChatWidgetProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidgetProvider enabled={true} />
      </body>
    </html>
  );
}
```

## Step 4: Test It Out (1 minute)

1. Start your dev server: `npm run dev`
2. Open http://localhost:3000
3. Look for the chat bubble in the bottom-right corner
4. Click it and start chatting!

## You're Done!

The chat system is now fully functional with:
- ✅ Real-time messaging
- ✅ Typing indicators
- ✅ Presence tracking
- ✅ Message history
- ✅ Dark mode support
- ✅ Mobile responsive

## Next Steps

### Add a Chat Page

Create a dedicated chat page:

```tsx
// app/chat/page.tsx
import { ChatRoom } from '@/components/chat';

export default function ChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Team Chat</h1>
      <ChatRoom
        roomId="general"
        roomName="General Chat"
        roomType="group"
        maxHeight="600px"
      />
    </div>
  );
}
```

### Use Custom Hooks

For more control, use the hooks:

```tsx
'use client';

import { useChatRoom } from '@/hooks/use-chat-room';

export function MyChat() {
  const { messages, sendMessage, typingUsers } = useChatRoom({
    roomId: 'custom',
  });

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

### Customize Styling

All components use Tailwind CSS:

```tsx
<ChatWidget
  position="bottom-left"
  accentColor="#ff6b6b"
  welcomeMessage="Hey! What's up?"
/>
```

## Troubleshooting

### Chat won't connect?
- Check Supabase credentials in `.env.local`
- Verify your Supabase project is active
- Check browser console for errors

### Messages not saving?
- Run `npm run db:chat` to create tables
- Verify `DATABASE_URL` is correct
- Check server logs for errors

### Need help?
- Read full docs: `/CHAT_SYSTEM.md`
- Check examples: `/app/examples/chat/page.tsx`
- Review component docs: `/components/chat/README.md`

## Common Use Cases

### 1. Customer Support Widget
```tsx
<ChatWidgetProvider
  enabled={true}
  position="bottom-right"
  title="Support"
/>
```

### 2. Team Collaboration
```tsx
<ChatRoom
  roomId="team-eng"
  roomName="Engineering"
  roomType="group"
/>
```

### 3. Private Messaging
```tsx
import { createPrivateRoomId } from '@/lib/realtime-chat';

const roomId = createPrivateRoomId(user1, user2);
<ChatRoom roomId={roomId} roomType="private" />
```

## File Locations

- Components: `/components/chat/`
- API Routes: `/app/api/chat/`
- Hooks: `/hooks/use-chat-*.ts`
- Types: `/lib/chat-types.ts`
- Core Library: `/lib/realtime-chat.ts`
- Setup Script: `/scripts/setup-chat-db.ts`

Happy chatting! 🎉
