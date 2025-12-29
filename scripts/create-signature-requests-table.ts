import { sql } from '@vercel/postgres'

/**
 * Create tables for document signing functionality
 *
 * Tables:
 * - signature_requests: Main signature request records
 * - signature_events: Event log for signature activities
 *
 * Run: npm run db:signature-requests
 */
async function createSignatureRequestsTables() {
  try {
    console.log('Creating signature_requests table...')

    // Create signature_requests table
    await sql`
      CREATE TABLE IF NOT EXISTS signature_requests (
        id SERIAL PRIMARY KEY,
        signature_request_id VARCHAR(255) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        document_type VARCHAR(100) NOT NULL,
        title VARCHAR(500) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'awaiting_signature',
        embedded BOOLEAN DEFAULT false,
        signers JSONB NOT NULL,
        metadata JSONB DEFAULT '{}',
        signed_document_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE,
        INDEX idx_signature_request_id (signature_request_id),
        INDEX idx_user_id (user_id),
        INDEX idx_document_type (document_type),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      )
    `

    console.log('Created signature_requests table')

    // Create signature_events table
    console.log('Creating signature_events table...')

    await sql`
      CREATE TABLE IF NOT EXISTS signature_events (
        id SERIAL PRIMARY KEY,
        signature_request_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        signer_email VARCHAR(255),
        event_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        event_hash VARCHAR(255),
        event_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        INDEX idx_signature_request_id (signature_request_id),
        INDEX idx_event_type (event_type),
        INDEX idx_signer_email (signer_email),
        INDEX idx_event_time (event_time),
        FOREIGN KEY (signature_request_id)
          REFERENCES signature_requests(signature_request_id)
          ON DELETE CASCADE
      )
    `

    console.log('Created signature_events table')

    // Create function to auto-update updated_at
    await sql`
      CREATE OR REPLACE FUNCTION update_signature_requests_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `

    await sql`
      DROP TRIGGER IF EXISTS update_signature_requests_updated_at_trigger
      ON signature_requests
    `

    await sql`
      CREATE TRIGGER update_signature_requests_updated_at_trigger
      BEFORE UPDATE ON signature_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_signature_requests_updated_at()
    `

    console.log('Created triggers for auto-updating timestamps')

    console.log('✅ All signature request tables created successfully!')
  } catch (error) {
    console.error('Error creating signature request tables:', error)
    throw error
  }
}

createSignatureRequestsTables()
  .then(() => {
    console.log('Database setup completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Database setup failed:', error)
    process.exit(1)
  })
