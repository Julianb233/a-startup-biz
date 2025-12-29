'use client';

import { useState } from 'react';
import { ChatRoom } from '@/components/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ChatRoomExample() {
  const [roomId, setRoomId] = useState('example-chat');
  const [roomName, setRoomName] = useState('Example Chat');
  const [roomType, setRoomType] = useState<'support' | 'private' | 'group'>('group');
  const [maxHeight, setMaxHeight] = useState('500px');
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-6 border rounded-lg bg-card space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="roomId">Room ID</Label>
            <Input
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="example-chat"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Example Chat"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type</Label>
            <Select value={roomType} onValueChange={(value: any) => setRoomType(value)}>
              <SelectTrigger id="roomType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="group">Group Chat</SelectItem>
                <SelectItem value="private">Private Chat</SelectItem>
                <SelectItem value="support">Support Chat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxHeight">Max Height</Label>
            <Input
              id="maxHeight"
              value={maxHeight}
              onChange={(e) => setMaxHeight(e.target.value)}
              placeholder="500px"
            />
          </div>
        </div>

        <Button onClick={() => setShowDemo(!showDemo)} className="w-full">
          {showDemo ? 'Hide Demo' : 'Show Demo'}
        </Button>
      </div>

      {showDemo && (
        <div className="border rounded-lg overflow-hidden">
          <ChatRoom
            roomId={roomId}
            roomName={roomName}
            roomType={roomType}
            maxHeight={maxHeight}
          />
        </div>
      )}

      {showDemo && (
        <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
          <p className="font-semibold">Current Configuration:</p>
          <pre className="overflow-x-auto">
            <code>{`<ChatRoom
  roomId="${roomId}"
  roomName="${roomName}"
  roomType="${roomType}"
  maxHeight="${maxHeight}"
/>`}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
