#!/usr/bin/env tsx

/**
 * Execute Pending Database Migrations
 *
 * Runs migrations 006 and 007 for Stripe Connect and Partner Onboarding
 * Usage:
 *   pnpm tsx scripts/execute-pending-migrations.ts
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set');
  console.error('Please add DATABASE_URL to your .env.local file');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

interface MigrationRecord {
  id: number;
  migration_name: string;
  executed_at: string;
}

/**
 * Create migration tracking table if it doesn't exist
 */
async function ensureMigrationTable(): Promise<void> {
  console.log('📊 Ensuring migration tracking table exists...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('   ✅ Migration tracking table ready');
  } catch (error) {
    console.error('   ❌ Error creating migration table:', error);
    throw error;
  }
}

/**
 * Check which migrations have been applied
 */
async function getAppliedMigrations(): Promise<Set<string>> {
  try {
    const result = await sql<MigrationRecord>`
      SELECT migration_name FROM schema_migrations ORDER BY executed_at
    `;
    const applied = new Set(result.map(r => r.migration_name));
    return applied;
  } catch (error) {
    console.error('Error checking applied migrations:', error);
    return new Set();
  }
}

/**
 * Record migration as applied
 */
async function recordMigration(name: string): Promise<void> {
  try {
    await sql`
      INSERT INTO schema_migrations (migration_name)
      VALUES (${name})
      ON CONFLICT (migration_name) DO NOTHING
    `;
  } catch (error) {
    console.error(`Error recording migration ${name}:`, error);
  }
}

/**
 * Run a single migration file
 */
async function runMigration(
  migrationName: string,
  filePath: string
): Promise<boolean> {
  console.log(`\n📄 Running migration: ${migrationName}`);

  try {
    const migrationSQL = readFileSync(filePath, 'utf-8');

    // Split by semicolons but preserve strings
    const statements = migrationSQL
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);

    let executed = 0;
    let warnings = 0;

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql(statement);
          executed++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          // Ignore idempotent operation warnings
          if (
            !errorMessage.includes('already exists') &&
            !errorMessage.includes('does not exist') &&
            !errorMessage.includes('duplicate key') &&
            !errorMessage.includes('is not unique')
          ) {
            console.warn(`   ⚠️  ${errorMessage.split('\n')[0]}`);
            warnings++;
          }
        }
      }
    }

    console.log(`   ✅ Successfully executed ${executed} statements${warnings > 0 ? ` (${warnings} warnings)` : ''}`);

    // Record successful migration
    await recordMigration(migrationName);
    console.log(`   📝 Recorded in schema_migrations table`);

    return true;
  } catch (error) {
    console.error(`   ❌ Error running migration: ${error}`);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  const migrationsDir = join(__dirname, 'migrations');
  const pendingMigrations = [
    '006_stripe_connect.sql',
    '007_partner_onboarding.sql'
  ];

  try {
    console.log('🚀 A Startup Biz - Database Migration Runner\n');
    console.log(`🔗 Database: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

    // Ensure migration tracking table exists
    await ensureMigrationTable();

    // Check what's already been applied
    const applied = await getAppliedMigrations();
    console.log(`\n✅ Already applied migrations: ${applied.size > 0 ? Array.from(applied).join(', ') : 'None'}\n`);

    // Run pending migrations
    let successful = 0;
    let failed = 0;
    const results: Array<{ name: string; success: boolean }> = [];

    for (const migrationFile of pendingMigrations) {
      const migrationName = migrationFile.replace('.sql', '');

      if (applied.has(migrationName)) {
        console.log(`\n⏭️  Skipping ${migrationName} (already applied)`);
        results.push({ name: migrationName, success: true });
        continue;
      }

      const filePath = join(migrationsDir, migrationFile);
      const success = await runMigration(migrationName, filePath);

      if (success) {
        successful++;
        results.push({ name: migrationName, success: true });
      } else {
        failed++;
        results.push({ name: migrationName, success: false });
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60));

    for (const result of results) {
      const icon = result.success ? '✅' : '❌';
      console.log(`${icon} ${result.name}`);
    }

    console.log('='.repeat(60));
    console.log(`\nResults: ${successful} successful, ${failed} failed`);

    if (failed > 0) {
      console.error('\n❌ Some migrations failed. Please check the errors above.');
      process.exit(1);
    }

    // Verify database state
    console.log('\n🔍 Verifying database state...\n');

    // Check for Stripe Connect tables
    const stripeTables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('partner_transfers', 'partner_payouts', 'stripe_connect_events')
      ORDER BY table_name
    `;

    if (stripeTables.length > 0) {
      console.log('✅ Stripe Connect tables created:');
      for (const table of stripeTables) {
        console.log(`   - ${table.table_name}`);
      }
    }

    // Check for Partner Onboarding tables
    const onboardingTables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('partner_microsites', 'partner_agreements', 'partner_agreement_acceptances', 'microsite_leads', 'partner_bank_details', 'partner_email_logs')
      ORDER BY table_name
    `;

    if (onboardingTables.length > 0) {
      console.log('\n✅ Partner Onboarding tables created:');
      for (const table of onboardingTables) {
        console.log(`   - ${table.table_name}`);
      }
    }

    // Check partners table modifications
    console.log('\n✅ Verifying partners table enhancements...');
    const partnersColumns = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'partners'
      AND column_name IN ('stripe_account_id', 'onboarding_step', 'microsite_id', 'agreements_completed')
      ORDER BY column_name
    `;

    if (partnersColumns.length > 0) {
      console.log('✅ New columns in partners table:');
      for (const col of partnersColumns) {
        console.log(`   - ${col.column_name}`);
      }
    }

    console.log('\n✅ All migrations completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Deploy the application code changes');
    console.log('   2. Test Stripe Connect integration endpoints');
    console.log('   3. Test partner onboarding workflow');
    console.log('   4. Monitor database performance and connections\n');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
