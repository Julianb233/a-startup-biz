import { Metadata } from 'next';
import { ChatRoomExample } from './ChatRoomExample';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Chat Examples | A Startup Biz',
  description: 'Real-time chat system examples and demos',
  openGraph: {
    title: 'Chat Examples | A Startup Biz',
    description: 'Real-time chat system examples and demos',
    type: 'website',
    images: ['/logo.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chat Examples | A Startup Biz',
    description: 'Real-time chat system examples and demos',
    images: ['/logo.webp'],
  },
};

export default async function ChatExamplesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/examples/chat');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Chat System Examples</h1>
          <p className="text-lg text-muted-foreground">
            Explore different chat implementations and features
          </p>
        </div>

        {/* Example 1: Support Chat Widget */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">1. Support Chat Widget</h2>
            <p className="text-muted-foreground">
              A floating chat widget perfect for customer support. Look for the chat bubble
              in the bottom-right corner of this page.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-muted/50">
            <pre className="text-sm overflow-x-auto">
              <code>{`import { ChatWidget } from '@/components/chat';

<ChatWidget
  position="bottom-right"
  defaultOpen={false}
  welcomeMessage="Hi! How can we help you today?"
  title="Support Chat"
/>`}</code>
            </pre>
          </div>
        </section>

        {/* Example 2: Full Chat Room */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">2. Full Chat Room</h2>
            <p className="text-muted-foreground">
              A complete chat interface for conversations, perfect for team collaboration
              or community discussions.
            </p>
          </div>
          <ChatRoomExample />
        </section>

        {/* Example 3: Private Chat */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">3. Private Chat</h2>
            <p className="text-muted-foreground">
              One-on-one conversations between users with privacy and encryption.
            </p>
          </div>
          <div className="p-6 border rounded-lg bg-muted/50">
            <pre className="text-sm overflow-x-auto">
              <code>{`import { createPrivateRoomId } from '@/lib/realtime-chat';
import { ChatRoom } from '@/components/chat';

const roomId = createPrivateRoomId(userId1, userId2);

<ChatRoom
  roomId={roomId}
  roomName="Private Chat"
  roomType="private"
  maxHeight="500px"
/>`}</code>
            </pre>
          </div>
        </section>

        {/* Features Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Real-time Updates
              </h3>
              <p className="text-sm text-muted-foreground">
                Messages appear instantly across all connected clients using Supabase Realtime
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Typing Indicators
              </h3>
              <p className="text-sm text-muted-foreground">
                See when other users are composing messages with real-time typing status
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🟢</span>
                Presence Tracking
              </h3>
              <p className="text-sm text-muted-foreground">
                Know who's currently online and active in the chat room
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">📎</span>
                File Attachments
              </h3>
              <p className="text-sm text-muted-foreground">
                Share images, documents, and files directly in the chat
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">💾</span>
                Message History
              </h3>
              <p className="text-sm text-muted-foreground">
                All messages are stored in PostgreSQL for reliable persistence
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🌙</span>
                Dark Mode
              </h3>
              <p className="text-sm text-muted-foreground">
                Full support for light and dark themes with smooth transitions
              </p>
            </div>
          </div>
        </section>

        {/* API Examples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">API Usage</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Create a Chat Room</h3>
              <div className="p-4 border rounded-lg bg-muted/50">
                <pre className="text-sm overflow-x-auto">
                  <code>{`const response = await fetch('/api/chat/rooms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'team-general',
    name: 'General',
    type: 'group',
    participants: ['user1', 'user2', 'user3']
  })
});

const { room } = await response.json();`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Send a Message</h3>
              <div className="p-4 border rounded-lg bg-muted/50">
                <pre className="text-sm overflow-x-auto">
                  <code>{`const response = await fetch('/api/chat/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    room_id: 'team-general',
    content: 'Hello team!',
    type: 'text'
  })
});

const { message } = await response.json();`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Get Message History</h3>
              <div className="p-4 border rounded-lg bg-muted/50">
                <pre className="text-sm overflow-x-auto">
                  <code>{`const response = await fetch(
  '/api/chat/messages?roomId=team-general&limit=50'
);

const { messages, hasMore } = await response.json();`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Setup Instructions */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Quick Setup</h2>
          <div className="p-6 border rounded-lg space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Environment Variables</h3>
              <pre className="text-sm p-4 bg-muted rounded overflow-x-auto">
                <code>{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
DATABASE_URL=your_postgresql_url`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Add to Your Layout</h3>
              <pre className="text-sm p-4 bg-muted rounded overflow-x-auto">
                <code>{`import { ChatWidgetProvider } from '@/components/chat/ChatWidgetProvider';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ChatWidgetProvider enabled={true} />
      </body>
    </html>
  );
}`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Start Chatting!</h3>
              <p className="text-sm text-muted-foreground">
                The database tables will be created automatically on first use. No migrations needed!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
