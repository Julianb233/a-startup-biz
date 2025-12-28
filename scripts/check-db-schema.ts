#!/usr/bin/env tsx

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);

async function checkSchema() {
  console.log('🔍 Checking onboarding_submissions table schema...\n');

  try {
    // Get table columns
    const columns = await sql`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'onboarding_submissions'
      ORDER BY ordinal_position
    `;

    console.log('📋 Current table structure:');
    console.log('─'.repeat(80));
    columns.forEach((col: any) => {
      console.log(`Column: ${col.column_name.padEnd(25)} Type: ${col.data_type.padEnd(20)} Nullable: ${col.is_nullable}`);
    });
    console.log('─'.repeat(80));

    // Get table indexes
    const indexes = await sql`
      SELECT
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename = 'onboarding_submissions'
      ORDER BY indexname
    `;

    console.log('\n📑 Table indexes:');
    console.log('─'.repeat(80));
    indexes.forEach((idx: any) => {
      console.log(`Index: ${idx.indexname}`);
      console.log(`  ${idx.indexdef}`);
    });
    console.log('─'.repeat(80));

    // Check if enhanced fields exist
    const requiredColumns = ['form_data', 'source', 'ip_address', 'user_agent', 'referral_code', 'completion_percentage'];
    const existingColumns = columns.map((c: any) => c.column_name);

    console.log('\n✅ Enhanced onboarding fields:');
    requiredColumns.forEach(col => {
      const exists = existingColumns.includes(col);
      console.log(`  ${exists ? '✓' : '✗'} ${col} ${exists ? '(exists)' : '(MISSING)'}`);
    });

    // Count records
    const count = await sql`SELECT COUNT(*) as count FROM onboarding_submissions`;
    console.log(`\n📊 Total submissions: ${count[0].count}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSchema();
