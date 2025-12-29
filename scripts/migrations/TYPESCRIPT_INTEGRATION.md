# TypeScript Integration Guide for Voice Calls Schema

## Overview

This guide shows how to integrate the enhanced voice calls database schema into your TypeScript/Next.js application with full type safety.

## Table of Contents
1. [Type Definitions](#type-definitions)
2. [Supabase Client Setup](#supabase-client-setup)
3. [CRUD Operations](#crud-operations)
4. [LiveKit Integration](#livekit-integration)
5. [React Hooks](#react-hooks)
6. [Error Handling](#error-handling)

## Type Definitions

Create `/types/voice-calls.ts`:

```typescript
// Enum types matching database
export type CallStatus = 'pending' | 'active' | 'completed' | 'failed';
export type MessageRole = 'user' | 'assistant' | 'system';
export type ParticipantType = 'user' | 'agent' | 'admin';

// Database table types
export interface VoiceCall {
  id: string;
  user_id: string | null;
  session_id: string;
  room_name: string;
  status: CallStatus;
  started_at: string | null;
  connected_at: string | null;
  ended_at: string | null;
  duration_seconds: number | null;
  recording_url: string | null;
  transcript: string | null;
  ai_agent_used: boolean;
  agent_identity: string | null;
  metadata: Record<string, any>;
  total_tokens_used: number;
  created_at: string;
  updated_at: string;
}

export interface VoiceMessage {
  id: string;
  call_id: string;
  role: MessageRole;
  content: string;
  audio_url: string | null;
  audio_duration_ms: number | null;
  timestamp: string;
  sequence_number: number | null;
  tokens_used: number;
  model_used: string | null;
  metadata: Record<string, any>;
}

export interface CallParticipant {
  id: string;
  call_id: string;
  user_id: string | null;
  participant_identity: string;
  participant_name: string | null;
  participant_type: ParticipantType;
  joined_at: string;
  left_at: string | null;
  duration_seconds: number | null;
  is_muted: boolean;
  metadata: Record<string, any>;
}

// View types
export interface ActiveCallSummary {
  id: string;
  session_id: string;
  room_name: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  status: CallStatus;
  started_at: string | null;
  ai_agent_used: boolean;
  participant_count: number;
  participants: string[];
}

export interface CallAnalytics {
  id: string;
  session_id: string;
  user_id: string | null;
  status: CallStatus;
  duration_seconds: number | null;
  ai_agent_used: boolean;
  total_tokens_used: number;
  message_count: number;
  user_message_count: number;
  assistant_message_count: number;
  created_at: string;
  ended_at: string | null;
}

// Insert types (fields required for creation)
export type VoiceCallInsert = Pick<
  VoiceCall,
  'user_id' | 'session_id' | 'room_name'
> & Partial<Omit<VoiceCall, 'id' | 'created_at' | 'updated_at'>>;

export type VoiceMessageInsert = Pick<
  VoiceMessage,
  'call_id' | 'role' | 'content'
> & Partial<Omit<VoiceMessage, 'id' | 'timestamp'>>;

export type CallParticipantInsert = Pick<
  CallParticipant,
  'call_id' | 'participant_identity'
> & Partial<Omit<CallParticipant, 'id' | 'joined_at'>>;

// Update types (all fields optional)
export type VoiceCallUpdate = Partial<
  Omit<VoiceCall, 'id' | 'created_at' | 'updated_at'>
>;

export type VoiceMessageUpdate = Partial<
  Omit<VoiceMessage, 'id' | 'call_id' | 'timestamp'>
>;

export type CallParticipantUpdate = Partial<
  Omit<CallParticipant, 'id' | 'call_id' | 'joined_at'>
>;
```

## Supabase Client Setup

Create `/lib/supabase/voice-calls.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type {
  VoiceCall,
  VoiceMessage,
  CallParticipant,
  VoiceCallInsert,
  VoiceMessageInsert,
  CallParticipantInsert,
  VoiceCallUpdate,
  ActiveCallSummary,
  CallAnalytics,
} from '@/types/voice-calls';

// Extend Supabase Database type
export interface Database {
  public: {
    Tables: {
      voice_calls: {
        Row: VoiceCall;
        Insert: VoiceCallInsert;
        Update: VoiceCallUpdate;
      };
      voice_messages: {
        Row: VoiceMessage;
        Insert: VoiceMessageInsert;
        Update: Partial<VoiceMessage>;
      };
      call_participants: {
        Row: CallParticipant;
        Insert: CallParticipantInsert;
        Update: Partial<CallParticipant>;
      };
    };
    Views: {
      active_calls_summary: {
        Row: ActiveCallSummary;
      };
      call_analytics: {
        Row: CallAnalytics;
      };
    };
  };
}

// Type-safe Supabase client
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## CRUD Operations

### Voice Calls Service

Create `/lib/services/voice-calls-service.ts`:

```typescript
import { supabase } from '@/lib/supabase/voice-calls';
import type {
  VoiceCall,
  VoiceCallInsert,
  VoiceCallUpdate,
  CallStatus,
  ActiveCallSummary,
} from '@/types/voice-calls';

export class VoiceCallsService {
  /**
   * Create a new voice call
   */
  static async createCall(
    data: VoiceCallInsert
  ): Promise<{ data: VoiceCall | null; error: Error | null }> {
    try {
      const { data: call, error } = await supabase
        .from('voice_calls')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return { data: call, error: null };
    } catch (error) {
      console.error('Failed to create call:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get call by ID
   */
  static async getCall(
    callId: string
  ): Promise<{ data: VoiceCall | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('voice_calls')
        .select('*')
        .eq('id', callId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get call by session ID (LiveKit room)
   */
  static async getCallBySession(
    sessionId: string
  ): Promise<{ data: VoiceCall | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('voice_calls')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update call
   */
  static async updateCall(
    callId: string,
    updates: VoiceCallUpdate
  ): Promise<{ data: VoiceCall | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('voice_calls')
        .update(updates)
        .eq('id', callId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update call status
   */
  static async updateStatus(
    callId: string,
    status: CallStatus
  ): Promise<{ data: VoiceCall | null; error: Error | null }> {
    const updates: VoiceCallUpdate = { status };

    // Auto-set timestamps based on status
    if (status === 'active' && !updates.connected_at) {
      updates.connected_at = new Date().toISOString();
    } else if (status === 'completed' || status === 'failed') {
      updates.ended_at = new Date().toISOString();
    }

    return this.updateCall(callId, updates);
  }

  /**
   * Get user's call history
   */
  static async getUserCalls(
    userId: string,
    limit = 20
  ): Promise<{ data: VoiceCall[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('voice_calls')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * Get active calls
   */
  static async getActiveCalls(): Promise<{
    data: ActiveCallSummary[];
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('active_calls_summary')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * Delete call (cascade deletes messages and participants)
   */
  static async deleteCall(
    callId: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { error } = await supabase
        .from('voice_calls')
        .delete()
        .eq('id', callId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}
```

### Voice Messages Service

Create `/lib/services/voice-messages-service.ts`:

```typescript
import { supabase } from '@/lib/supabase/voice-calls';
import type {
  VoiceMessage,
  VoiceMessageInsert,
  MessageRole,
} from '@/types/voice-calls';

export class VoiceMessagesService {
  /**
   * Add message to call
   */
  static async addMessage(
    data: VoiceMessageInsert
  ): Promise<{ data: VoiceMessage | null; error: Error | null }> {
    try {
      // Get next sequence number for this call
      const { count } = await supabase
        .from('voice_messages')
        .select('*', { count: 'exact', head: true })
        .eq('call_id', data.call_id);

      const messageData = {
        ...data,
        sequence_number: (count || 0) + 1,
      };

      const { data: message, error } = await supabase
        .from('voice_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;
      return { data: message, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get messages for a call
   */
  static async getCallMessages(
    callId: string
  ): Promise<{ data: VoiceMessage[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('voice_messages')
        .select('*')
        .eq('call_id', callId)
        .order('sequence_number', { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * Get conversation history (formatted)
   */
  static async getConversation(callId: string): Promise<{
    data: Array<{
      role: MessageRole;
      content: string;
      timestamp: string;
    }>;
    error: Error | null;
  }> {
    try {
      const { data, error } = await this.getCallMessages(callId);
      if (error) throw error;

      const conversation = data.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));

      return { data: conversation, error: null };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }

  /**
   * Add user message
   */
  static async addUserMessage(
    callId: string,
    content: string,
    audioUrl?: string
  ): Promise<{ data: VoiceMessage | null; error: Error | null }> {
    return this.addMessage({
      call_id: callId,
      role: 'user',
      content,
      audio_url: audioUrl,
    });
  }

  /**
   * Add AI assistant message
   */
  static async addAssistantMessage(
    callId: string,
    content: string,
    options?: {
      audioUrl?: string;
      tokensUsed?: number;
      modelUsed?: string;
    }
  ): Promise<{ data: VoiceMessage | null; error: Error | null }> {
    return this.addMessage({
      call_id: callId,
      role: 'assistant',
      content,
      audio_url: options?.audioUrl,
      tokens_used: options?.tokensUsed || 0,
      model_used: options?.modelUsed,
    });
  }
}
```

## LiveKit Integration

Create `/lib/services/livekit-voice-service.ts`:

```typescript
import { generateToken, createRoom, deleteRoom } from '@/lib/livekit';
import { VoiceCallsService } from './voice-calls-service';
import type { VoiceCall } from '@/types/voice-calls';

export class LiveKitVoiceService {
  /**
   * Initiate a new voice call with LiveKit
   */
  static async initiateCall(
    userId: string,
    roomName: string = 'Support Call',
    options?: {
      maxParticipants?: number;
      enableAIAgent?: boolean;
    }
  ): Promise<{
    call: VoiceCall | null;
    token: string | null;
    error: Error | null;
  }> {
    try {
      // Generate unique session ID
      const sessionId = `call-${userId}-${Date.now()}`;

      // Create database record
      const { data: call, error: dbError } = await VoiceCallsService.createCall(
        {
          user_id: userId,
          session_id: sessionId,
          room_name: roomName,
          status: 'pending',
          ai_agent_used: options?.enableAIAgent || false,
        }
      );

      if (dbError || !call) {
        throw dbError || new Error('Failed to create call record');
      }

      // Create LiveKit room
      const { success, error: roomError } = await createRoom(sessionId, {
        maxParticipants: options?.maxParticipants || 10,
        emptyTimeout: 600,
        metadata: JSON.stringify({ callId: call.id }),
      });

      if (!success) {
        // Rollback database record
        await VoiceCallsService.deleteCall(call.id);
        throw new Error(roomError || 'Failed to create LiveKit room');
      }

      // Generate user token
      const token = await generateToken(sessionId, userId, {
        metadata: JSON.stringify({ userId, callId: call.id }),
      });

      if (!token) {
        throw new Error('Failed to generate access token');
      }

      return { call, token, error: null };
    } catch (error) {
      console.error('Failed to initiate call:', error);
      return { call: null, token: null, error: error as Error };
    }
  }

  /**
   * Connect to an existing call
   */
  static async joinCall(
    userId: string,
    sessionId: string
  ): Promise<{
    call: VoiceCall | null;
    token: string | null;
    error: Error | null;
  }> {
    try {
      // Get call from database
      const { data: call, error: dbError } =
        await VoiceCallsService.getCallBySession(sessionId);

      if (dbError || !call) {
        throw new Error('Call not found');
      }

      if (call.status === 'completed' || call.status === 'failed') {
        throw new Error('Call has already ended');
      }

      // Generate token
      const token = await generateToken(sessionId, userId, {
        metadata: JSON.stringify({ userId, callId: call.id }),
      });

      if (!token) {
        throw new Error('Failed to generate access token');
      }

      // Update call status if pending
      if (call.status === 'pending') {
        await VoiceCallsService.updateStatus(call.id, 'active');
      }

      return { call, token, error: null };
    } catch (error) {
      return { call: null, token: null, error: error as Error };
    }
  }

  /**
   * End a call
   */
  static async endCall(
    callId: string,
    sessionId: string
  ): Promise<{ success: boolean; error: Error | null }> {
    try {
      // Update database
      const { error: dbError } = await VoiceCallsService.updateCall(callId, {
        status: 'completed',
        ended_at: new Date().toISOString(),
      });

      if (dbError) throw dbError;

      // Delete LiveKit room
      await deleteRoom(sessionId);

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}
```

## React Hooks

Create `/hooks/use-voice-call.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { VoiceCallsService } from '@/lib/services/voice-calls-service';
import { VoiceMessagesService } from '@/lib/services/voice-messages-service';
import { LiveKitVoiceService } from '@/lib/services/livekit-voice-service';
import type { VoiceCall, VoiceMessage } from '@/types/voice-calls';

export function useVoiceCall(userId: string) {
  const [call, setCall] = useState<VoiceCall | null>(null);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Start a new call
   */
  const startCall = useCallback(
    async (roomName?: string) => {
      setLoading(true);
      setError(null);

      const { call, token, error } = await LiveKitVoiceService.initiateCall(
        userId,
        roomName
      );

      if (error || !call || !token) {
        setError(error || new Error('Failed to start call'));
        setLoading(false);
        return null;
      }

      setCall(call);
      setLoading(false);
      return { call, token };
    },
    [userId]
  );

  /**
   * End current call
   */
  const endCall = useCallback(async () => {
    if (!call) return;

    setLoading(true);
    const { error } = await LiveKitVoiceService.endCall(
      call.id,
      call.session_id
    );

    if (error) {
      setError(error);
    } else {
      setCall(null);
      setMessages([]);
    }
    setLoading(false);
  }, [call]);

  /**
   * Add message to call
   */
  const addMessage = useCallback(
    async (content: string, role: 'user' | 'assistant' = 'user') => {
      if (!call) return;

      const { data, error } = await VoiceMessagesService.addMessage({
        call_id: call.id,
        role,
        content,
      });

      if (error) {
        setError(error);
      } else if (data) {
        setMessages((prev) => [...prev, data]);
      }
    },
    [call]
  );

  /**
   * Load messages for current call
   */
  const loadMessages = useCallback(async () => {
    if (!call) return;

    const { data, error } = await VoiceMessagesService.getCallMessages(call.id);

    if (error) {
      setError(error);
    } else {
      setMessages(data);
    }
  }, [call]);

  useEffect(() => {
    if (call) {
      loadMessages();
    }
  }, [call, loadMessages]);

  return {
    call,
    messages,
    loading,
    error,
    startCall,
    endCall,
    addMessage,
    refreshMessages: loadMessages,
  };
}

/**
 * Hook for call history
 */
export function useCallHistory(userId: string, limit = 20) {
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCalls = useCallback(async () => {
    setLoading(true);
    const { data, error } = await VoiceCallsService.getUserCalls(userId, limit);

    if (error) {
      setError(error);
    } else {
      setCalls(data);
    }
    setLoading(false);
  }, [userId, limit]);

  useEffect(() => {
    loadCalls();
  }, [loadCalls]);

  return { calls, loading, error, refresh: loadCalls };
}
```

## Error Handling

Create `/lib/errors/voice-call-errors.ts`:

```typescript
export class VoiceCallError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'VoiceCallError';
  }
}

export class CallNotFoundError extends VoiceCallError {
  constructor(callId: string) {
    super(`Call not found: ${callId}`, 'CALL_NOT_FOUND', 404);
  }
}

export class CallAlreadyEndedError extends VoiceCallError {
  constructor() {
    super('Call has already ended', 'CALL_ALREADY_ENDED', 400);
  }
}

export class LiveKitConnectionError extends VoiceCallError {
  constructor(message: string) {
    super(`LiveKit connection failed: ${message}`, 'LIVEKIT_ERROR', 503);
  }
}

export class UnauthorizedCallAccessError extends VoiceCallError {
  constructor() {
    super('Unauthorized access to call', 'UNAUTHORIZED', 403);
  }
}
```

## Example Usage in Component

```typescript
'use client';

import { useState } from 'react';
import { useVoiceCall } from '@/hooks/use-voice-call';
import { useUser } from '@/hooks/use-user';

export function VoiceCallButton() {
  const { user } = useUser();
  const { call, startCall, endCall, messages, addMessage } = useVoiceCall(
    user?.id || ''
  );
  const [token, setToken] = useState<string | null>(null);

  const handleStart = async () => {
    const result = await startCall('Support Call');
    if (result) {
      setToken(result.token);
      // Now connect to LiveKit with token
    }
  };

  const handleEnd = async () => {
    await endCall();
    setToken(null);
  };

  return (
    <div>
      {!call ? (
        <button onClick={handleStart}>Start Voice Call</button>
      ) : (
        <>
          <button onClick={handleEnd}>End Call</button>
          <div>
            {messages.map((msg) => (
              <div key={msg.id}>
                <strong>{msg.role}:</strong> {msg.content}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

## API Route Example

Create `/app/api/voice/start/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { LiveKitVoiceService } from '@/lib/services/livekit-voice-service';
import { getServerSession } from 'next-auth';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomName, enableAIAgent } = await request.json();

    // Initiate call
    const { call, token, error } = await LiveKitVoiceService.initiateCall(
      session.user.id,
      roomName,
      { enableAIAgent }
    );

    if (error || !call || !token) {
      return NextResponse.json(
        { error: error?.message || 'Failed to start call' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      callId: call.id,
      sessionId: call.session_id,
      token,
    });
  } catch (error) {
    console.error('Start call error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Summary

This integration guide provides:

1. **Full type safety** with TypeScript definitions
2. **Service layer** for clean separation of concerns
3. **React hooks** for easy component integration
4. **Error handling** with custom error classes
5. **LiveKit integration** with database sync
6. **API routes** for server-side operations

All code examples follow TypeScript best practices and integrate seamlessly with the enhanced voice calls database schema.
