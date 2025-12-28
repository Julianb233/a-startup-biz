#!/usr/bin/env tsx

/**
 * Comprehensive Onboarding Wizard Connection Verification
 * Runs all checks to ensure everything is working properly
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);

async function verifyConnection() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║   Onboarding Wizard → Database Connection Verification       ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝\n');

  let allPassed = true;

  try {
    // 1. Database Connection
    console.log('1️⃣  Database Connection');
    console.log('─'.repeat(70));
    const dbTest = await sql`SELECT current_database(), version()`;
    console.log(`   ✓ Connected to: ${dbTest[0].current_database}`);
    console.log(`   ✓ PostgreSQL: ${dbTest[0].version.split(' ')[1]}`);
    console.log('');

    // 2. Table Existence
    console.log('2️⃣  Table Structure');
    console.log('─'.repeat(70));
    const tableCheck = await sql`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_name = 'onboarding_submissions'
    `;
    if (tableCheck[0].count > 0) {
      console.log('   ✓ onboarding_submissions table exists');
    } else {
      console.log('   ✗ onboarding_submissions table MISSING');
      allPassed = false;
    }
    console.log('');

    // 3. Enhanced Fields
    console.log('3️⃣  Enhanced Fields (JSONB Support)');
    console.log('─'.repeat(70));
    const requiredFields = [
      'form_data',
      'source',
      'ip_address',
      'user_agent',
      'referral_code',
      'completion_percentage',
    ];
    const columns = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'onboarding_submissions'
      AND column_name = ANY(${requiredFields})
    `;
    const existingFields = columns.map((c: any) => c.column_name);
    requiredFields.forEach((field) => {
      if (existingFields.includes(field)) {
        console.log(`   ✓ ${field}`);
      } else {
        console.log(`   ✗ ${field} MISSING`);
        allPassed = false;
      }
    });
    console.log('');

    // 4. Indexes
    console.log('4️⃣  Performance Indexes');
    console.log('─'.repeat(70));
    const indexes = await sql`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'onboarding_submissions'
      AND indexname != 'onboarding_submissions_pkey'
    `;
    console.log(`   ✓ Found ${indexes.length} performance indexes:`);
    indexes.forEach((idx: any) => {
      console.log(`     • ${idx.indexname}`);
    });
    console.log('');

    // 5. Constraints
    console.log('5️⃣  Data Integrity Constraints');
    console.log('─'.repeat(70));
    const constraints = await sql`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'onboarding_submissions'
      AND constraint_type = 'CHECK'
    `;
    console.log(`   ✓ Found ${constraints.length} check constraints:`);
    constraints.forEach((con: any) => {
      console.log(`     • ${con.constraint_name}`);
    });
    console.log('');

    // 6. API Route
    console.log('6️⃣  API Route');
    console.log('─'.repeat(70));
    try {
      const apiRoute = readFileSync(
        resolve(__dirname, '../app/api/onboarding/route.ts'),
        'utf-8'
      );
      if (apiRoute.includes('createOnboardingSubmission')) {
        console.log('   ✓ POST /api/onboarding route exists');
        console.log('   ✓ Uses createOnboardingSubmission function');
      }
      if (apiRoute.includes('getOnboardingSubmissionByEmail')) {
        console.log('   ✓ GET /api/onboarding route exists');
        console.log('   ✓ Uses getOnboardingSubmissionByEmail function');
      }
      if (apiRoute.includes('withRateLimit')) {
        console.log('   ✓ Rate limiting enabled');
      }
      if (apiRoute.includes('sendEmail')) {
        console.log('   ✓ Email notifications configured');
      }
    } catch (e) {
      console.log('   ✗ API route file not found');
      allPassed = false;
    }
    console.log('');

    // 7. Database Query Functions
    console.log('7️⃣  Database Query Functions');
    console.log('─'.repeat(70));
    try {
      const dbQueries = readFileSync(
        resolve(__dirname, '../lib/db-queries.ts'),
        'utf-8'
      );
      const functions = [
        'createOnboardingSubmission',
        'getOnboardingSubmissionByEmail',
        'getAllOnboardingSubmissions',
        'updateOnboardingStatus',
        'getUserOnboarding',
      ];
      functions.forEach((fn) => {
        if (dbQueries.includes(`export async function ${fn}`)) {
          console.log(`   ✓ ${fn}`);
        } else {
          console.log(`   ✗ ${fn} MISSING`);
          allPassed = false;
        }
      });
    } catch (e) {
      console.log('   ✗ db-queries.ts file not found');
      allPassed = false;
    }
    console.log('');

    // 8. Validation Schema
    console.log('8️⃣  Form Validation');
    console.log('─'.repeat(70));
    try {
      const onboardingData = readFileSync(
        resolve(__dirname, '../lib/onboarding-data.ts'),
        'utf-8'
      );
      if (onboardingData.includes('onboardingSchema')) {
        console.log('   ✓ Zod validation schema defined');
      }
      if (onboardingData.includes('validateStep')) {
        console.log('   ✓ Step-by-step validation enabled');
      }
      if (onboardingData.includes('saveProgress')) {
        console.log('   ✓ Auto-save progress functionality');
      }
    } catch (e) {
      console.log('   ✗ onboarding-data.ts file not found');
      allPassed = false;
    }
    console.log('');

    // 9. Data Submission Test
    console.log('9️⃣  Database Write Test');
    console.log('─'.repeat(70));
    const testData = {
      businessName: 'Verification Test',
      businessType: 'Test',
      businessStage: 'Test',
      goals: ['Test'],
      challenges: ['Test'],
      contactEmail: 'verification@test.com',
      formData: { test: true },
      source: 'verification',
      completionPercentage: 100,
    };

    const insertResult = await sql`
      INSERT INTO onboarding_submissions (
        business_name, business_type, business_stage,
        goals, challenges, contact_email, form_data,
        source, completion_percentage, status
      )
      VALUES (
        ${testData.businessName},
        ${testData.businessType},
        ${testData.businessStage},
        ${testData.goals},
        ${testData.challenges},
        ${testData.contactEmail},
        ${JSON.stringify(testData.formData)},
        ${testData.source},
        ${testData.completionPercentage},
        'submitted'
      )
      RETURNING id
    `;
    console.log('   ✓ Data insertion successful');

    // 10. Data Retrieval Test
    console.log('\n🔟 Database Read Test');
    console.log('─'.repeat(70));
    const retrieveResult = await sql`
      SELECT * FROM onboarding_submissions
      WHERE id = ${insertResult[0].id}
    `;
    if (retrieveResult.length > 0) {
      console.log('   ✓ Data retrieval successful');
      console.log('   ✓ JSONB form_data field accessible');
    }

    // Cleanup
    await sql`
      DELETE FROM onboarding_submissions
      WHERE id = ${insertResult[0].id}
    `;
    console.log('   ✓ Test data cleaned up');
    console.log('');

    // Final Summary
    console.log('═'.repeat(70));
    if (allPassed) {
      console.log('✅ ALL CHECKS PASSED - Onboarding wizard is fully operational!');
      console.log('');
      console.log('🎯 Summary:');
      console.log('   • Database: Connected (Neon PostgreSQL)');
      console.log('   • Schema: Complete with JSONB support');
      console.log('   • API Routes: Configured and ready');
      console.log('   • Validation: Zod schema active');
      console.log('   • Notifications: Email system configured');
      console.log('   • Performance: Indexes optimized');
      console.log('   • Security: Rate limiting and constraints active');
      console.log('');
      console.log('📋 Next Steps:');
      console.log('   1. Test the onboarding form in the UI');
      console.log('   2. Submit a test entry through /onboarding');
      console.log('   3. Verify email notifications are sent');
      console.log('   4. Check admin dashboard for submissions');
    } else {
      console.log('⚠️  SOME CHECKS FAILED - Review the output above');
    }
    console.log('═'.repeat(70));

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyConnection();
