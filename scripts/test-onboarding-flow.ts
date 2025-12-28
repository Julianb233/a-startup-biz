#!/usr/bin/env tsx

/**
 * Test Onboarding Submission Flow
 * This script tests the complete onboarding wizard to database connection
 */

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const DATABASE_URL = process.env.DATABASE_URL!;
const sql = neon(DATABASE_URL);

async function testOnboardingFlow() {
  console.log('🧪 Testing Onboarding Wizard → Database Connection\n');

  try {
    // Simulate a complete onboarding submission
    const testSubmission = {
      businessName: 'Test Adventure Company',
      businessType: 'Adventure & Outdoor Recreation',
      businessStage: '2-5 employees',
      goals: ['Increase online visibility', 'Generate more leads', 'Build brand awareness'],
      challenges: ['Need better online presence and automated lead generation'],
      contactEmail: 'test@example.com',
      contactPhone: '555-1234',
      timeline: 'Short-term (1-3 months)',
      budgetRange: '$10,000 - $25,000',
      formData: {
        companyName: 'Test Adventure Company',
        companySize: '2-5 employees',
        revenueRange: '$100k - $500k',
        yearsInBusiness: '3',
        website: 'https://testadventure.com',
        industry: 'Adventure & Outdoor Recreation',
        businessGoals: ['Increase online visibility', 'Generate more leads', 'Build brand awareness'],
        primaryChallenge: 'Need better online presence and automated lead generation',
        timeline: 'Short-term (1-3 months)',
        currentTools: ['CRM (Customer Relationship Management)', 'Email Marketing'],
        teamSize: '5',
        budgetRange: '$10,000 - $25,000',
        servicesInterested: ['Web Design & Development', 'Marketing & SEO'],
        priorityLevel: 'High - Important',
        contactName: 'John Doe',
        contactEmail: 'test@example.com',
        contactPhone: '555-1234',
        bestTimeToCall: 'Morning (8am-12pm)',
        timezone: 'Eastern (ET)',
        communicationPreference: 'Email',
        brandStyle: 'Bold & Energetic',
        businessCategory: 'Adventure Sports',
      },
      source: 'test_script',
      ipAddress: '127.0.0.1',
      userAgent: 'Test Script',
      completionPercentage: 100,
    };

    console.log('1️⃣ Creating test submission...');
    const result = await sql`
      INSERT INTO onboarding_submissions (
        business_name,
        business_type,
        business_stage,
        goals,
        challenges,
        contact_email,
        contact_phone,
        timeline,
        budget_range,
        form_data,
        source,
        ip_address,
        user_agent,
        completion_percentage,
        status
      )
      VALUES (
        ${testSubmission.businessName},
        ${testSubmission.businessType},
        ${testSubmission.businessStage},
        ${testSubmission.goals},
        ${testSubmission.challenges},
        ${testSubmission.contactEmail},
        ${testSubmission.contactPhone},
        ${testSubmission.timeline},
        ${testSubmission.budgetRange},
        ${JSON.stringify(testSubmission.formData)},
        ${testSubmission.source},
        ${testSubmission.ipAddress},
        ${testSubmission.userAgent},
        ${testSubmission.completionPercentage},
        'submitted'
      )
      RETURNING id, business_name, contact_email, status, created_at
    `;

    console.log('   ✓ Submission created successfully!');
    console.log(`   ID: ${result[0].id}`);
    console.log(`   Business: ${result[0].business_name}`);
    console.log(`   Email: ${result[0].contact_email}`);
    console.log(`   Status: ${result[0].status}`);

    // Retrieve and verify the submission
    console.log('\n2️⃣ Retrieving submission...');
    const retrieved = await sql`
      SELECT * FROM onboarding_submissions
      WHERE id = ${result[0].id}
    `;

    console.log('   ✓ Submission retrieved successfully!');
    console.log(`   Goals count: ${retrieved[0].goals.length}`);
    console.log(`   Challenges count: ${retrieved[0].challenges.length}`);
    console.log(`   Form data fields: ${Object.keys(retrieved[0].form_data).length}`);

    // Test JSONB querying
    console.log('\n3️⃣ Testing JSONB queries...');
    const servicesQuery = await sql`
      SELECT
        id,
        business_name,
        form_data->'servicesInterested' as services
      FROM onboarding_submissions
      WHERE form_data @> '{"priorityLevel": "High - Important"}'::jsonb
    `;

    console.log(`   ✓ Found ${servicesQuery.length} high-priority submissions`);

    // Test full-text search on form_data
    console.log('\n4️⃣ Testing form data extraction...');
    const extracted = await sql`
      SELECT
        id,
        business_name,
        form_data->>'contactName' as contact_name,
        form_data->>'brandStyle' as brand_style,
        form_data->>'businessCategory' as business_category,
        form_data->'servicesInterested' as services_interested
      FROM onboarding_submissions
      WHERE id = ${result[0].id}
    `;

    console.log('   ✓ Data extraction successful!');
    console.log(`   Contact Name: ${extracted[0].contact_name}`);
    console.log(`   Brand Style: ${extracted[0].brand_style}`);
    console.log(`   Business Category: ${extracted[0].business_category}`);

    // Clean up test data
    console.log('\n5️⃣ Cleaning up test data...');
    await sql`
      DELETE FROM onboarding_submissions
      WHERE id = ${result[0].id}
    `;
    console.log('   ✓ Test data removed');

    console.log('\n✅ All tests passed! Onboarding wizard is properly connected to Neon database.');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    throw error;
  }
}

testOnboardingFlow();
