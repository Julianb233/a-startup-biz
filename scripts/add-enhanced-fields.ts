#!/usr/bin/env tsx

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);

async function addEnhancedFields() {
  console.log('🚀 Adding enhanced onboarding fields...\n');

  try {
    // Add form_data JSONB column
    console.log('1️⃣ Adding form_data column...');
    await sql`
      ALTER TABLE onboarding_submissions
      ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}'::jsonb
    `;
    console.log('   ✓ form_data column added');

    // Add source column
    console.log('2️⃣ Adding source column...');
    await sql`
      ALTER TABLE onboarding_submissions
      ADD COLUMN IF NOT EXISTS source VARCHAR(100) DEFAULT 'onboarding_form'
    `;
    console.log('   ✓ source column added');

    // Add ip_address column
    console.log('3️⃣ Adding ip_address column...');
    await sql`
      ALTER TABLE onboarding_submissions
      ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45)
    `;
    console.log('   ✓ ip_address column added');

    // Add user_agent column
    console.log('4️⃣ Adding user_agent column...');
    await sql`
      ALTER TABLE onboarding_submissions
      ADD COLUMN IF NOT EXISTS user_agent TEXT
    `;
    console.log('   ✓ user_agent column added');

    // Add referral_code column
    console.log('5️⃣ Adding referral_code column...');
    await sql`
      ALTER TABLE onboarding_submissions
      ADD COLUMN IF NOT EXISTS referral_code VARCHAR(50)
    `;
    console.log('   ✓ referral_code column added');

    // Add completion_percentage column
    console.log('6️⃣ Adding completion_percentage column...');
    await sql`
      ALTER TABLE onboarding_submissions
      ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 100
    `;
    console.log('   ✓ completion_percentage column added');

    // Create indexes
    console.log('\n📑 Creating indexes...');

    console.log('   Creating GIN index on form_data...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_onboarding_form_data_gin
      ON onboarding_submissions USING GIN (form_data)
    `;
    console.log('   ✓ GIN index created');

    console.log('   Creating index on contact_email...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_onboarding_contact_email
      ON onboarding_submissions(contact_email)
    `;
    console.log('   ✓ contact_email index created');

    console.log('   Creating index on created_at...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_onboarding_created_at
      ON onboarding_submissions(created_at DESC)
    `;
    console.log('   ✓ created_at index created');

    console.log('   Creating composite index on status + created_at...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_onboarding_status_created
      ON onboarding_submissions(status, created_at DESC)
    `;
    console.log('   ✓ composite index created');

    // Add constraints
    console.log('\n🔒 Adding constraints...');

    console.log('   Adding completion_percentage check...');
    await sql`
      ALTER TABLE onboarding_submissions
      DROP CONSTRAINT IF EXISTS check_completion_percentage
    `;
    await sql`
      ALTER TABLE onboarding_submissions
      ADD CONSTRAINT check_completion_percentage
      CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
    `;
    console.log('   ✓ completion_percentage constraint added');

    console.log('   Adding email format check...');
    await sql`
      ALTER TABLE onboarding_submissions
      DROP CONSTRAINT IF EXISTS check_contact_email_format
    `;
    await sql`
      ALTER TABLE onboarding_submissions
      ADD CONSTRAINT check_contact_email_format
      CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
    `;
    console.log('   ✓ email format constraint added');

    // Analyze table
    console.log('\n📊 Analyzing table...');
    await sql`ANALYZE onboarding_submissions`;
    console.log('   ✓ Table analyzed');

    console.log('\n✅ All enhanced fields added successfully!');

    // Verify
    const columns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'onboarding_submissions'
      AND column_name IN ('form_data', 'source', 'ip_address', 'user_agent', 'referral_code', 'completion_percentage')
    `;

    console.log('\n🔍 Verification:');
    console.log(`   Found ${columns.length}/6 enhanced columns`);
    columns.forEach((col: any) => {
      console.log(`   ✓ ${col.column_name}`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  }
}

addEnhancedFields();
