import { sql } from '@/lib/db';

export type AuditAction =
  | 'admin.dashboard.view'
  | 'admin.user.view'
  | 'admin.user.update'
  | 'admin.user.delete'
  | 'admin.partner.view'
  | 'admin.partner.approve'
  | 'admin.partner.reject'
  | 'admin.order.view'
  | 'admin.order.update'
  | 'admin.settings.update'
  | 'admin.chatbot.update';

export type ResourceType =
  | 'user'
  | 'partner'
  | 'order'
  | 'settings'
  | 'dashboard'
  | 'chatbot';

interface AuditLogEntry {
  userId: string;
  action: AuditAction;
  resourceType?: ResourceType;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

/**
 * Log an admin action for audit purposes
 */
export async function logAdminAction({
  userId,
  action,
  resourceType,
  resourceId,
  metadata,
  ipAddress,
}: AuditLogEntry): Promise<void> {
  try {
    await sql`
      INSERT INTO admin_audit_log (
        user_id,
        action,
        resource_type,
        resource_id,
        metadata,
        ip_address
      ) VALUES (
        ${userId},
        ${action},
        ${resourceType || null},
        ${resourceId || null},
        ${metadata ? JSON.stringify(metadata) : null},
        ${ipAddress || null}
      )
    `;
  } catch (error) {
    // Log error but don't throw - audit logging shouldn't break the main operation
    console.error('Failed to log admin action:', error);
  }
}

/**
 * Get recent audit log entries
 */
export async function getAuditLogs(options?: {
  userId?: string;
  action?: AuditAction;
  resourceType?: ResourceType;
  limit?: number;
  offset?: number;
}) {
  const limit = options?.limit || 50;
  const offset = options?.offset || 0;

  let query = sql`
    SELECT
      id,
      user_id,
      action,
      resource_type,
      resource_id,
      metadata,
      ip_address,
      created_at
    FROM admin_audit_log
    WHERE 1=1
  `;

  if (options?.userId) {
    query = sql`${query} AND user_id = ${options.userId}`;
  }
  if (options?.action) {
    query = sql`${query} AND action = ${options.action}`;
  }
  if (options?.resourceType) {
    query = sql`${query} AND resource_type = ${options.resourceType}`;
  }

  query = sql`${query} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

  const result = await query;
  return result;
}

/**
 * Helper to extract IP address from request headers
 */
export function getIpFromHeaders(headers: Headers): string | undefined {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    undefined
  );
}
