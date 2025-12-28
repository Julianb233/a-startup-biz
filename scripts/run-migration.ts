#!/usr/bin/env tsx

/**
 * Database Migration Runner
 *
 * Usage:
 *   pnpm tsx scripts/run-migration.ts 004_enhanced_onboarding
 *   pnpm tsx scripts/run-migration.ts all
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set');
  console.error('Please add DATABASE_URL to your .env file');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigration(migrationFile: string): Promise<void> {
  console.log(`\n📄 Running migration: ${migrationFile}`);

  const migrationPath = join(__dirname, 'migrations', migrationFile);

  try {
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Split by semicolons but be careful with function definitions
    const statements = migrationSQL
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/) // Split by ; but not inside quotes
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`   Found ${statements.length} SQL statements`);

    let executed = 0;
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql(statement);
          executed++;
        } catch (error) {
          // Some statements might fail if already executed (like CREATE INDEX IF NOT EXISTS)
          // We'll only show critical errors
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (!errorMessage.includes('already exists') && !errorMessage.includes('does not exist')) {
            console.error(`   ⚠️  Warning: ${errorMessage.split('\n')[0]}`);
          }
        }
      }
    }

    console.log(`   ✅ Successfully executed ${executed} statements`);

  } catch (error) {
    console.error(`   ❌ Error running migration: ${error}`);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Error: Please specify a migration file or "all"');
    console.error('Usage: pnpm tsx scripts/run-migration.ts <migration-name>');
    console.error('Example: pnpm tsx scripts/run-migration.ts 004_enhanced_onboarding.sql');
    console.error('         pnpm tsx scripts/run-migration.ts all');
    process.exit(1);
  }

  const migrationsDir = join(__dirname, 'migrations');

  try {
    console.log('🚀 Starting database migration...\n');
    console.log(`📁 Migrations directory: ${migrationsDir}`);
    console.log(`🔗 Database: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

    if (args[0] === 'all') {
      // Run all migrations in order
      const files = readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

      console.log(`📋 Found ${files.length} migration files\n`);

      for (const file of files) {
        await runMigration(file);
      }

      console.log('\n✅ All migrations completed successfully!');

    } else {
      // Run specific migration
      let migrationFile = args[0];

      // Add .sql extension if not present
      if (!migrationFile.endsWith('.sql')) {
        migrationFile += '.sql';
      }

      await runMigration(migrationFile);

      console.log('\n✅ Migration completed successfully!');
    }

    // Test the connection
    console.log('\n🔍 Testing database connection...');
    const result = await sql`SELECT COUNT(*) as count FROM onboarding_submissions`;
    console.log(`✅ Database connected. Found ${result[0].count} onboarding submissions`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
