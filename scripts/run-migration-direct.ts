#!/usr/bin/env tsx

/**
 * Direct Database Migration Runner
 * Runs migration with environment variables from .env.local
 */

import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set');
  console.error('Please check your .env.local file');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigration(): Promise<void> {
  const migrationFile = '004_enhanced_onboarding.sql';
  console.log(`\n📄 Running migration: ${migrationFile}`);

  const migrationPath = join(__dirname, 'migrations', migrationFile);

  try {
    const migrationSQL = readFileSync(migrationPath, 'utf-8');

    // Split by semicolons but be careful with function definitions
    const statements = migrationSQL
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

    console.log(`   Found ${statements.length} SQL statements`);

    let executed = 0;
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql(statement);
          executed++;
        } catch (error) {
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
  try {
    console.log('🚀 Starting enhanced onboarding migration...\n');
    console.log(`🔗 Database: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

    await runMigration();

    // Test the connection
    console.log('\n🔍 Testing database connection...');
    const result = await sql`SELECT COUNT(*) as count FROM onboarding_submissions`;
    console.log(`✅ Database connected. Found ${result[0].count} onboarding submissions`);

    // Check if form_data column exists
    const columnCheck = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'onboarding_submissions'
      AND column_name IN ('form_data', 'source', 'ip_address', 'referral_code', 'completion_percentage')
      ORDER BY column_name
    `;

    console.log('\n📋 Enhanced onboarding columns:');
    columnCheck.forEach((col: any) => {
      console.log(`   ✓ ${col.column_name} (${col.data_type})`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
