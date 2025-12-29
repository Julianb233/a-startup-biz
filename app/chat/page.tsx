import { Metadata } from 'next';
import { ChatRoom } from '@/components/chat';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Chat | A Startup Biz',
  description: 'Real-time chat with our team',
};

export default async function ChatPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/chat');
  }

  // Create a general chat room ID
  const roomId = 'general-chat';

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Chat</h1>
          <p className="text-muted-foreground mt-2">
            Connect with our team and other users in real-time
          </p>
        </div>

        <div className="grid gap-6">
          <ChatRoom
            roomId={roomId}
            roomName="General Chat"
            roomType="group"
            maxHeight="calc(100vh - 300px)"
          />
        </div>

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Chat Features</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Real-time messaging powered by Supabase Realtime</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Typing indicators to see when others are composing messages</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Presence tracking to see who's online</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Support for text, images, and file attachments</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Message history stored in PostgreSQL</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span>Dark mode support with Tailwind CSS</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
