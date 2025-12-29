#!/usr/bin/env tsx

/**
 * Voice Agent Setup Checker
 *
 * Verifies that all required environment variables and dependencies
 * are properly configured for the voice agent system.
 */

import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: CheckResult[] = [];

/**
 * Add check result
 */
function addCheck(name: string, status: 'pass' | 'fail' | 'warning', message: string): void {
  results.push({ name, status, message });
}

/**
 * Check environment variable
 */
function checkEnvVar(name: string, required: boolean = true): boolean {
  const value = process.env[name];
  const exists = !!value && value.trim().length > 0;

  if (exists) {
    addCheck(name, 'pass', `Set (${value.substring(0, 20)}...)`);
    return true;
  } else if (required) {
    addCheck(name, 'fail', 'Not set (required)');
    return false;
  } else {
    addCheck(name, 'warning', 'Not set (optional)');
    return false;
  }
}

/**
 * Check package dependencies
 */
function checkDependencies(): void {
  try {
    const pkg = require('../package.json');
    const deps = pkg.dependencies || {};

    const requiredDeps = [
      'livekit-client',
      'livekit-server-sdk',
      '@livekit/components-react',
    ];

    requiredDeps.forEach(dep => {
      if (deps[dep]) {
        addCheck(
          `Dependency: ${dep}`,
          'pass',
          `Installed (${deps[dep]})`
        );
      } else {
        addCheck(
          `Dependency: ${dep}`,
          'fail',
          'Not installed'
        );
      }
    });

  } catch (error) {
    addCheck('Package Check', 'fail', 'Could not read package.json');
  }
}

/**
 * Test OpenAI API connection
 */
async function testOpenAIConnection(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    addCheck('OpenAI Connection', 'fail', 'API key not set');
    return;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      addCheck('OpenAI Connection', 'pass', 'API connection successful');
    } else {
      const error = await response.text();
      addCheck('OpenAI Connection', 'fail', `API error: ${response.status}`);
    }
  } catch (error) {
    addCheck(
      'OpenAI Connection',
      'fail',
      `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Test LiveKit connection
 */
async function testLiveKitConnection(): Promise<void> {
  const host = process.env.LIVEKIT_HOST;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!host || !apiKey || !apiSecret) {
    addCheck('LiveKit Connection', 'fail', 'Credentials not set');
    return;
  }

  try {
    // Test by trying to import the SDK
    const { RoomServiceClient } = await import('livekit-server-sdk');

    const client = new RoomServiceClient(
      host.replace('wss://', 'https://'),
      apiKey,
      apiSecret
    );

    // Try to list rooms (this will fail gracefully if auth is wrong)
    await client.listRooms();

    addCheck('LiveKit Connection', 'pass', 'SDK initialized successfully');

  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      addCheck('LiveKit Connection', 'fail', 'Authentication failed');
    } else {
      addCheck(
        'LiveKit Connection',
        'warning',
        'Could not verify connection (may still work)'
      );
    }
  }
}

/**
 * Print results
 */
function printResults(): void {
  console.log('\n=================================');
  console.log('Voice Agent Setup Check Results');
  console.log('=================================\n');

  const groupedResults = {
    'Environment Variables': results.filter(r => r.name.startsWith('NEXT_PUBLIC_') || r.name.includes('_')),
    'Dependencies': results.filter(r => r.name.startsWith('Dependency:')),
    'Connections': results.filter(r => r.name.includes('Connection')),
  };

  for (const [group, items] of Object.entries(groupedResults)) {
    if (items.length === 0) continue;

    console.log(`${group}:`);
    console.log('-'.repeat(50));

    items.forEach(result => {
      const icon = result.status === 'pass' ? '✓' : result.status === 'fail' ? '✗' : '⚠';
      const color =
        result.status === 'pass'
          ? '\x1b[32m' // green
          : result.status === 'fail'
          ? '\x1b[31m' // red
          : '\x1b[33m'; // yellow
      const reset = '\x1b[0m';

      console.log(`${color}${icon}${reset} ${result.name}`);
      console.log(`  ${result.message}`);
    });

    console.log('');
  }

  // Summary
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  console.log('Summary:');
  console.log('-'.repeat(50));
  console.log(`✓ Passed: ${passed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`⚠ Warnings: ${warnings}`);
  console.log('');

  if (failed > 0) {
    console.log('\x1b[31mSetup incomplete. Please fix the failed checks above.\x1b[0m');
    console.log('\nRefer to docs/VOICE_AGENT.md for setup instructions.\n');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\x1b[33mSetup mostly complete, but some optional items are missing.\x1b[0m\n');
  } else {
    console.log('\x1b[32mAll checks passed! Voice agent is ready to use.\x1b[0m\n');
  }
}

/**
 * Main execution
 */
async function main(): Promise<void> {
  console.log('Checking voice agent setup...\n');

  // Check environment variables
  console.log('Checking environment variables...');
  checkEnvVar('LIVEKIT_HOST', true);
  checkEnvVar('LIVEKIT_API_KEY', true);
  checkEnvVar('LIVEKIT_API_SECRET', true);
  checkEnvVar('OPENAI_API_KEY', true);
  checkEnvVar('NEXT_PUBLIC_APP_URL', false);

  // Check dependencies
  console.log('Checking dependencies...');
  checkDependencies();

  // Test connections
  console.log('Testing API connections...');
  await testOpenAIConnection();
  await testLiveKitConnection();

  // Print results
  printResults();
}

// Run the checks
main().catch(error => {
  console.error('Error running setup check:', error);
  process.exit(1);
});
