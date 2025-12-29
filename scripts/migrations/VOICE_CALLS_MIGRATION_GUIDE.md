# Voice Calls Database Schema - Migration Guide

## Overview

This guide explains the voice call database schema, the differences between the basic and enhanced versions, and how to apply the migration to your database.

## Schema Versions

### Version 1: Basic (010_voice_calls.sql)
- Simple voice call tracking
- Uses VARCHAR for user IDs
- No session_id field
- No voice_messages table
- No RLS policies
- Basic indexing

### Version 2: Enhanced (010_voice_calls_enhanced.sql) ✅ RECOMMENDED
- Complete LiveKit integration
- Proper UUID foreign keys to users table
- Session tracking with unique session_id
- Message-level tracking in voice_messages table
- Row Level Security (RLS) policies for Supabase
- Enum types for type safety
- Automated triggers for duration calculation
- Token usage tracking for AI metrics
- Utility views for analytics
- Comprehensive indexing strategy

## Key Differences

| Feature | Basic | Enhanced |
|---------|-------|----------|
| **Session ID** | ❌ No | ✅ Yes (unique, indexed) |
| **User Reference** | VARCHAR | UUID with FK |
| **Message Tracking** | ❌ No | ✅ voice_messages table |
| **RLS Policies** | ❌ No | ✅ Full Supabase RLS |
| **Enum Types** | VARCHAR | Typed enums |
| **AI Metrics** | ❌ No | ✅ Token tracking |
| **Auto Duration** | Manual | Automated triggers |
| **Analytics Views** | ❌ No | ✅ 2 utility views |
| **Indexes** | 6 basic | 14 optimized |

## Tables Created

### 1. voice_calls
Stores call session metadata and lifecycle information.

**Key Fields:**
- `id` - UUID primary key
- `user_id` - References users table
- `session_id` - **Unique LiveKit room identifier** (required)
- `status` - Enum: pending, active, completed, failed
- `recording_url` - S3/storage URL for recording
- `transcript` - Full call transcript text
- `total_tokens_used` - AI usage metrics

### 2. voice_messages
Stores individual messages within conversations.

**Key Fields:**
- `call_id` - References voice_calls
- `role` - Enum: user, assistant, system
- `content` - Message text/transcription
- `audio_url` - URL to audio snippet
- `tokens_used` - Per-message AI token count
- `sequence_number` - Message ordering

### 3. call_participants
Tracks all participants in multi-party calls.

**Key Fields:**
- `call_id` - References voice_calls
- `user_id` - References users (nullable for anonymous)
- `participant_identity` - LiveKit identity
- `participant_type` - user, agent, admin
- `joined_at`, `left_at` - Session timing

## Enum Types

### call_status
```sql
'pending'    -- Call initiated but not connected
'active'     -- Call in progress
'completed'  -- Call ended successfully
'failed'     -- Call failed
```

### message_role
```sql
'user'       -- Human user message
'assistant'  -- AI agent response
'system'     -- System notifications
```

## Indexing Strategy

### Performance Optimized Indexes

1. **User Lookups** - `idx_voice_calls_user_id`
   - Fast user history queries
   - Partial index (excludes NULL)

2. **LiveKit Session** - `idx_voice_calls_session_id`
   - Critical for LiveKit webhooks
   - Unique constraint enforced

3. **Active Calls** - `idx_voice_calls_active`
   - Filtered index for active status
   - Ordered by created_at DESC

4. **AI Analytics** - `idx_voice_calls_ai_agent`
   - Tracks AI-assisted calls
   - Filtered for ai_agent_used = true

5. **Message Ordering** - `idx_voice_messages_call_sequence`
   - Composite index (call_id, sequence_number)
   - Ensures fast chronological retrieval

## Row Level Security (RLS)

### Security Model

**Users can:**
- View their own calls
- View calls they participated in
- Insert calls they initiate
- Update their own calls

**Admins can:**
- View all calls
- Manage all data

**Anonymous users:**
- No access (requires authentication)

### RLS Policies

```sql
-- Users see their own calls
voice_calls_select_own: auth.uid() = user_id

-- Users see calls they joined
voice_calls_select_own: auth.uid() IN (SELECT user_id FROM call_participants...)

-- Admin full access
voice_calls_admin_all: role = 'admin'
```

## Automated Triggers

### 1. Duration Calculation
**Trigger:** `voice_calls_calculate_duration_trigger`
- Automatically calculates duration when call ends
- Formula: `ended_at - connected_at`
- Stores as integer seconds

### 2. Token Aggregation
**Trigger:** `voice_messages_update_tokens_trigger`
- Updates total_tokens_used on voice_calls
- Fires when messages are inserted/updated
- Sums all tokens_used from voice_messages

### 3. Participant Duration
**Trigger:** `call_participants_calculate_duration_trigger`
- Calculates participant session duration
- Formula: `left_at - joined_at`

### 4. Updated Timestamp
**Trigger:** `voice_calls_updated_at_trigger`
- Auto-updates updated_at column
- Fires on every UPDATE

## Utility Views

### active_calls_summary
Real-time dashboard of active calls.

```sql
SELECT * FROM active_calls_summary;
```

Returns:
- Call details (id, session_id, room_name)
- User information (name, email)
- Participant count and names
- Only active calls

### call_analytics
Analytics and reporting metrics.

```sql
SELECT * FROM call_analytics
WHERE created_at > NOW() - INTERVAL '7 days';
```

Returns:
- Call statistics
- Message counts by role
- Token usage
- Duration metrics

## Migration Instructions

### Step 1: Backup Current Database

```bash
# If using Supabase
npx supabase db dump > backup-$(date +%Y%m%d).sql

# If using PostgreSQL directly
pg_dump -U your_user your_database > backup-$(date +%Y%m%d).sql
```

### Step 2: Review Existing Data

Check if you have any existing voice_calls data:

```sql
SELECT COUNT(*) FROM voice_calls;
SELECT COUNT(*) FROM call_participants;
```

### Step 3: Apply Migration

**Option A: Fresh Database (No existing data)**

```bash
psql -U your_user -d your_database -f scripts/migrations/010_voice_calls_enhanced.sql
```

**Option B: Existing Data (Requires data migration)**

1. First, rename old tables:
```sql
ALTER TABLE voice_calls RENAME TO voice_calls_old;
ALTER TABLE call_participants RENAME TO call_participants_old;
```

2. Run the enhanced migration:
```bash
psql -U your_user -d your_database -f scripts/migrations/010_voice_calls_enhanced.sql
```

3. Migrate data (customize based on your data):
```sql
-- Migrate voice_calls
INSERT INTO voice_calls (
  id, user_id, session_id, room_name, status,
  started_at, ended_at, duration_seconds,
  recording_url, transcript, metadata, created_at
)
SELECT
  gen_random_uuid(), -- Generate new UUID
  NULLIF(caller_id, '')::uuid, -- Convert VARCHAR to UUID if valid
  room_name || '-' || id::text, -- Generate session_id from room_name + id
  room_name,
  status::call_status, -- Cast to enum
  started_at,
  ended_at,
  duration_seconds,
  recording_url,
  transcript,
  metadata,
  created_at
FROM voice_calls_old;

-- Migrate call_participants
INSERT INTO call_participants (
  call_id, user_id, participant_identity,
  participant_name, joined_at, left_at,
  duration_seconds, is_muted
)
SELECT
  -- Match to new call by room_name (requires join)
  vc.id,
  NULLIF(cpo.user_id, '')::uuid,
  cpo.user_id, -- Use old user_id as identity
  cpo.participant_name,
  cpo.joined_at,
  cpo.left_at,
  cpo.duration_seconds,
  cpo.is_muted
FROM call_participants_old cpo
JOIN voice_calls vc ON vc.room_name = (
  SELECT room_name FROM voice_calls_old WHERE id = cpo.call_id
);
```

4. Verify migration:
```sql
SELECT COUNT(*) FROM voice_calls;
SELECT COUNT(*) FROM voice_messages;
SELECT COUNT(*) FROM call_participants;
```

5. Drop old tables (after verification):
```sql
DROP TABLE call_participants_old;
DROP TABLE voice_calls_old;
```

### Step 4: Verify Installation

```sql
-- Check tables exist
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE '%voice%';

-- Check indexes
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public'
AND tablename LIKE '%voice%';

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE '%voice%';

-- Check triggers
SELECT tgname, tgrelid::regclass
FROM pg_trigger
WHERE tgrelid::regclass::text LIKE '%voice%';
```

Expected output:
- 3 tables: voice_calls, voice_messages, call_participants
- 14 indexes
- 3 tables with RLS enabled
- 4 triggers

## LiveKit Integration

### Creating a Call Session

```typescript
import { createRoom, generateToken } from '@/lib/livekit';
import { v4 as uuidv4 } from 'uuid';

// 1. Create database record
const sessionId = `support-${userId}-${Date.now()}`;
const { data: call } = await supabase
  .from('voice_calls')
  .insert({
    user_id: userId,
    session_id: sessionId,
    room_name: 'Support Call',
    status: 'pending'
  })
  .select()
  .single();

// 2. Create LiveKit room
await createRoom(sessionId, {
  maxParticipants: 2,
  emptyTimeout: 300
});

// 3. Generate token for user
const token = await generateToken(sessionId, userId);

// 4. Return connection details
return { callId: call.id, sessionId, token };
```

### Tracking Messages

```typescript
// When user speaks
await supabase
  .from('voice_messages')
  .insert({
    call_id: callId,
    role: 'user',
    content: transcribedText,
    audio_url: audioFileUrl,
    sequence_number: messageCount++
  });

// When AI responds
await supabase
  .from('voice_messages')
  .insert({
    call_id: callId,
    role: 'assistant',
    content: aiResponse,
    tokens_used: 150,
    model_used: 'gpt-4-turbo',
    sequence_number: messageCount++
  });
// Note: total_tokens_used auto-updates via trigger
```

### Ending a Call

```typescript
// Update call status
await supabase
  .from('voice_calls')
  .update({
    status: 'completed',
    ended_at: new Date().toISOString()
    // duration_seconds auto-calculated via trigger
  })
  .eq('id', callId);

// Clean up LiveKit room
await deleteRoom(sessionId);
```

## Querying Examples

### Get User's Call History

```sql
SELECT
  vc.*,
  COUNT(vm.id) as message_count,
  COUNT(vm.id) FILTER (WHERE vm.role = 'assistant') as ai_responses
FROM voice_calls vc
LEFT JOIN voice_messages vm ON vm.call_id = vc.id
WHERE vc.user_id = $1
GROUP BY vc.id
ORDER BY vc.created_at DESC
LIMIT 20;
```

### Get Call Conversation

```sql
SELECT
  vm.role,
  vm.content,
  vm.timestamp,
  vm.tokens_used
FROM voice_messages vm
WHERE vm.call_id = $1
ORDER BY vm.sequence_number ASC;
```

### Active Calls Dashboard

```sql
SELECT * FROM active_calls_summary
ORDER BY started_at DESC;
```

### AI Usage Analytics

```sql
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_calls,
  COUNT(*) FILTER (WHERE ai_agent_used) as ai_calls,
  SUM(total_tokens_used) as total_tokens,
  AVG(duration_seconds) as avg_duration
FROM voice_calls
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
```

## Performance Considerations

### Index Usage

All queries using these patterns will use indexes:

✅ `WHERE user_id = ?` - Uses idx_voice_calls_user_id
✅ `WHERE session_id = ?` - Uses idx_voice_calls_session_id
✅ `WHERE status = 'active'` - Uses idx_voice_calls_active
✅ `WHERE call_id = ? ORDER BY sequence_number` - Uses idx_voice_messages_call_sequence

### Scaling Recommendations

**Under 10K calls/month:**
- Current schema is optimal
- No additional optimization needed

**10K-100K calls/month:**
- Consider partitioning voice_calls by created_at (monthly)
- Add Redis cache for active_calls_summary view
- Archive completed calls older than 90 days

**100K+ calls/month:**
- Implement table partitioning
- Move transcripts to S3, store URLs only
- Separate read replicas for analytics
- Consider time-series database for message data

### Storage Optimization

**Transcript Storage:**
- Current: Stored in TEXT field
- Optimize: Store in S3, keep URL in transcript_url field
- Savings: ~90% reduction in table size

**Audio URLs:**
- Use signed URLs with expiration
- Archive to cold storage after 30 days
- Delete after 90 days (configurable)

## Monitoring

### Key Metrics to Track

```sql
-- Daily call volume
SELECT COUNT(*) FROM voice_calls
WHERE created_at > NOW() - INTERVAL '1 day';

-- Average call duration
SELECT AVG(duration_seconds) FROM voice_calls
WHERE status = 'completed'
AND created_at > NOW() - INTERVAL '7 days';

-- AI token consumption
SELECT SUM(total_tokens_used) FROM voice_calls
WHERE ai_agent_used = true
AND created_at > NOW() - INTERVAL '1 day';

-- Failed call rate
SELECT
  COUNT(*) FILTER (WHERE status = 'failed')::float /
  NULLIF(COUNT(*), 0) * 100 as failure_rate
FROM voice_calls
WHERE created_at > NOW() - INTERVAL '1 day';
```

### Alerts to Set Up

1. **High Failure Rate** - Alert if > 5% calls fail
2. **Long Active Calls** - Alert if call active > 2 hours
3. **Token Spike** - Alert if daily tokens > 2x average
4. **Storage Growth** - Alert if table size grows > 50% in 7 days

## Troubleshooting

### Issue: RLS policies blocking queries

**Symptom:** Queries return empty results even with data
**Solution:**
```sql
-- Check if RLS is causing issues
SET ROLE postgres; -- Bypass RLS for testing
SELECT * FROM voice_calls;
RESET ROLE;

-- Verify user authentication
SELECT auth.uid(); -- Should return user UUID

-- Check policy definitions
SELECT * FROM pg_policies WHERE tablename = 'voice_calls';
```

### Issue: Triggers not firing

**Symptom:** duration_seconds or total_tokens_used not updating
**Solution:**
```sql
-- Verify triggers exist
SELECT tgname, tgrelid::regclass, tgenabled
FROM pg_trigger
WHERE tgrelid::regclass::text LIKE '%voice%';

-- Re-create trigger if needed
DROP TRIGGER IF EXISTS voice_calls_calculate_duration_trigger ON voice_calls;
CREATE TRIGGER voice_calls_calculate_duration_trigger...
```

### Issue: Poor query performance

**Symptom:** Slow queries on voice_calls table
**Solution:**
```sql
-- Check if indexes are being used
EXPLAIN ANALYZE
SELECT * FROM voice_calls WHERE user_id = 'some-uuid';

-- Rebuild indexes if needed
REINDEX TABLE voice_calls;

-- Update table statistics
ANALYZE voice_calls;
```

## Security Best Practices

1. **Never store sensitive data in metadata**
   - Use encryption for PII in metadata JSONB
   - Prefer separate encrypted fields

2. **Audio URL security**
   - Always use signed URLs with expiration
   - Never expose raw S3/storage URLs
   - Implement URL regeneration on access

3. **RLS enforcement**
   - Always test RLS policies with different user roles
   - Never disable RLS in production
   - Audit policy changes

4. **API authentication**
   - Require authentication for all voice endpoints
   - Use JWT tokens with short expiration
   - Implement rate limiting

## Next Steps

1. ✅ Apply migration to database
2. ✅ Update application code to use new schema
3. ✅ Test LiveKit integration end-to-end
4. ✅ Set up monitoring and alerts
5. ✅ Configure backup strategy
6. ✅ Document internal procedures

## Support

For issues or questions:
- Review migration logs in Supabase dashboard
- Check PostgreSQL error logs
- Test queries in database client before app integration

## Changelog

### v2.0 (2025-12-29) - Enhanced Schema
- Added session_id for LiveKit integration
- Created voice_messages table
- Implemented RLS policies
- Added enum types
- Created automated triggers
- Added utility views
- Comprehensive indexing strategy

### v1.0 (2025-12-29) - Basic Schema
- Initial voice_calls table
- Basic call_participants table
- Simple indexing
