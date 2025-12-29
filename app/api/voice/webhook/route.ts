import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// LiveKit webhook handler
export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');

    // Validate webhook (in production, verify the JWT signature)
    // const apiKey = process.env.LIVEKIT_API_KEY;
    // const apiSecret = process.env.LIVEKIT_API_SECRET;

    const body = await request.json();
    const { event, room, participant, track } = body;

    console.log('LiveKit webhook received:', event);

    switch (event) {
      case 'room_started':
        console.log(`Room started: ${room?.name}`);
        // Track room creation in database
        break;

      case 'room_finished':
        console.log(`Room finished: ${room?.name}`);
        // Log call duration, create call record
        break;

      case 'participant_joined':
        console.log(`Participant joined: ${participant?.identity} in room ${room?.name}`);
        // Notify support agent, update UI
        break;

      case 'participant_left':
        console.log(`Participant left: ${participant?.identity} from room ${room?.name}`);
        // Update call status
        break;

      case 'track_published':
        console.log(`Track published: ${track?.type} by ${participant?.identity}`);
        break;

      case 'track_unpublished':
        console.log(`Track unpublished: ${track?.type} by ${participant?.identity}`);
        break;

      default:
        console.log(`Unhandled event: ${event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
