'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { ChatRoom } from '@/lib/realtime-chat';

interface UseChatRoomsOptions {
  type?: 'support' | 'private' | 'group';
  autoLoad?: boolean;
  limit?: number;
}

export function useChatRooms({
  type,
  autoLoad = true,
  limit = 50,
}: UseChatRoomsOptions = {}) {
  const { user } = useUser();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load rooms
  const loadRooms = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`/api/chat/rooms?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      } else {
        throw new Error('Failed to load rooms');
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
      setError(err instanceof Error ? err.message : 'Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  }, [user, type, limit]);

  // Create room
  const createRoom = useCallback(
    async (room: Omit<ChatRoom, 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Not authenticated');

      try {
        const response = await fetch('/api/chat/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(room),
        });

        if (response.ok) {
          const { room: newRoom } = await response.json();
          setRooms((prev) => [newRoom, ...prev]);
          return newRoom;
        } else {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create room');
        }
      } catch (err) {
        console.error('Failed to create room:', err);
        throw err;
      }
    },
    [user]
  );

  // Update room
  const updateRoom = useCallback(
    async (roomId: string, updates: Partial<ChatRoom>) => {
      if (!user) throw new Error('Not authenticated');

      try {
        const response = await fetch('/api/chat/rooms', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: roomId, ...updates }),
        });

        if (response.ok) {
          const { room: updatedRoom } = await response.json();
          setRooms((prev) =>
            prev.map((r) => (r.id === roomId ? updatedRoom : r))
          );
          return updatedRoom;
        } else {
          throw new Error('Failed to update room');
        }
      } catch (err) {
        console.error('Failed to update room:', err);
        throw err;
      }
    },
    [user]
  );

  // Delete room
  const deleteRoom = useCallback(
    async (roomId: string) => {
      if (!user) throw new Error('Not authenticated');

      try {
        const response = await fetch(`/api/chat/rooms?id=${roomId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRooms((prev) => prev.filter((r) => r.id !== roomId));
        } else {
          throw new Error('Failed to delete room');
        }
      } catch (err) {
        console.error('Failed to delete room:', err);
        throw err;
      }
    },
    [user]
  );

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad && user) {
      loadRooms();
    }
  }, [autoLoad, user, loadRooms]);

  return {
    rooms,
    isLoading,
    error,
    createRoom,
    updateRoom,
    deleteRoom,
    refresh: loadRooms,
  };
}
