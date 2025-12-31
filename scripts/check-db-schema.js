#!/usr/bin/env node

/**
 * Pre-Build Database Schema Validator
 *
 * Checks that all required tables exist before build.
 * Run this in CI/CD to catch missing migrations early.
 *
 * Usage: DATABASE_URL="..." node scripts/check-db-schema.js
 */

const REQUIRED_TABLES = [
  // Core tables
  'users',
  'orders',
  'consultations',
  'partners',
  'referrals',
  'referral_links',
  // Partner system
  'partner_profiles',
  'partner_agreements',
  'partner_agreement_acceptances',
  'partner_bank_details',
  'partner_microsites',
  'partner_payouts',
  'partner_transfers',
  // Chat system
  'chat_rooms',
  'chat_messages',
  // Notifications
  'notifications',
  'notification_preferences',
  'push_subscriptions',
  // Admin
  'admin_audit_log',
  // Documents
  'documents',
  'signature_requests',
  'signature_events',
  // Blog
  'blog_posts',
  'blog_categories',
  // Quotes
  'quotes',
  'quote_line_items',
  // Bookings
  'bookings',
  'calendar_bookings',
  'availability_configs',
  // Voice
  'voice_calls',
  'voice_agent_config',
  // Chatbot
  'chatbot_knowledge',
  'chatbot_categories',
  // Other
  'stripe_connect_events',
  'schema_migrations',
];

async function main() {
  const { neon } = await import('@neondatabase/serverless');

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL not set - skipping schema check');
    process.exit(0); // Don't fail build if no DB URL
  }

  const sql = neon(DATABASE_URL);

  console.log('🔍 Checking database schema...\n');

  try {
    const result = await sql`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
    `;
    const existingTables = new Set(result.map(r => r.tablename));

    const missingTables = REQUIRED_TABLES.filter(t => !existingTables.has(t));

    if (missingTables.length > 0) {
      console.error('❌ Missing tables detected:\n');
      missingTables.forEach(t => console.error(`   - ${t}`));
      console.error('\n🔧 Run migrations: DATABASE_URL="..." node scripts/run-migrations.js\n');
      process.exit(1);
    }

    console.log(`✅ All ${REQUIRED_TABLES.length} required tables exist!`);
    process.exit(0);

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
}

main();
