/**
 * Email System Test Script
 * Run this to verify the email system is working correctly
 *
 * Usage:
 *   node --loader ts-node/esm lib/email/test-email.ts
 *   or import and run testEmailSystem() from a Next.js API route
 */

import { sendEmail, sendEmailWithTemplate } from './send';
import { WelcomeEmail, OnboardingConfirmation, PaymentInvoice } from './templates';

export async function testEmailSystem(testEmail: string = 'test@example.com') {
  console.log('🧪 Testing Email System...\n');

  const results = {
    directEmail: false,
    welcomeTemplate: false,
    onboardingTemplate: false,
    invoiceTemplate: false,
  };

  // Test 1: Direct email sending
  console.log('1️⃣ Testing direct email sending...');
  try {
    const result1 = await sendEmail({
      to: testEmail,
      subject: 'Test Email - Direct Send',
      html: '<h1>Test Email</h1><p>This is a test email from A Startup Biz.</p>',
      text: 'Test Email\n\nThis is a test email from A Startup Biz.',
    });

    if (result1.success) {
      console.log('✅ Direct email test passed');
      if (result1.mock) {
        console.log('   (Mock mode - no actual email sent)');
      }
      results.directEmail = true;
    } else {
      console.log('❌ Direct email test failed:', result1.error);
    }
  } catch (error) {
    console.log('❌ Direct email test error:', error);
  }

  console.log('');

  // Test 2: Welcome email template
  console.log('2️⃣ Testing Welcome email template...');
  try {
    const result2 = await sendEmailWithTemplate(
      WelcomeEmail({
        name: 'Test User',
        accountType: 'free',
      }),
      {
        to: testEmail,
        subject: 'Welcome to A Startup Biz!',
      }
    );

    if (result2.success) {
      console.log('✅ Welcome template test passed');
      if (result2.mock) {
        console.log('   (Mock mode - no actual email sent)');
      }
      results.welcomeTemplate = true;
    } else {
      console.log('❌ Welcome template test failed:', result2.error);
    }
  } catch (error) {
    console.log('❌ Welcome template test error:', error);
  }

  console.log('');

  // Test 3: Onboarding confirmation template
  console.log('3️⃣ Testing Onboarding Confirmation template...');
  try {
    const result3 = await sendEmailWithTemplate(
      OnboardingConfirmation({
        customerName: 'Test User',
        businessName: 'Test Startup Inc.',
      }),
      {
        to: testEmail,
        subject: 'We Received Your Onboarding Information',
      }
    );

    if (result3.success) {
      console.log('✅ Onboarding template test passed');
      if (result3.mock) {
        console.log('   (Mock mode - no actual email sent)');
      }
      results.onboardingTemplate = true;
    } else {
      console.log('❌ Onboarding template test failed:', result3.error);
    }
  } catch (error) {
    console.log('❌ Onboarding template test error:', error);
  }

  console.log('');

  // Test 4: Payment invoice template
  console.log('4️⃣ Testing Payment Invoice template...');
  try {
    const result4 = await sendEmailWithTemplate(
      PaymentInvoice({
        customerName: 'Test User',
        invoiceNumber: 'TEST-001',
        items: [
          {
            name: 'Website Design',
            description: 'Custom responsive website',
            price: 2500,
            quantity: 1,
          },
          {
            name: 'SEO Package',
            price: 500,
            quantity: 1,
          },
        ],
        subtotal: 3000,
        tax: 240,
        total: 3240,
        dueDate: '2025-01-31',
        paymentLink: 'https://pay.astartupbiz.com/invoice/TEST-001',
      }),
      {
        to: testEmail,
        subject: 'Invoice TEST-001 - Payment Required',
      }
    );

    if (result4.success) {
      console.log('✅ Invoice template test passed');
      if (result4.mock) {
        console.log('   (Mock mode - no actual email sent)');
      }
      results.invoiceTemplate = true;
    } else {
      console.log('❌ Invoice template test failed:', result4.error);
    }
  } catch (error) {
    console.log('❌ Invoice template test error:', error);
  }

  console.log('');

  // Summary
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  console.log('📊 Test Summary');
  console.log('═══════════════');
  console.log(`Passed: ${passed}/${total}`);
  console.log('');

  if (passed === total) {
    console.log('🎉 All tests passed! Email system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
    console.log('');
    console.log('Common issues:');
    console.log('- Missing @react-email/render: npm install @react-email/render');
    console.log('- Missing RESEND_API_KEY: Check .env.local');
    console.log('- Invalid API key: Verify key at resend.com');
  }

  return results;
}

// Run tests if executed directly
if (require.main === module) {
  const testEmail = process.argv[2] || 'test@example.com';
  testEmailSystem(testEmail).catch(console.error);
}
