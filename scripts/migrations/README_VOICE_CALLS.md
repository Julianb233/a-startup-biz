# Voice Calls Database Schema - Complete Documentation

## Overview

This directory contains the complete database schema and integration guides for the voice call functionality with LiveKit integration.

## What's Included

### 1. Database Migration Files

| File | Description | When to Use |
|------|-------------|-------------|
| `010_voice_calls.sql` | **Basic Schema** - Simple call tracking | MVP/prototype stage, < 1K calls/month |
| `010_voice_calls_enhanced.sql` | **Enhanced Schema** - Full-featured with RLS, message tracking, AI metrics | Production apps, user authentication, > 1K calls/month |

### 2. Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| `VOICE_CALLS_QUICKSTART.md` | 30-minute setup guide | Developers (new to schema) |
| `VOICE_CALLS_MIGRATION_GUIDE.md` | Comprehensive migration and usage guide | Database administrators, architects |
| `VOICE_SCHEMA_COMPARISON.md` | Detailed feature comparison between basic and enhanced | Decision makers, architects |
| `TYPESCRIPT_INTEGRATION.md` | TypeScript service layer and React integration | Frontend/fullstack developers |
| `README_VOICE_CALLS.md` | This file - navigation and overview | Everyone |

## Quick Decision Guide

### I'm building a...

**MVP/Prototype**
→ Start here: `VOICE_CALLS_QUICKSTART.md`
→ Use schema: `010_voice_calls.sql` (basic)
→ Migrate later when scaling

**Production SaaS Application**
→ Start here: `VOICE_SCHEMA_COMPARISON.md`
→ Use schema: `010_voice_calls_enhanced.sql`
→ Integration: `TYPESCRIPT_INTEGRATION.md`

**Migrating Existing System**
→ Start here: `VOICE_CALLS_MIGRATION_GUIDE.md`
→ Review: `VOICE_SCHEMA_COMPARISON.md` for differences
→ Use schema: `010_voice_calls_enhanced.sql`

**Just Exploring**
→ Start here: `VOICE_SCHEMA_COMPARISON.md`
→ Quick test: `VOICE_CALLS_QUICKSTART.md` (Steps 1-8)

## Schema Features Comparison

### Basic Schema (010_voice_calls.sql)

**Tables:** 2 (voice_calls, call_participants)
**Indexes:** 6
**RLS Policies:** None
**Enums:** None
**Triggers:** None
**Views:** None

**Best for:**
- Simple call logging
- Internal tools
- MVPs without user authentication
- < 1,000 calls/month

### Enhanced Schema (010_voice_calls_enhanced.sql) ⭐ RECOMMENDED

**Tables:** 3 (voice_calls, voice_messages, call_participants)
**Indexes:** 14 (optimized)
**RLS Policies:** 9 (full security)
**Enums:** 2 (call_status, message_role)
**Triggers:** 4 (automated calculations)
**Views:** 2 (analytics, active calls)

**Best for:**
- Production applications
- User-facing products
- AI voice agents with token tracking
- Message-level conversation history
- Analytics and reporting
- Compliance requirements
- > 1,000 calls/month

**Key additions:**
- ✅ LiveKit session_id tracking
- ✅ Message-level conversation history
- ✅ AI token usage tracking
- ✅ Row Level Security (RLS)
- ✅ Automated duration calculation
- ✅ Analytics views
- ✅ Type-safe enums

## Database Architecture

### Enhanced Schema ERD

```
users (from 001_full_schema.sql)
  ↓ (user_id FK)
voice_calls
  ├── id (uuid, PK)
  ├── user_id (uuid, FK → users.id)
  ├── session_id (unique, LiveKit room)
  ├── status (enum: pending/active/completed/failed)
  ├── timestamps (started_at, connected_at, ended_at)
  ├── recording_url
  ├── transcript
  ├── ai_agent_used
  ├── total_tokens_used (auto-calculated)
  └── metadata (jsonb)
  ↓ (call_id FK)
voice_messages
  ├── id (uuid, PK)
  ├── call_id (uuid, FK → voice_calls.id)
  ├── role (enum: user/assistant/system)
  ├── content
  ├── audio_url
  ├── sequence_number
  ├── tokens_used
  └── model_used

call_participants
  ├── id (uuid, PK)
  ├── call_id (uuid, FK → voice_calls.id)
  ├── user_id (uuid, FK → users.id)
  ├── participant_identity (LiveKit)
  ├── participant_type (user/agent/admin)
  └── session data (joined_at, left_at, duration)
```

## Implementation Timeline

### Phase 1: Database Setup (30 minutes)
**Follow:** `VOICE_CALLS_QUICKSTART.md` Steps 1-9

1. ✅ Apply database migration
2. ✅ Configure environment variables
3. ✅ Install dependencies
4. ✅ Create type definitions
5. ✅ Set up API routes
6. ✅ Test basic call flow

**Deliverable:** Working database schema with test call

### Phase 2: Frontend Integration (2-4 hours)
**Follow:** `TYPESCRIPT_INTEGRATION.md`

1. ✅ Create service layer
2. ✅ Build React hooks
3. ✅ Integrate LiveKit client
4. ✅ Add UI components
5. ✅ Test end-to-end flow

**Deliverable:** Functional voice call UI

### Phase 3: AI Agent Integration (2-3 hours)
**Use existing:** `/lib/voice-agent.ts`

1. ✅ Spawn AI agent on call start
2. ✅ Track agent messages
3. ✅ Monitor token usage
4. ✅ Build conversation history

**Deliverable:** AI-powered voice support

### Phase 4: Analytics & Monitoring (2-3 hours)
**Follow:** `VOICE_CALLS_MIGRATION_GUIDE.md` sections on monitoring

1. ✅ Build analytics dashboard
2. ✅ Set up monitoring alerts
3. ✅ Create usage reports
4. ✅ Track costs

**Deliverable:** Production-ready monitoring

**Total Time:** 8-12 hours from zero to production

## File Structure in Your Project

After implementation, you should have:

```
/scripts/migrations/
├── 010_voice_calls_enhanced.sql          ← Database migration
├── VOICE_CALLS_MIGRATION_GUIDE.md        ← Reference docs
├── VOICE_SCHEMA_COMPARISON.md
├── TYPESCRIPT_INTEGRATION.md
└── VOICE_CALLS_QUICKSTART.md

/types/
└── voice-calls.ts                        ← TypeScript types

/lib/
├── livekit.ts                            ← Already exists ✅
├── voice-agent.ts                        ← Already exists ✅
└── services/
    ├── voice-calls-service.ts            ← Create this
    ├── voice-messages-service.ts         ← Create this
    └── livekit-voice-service.ts          ← Create this

/hooks/
└── use-voice-call.ts                     ← Create this

/app/api/voice/
├── start/route.ts                        ← Create this
├── end/route.ts                          ← Create this
└── messages/route.ts                     ← Optional

/components/
└── voice-call-interface.tsx              ← Already exists ✅
```

## Technology Stack

### Database
- **PostgreSQL** 13+ (or Supabase)
- **Extensions:** uuid-ossp (for UUID generation)
- **Features:** Enums, JSONB, Row Level Security, Triggers

### Backend
- **Next.js** App Router
- **TypeScript** for type safety
- **Supabase Client** for database access

### Voice Infrastructure
- **LiveKit** for WebRTC rooms
- **LiveKit Server SDK** for room management
- **LiveKit Client** for frontend

### AI (Optional)
- **OpenAI** for voice agents
- **Custom agent framework** (`/lib/voice-agent.ts`)

## Security Considerations

### Row Level Security (Enhanced Schema)

**Enabled by default on:**
- `voice_calls`
- `voice_messages`
- `call_participants`

**Policies enforce:**
- Users can only access their own calls
- Participants can access calls they joined
- Admins have full access (role='admin')

**Testing RLS:**
```sql
-- As user
SET ROLE authenticated;
SELECT * FROM voice_calls; -- Only shows user's calls

-- As admin
SET ROLE authenticated;
SELECT * FROM voice_calls; -- Shows all calls if role='admin'
```

### API Security

**Always:**
- Verify user authentication
- Validate user owns call before operations
- Use signed URLs for recordings
- Rate limit API endpoints

**Example:**
```typescript
// Verify ownership before ending call
const { data: call } = await supabase
  .from('voice_calls')
  .select('user_id')
  .eq('id', callId)
  .single();

if (call.user_id !== session.user.id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

## Performance Optimization

### Query Performance

**Indexed fields** (Enhanced schema):
- `user_id` - Fast user lookups
- `session_id` - Fast LiveKit lookups
- `status` - Fast status filtering
- `created_at` - Fast time-range queries
- `call_id` + `sequence_number` - Fast message ordering

**Use indexes:**
```typescript
// Good - uses idx_voice_calls_user_id
await supabase
  .from('voice_calls')
  .select('*')
  .eq('user_id', userId);

// Good - uses idx_voice_calls_session_id
await supabase
  .from('voice_calls')
  .select('*')
  .eq('session_id', sessionId);

// Good - uses idx_voice_calls_active
await supabase
  .from('voice_calls')
  .select('*')
  .eq('status', 'active');
```

### Storage Optimization

**At scale (> 100K calls):**
1. Store transcripts in S3, keep URLs in DB
2. Archive old calls to cold storage
3. Partition tables by created_at (monthly)
4. Use separate analytics database

**Example archival strategy:**
```sql
-- Move calls older than 90 days to archive
CREATE TABLE voice_calls_archive (LIKE voice_calls INCLUDING ALL);

INSERT INTO voice_calls_archive
SELECT * FROM voice_calls
WHERE created_at < NOW() - INTERVAL '90 days';

DELETE FROM voice_calls
WHERE created_at < NOW() - INTERVAL '90 days';
```

## Monitoring & Alerts

### Key Metrics

**Database:**
- Table sizes (watch for growth)
- Index usage (ensure indexes are used)
- Query performance (< 100ms target)
- RLS policy performance

**Application:**
- Call volume (daily, weekly, monthly)
- Call duration (average, percentiles)
- Failure rate (< 5% target)
- AI token usage (cost tracking)

### Recommended Alerts

```yaml
alerts:
  - name: High Failure Rate
    condition: failure_rate > 5%
    interval: 1 hour

  - name: Long Active Call
    condition: call_active > 2 hours
    interval: 30 minutes

  - name: Token Spike
    condition: daily_tokens > 2x avg
    interval: 1 day

  - name: Storage Growth
    condition: table_size_growth > 50%
    interval: 7 days
```

## Troubleshooting Guide

### Common Issues

**1. Migration fails with "permission denied"**
```sql
-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

**2. RLS blocks all queries**
```sql
-- Check authentication
SELECT auth.uid(); -- Should return UUID

-- Temporarily disable for testing
ALTER TABLE voice_calls DISABLE ROW LEVEL SECURITY;
```

**3. Triggers not firing**
```sql
-- Verify triggers exist
SELECT * FROM pg_trigger WHERE tgrelid = 'voice_calls'::regclass;

-- Re-create if needed
DROP TRIGGER IF EXISTS voice_calls_calculate_duration_trigger ON voice_calls;
-- Then re-run migration
```

**4. Poor query performance**
```sql
-- Analyze query plan
EXPLAIN ANALYZE
SELECT * FROM voice_calls WHERE user_id = 'some-uuid';

-- Rebuild indexes
REINDEX TABLE voice_calls;
ANALYZE voice_calls;
```

**5. LiveKit connection fails**
```typescript
// Check configuration
console.log({
  host: process.env.LIVEKIT_HOST,
  hasKey: !!process.env.LIVEKIT_API_KEY,
  hasSecret: !!process.env.LIVEKIT_API_SECRET,
});
```

## Support & Resources

### Documentation
- **This Directory:** Complete schema documentation
- **LiveKit Docs:** https://docs.livekit.io
- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs

### Community
- **LiveKit Discord:** https://livekit.io/discord
- **Supabase Discord:** https://discord.supabase.com
- **PostgreSQL Mailing Lists:** https://www.postgresql.org/list

### Getting Help

**For schema issues:**
1. Review `VOICE_CALLS_MIGRATION_GUIDE.md` troubleshooting section
2. Check database logs
3. Verify migration completed successfully

**For integration issues:**
1. Review `TYPESCRIPT_INTEGRATION.md` examples
2. Check TypeScript compilation errors
3. Verify environment variables

**For LiveKit issues:**
1. Test connection with `isLiveKitConfigured()`
2. Verify credentials in LiveKit dashboard
3. Check network/firewall rules

## Version History

### v2.0 - Enhanced Schema (2025-12-29)
- ✅ Added LiveKit session_id tracking
- ✅ Created voice_messages table
- ✅ Implemented Row Level Security
- ✅ Added enum types for type safety
- ✅ Created automated triggers
- ✅ Added analytics views
- ✅ Comprehensive indexing strategy
- ✅ Full TypeScript integration guide
- ✅ Quick-start documentation

### v1.0 - Basic Schema (2025-12-29)
- ✅ Initial voice_calls table
- ✅ Basic call_participants table
- ✅ Simple indexing
- ✅ PostgreSQL compatibility

## Migration Path

### From Basic to Enhanced

If you started with the basic schema and need to upgrade:

**Estimated time:** 2-4 hours
**Downtime required:** < 5 minutes (with proper planning)

**Steps:**
1. Read `VOICE_CALLS_MIGRATION_GUIDE.md` section "Migration Instructions"
2. Backup database
3. Test migration in development
4. Apply to production during low-traffic period
5. Verify data integrity
6. Update application code

## Next Steps

### For New Implementations
1. ✅ Start with `VOICE_CALLS_QUICKSTART.md`
2. ✅ Complete database setup (30 minutes)
3. ✅ Test basic call flow
4. ✅ Integrate LiveKit client (2-4 hours)
5. ✅ Add AI agent (optional, 2-3 hours)
6. ✅ Build analytics (optional, 2-3 hours)

### For Existing Projects
1. ✅ Review `VOICE_SCHEMA_COMPARISON.md`
2. ✅ Decide on schema version
3. ✅ Read `VOICE_CALLS_MIGRATION_GUIDE.md`
4. ✅ Plan migration timeline
5. ✅ Execute migration
6. ✅ Update application code

### For Production Deployment
1. ✅ Complete implementation
2. ✅ Load test with expected volume
3. ✅ Set up monitoring and alerts
4. ✅ Configure backup strategy
5. ✅ Document procedures
6. ✅ Train team on new system

## Contributing

Found an issue or have an improvement?

1. Check existing documentation
2. Test your change in development
3. Update relevant documentation
4. Submit pull request

## License

This schema and documentation are part of the A Startup Biz project.

---

## Quick Links

- **Get Started:** [VOICE_CALLS_QUICKSTART.md](./VOICE_CALLS_QUICKSTART.md)
- **Full Guide:** [VOICE_CALLS_MIGRATION_GUIDE.md](./VOICE_CALLS_MIGRATION_GUIDE.md)
- **Compare Schemas:** [VOICE_SCHEMA_COMPARISON.md](./VOICE_SCHEMA_COMPARISON.md)
- **TypeScript:** [TYPESCRIPT_INTEGRATION.md](./TYPESCRIPT_INTEGRATION.md)

**Questions?** Review the documentation above or check the troubleshooting sections in each guide.

---

**Last Updated:** 2025-12-29
**Schema Version:** 2.0 (Enhanced)
**Status:** Production Ready ✅
