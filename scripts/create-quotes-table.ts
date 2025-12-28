/**
 * Create Quotes Table Migration
 * Sets up database table for storing generated quotes
 */

import { neon } from '@neondatabase/serverless'

async function createQuotesTable() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  console.log('📊 Connecting to database...')
  const sql = neon(databaseUrl)

  try {
    console.log('📝 Creating quotes table...')

    await sql`
      CREATE TABLE IF NOT EXISTS quotes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT,
        onboarding_submission_id UUID REFERENCES onboarding_submissions(id) ON DELETE SET NULL,
        quote_number VARCHAR(50) UNIQUE NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        quote_data JSONB NOT NULL,
        pdf_url TEXT,
        pdf_storage_path TEXT,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
        subtotal DECIMAL(10, 2) NOT NULL,
        tax_amount DECIMAL(10, 2) DEFAULT 0,
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) NOT NULL,
        issue_date TIMESTAMP NOT NULL,
        expiry_date TIMESTAMP NOT NULL,
        sent_at TIMESTAMP,
        accepted_at TIMESTAMP,
        rejected_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `

    console.log('✅ Quotes table created successfully')

    console.log('📝 Creating indexes...')

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_onboarding_submission_id ON quotes(onboarding_submission_id);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_customer_email ON quotes(customer_email);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_quote_number ON quotes(quote_number);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quotes_expiry_date ON quotes(expiry_date);
    `

    console.log('✅ Indexes created successfully')

    console.log('📝 Creating updated_at trigger...')

    await sql`
      CREATE OR REPLACE FUNCTION update_quotes_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `

    await sql`
      DROP TRIGGER IF EXISTS quotes_updated_at_trigger ON quotes;
    `

    await sql`
      CREATE TRIGGER quotes_updated_at_trigger
      BEFORE UPDATE ON quotes
      FOR EACH ROW
      EXECUTE FUNCTION update_quotes_updated_at();
    `

    console.log('✅ Trigger created successfully')

    console.log('📝 Creating quote_line_items table for detailed tracking...')

    await sql`
      CREATE TABLE IF NOT EXISTS quote_line_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        category VARCHAR(100),
        quantity DECIMAL(10, 2) NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_id ON quote_line_items(quote_id);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quote_line_items_sort_order ON quote_line_items(quote_id, sort_order);
    `

    console.log('✅ Quote line items table created successfully')

    console.log('📝 Creating quote_activities table for audit trail...')

    await sql`
      CREATE TABLE IF NOT EXISTS quote_activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
        activity_type VARCHAR(50) NOT NULL,
        description TEXT,
        performed_by TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quote_activities_quote_id ON quote_activities(quote_id);
    `

    await sql`
      CREATE INDEX IF NOT EXISTS idx_quote_activities_created_at ON quote_activities(created_at DESC);
    `

    console.log('✅ Quote activities table created successfully')

    console.log('\n📋 Verifying tables...')
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('quotes', 'quote_line_items', 'quote_activities')
      ORDER BY table_name
    `

    console.log('\n✅ Created tables:')
    tables.forEach((t: { table_name: string }) => {
      console.log(`   - ${t.table_name}`)
    })

    console.log('\n🎉 Quote system database setup complete!')
  } catch (error) {
    console.error('❌ Error creating quotes tables:', error)
    process.exit(1)
  }
}

createQuotesTable()
