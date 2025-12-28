#!/usr/bin/env node

/**
 * Email System Package Check
 * Verifies all required packages are installed
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Email System Dependencies...\n');

// Read package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const dependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

// Required packages
const required = {
  'resend': {
    required: true,
    reason: 'Email delivery service',
  },
  '@react-email/render': {
    required: true,
    reason: 'Render React components to HTML',
  },
  'react': {
    required: true,
    reason: 'React for email templates',
  },
};

let allInstalled = true;
let missingPackages = [];

console.log('Required Packages:');
console.log('═'.repeat(50));

for (const [pkg, info] of Object.entries(required)) {
  const installed = dependencies[pkg];

  if (installed) {
    console.log(`✅ ${pkg.padEnd(30)} ${installed}`);
  } else {
    console.log(`❌ ${pkg.padEnd(30)} MISSING`);
    console.log(`   └─ ${info.reason}`);
    allInstalled = false;
    missingPackages.push(pkg);
  }
}

console.log('═'.repeat(50));
console.log('');

// Check .env.example
const envExamplePath = path.join(process.cwd(), '.env.example');
console.log('Configuration Files:');
console.log('═'.repeat(50));

if (fs.existsSync(envExamplePath)) {
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  const hasResendKey = envContent.includes('RESEND_API_KEY');
  const hasEmailFrom = envContent.includes('EMAIL_FROM');

  if (hasResendKey && hasEmailFrom) {
    console.log('✅ .env.example configured correctly');
  } else {
    console.log('⚠️  .env.example missing email variables');
  }
} else {
  console.log('⚠️  .env.example not found');
}

// Check .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const hasResendKey = envContent.includes('RESEND_API_KEY=re_');

  if (hasResendKey) {
    console.log('✅ .env.local has RESEND_API_KEY configured');
  } else {
    console.log('⚠️  .env.local exists but RESEND_API_KEY may not be set');
  }
} else {
  console.log('⚠️  .env.local not found (create from .env.example)');
}

console.log('═'.repeat(50));
console.log('');

// Check email directory structure
console.log('Email System Files:');
console.log('═'.repeat(50));

const emailFiles = [
  'lib/email/send.ts',
  'lib/email/components/EmailLayout.tsx',
  'lib/email/templates/welcome.tsx',
  'lib/email/templates/onboarding-confirmation.tsx',
  'lib/email/templates/payment-invoice.tsx',
  'lib/email/templates/index.ts',
  'app/api/email/send/route.ts',
];

let filesOk = true;
for (const file of emailFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} MISSING`);
    filesOk = false;
  }
}

console.log('═'.repeat(50));
console.log('');

// Final summary
console.log('Summary:');
console.log('═'.repeat(50));

if (allInstalled && filesOk) {
  console.log('✅ All packages installed');
  console.log('✅ All files present');
  console.log('');
  console.log('🎉 Email system is ready to use!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Set RESEND_API_KEY in .env.local');
  console.log('2. Test with: curl http://localhost:3000/api/email/send');
} else {
  if (!allInstalled) {
    console.log('❌ Missing packages detected');
    console.log('');
    console.log('Install missing packages:');
    console.log(`npm install ${missingPackages.join(' ')}`);
  }

  if (!filesOk) {
    console.log('❌ Some email system files are missing');
    console.log('   Check the implementation or re-run setup');
  }

  console.log('');
  console.log('📖 See lib/email/INSTALL.md for setup instructions');
}

console.log('═'.repeat(50));

process.exit(allInstalled && filesOk ? 0 : 1);
