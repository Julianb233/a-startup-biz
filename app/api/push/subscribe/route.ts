import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/clerk-server-safe';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Subscribe to push notifications
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json(
        { error: 'Invalid subscription' },
        { status: 400 }
      );
    }

    // Store subscription in database
    await sql`
      INSERT INTO push_subscriptions (
        user_id,
        endpoint,
        p256dh,
        auth,
        created_at,
        updated_at
      ) VALUES (
        ${userId},
        ${subscription.endpoint},
        ${subscription.keys.p256dh},
        ${subscription.keys.auth},
        NOW(),
        NOW()
      )
      ON CONFLICT (endpoint)
      DO UPDATE SET
        user_id = ${userId},
        p256dh = ${subscription.keys.p256dh},
        auth = ${subscription.keys.auth},
        updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Unsubscribe from push notifications
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM push_subscriptions
      WHERE endpoint = ${endpoint} AND user_id = ${userId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
