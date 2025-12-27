import { NextResponse } from 'next/server';
import { requireAdmin, withAuth } from '@/lib/api-auth';

/**
 * GET /api/admin
 *
 * Admin-only endpoint that returns sensitive data
 * Requires authentication AND admin role
 *
 * @returns Admin data or 401/403 if not authorized
 */
export async function GET() {
  return withAuth(async () => {
    // Require admin role
    const { userId, user } = await requireAdmin();

    // This endpoint is only accessible to admins
    return NextResponse.json({
      message: 'Admin access granted',
      admin: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        role: user.publicMetadata?.role || user.privateMetadata?.role,
      },
      // Example admin data
      stats: {
        totalUsers: 150, // Replace with actual data
        activeUsers: 89,
        systemStatus: 'operational',
      },
      permissions: [
        'manage_users',
        'view_analytics',
        'system_settings',
      ],
    });
  });
}

/**
 * POST /api/admin
 *
 * Admin action endpoint (example)
 * Performs administrative actions
 *
 * @returns Action result or error
 */
export async function POST(request: Request) {
  return withAuth(async () => {
    const { userId, user } = await requireAdmin();

    const body = await request.json();
    const { action, data } = body;

    // Validate action
    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }

    // Example admin actions
    switch (action) {
      case 'update_settings':
        return NextResponse.json({
          success: true,
          message: 'Settings updated',
          data,
        });

      case 'manage_user':
        return NextResponse.json({
          success: true,
          message: 'User management action performed',
          data,
        });

      case 'view_logs':
        return NextResponse.json({
          success: true,
          message: 'Logs retrieved',
          logs: [
            { timestamp: new Date().toISOString(), event: 'admin_access', userId },
          ],
        });

      default:
        return NextResponse.json(
          { error: 'Unknown action', action },
          { status: 400 }
        );
    }
  });
}

/**
 * DELETE /api/admin
 *
 * Admin deletion endpoint (example)
 * Performs destructive administrative actions
 *
 * @returns Deletion result or error
 */
export async function DELETE(request: Request) {
  return withAuth(async () => {
    const { userId } = await requireAdmin();

    const body = await request.json();
    const { resource, resourceId } = body;

    if (!resource || !resourceId) {
      return NextResponse.json(
        { error: 'Resource and resourceId required' },
        { status: 400 }
      );
    }

    // Example deletion logic
    return NextResponse.json({
      success: true,
      message: `${resource} deleted`,
      resourceId,
      deletedBy: userId,
      timestamp: new Date().toISOString(),
    });
  });
}
