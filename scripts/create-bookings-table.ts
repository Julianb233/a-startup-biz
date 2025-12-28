#!/usr/bin/env tsx
/**
 * Database Migration Script - Bookings Table
 *
 * Creates comprehensive booking system tables with proper indexes and constraints
 * Run with: npm run db:migrate or tsx scripts/create-bookings-table.ts
 */

import { neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') })
dotenv.config()

async function createBookingsTables() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  console.log('🔄 Connecting to database...')
  const sql = neon(databaseUrl)

  try {
    console.log('📋 Creating bookings table...')

    // Create bookings table
    await sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        service_type TEXT NOT NULL,
        start_time TIMESTAMPTZ NOT NULL,
        end_time TIMESTAMPTZ NOT NULL,
        timezone TEXT NOT NULL DEFAULT 'America/New_York',
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
        notes TEXT,
        calendar_event_id TEXT,
        meeting_link TEXT,
        reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
        notification_type TEXT NOT NULL DEFAULT 'email' CHECK (notification_type IN ('email', 'sms', 'both')),
        metadata JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        cancelled_at TIMESTAMPTZ,
        cancellation_reason TEXT
      )
    `

    console.log('✅ Bookings table created successfully')

    console.log('📋 Creating availability_configs table...')

    // Create availability_configs table
    await sql`
      CREATE TABLE IF NOT EXISTS availability_configs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT,
        working_hours JSONB NOT NULL,
        slot_duration INTEGER NOT NULL DEFAULT 60,
        buffer_time INTEGER NOT NULL DEFAULT 15,
        min_advance_notice INTEGER NOT NULL DEFAULT 24,
        max_advance_days INTEGER NOT NULL DEFAULT 90,
        timezone TEXT NOT NULL DEFAULT 'America/New_York',
        excluded_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
        excluded_time_ranges JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT user_id_unique UNIQUE (user_id)
      )
    `

    console.log('✅ Availability configs table created successfully')

    console.log('📋 Creating indexes...')

    // Create indexes for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_service_type ON bookings(service_type)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at)
    `

    // Composite index for common queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_status_start_time
      ON bookings(status, start_time)
    `

    // Index for reminder queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_bookings_reminder_pending
      ON bookings(reminder_sent, status, start_time)
      WHERE reminder_sent = FALSE AND status = 'confirmed'
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_availability_configs_user_id
      ON availability_configs(user_id)
    `

    console.log('✅ Indexes created successfully')

    console.log('📋 Creating updated_at trigger...')

    // Create function to update updated_at timestamp
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `

    // Create trigger for bookings table
    await sql`
      DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings
    `

    await sql`
      CREATE TRIGGER update_bookings_updated_at
      BEFORE UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `

    // Create trigger for availability_configs table
    await sql`
      DROP TRIGGER IF EXISTS update_availability_configs_updated_at ON availability_configs
    `

    await sql`
      CREATE TRIGGER update_availability_configs_updated_at
      BEFORE UPDATE ON availability_configs
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `

    console.log('✅ Triggers created successfully')

    console.log('📋 Inserting default availability configuration...')

    // Insert default system-wide availability configuration
    await sql`
      INSERT INTO availability_configs (
        user_id,
        working_hours,
        slot_duration,
        buffer_time,
        min_advance_notice,
        max_advance_days,
        timezone,
        excluded_dates,
        excluded_time_ranges
      ) VALUES (
        NULL,
        '[
          {"dayOfWeek": 1, "startTime": "09:00", "endTime": "17:00", "enabled": true},
          {"dayOfWeek": 2, "startTime": "09:00", "endTime": "17:00", "enabled": true},
          {"dayOfWeek": 3, "startTime": "09:00", "endTime": "17:00", "enabled": true},
          {"dayOfWeek": 4, "startTime": "09:00", "endTime": "17:00", "enabled": true},
          {"dayOfWeek": 5, "startTime": "09:00", "endTime": "17:00", "enabled": true},
          {"dayOfWeek": 6, "startTime": "09:00", "endTime": "17:00", "enabled": false},
          {"dayOfWeek": 0, "startTime": "09:00", "endTime": "17:00", "enabled": false}
        ]'::jsonb,
        60,
        15,
        24,
        90,
        'America/New_York',
        '[]'::jsonb,
        '[]'::jsonb
      )
      ON CONFLICT (user_id) DO NOTHING
    `

    console.log('✅ Default configuration inserted')

    // Verify tables exist
    console.log('\n📊 Verifying tables...')
    const tables = await sql`
      SELECT table_name,
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
        AND table_name IN ('bookings', 'availability_configs')
      ORDER BY table_name
    `

    console.log('\n✅ Migration completed successfully!\n')
    console.log('📋 Created tables:')
    tables.forEach((t: { table_name: string; column_count: number }) => {
      console.log(`   - ${t.table_name} (${t.column_count} columns)`)
    })

    // Show indexes
    const indexes = await sql`
      SELECT indexname, tablename
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename IN ('bookings', 'availability_configs')
      ORDER BY tablename, indexname
    `

    console.log('\n📋 Created indexes:')
    indexes.forEach((idx: { tablename: string; indexname: string }) => {
      console.log(`   - ${idx.tablename}.${idx.indexname}`)
    })

    // Show record counts
    const bookingsCount = await sql`SELECT COUNT(*) as count FROM bookings`
    const configsCount = await sql`SELECT COUNT(*) as count FROM availability_configs`

    console.log('\n📊 Current records:')
    console.log(`   - bookings: ${bookingsCount[0].count}`)
    console.log(`   - availability_configs: ${configsCount[0].count}`)

    console.log('\n🎉 Booking system database migration complete!')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

// Run migration
createBookingsTables()
  .then(() => {
    console.log('\n✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error)
    process.exit(1)
  })
