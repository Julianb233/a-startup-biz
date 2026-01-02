import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/clerk-server-safe';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Create chat_rooms table if it doesn't exist
async function ensureChatRoomsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS chat_rooms (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      participants TEXT[] NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_chat_rooms_participants
    ON chat_rooms USING GIN(participants)
  `;
}

// GET /api/chat/rooms - List chat rooms for the current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureChatRoomsTable();

        const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let rooms;
    if (type) {
      rooms = await sql`
        SELECT * FROM chat_rooms
        WHERE ${userId} = ANY(participants)
        AND type = ${type}
        ORDER BY updated_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else {
      rooms = await sql`
        SELECT * FROM chat_rooms
        WHERE ${userId} = ANY(participants)
        ORDER BY updated_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }

    return NextResponse.json({
      rooms,
      total: rooms.length,
    });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat rooms' },
      { status: 500 }
    );
  }
}

// POST /api/chat/rooms - Create a new chat room
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureChatRoomsTable();

        const body = await request.json();
    const { id, name, type, participants, metadata = {} } = body;

    // Validate required fields
    if (!id || !name || !type || !participants) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['support', 'private', 'group'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid room type' },
        { status: 400 }
      );
    }

    // Ensure creator is in participants
    const allParticipants = Array.from(new Set([userId, ...participants]));

    // Check if room already exists
    const existingRoom = await sql`
      SELECT * FROM chat_rooms WHERE id = ${id}
    `;

    if (existingRoom.length > 0) {
      return NextResponse.json(
        { error: 'Room already exists', room: existingRoom[0] },
        { status: 409 }
      );
    }

    // Create room
    const [room] = await sql`
      INSERT INTO chat_rooms (id, name, type, participants, metadata)
      VALUES (${id}, ${name}, ${type}, ${allParticipants}, ${JSON.stringify(metadata)})
      RETURNING *
    `;

    return NextResponse.json({
      room,
      message: 'Chat room created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating chat room:', error);
    return NextResponse.json(
      { error: 'Failed to create chat room' },
      { status: 500 }
    );
  }
}

// PATCH /api/chat/rooms - Update a chat room
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureChatRoomsTable();

        const body = await request.json();
    const { id, name, participants, metadata } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // Check if user is a participant
    const existingRoom = await sql`
      SELECT * FROM chat_rooms
      WHERE id = ${id}
      AND ${userId} = ANY(participants)
    `;

    if (existingRoom.length === 0) {
      return NextResponse.json(
        { error: 'Room not found or access denied' },
        { status: 404 }
      );
    }

    // Update room with dynamic fields using safe parameterized queries
    let result;

    // Handle all combinations of updateable fields
    if (name !== undefined && participants !== undefined && metadata !== undefined) {
      result = await sql`
        UPDATE chat_rooms
        SET name = ${name}, participants = ${participants}, metadata = ${JSON.stringify(metadata)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (name !== undefined && participants !== undefined) {
      result = await sql`
        UPDATE chat_rooms
        SET name = ${name}, participants = ${participants}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (name !== undefined && metadata !== undefined) {
      result = await sql`
        UPDATE chat_rooms
        SET name = ${name}, metadata = ${JSON.stringify(metadata)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (participants !== undefined && metadata !== undefined) {
      result = await sql`
        UPDATE chat_rooms
        SET participants = ${participants}, metadata = ${JSON.stringify(metadata)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (name !== undefined) {
      result = await sql`
        UPDATE chat_rooms
        SET name = ${name}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (participants !== undefined) {
      result = await sql`
        UPDATE chat_rooms
        SET participants = ${participants}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (metadata !== undefined) {
      result = await sql`
        UPDATE chat_rooms
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

    const [room] = result;

    return NextResponse.json({
      room,
      message: 'Chat room updated successfully',
    });
  } catch (error) {
    console.error('Error updating chat room:', error);
    return NextResponse.json(
      { error: 'Failed to update chat room' },
      { status: 500 }
    );
  }
}

// DELETE /api/chat/rooms - Delete a chat room
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await ensureChatRoomsTable();

        const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    // Check if user is a participant
    const existingRoom = await sql`
      SELECT * FROM chat_rooms
      WHERE id = ${id}
      AND ${userId} = ANY(participants)
    `;

    if (existingRoom.length === 0) {
      return NextResponse.json(
        { error: 'Room not found or access denied' },
        { status: 404 }
      );
    }

    // Delete room
    await sql`
      DELETE FROM chat_rooms WHERE id = ${id}
    `;

    // Also delete associated messages
    await sql`
      DELETE FROM chat_messages WHERE room_id = ${id}
    `;

    return NextResponse.json({
      message: 'Chat room deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting chat room:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat room' },
      { status: 500 }
    );
  }
}
