import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/clerk-server-safe';
import {
  getVoiceCallHistory,
  getVoiceCallStats,
  getCallParticipants,
  VoiceCall,
} from '@/lib/db-queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/voice/history
 * Get call history for a user or all calls (admin)
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const callType = searchParams.get('callType') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeStats = searchParams.get('includeStats') === 'true';
    const allUsers = searchParams.get('allUsers') === 'true'; // Admin only

    // For now, allow viewing own calls or all (admin check would go here)
    const targetUserId = allUsers ? undefined : userId;

    const { calls, total } = await getVoiceCallHistory({
      userId: targetUserId,
      callType,
      status,
      limit,
      offset,
    });

    // Enrich calls with participant info
    const enrichedCalls = await Promise.all(
      calls.map(async (call: VoiceCall) => {
        const participants = await getCallParticipants(call.id);
        return {
          ...call,
          participants,
          formattedDuration: formatDuration(call.duration_seconds),
        };
      })
    );

    let response: any = {
      success: true,
      calls: enrichedCalls,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + calls.length < total,
      },
    };

    // Include stats if requested
    if (includeStats) {
      const stats = await getVoiceCallStats(30); // Last 30 days
      response.stats = {
        ...stats,
        formattedAverageDuration: formatDuration(stats.averageDuration),
      };
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching call history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Format duration in seconds to human readable string
 */
function formatDuration(seconds: number | null): string {
  if (!seconds || seconds === 0) return '0:00';

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${remainingMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
