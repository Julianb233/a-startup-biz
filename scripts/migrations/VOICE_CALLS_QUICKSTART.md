# Voice Calls Database - Quick Start Checklist

## Overview

This quick-start guide will get you from zero to a working voice call system in under 30 minutes.

## Prerequisites

- [ ] PostgreSQL database (or Supabase project)
- [ ] LiveKit account and credentials
- [ ] Next.js/TypeScript application
- [ ] User authentication system in place

## Step 1: Database Migration (5 minutes)

### 1.1 Backup Your Database

```bash
# Supabase
npx supabase db dump > backup-$(date +%Y%m%d).sql

# PostgreSQL
pg_dump -U your_user your_database > backup.sql
```

### 1.2 Choose Your Schema

**For production apps:** Use `010_voice_calls_enhanced.sql`
**For MVPs/prototypes:** Use `010_voice_calls.sql`

### 1.3 Apply Migration

```bash
# Supabase
psql -U postgres -h db.YOUR_PROJECT.supabase.co -d postgres -f scripts/migrations/010_voice_calls_enhanced.sql

# Local PostgreSQL
psql -U your_user -d your_database -f scripts/migrations/010_voice_calls_enhanced.sql
```

### 1.4 Verify Installation

```sql
-- Check tables exist
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE '%voice%';

-- Should return: voice_calls, voice_messages, call_participants
```

✅ **Checkpoint:** You should see 3 tables created.

## Step 2: Environment Variables (2 minutes)

### 2.1 Add to `.env.local`

```bash
# LiveKit Configuration
LIVEKIT_HOST=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret

# Supabase (if not already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 2.2 Get LiveKit Credentials

1. Go to https://cloud.livekit.io
2. Create a project (or use existing)
3. Copy API Key and Secret from Settings → Keys

✅ **Checkpoint:** `echo $LIVEKIT_API_KEY` should output your key.

## Step 3: Install Dependencies (2 minutes)

```bash
npm install livekit-server-sdk livekit-client @supabase/supabase-js
# or
pnpm add livekit-server-sdk livekit-client @supabase/supabase-js
```

✅ **Checkpoint:** `package.json` should include all three packages.

## Step 4: Copy Type Definitions (3 minutes)

### 4.1 Create Types File

```bash
mkdir -p types
touch types/voice-calls.ts
```

### 4.2 Copy from Integration Guide

Copy the type definitions from `TYPESCRIPT_INTEGRATION.md` section "Type Definitions" into `types/voice-calls.ts`.

**Quick copy:**
```bash
# Copy from the guide (see TYPESCRIPT_INTEGRATION.md)
```

✅ **Checkpoint:** `types/voice-calls.ts` should export `VoiceCall`, `VoiceMessage`, `CallParticipant` types.

## Step 5: Create Service Layer (5 minutes)

### 5.1 Create Services Directory

```bash
mkdir -p lib/services
```

### 5.2 Create Voice Calls Service

Copy the complete service files from `TYPESCRIPT_INTEGRATION.md`:

1. `lib/services/voice-calls-service.ts`
2. `lib/services/voice-messages-service.ts`
3. `lib/services/livekit-voice-service.ts`

**Or use the existing LiveKit integration:**
- Your project already has `lib/livekit.ts` ✅
- Create service wrappers that use it

✅ **Checkpoint:** Services should import successfully without TypeScript errors.

## Step 6: Create API Routes (5 minutes)

### 6.1 Create Voice API Directory

```bash
mkdir -p app/api/voice
```

### 6.2 Create Start Call Endpoint

Create `app/api/voice/start/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createRoom, generateToken } from '@/lib/livekit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Get user from session (adapt to your auth)
    const { userId, roomName } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Create session ID
    const sessionId = `call-${userId}-${Date.now()}`;

    // Create database record
    const { data: call, error: dbError } = await supabase
      .from('voice_calls')
      .insert({
        user_id: userId,
        session_id: sessionId,
        room_name: roomName || 'Voice Call',
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Create LiveKit room
    await createRoom(sessionId, { maxParticipants: 10 });

    // Generate token
    const token = await generateToken(sessionId, userId);

    return NextResponse.json({
      callId: call.id,
      sessionId,
      token,
    });
  } catch (error) {
    console.error('Start call error:', error);
    return NextResponse.json(
      { error: 'Failed to start call' },
      { status: 500 }
    );
  }
}
```

### 6.3 Create End Call Endpoint

Create `app/api/voice/end/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { deleteRoom } from '@/lib/livekit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { callId, sessionId } = await request.json();

    // Update database
    await supabase
      .from('voice_calls')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
      })
      .eq('id', callId);

    // Delete LiveKit room
    await deleteRoom(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('End call error:', error);
    return NextResponse.json(
      { error: 'Failed to end call' },
      { status: 500 }
    );
  }
}
```

✅ **Checkpoint:** Both API routes should compile without errors.

## Step 7: Create React Hook (3 minutes)

Create `hooks/use-voice-call.ts`:

```typescript
import { useState } from 'react';

export function useVoiceCall(userId: string) {
  const [callId, setCallId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startCall = async (roomName?: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/voice/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roomName }),
      });

      const data = await response.json();
      setCallId(data.callId);
      setSessionId(data.sessionId);
      setToken(data.token);
      return data;
    } catch (error) {
      console.error('Failed to start call:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const endCall = async () => {
    if (!callId || !sessionId) return;

    setLoading(true);
    try {
      await fetch('/api/voice/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, sessionId }),
      });

      setCallId(null);
      setSessionId(null);
      setToken(null);
    } catch (error) {
      console.error('Failed to end call:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    callId,
    sessionId,
    token,
    loading,
    startCall,
    endCall,
    isActive: !!callId,
  };
}
```

✅ **Checkpoint:** Hook should compile and export correctly.

## Step 8: Test Basic Flow (5 minutes)

### 8.1 Create Test Component

Create `components/voice-call-test.tsx`:

```typescript
'use client';

import { useVoiceCall } from '@/hooks/use-voice-call';

export function VoiceCallTest({ userId }: { userId: string }) {
  const { isActive, loading, startCall, endCall } = useVoiceCall(userId);

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-4">Voice Call Test</h3>

      {!isActive ? (
        <button
          onClick={() => startCall('Test Call')}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {loading ? 'Starting...' : 'Start Call'}
        </button>
      ) : (
        <button
          onClick={endCall}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          {loading ? 'Ending...' : 'End Call'}
        </button>
      )}
    </div>
  );
}
```

### 8.2 Add to Test Page

Add to any page:

```typescript
import { VoiceCallTest } from '@/components/voice-call-test';

export default function TestPage() {
  return (
    <div className="p-8">
      <VoiceCallTest userId="test-user-id" />
    </div>
  );
}
```

### 8.3 Run Test

1. Start dev server: `npm run dev`
2. Navigate to test page
3. Click "Start Call"
4. Check database:

```sql
SELECT * FROM voice_calls ORDER BY created_at DESC LIMIT 1;
```

5. Click "End Call"
6. Verify status updated to 'completed'

✅ **Checkpoint:** Call record should appear in database with correct status transitions.

## Step 9: Verify Database (2 minutes)

### 9.1 Check Call Record

```sql
SELECT
  id,
  session_id,
  status,
  created_at,
  ended_at,
  duration_seconds
FROM voice_calls
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:** Recent call with status progression: pending → active → completed

### 9.2 Check Indexes

```sql
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'voice_calls';
```

**Expected:** 6-14 indexes depending on schema version

### 9.3 Check RLS (Enhanced Schema Only)

```sql
SELECT
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'voice_calls';
```

**Expected:** 3+ RLS policies

✅ **Checkpoint:** All database objects should be present and functional.

## Step 10: Integration Checklist (Optional)

### Frontend Integration
- [ ] LiveKit client connected with token
- [ ] Audio/video controls working
- [ ] Real-time participant tracking
- [ ] Message display in UI

### Message Tracking
- [ ] User messages saved to `voice_messages`
- [ ] AI responses saved with token count
- [ ] Conversation history retrievable

### Analytics
- [ ] Active calls dashboard works
- [ ] Call history displays correctly
- [ ] Token usage tracked accurately

### Security
- [ ] RLS policies prevent unauthorized access
- [ ] User can only see their own calls
- [ ] Admin can access all calls (if role=admin)

### Performance
- [ ] Queries return in < 100ms
- [ ] Indexes being used (check EXPLAIN ANALYZE)
- [ ] No N+1 query issues

## Common Issues & Fixes

### Issue: "relation 'voice_calls' does not exist"

**Fix:** Migration didn't run successfully.

```sql
-- Check if tables exist
\dt voice*

-- Re-run migration
\i scripts/migrations/010_voice_calls_enhanced.sql
```

### Issue: "RLS policy blocks query"

**Fix:** RLS enabled but auth.uid() returns NULL.

```sql
-- Temporarily disable RLS for testing
ALTER TABLE voice_calls DISABLE ROW LEVEL SECURITY;

-- Check auth
SELECT auth.uid(); -- Should return user UUID
```

### Issue: "LiveKit room creation fails"

**Fix:** Check credentials and API permissions.

```typescript
// Test connection
import { isLiveKitConfigured } from '@/lib/livekit';
console.log('LiveKit configured:', isLiveKitConfigured());
```

### Issue: "Triggers not firing"

**Fix:** Verify triggers exist and are enabled.

```sql
SELECT tgname, tgrelid::regclass, tgenabled
FROM pg_trigger
WHERE tgrelid::regclass::text LIKE '%voice%';

-- Should show 4 triggers
```

### Issue: "Duration not calculating"

**Fix:** Ensure `ended_at` and `connected_at` are set.

```sql
-- Manual calculation test
UPDATE voice_calls
SET
  connected_at = NOW() - INTERVAL '5 minutes',
  ended_at = NOW()
WHERE id = 'your-call-id';

-- Check duration_seconds populated
SELECT duration_seconds FROM voice_calls WHERE id = 'your-call-id';
```

## Next Steps

Now that you have the basic flow working:

1. **Integrate LiveKit Client:**
   - Follow LiveKit React documentation
   - Use your existing `components/voice-call-interface.tsx`
   - Connect with token from `startCall()`

2. **Add Message Tracking:**
   - Save transcriptions to `voice_messages`
   - Track AI responses with token counts
   - Build conversation history UI

3. **Add AI Agent:**
   - Use existing `lib/voice-agent.ts`
   - Spawn agent when call starts
   - Track agent messages and tokens

4. **Build Analytics:**
   - Query `call_analytics` view
   - Create dashboard for call metrics
   - Monitor token usage and costs

5. **Production Checklist:**
   - [ ] Enable RLS in production
   - [ ] Set up monitoring alerts
   - [ ] Configure backup strategy
   - [ ] Add error tracking (Sentry, etc.)
   - [ ] Load test with expected volume
   - [ ] Document internal procedures

## Resources

- **Migration Guide:** `VOICE_CALLS_MIGRATION_GUIDE.md`
- **Schema Comparison:** `VOICE_SCHEMA_COMPARISON.md`
- **TypeScript Integration:** `TYPESCRIPT_INTEGRATION.md`
- **LiveKit Docs:** https://docs.livekit.io
- **Supabase RLS:** https://supabase.com/docs/guides/auth/row-level-security

## Support

If you encounter issues:

1. Check database logs in Supabase dashboard
2. Verify all environment variables are set
3. Test API routes with curl/Postman
4. Check browser console for client errors
5. Review migration guide for troubleshooting section

## Completion Checklist

- [ ] Database migration applied successfully
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Type definitions created
- [ ] API routes working
- [ ] React hook functional
- [ ] Test call creates database record
- [ ] Call status transitions correctly
- [ ] Duration auto-calculates
- [ ] RLS policies enforced (enhanced schema)

**Time to complete:** ~30 minutes

**Estimated time to production:** Add 2-4 hours for LiveKit client integration and UI polish.

---

**Congratulations!** 🎉 You now have a working voice call database schema integrated with your application.
