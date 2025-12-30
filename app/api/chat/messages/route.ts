import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Create chat_messages table if it doesn't exist
async function ensureChatMessagesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id VARCHAR(255) PRIMARY KEY,
      room_id VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      user_name VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      type VARCHAR(50) DEFAULT 'text',
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id
    ON chat_messages(room_id, created_at DESC)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id
    ON chat_messages(user_id)
  `;
}

// GET /api/chat/messages - Get messages for a chat room
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureChatMessagesTable();

        const searchParams = request.nextUrl.searchParams;
    const roomId = searchParams.get('roomId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const before = searchParams.get('before'); // ISO timestamp for pagination

    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // Verify user has access to this room
    const room = await sql`
      SELECT * FROM chat_rooms
      WHERE id = ${roomId}
      AND ${userId} = ANY(participants)
    `;

    if (room.length === 0) {
      return NextResponse.json(
        { error: 'Room not found or access denied' },
        { status: 404 }
      );
    }

    // Fetch messages
    let messages;
    if (before) {
      messages = await sql`
        SELECT * FROM chat_messages
        WHERE room_id = ${roomId}
        AND created_at < ${before}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else {
      messages = await sql`
        SELECT * FROM chat_messages
        WHERE room_id = ${roomId}
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }

    // Reverse to get chronological order
    const chronologicalMessages = messages.reverse();

    return NextResponse.json({
      messages: chronologicalMessages,
      total: messages.length,
      hasMore: messages.length === limit,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/chat/messages - Store a new message
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureChatMessagesTable();

        const body = await request.json();
    const { room_id, content, type = 'text', metadata = {} } = body;

    // Validate required fields
    if (!room_id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify user has access to this room
    const room = await sql`
      SELECT * FROM chat_rooms
      WHERE id = ${room_id}
      AND ${userId} = ANY(participants)
    `;

    if (room.length === 0) {
      return NextResponse.json(
        { error: 'Room not found or access denied' },
        { status: 404 }
      );
    }

    // Get user name from metadata or use userId as fallback
    const user_name = body.user_name || userId;

    // Generate message ID
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Insert message
    const [message] = await sql`
      INSERT INTO chat_messages (id, room_id, user_id, user_name, content, type, metadata)
      VALUES (${messageId}, ${room_id}, ${userId}, ${user_name}, ${content}, ${type}, ${JSON.stringify(metadata)})
      RETURNING *
    `;

    // Update room's updated_at timestamp
    await sql`
      UPDATE chat_rooms
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = ${room_id}
    `;

    return NextResponse.json({
      message,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

// PATCH /api/chat/messages - Update a message (edit)
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureChatMessagesTable();

        const body = await request.json();
    const { id, content, metadata } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns the message
    const existingMessage = await sql`
      SELECT * FROM chat_messages
      WHERE id = ${id}
      AND user_id = ${userId}
    `;

    if (existingMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message not found or access denied' },
        { status: 404 }
      );
    }

    // Update message - handle dynamic query with separate branches
    let result;

    if (content !== undefined && metadata !== undefined) {
      result = await sql`
        UPDATE chat_messages
        SET content = ${content}, metadata = ${JSON.stringify(metadata)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (content !== undefined) {
      result = await sql`
        UPDATE chat_messages
        SET content = ${content}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (metadata !== undefined) {
      result = await sql`
        UPDATE chat_messages
        SET metadata = ${JSON.stringify(metadata)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    const [message] = result;

    return NextResponse.json({
      message,
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/messages - Delete a message
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureChatMessagesTable();

        const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Check if user owns the message
    const existingMessage = await sql`
      SELECT * FROM chat_messages
      WHERE id = ${id}
      AND user_id = ${userId}
    `;

    if (existingMessage.length === 0) {
      return NextResponse.json(
        { error: 'Message not found or access denied' },
        { status: 404 }
      );
    }

    // Soft delete - update metadata instead of actual delete
    await sql`
      UPDATE chat_messages
      SET
        content = 'This message was deleted',
        metadata = jsonb_set(metadata, '{deleted}', 'true'),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    return NextResponse.json({
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}
