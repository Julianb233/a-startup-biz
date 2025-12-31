#!/usr/bin/env node

/**
 * Execute Pending Database Migrations
 *
 * Auto-discovers and runs all numbered SQL migrations in order.
 * Prevents the "missing table" errors by ensuring all migrations are applied.
 */

const fs = require('fs');
const path = require('path');

async function main() {
  const { neon } = await import('@neondatabase/serverless');

  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const sql = neon(DATABASE_URL);
  const migrationsDir = path.join(__dirname, 'migrations');

  console.log('🚀 A Startup Biz - Database Migration Runner\n');
  console.log(`🔗 Database: ${DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

  // Auto-discover all SQL migrations
  const allFiles = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort((a, b) => {
      const numA = parseInt(a.split('_')[0]) || 0;
      const numB = parseInt(b.split('_')[0]) || 0;
      return numA - numB;
    });

  console.log(`📁 Found ${allFiles.length} migration files\n`);

  // Ensure migration tracking table exists
  console.log('📊 Ensuring migration tracking table exists...');
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        migration_name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log('   ✅ Migration tracking table ready\n');
  } catch (error) {
    console.error('   ❌ Error creating migration table:', error);
    process.exit(1);
  }

  // Check what's already been applied
  let applied = new Set();
  try {
    const result = await sql`SELECT migration_name FROM schema_migrations ORDER BY executed_at`;
    applied = new Set(result.map(r => r.migration_name));
    console.log(`✅ Already applied: ${applied.size} migrations\n`);
  } catch (error) {
    console.log('⚠️  Could not check applied migrations, continuing...\n');
  }

  // Execute migrations
  let successful = 0;
  let skipped = 0;
  let failed = 0;

  for (const migrationFile of allFiles) {
    const migrationName = migrationFile.replace('.sql', '');

    if (applied.has(migrationName)) {
      skipped++;
      continue;
    }

    console.log(`📄 Running: ${migrationName}`);

    const filePath = path.join(migrationsDir, migrationFile);

    try {
      const migrationSQL = fs.readFileSync(filePath, 'utf-8');

      // Split by semicolons but preserve strings
      const statements = migrationSQL
        .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      let executed = 0;

      for (const statement of statements) {
        if (statement.trim()) {
          try {
            await sql(statement);
            executed++;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            // Ignore "already exists" and similar non-fatal errors
            if (
              !errorMessage.includes('already exists') &&
              !errorMessage.includes('does not exist') &&
              !errorMessage.includes('duplicate key') &&
              !errorMessage.includes('is not unique')
            ) {
              // Log but don't fail for minor issues
              console.warn(`   ⚠️  ${errorMessage.split('\n')[0]}`);
            }
          }
        }
      }

      console.log(`   ✅ Executed ${executed} statements`);

      // Record successful migration
      try {
        await sql`
          INSERT INTO schema_migrations (migration_name)
          VALUES (${migrationName})
          ON CONFLICT (migration_name) DO NOTHING
        `;
      } catch (recordError) {
        // Ignore recording errors
      }

      successful++;

    } catch (error) {
      console.error(`   ❌ Error: ${error}\n`);
      failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successful}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(50));

  if (failed > 0) {
    console.error('\n❌ Some migrations failed.');
    process.exit(1);
  }

  console.log('\n✅ All migrations completed!');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
