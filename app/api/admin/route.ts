import { NextResponse } from 'next/server';
import { requireAdmin, withAuth, getCurrentUserId } from '@/lib/api-auth';
import { getAdminStats } from '@/lib/db-queries';
import { logAdminAction, getIpFromHeaders } from '@/lib/audit';

/**
 * GET /api/admin
 *
 * Admin-only endpoint that returns sensitive data
 * Requires authentication AND admin role
 *
 * @returns Admin data or 401/403 if not authorized
 */
export async function GET(request: Request) {
  return withAuth(async () => {
    // Require admin role
    await requireAdmin();
    const userId = await getCurrentUserId();

    // Log admin dashboard access
    await logAdminAction({
      userId: userId || 'unknown',
      action: 'admin.dashboard.view',
      resourceType: 'dashboard',
      ipAddress: getIpFromHeaders(new Headers(request.headers)),
    });

    // Fetch real stats from database
    const dbStats = await getAdminStats();

    // This endpoint is only accessible to admins
    return NextResponse.json({
      message: 'Admin access granted',
      admin: {
        id: userId,
        role: 'admin',
      },
      stats: {
        totalUsers: parseInt(dbStats.users?.total || '0'),
        newUsersThisWeek: parseInt(dbStats.users?.new_this_week || '0'),
        newUsersThisMonth: parseInt(dbStats.users?.new_this_month || '0'),
        totalOrders: parseInt(dbStats.orders?.total || '0'),
        pendingOrders: parseInt(dbStats.orders?.pending || '0'),
        totalRevenue: parseFloat(dbStats.revenue?.total_revenue || '0'),
        revenueThisMonth: parseFloat(dbStats.revenue?.revenue_this_month || '0'),
        totalConsultations: parseInt(dbStats.consultations?.total || '0'),
        pendingConsultations: parseInt(dbStats.consultations?.pending || '0'),
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
    await requireAdmin();
    const userId = await getCurrentUserId();

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
        await logAdminAction({
          userId: userId || 'unknown',
          action: 'admin.settings.update',
          resourceType: 'settings',
          metadata: { settings: data },
        });
        return NextResponse.json({
          success: true,
          message: 'Settings updated',
          data,
        });

      case 'manage_user':
        await logAdminAction({
          userId: userId || 'unknown',
          action: 'admin.user.update',
          resourceType: 'user',
          resourceId: data?.userId,
          metadata: { action: 'manage_user', data },
        });
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
    await requireAdmin();
    const userId = await getCurrentUserId();

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
