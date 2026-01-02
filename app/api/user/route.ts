import { auth, currentUser } from '@/lib/clerk-server-safe';
import { NextResponse } from 'next/server';
import { requireAuth, withAuth } from '@/lib/api-auth';

/**
 * GET /api/user
 *
 * Returns current authenticated user data from Clerk
 * Requires authentication
 *
 * @returns User data or 401 if not authenticated
 */
export async function GET() {
  return withAuth(async () => {
    // Require authentication
    const userId = await requireAuth();

    // Get full user data from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return sanitized user data
    return NextResponse.json({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // User metadata (from Supabase user_metadata)
      metadata: {},
    });
  });
}

/**
 * PATCH /api/user
 *
 * Updates user metadata (example endpoint)
 * Note: To actually update Clerk user data, use Clerk's SDK methods
 *
 * @returns Updated user data or error
 */
export async function PATCH(request: Request) {
  return withAuth(async () => {
    const userId = await requireAuth();
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();

    // This is a placeholder - in production, you would use Clerk's
    // clerkClient.users.updateUser() to actually update user data

    return NextResponse.json({
      message: 'User update endpoint',
      userId,
      receivedData: body,
      note: 'Use clerkClient.users.updateUser() to actually update user data'
    });
  });
}
