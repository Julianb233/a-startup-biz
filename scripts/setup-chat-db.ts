/**
 * Chat Database Setup Script
 *
 * Run this script to create the chat system database tables
 * Usage: npm run db:chat or tsx scripts/setup-chat-db.ts
 */

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function setupChatDatabase() {
  console.log('Setting up chat database tables...');

  try {
    // Create chat_rooms table
    console.log('Creating chat_rooms table...');
    await sql`
      CREATE TABLE IF NOT EXISTS chat_rooms (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('support', 'private', 'group')),
        description TEXT,
        participants TEXT[] NOT NULL,
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ chat_rooms table created');

    // Create indexes for chat_rooms
    console.log('Creating indexes for chat_rooms...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_rooms_participants
      ON chat_rooms USING GIN(participants)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_rooms_type
      ON chat_rooms(type)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_rooms_updated_at
      ON chat_rooms(updated_at DESC)
    `;
    console.log('✓ chat_rooms indexes created');

    // Create chat_messages table
    console.log('Creating chat_messages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(255) PRIMARY KEY,
        room_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'text' CHECK (type IN ('text', 'image', 'file', 'system')),
        metadata JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE
      )
    `;
    console.log('✓ chat_messages table created');

    // Create indexes for chat_messages
    console.log('Creating indexes for chat_messages...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id
      ON chat_messages(room_id, created_at DESC)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id
      ON chat_messages(user_id)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_type
      ON chat_messages(type)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
      ON chat_messages(created_at DESC)
    `;
    console.log('✓ chat_messages indexes created');

    // Create chat_notifications table (optional, for future use)
    console.log('Creating chat_notifications table...');
    await sql`
      CREATE TABLE IF NOT EXISTS chat_notifications (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        room_id VARCHAR(255) NOT NULL,
        message_id VARCHAR(255),
        type VARCHAR(50) NOT NULL,
        content TEXT,
        metadata JSONB DEFAULT '{}'::jsonb,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
        FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE
      )
    `;
    console.log('✓ chat_notifications table created');

    // Create indexes for chat_notifications
    console.log('Creating indexes for chat_notifications...');
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_notifications_user_id
      ON chat_notifications(user_id, created_at DESC)
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_chat_notifications_read
      ON chat_notifications(user_id, read)
    `;
    console.log('✓ chat_notifications indexes created');

    // Create updated_at trigger function
    console.log('Creating trigger function for updated_at...');
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;
    console.log('✓ Trigger function created');

    // Create triggers for auto-updating updated_at
    console.log('Creating triggers...');
    await sql`
      DROP TRIGGER IF EXISTS update_chat_rooms_updated_at ON chat_rooms
    `;
    await sql`
      CREATE TRIGGER update_chat_rooms_updated_at
      BEFORE UPDATE ON chat_rooms
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `;

    await sql`
      DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages
    `;
    await sql`
      CREATE TRIGGER update_chat_messages_updated_at
      BEFORE UPDATE ON chat_messages
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()
    `;
    console.log('✓ Triggers created');

    console.log('\n✅ Chat database setup completed successfully!');
    console.log('\nTables created:');
    console.log('  - chat_rooms');
    console.log('  - chat_messages');
    console.log('  - chat_notifications');
    console.log('\nYou can now start using the chat system.');
  } catch (error) {
    console.error('❌ Error setting up chat database:', error);
    throw error;
  }
}

// Run setup
setupChatDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
