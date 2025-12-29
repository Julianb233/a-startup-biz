/**
 * HubSpot Database Operations
 *
 * Handles syncing HubSpot data with local database tables.
 * Maps HubSpot contacts to users/contact_submissions tables.
 */

import { sql } from '../db';

// Types for HubSpot synced data
export interface HubSpotContactData {
  hubspotId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  website?: string;
  lifecycleStage?: string;
  leadStatus?: string;
  lastModifiedDate?: string;
}

export interface HubSpotDealData {
  hubspotId: string;
  dealName: string;
  dealStage?: string;
  pipeline?: string;
  amount?: number;
  closeDate?: string;
  lastModifiedDate?: string;
  associatedContactId?: string;
}

export interface HubSpotCompanyData {
  hubspotId: string;
  name: string;
  domain?: string;
  industry?: string;
  phone?: string;
  city?: string;
  state?: string;
  country?: string;
  lastModifiedDate?: string;
}

/**
 * Upsert a contact from HubSpot into the local database
 * Maps to contact_submissions table with hubspot_id tracking
 */
export async function upsertContactFromHubSpot(
  contact: HubSpotContactData
): Promise<{ id: string; created: boolean }> {
  const name = [contact.firstName, contact.lastName].filter(Boolean).join(' ') || null;

  // Check if contact exists by hubspot_id or email
  const existing = await sql`
    SELECT id FROM contact_submissions
    WHERE hubspot_id = ${contact.hubspotId}
    OR email = ${contact.email}
    LIMIT 1
  ` as { id: string }[];

  if (existing.length > 0) {
    // Update existing contact
    await sql`
      UPDATE contact_submissions SET
        name = COALESCE(${name}, name),
        phone = COALESCE(${contact.phone || null}, phone),
        company = COALESCE(${contact.company || null}, company),
        hubspot_id = ${contact.hubspotId},
        hubspot_lifecycle_stage = ${contact.lifecycleStage || null},
        hubspot_lead_status = ${contact.leadStatus || null},
        hubspot_synced_at = NOW(),
        updated_at = NOW()
      WHERE id = ${existing[0].id}
    `;
    return { id: existing[0].id, created: false };
  } else {
    // Create new contact
    const result = await sql`
      INSERT INTO contact_submissions (
        name, email, phone, company, hubspot_id,
        hubspot_lifecycle_stage, hubspot_lead_status,
        hubspot_synced_at, message, status
      ) VALUES (
        ${name}, ${contact.email}, ${contact.phone || null},
        ${contact.company || null}, ${contact.hubspotId},
        ${contact.lifecycleStage || null}, ${contact.leadStatus || null},
        NOW(), 'Imported from HubSpot', 'hubspot_sync'
      )
      RETURNING id
    ` as { id: string }[];
    return { id: result[0].id, created: true };
  }
}

/**
 * Get local contacts that need to be pushed to HubSpot
 * Returns contacts without hubspot_id or with updates since last sync
 */
export async function getContactsForHubSpotPush(
  lastSyncTime?: Date
): Promise<HubSpotContactData[]> {
  let contacts;

  if (lastSyncTime) {
    contacts = await sql`
      SELECT
        id, email, name, phone, company,
        hubspot_id, updated_at
      FROM contact_submissions
      WHERE hubspot_id IS NULL
      OR updated_at > ${lastSyncTime.toISOString()}
      ORDER BY updated_at DESC
      LIMIT 100
    ` as any[];
  } else {
    contacts = await sql`
      SELECT
        id, email, name, phone, company,
        hubspot_id, updated_at
      FROM contact_submissions
      WHERE hubspot_id IS NULL
      ORDER BY created_at DESC
      LIMIT 100
    ` as any[];
  }

  return contacts.map((c: any) => ({
    hubspotId: c.hubspot_id || '',
    email: c.email,
    firstName: c.name?.split(' ')[0] || '',
    lastName: c.name?.split(' ').slice(1).join(' ') || '',
    phone: c.phone,
    company: c.company,
  }));
}

/**
 * Update local contact with HubSpot ID after push
 */
export async function updateContactHubSpotId(
  email: string,
  hubspotId: string
): Promise<void> {
  await sql`
    UPDATE contact_submissions
    SET hubspot_id = ${hubspotId},
        hubspot_synced_at = NOW()
    WHERE email = ${email}
  `;
}

/**
 * Upsert a deal from HubSpot into local database
 * Maps to orders table with hubspot_deal_id tracking
 */
export async function upsertDealFromHubSpot(
  deal: HubSpotDealData
): Promise<{ id: string; created: boolean }> {
  const existing = await sql`
    SELECT id FROM orders
    WHERE hubspot_deal_id = ${deal.hubspotId}
    LIMIT 1
  ` as { id: string }[];

  if (existing.length > 0) {
    await sql`
      UPDATE orders SET
        hubspot_deal_stage = ${deal.dealStage || null},
        hubspot_pipeline = ${deal.pipeline || null},
        hubspot_synced_at = NOW(),
        updated_at = NOW()
      WHERE id = ${existing[0].id}
    `;
    return { id: existing[0].id, created: false };
  } else {
    // Create a placeholder order for tracking HubSpot deals
    const result = await sql`
      INSERT INTO orders (
        items, subtotal, discount, total, status,
        hubspot_deal_id, hubspot_deal_name, hubspot_deal_stage,
        hubspot_pipeline, hubspot_synced_at
      ) VALUES (
        '[]'::jsonb, ${deal.amount || 0}, 0, ${deal.amount || 0},
        'hubspot_sync', ${deal.hubspotId}, ${deal.dealName},
        ${deal.dealStage || null}, ${deal.pipeline || null}, NOW()
      )
      RETURNING id
    ` as { id: string }[];
    return { id: result[0].id, created: true };
  }
}

/**
 * Record sync operation in database for audit trail
 */
export async function recordSyncOperation(
  entityType: 'contacts' | 'deals' | 'companies',
  direction: 'push' | 'pull' | 'both',
  status: 'success' | 'error' | 'partial',
  recordsProcessed: number,
  recordsSucceeded: number,
  recordsFailed: number,
  errorDetails?: string
): Promise<void> {
  await sql`
    INSERT INTO hubspot_sync_log (
      entity_type, direction, status,
      records_processed, records_succeeded, records_failed,
      error_details, synced_at
    ) VALUES (
      ${entityType}, ${direction}, ${status},
      ${recordsProcessed}, ${recordsSucceeded}, ${recordsFailed},
      ${errorDetails || null}, NOW()
    )
  `;
}

/**
 * Get last successful sync timestamp for entity type
 */
export async function getLastSyncTime(
  entityType: 'contacts' | 'deals' | 'companies'
): Promise<Date | null> {
  const result = await sql`
    SELECT synced_at FROM hubspot_sync_log
    WHERE entity_type = ${entityType}
    AND status = 'success'
    ORDER BY synced_at DESC
    LIMIT 1
  ` as { synced_at: Date }[];

  return result.length > 0 ? result[0].synced_at : null;
}

/**
 * Get sync statistics for dashboard
 */
export async function getSyncStats(): Promise<{
  totalSyncs: number;
  lastSync: Date | null;
  contactsSynced: number;
  dealsSynced: number;
}> {
  const stats = await sql`
    SELECT
      COUNT(*) as total_syncs,
      MAX(synced_at) as last_sync,
      SUM(CASE WHEN entity_type = 'contacts' THEN records_succeeded ELSE 0 END) as contacts_synced,
      SUM(CASE WHEN entity_type = 'deals' THEN records_succeeded ELSE 0 END) as deals_synced
    FROM hubspot_sync_log
    WHERE status = 'success'
  ` as any[];

  return {
    totalSyncs: parseInt(stats[0]?.total_syncs || '0'),
    lastSync: stats[0]?.last_sync || null,
    contactsSynced: parseInt(stats[0]?.contacts_synced || '0'),
    dealsSynced: parseInt(stats[0]?.deals_synced || '0'),
  };
}
