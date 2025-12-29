/**
 * HubSpot CRM Bi-Directional Sync Service
 *
 * Handles automated synchronization between local database and HubSpot CRM
 * with conflict resolution, incremental sync, and comprehensive tracking
 */

import { getHubSpotClient } from './client';
import {
  findContactByEmail,
  createContact,
  updateContact,
  getContact,
} from './contacts';
import {
  createDeal,
  updateDeal,
  getDeal,
} from './deals';
import {
  findCompanyByDomain,
  createCompany,
  updateCompany,
  getCompany,
} from './companies';
import {
  HubSpotContact,
  HubSpotDeal,
  HubSpotCompany,
  HubSpotResponse,
  HubSpotSearchResponse,
  SyncReport,
  SyncLog,
  SyncOptions,
  ConflictResolutionStrategy,
} from './types';
import {
  upsertContactFromHubSpot,
  upsertDealFromHubSpot,
  getContactsForHubSpotPush,
  updateContactHubSpotId,
  recordSyncOperation,
  getLastSyncTime,
  HubSpotContactData,
} from './db-operations';

/**
 * In-memory sync tracking (for production, use database)
 * Store in Redis, PostgreSQL, or another persistent store
 */
class SyncTracker {
  private syncHistory: SyncLog[] = [];
  private lastSyncTimestamps: Map<string, Date> = new Map();

  /**
   * Record sync operation
   */
  recordSync(log: SyncLog): void {
    this.syncHistory.push(log);

    // Keep only last 1000 logs in memory
    if (this.syncHistory.length > 1000) {
      this.syncHistory = this.syncHistory.slice(-1000);
    }

    // Update last sync timestamp for entity type
    this.lastSyncTimestamps.set(log.entityType, new Date(log.timestamp));
  }

  /**
   * Get last sync timestamp for entity type
   */
  getLastSyncTimestamp(entityType: 'contacts' | 'deals' | 'companies'): Date | null {
    return this.lastSyncTimestamps.get(entityType) || null;
  }

  /**
   * Get sync history with filters
   */
  getHistory(options?: {
    entityType?: string;
    status?: 'success' | 'error' | 'skipped';
    limit?: number;
  }): SyncLog[] {
    let filtered = [...this.syncHistory];

    if (options?.entityType) {
      filtered = filtered.filter(log => log.entityType === options.entityType);
    }

    if (options?.status) {
      filtered = filtered.filter(log => log.status === options.status);
    }

    if (options?.limit) {
      filtered = filtered.slice(-options.limit);
    }

    return filtered;
  }

  /**
   * Get sync statistics
   */
  getStats(): {
    totalSyncs: number;
    successful: number;
    failed: number;
    skipped: number;
    lastSync: Date | null;
  } {
    const successful = this.syncHistory.filter(log => log.status === 'success').length;
    const failed = this.syncHistory.filter(log => log.status === 'error').length;
    const skipped = this.syncHistory.filter(log => log.status === 'skipped').length;

    const lastSync = this.syncHistory.length > 0
      ? new Date(this.syncHistory[this.syncHistory.length - 1].timestamp)
      : null;

    return {
      totalSyncs: this.syncHistory.length,
      successful,
      failed,
      skipped,
      lastSync,
    };
  }
}

// Singleton tracker instance
const syncTracker = new SyncTracker();

/**
 * HubSpot Sync Service
 */
export class HubSpotSyncService {
  private client = getHubSpotClient();
  private conflictStrategy: ConflictResolutionStrategy;
  private batchSize: number;

  constructor(options?: SyncOptions) {
    this.conflictStrategy = options?.conflictResolution || 'last-write-wins';
    this.batchSize = options?.batchSize || 100;
  }

  /**
   * Sync contacts bi-directionally
   */
  async syncContacts(options?: {
    direction?: 'push' | 'pull' | 'both';
    incremental?: boolean;
    contactIds?: string[];
  }): Promise<SyncReport> {
    const startTime = Date.now();
    const report: SyncReport = {
      entityType: 'contacts',
      direction: options?.direction || 'both',
      startTime: new Date().toISOString(),
      endTime: '',
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    try {
      const direction = options?.direction || 'both';

      if (direction === 'pull' || direction === 'both') {
        await this.pullContacts(report, options);
      }

      if (direction === 'push' || direction === 'both') {
        await this.pushContacts(report, options);
      }

      report.endTime = new Date().toISOString();
      report.durationMs = Date.now() - startTime;

      // Record sync
      syncTracker.recordSync({
        entityType: 'contacts',
        direction: direction,
        status: report.failed === 0 ? 'success' : 'error',
        recordsProcessed: report.totalProcessed,
        recordsSucceeded: report.successful,
        recordsFailed: report.failed,
        timestamp: report.endTime,
        durationMs: report.durationMs,
        errors: report.errors,
      });

      return report;

    } catch (error) {
      report.endTime = new Date().toISOString();
      report.durationMs = Date.now() - startTime;
      report.errors.push({
        entityId: 'sync-service',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      syncTracker.recordSync({
        entityType: 'contacts',
        direction: options?.direction || 'both',
        status: 'error',
        recordsProcessed: report.totalProcessed,
        recordsSucceeded: report.successful,
        recordsFailed: report.failed,
        timestamp: report.endTime,
        durationMs: report.durationMs,
        errors: report.errors,
      });

      throw error;
    }
  }

  /**
   * Pull contacts from HubSpot to local DB
   */
  private async pullContacts(
    report: SyncReport,
    options?: { incremental?: boolean }
  ): Promise<void> {
    const lastSync = options?.incremental
      ? syncTracker.getLastSyncTimestamp('contacts')
      : null;

    let after: string | undefined;
    let hasMore = true;

    while (hasMore) {
      try {
        // Build search query
        const searchPayload: any = {
          limit: this.batchSize,
          properties: [
            'email',
            'firstname',
            'lastname',
            'phone',
            'company',
            'website',
            'lifecyclestage',
            'hs_lead_status',
            'lastmodifieddate',
          ],
        };

        if (after) {
          searchPayload.after = after;
        }

        // Add incremental filter
        if (lastSync) {
          searchPayload.filterGroups = [
            {
              filters: [
                {
                  propertyName: 'lastmodifieddate',
                  operator: 'GTE',
                  value: lastSync.getTime().toString(),
                },
              ],
            },
          ];
        }

        const response = await this.client.post<
          HubSpotSearchResponse<HubSpotContact['properties']>
        >('/crm/v3/objects/contacts/search', searchPayload);

        // Process each contact
        for (const contact of response.results) {
          report.totalProcessed++;

          try {
            // Map HubSpot contact to local schema and upsert
            const contactData: HubSpotContactData = {
              hubspotId: contact.id,
              email: contact.properties.email || '',
              firstName: contact.properties.firstname,
              lastName: contact.properties.lastname,
              phone: contact.properties.phone,
              company: contact.properties.company,
              website: contact.properties.website,
              lifecycleStage: contact.properties.lifecyclestage,
              leadStatus: contact.properties.hs_lead_status,
              lastModifiedDate: contact.properties.lastmodifieddate,
            };

            if (contactData.email) {
              const result = await upsertContactFromHubSpot(contactData);
              console.log(`${result.created ? 'Created' : 'Updated'} contact ${contact.id} from HubSpot`);
              report.successful++;
            } else {
              report.skipped++;
              console.log(`Skipped contact ${contact.id} - no email`);
            }
          } catch (error) {
            report.failed++;
            report.errors.push({
              entityId: contact.id,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }

        // Check for more pages
        hasMore = !!response.paging?.next;
        after = response.paging?.next?.after;

        // Rate limit protection
        if (hasMore && this.client.isApproachingRateLimit()) {
          console.warn('Approaching HubSpot rate limit, pausing sync...');
          await this.sleep(10000); // Wait 10 seconds
        }

      } catch (error) {
        console.error('Error pulling contacts batch:', error);
        throw error;
      }
    }
  }

  /**
   * Push contacts from local DB to HubSpot
   */
  private async pushContacts(
    report: SyncReport,
    options?: { incremental?: boolean; contactIds?: string[] }
  ): Promise<void> {
    // Get last sync time for incremental sync
    const lastSync = options?.incremental
      ? await getLastSyncTime('contacts')
      : null;

    // Fetch contacts from local database that need to be pushed
    const contacts = await getContactsForHubSpotPush(lastSync || undefined);

    for (const contact of contacts) {
      report.totalProcessed++;

      try {
        if (!contact.email) {
          report.skipped++;
          continue;
        }

        // Check if contact exists in HubSpot
        const existing = await findContactByEmail(contact.email);

        if (existing) {
          // Update existing contact
          await updateContact(existing.id, {
            firstname: contact.firstName || '',
            lastname: contact.lastName || '',
            phone: contact.phone || '',
            company: contact.company || '',
          });
          await updateContactHubSpotId(contact.email, existing.id);
          console.log(`Updated contact ${existing.id} in HubSpot`);
        } else {
          // Create new contact in HubSpot
          const newContact = await createContact({
            email: contact.email,
            firstname: contact.firstName || '',
            lastname: contact.lastName || '',
            phone: contact.phone || '',
            company: contact.company || '',
          });
          await updateContactHubSpotId(contact.email, newContact.id);
          console.log(`Created contact ${newContact.id} in HubSpot`);
        }

        report.successful++;
      } catch (error) {
        report.failed++;
        report.errors.push({
          entityId: contact.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      // Rate limit protection
      if (this.client.isApproachingRateLimit()) {
        console.warn('Approaching HubSpot rate limit, pausing...');
        await this.sleep(10000);
      }
    }
  }

  /**
   * Sync deals bi-directionally
   */
  async syncDeals(options?: {
    direction?: 'push' | 'pull' | 'both';
    incremental?: boolean;
    dealIds?: string[];
  }): Promise<SyncReport> {
    const startTime = Date.now();
    const report: SyncReport = {
      entityType: 'deals',
      direction: options?.direction || 'both',
      startTime: new Date().toISOString(),
      endTime: '',
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    try {
      const direction = options?.direction || 'both';

      if (direction === 'pull' || direction === 'both') {
        await this.pullDeals(report, options);
      }

      if (direction === 'push' || direction === 'both') {
        await this.pushDeals(report, options);
      }

      report.endTime = new Date().toISOString();
      report.durationMs = Date.now() - startTime;

      syncTracker.recordSync({
        entityType: 'deals',
        direction: direction,
        status: report.failed === 0 ? 'success' : 'error',
        recordsProcessed: report.totalProcessed,
        recordsSucceeded: report.successful,
        recordsFailed: report.failed,
        timestamp: report.endTime,
        durationMs: report.durationMs,
        errors: report.errors,
      });

      return report;

    } catch (error) {
      report.endTime = new Date().toISOString();
      report.durationMs = Date.now() - startTime;
      report.errors.push({
        entityId: 'sync-service',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Pull deals from HubSpot
   */
  private async pullDeals(
    report: SyncReport,
    options?: { incremental?: boolean }
  ): Promise<void> {
    const lastSync = options?.incremental
      ? syncTracker.getLastSyncTimestamp('deals')
      : null;

    let after: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const searchPayload: any = {
        limit: this.batchSize,
        properties: [
          'dealname',
          'dealstage',
          'pipeline',
          'amount',
          'closedate',
          'hs_lastmodifieddate',
        ],
      };

      if (after) {
        searchPayload.after = after;
      }

      if (lastSync) {
        searchPayload.filterGroups = [
          {
            filters: [
              {
                propertyName: 'hs_lastmodifieddate',
                operator: 'GTE',
                value: lastSync.getTime().toString(),
              },
            ],
          },
        ];
      }

      const response = await this.client.post<
        HubSpotSearchResponse<HubSpotDeal['properties']>
      >('/crm/v3/objects/deals/search', searchPayload);

      for (const deal of response.results) {
        report.totalProcessed++;

        try {
          // Map HubSpot deal to local schema and upsert
          const dealData = {
            hubspotId: deal.id,
            dealName: deal.properties.dealname || 'Unnamed Deal',
            dealStage: deal.properties.dealstage,
            pipeline: deal.properties.pipeline,
            amount: deal.properties.amount ? parseFloat(deal.properties.amount) : undefined,
            closeDate: deal.properties.closedate,
            lastModifiedDate: deal.properties.hs_lastmodifieddate,
          };

          const result = await upsertDealFromHubSpot(dealData);
          console.log(`${result.created ? 'Created' : 'Updated'} deal ${deal.id} from HubSpot`);
          report.successful++;
        } catch (error) {
          report.failed++;
          report.errors.push({
            entityId: deal.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      hasMore = !!response.paging?.next;
      after = response.paging?.next?.after;

      if (hasMore && this.client.isApproachingRateLimit()) {
        await this.sleep(10000);
      }
    }
  }

  /**
   * Push deals to HubSpot
   * Note: Deals are typically created in HubSpot first, so push is less common
   */
  private async pushDeals(
    report: SyncReport,
    options?: { incremental?: boolean }
  ): Promise<void> {
    // For now, deals are primarily managed in HubSpot
    // Local orders are synced when they're created via payment flow
    console.log('Deal push: Orders are synced to HubSpot at creation time via checkout flow');
  }

  /**
   * Sync companies bi-directionally
   */
  async syncCompanies(options?: {
    direction?: 'push' | 'pull' | 'both';
    incremental?: boolean;
  }): Promise<SyncReport> {
    const startTime = Date.now();
    const report: SyncReport = {
      entityType: 'companies',
      direction: options?.direction || 'both',
      startTime: new Date().toISOString(),
      endTime: '',
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      errors: [],
    };

    try {
      const direction = options?.direction || 'both';

      if (direction === 'pull' || direction === 'both') {
        await this.pullCompanies(report, options);
      }

      if (direction === 'push' || direction === 'both') {
        await this.pushCompanies(report, options);
      }

      report.endTime = new Date().toISOString();
      report.durationMs = Date.now() - startTime;

      syncTracker.recordSync({
        entityType: 'companies',
        direction: direction,
        status: report.failed === 0 ? 'success' : 'error',
        recordsProcessed: report.totalProcessed,
        recordsSucceeded: report.successful,
        recordsFailed: report.failed,
        timestamp: report.endTime,
        durationMs: report.durationMs,
        errors: report.errors,
      });

      return report;

    } catch (error) {
      report.endTime = new Date().toISOString();
      report.durationMs = Date.now() - startTime;
      throw error;
    }
  }

  /**
   * Pull companies from HubSpot
   */
  private async pullCompanies(
    report: SyncReport,
    options?: { incremental?: boolean }
  ): Promise<void> {
    const lastSync = options?.incremental
      ? syncTracker.getLastSyncTimestamp('companies')
      : null;

    let after: string | undefined;
    let hasMore = true;

    while (hasMore) {
      const searchPayload: any = {
        limit: this.batchSize,
        properties: [
          'name',
          'domain',
          'industry',
          'phone',
          'city',
          'state',
          'country',
          'hs_lastmodifieddate',
        ],
      };

      if (after) {
        searchPayload.after = after;
      }

      if (lastSync) {
        searchPayload.filterGroups = [
          {
            filters: [
              {
                propertyName: 'hs_lastmodifieddate',
                operator: 'GTE',
                value: lastSync.getTime().toString(),
              },
            ],
          },
        ];
      }

      const response = await this.client.post<
        HubSpotSearchResponse<HubSpotCompany['properties']>
      >('/crm/v3/objects/companies/search', searchPayload);

      for (const company of response.results) {
        report.totalProcessed++;

        try {
          // Companies are typically associated with contacts
          // For now, log the sync - full company table can be added if needed
          console.log(`Pulled company ${company.id}: ${company.properties.name || 'Unknown'} from HubSpot`);
          report.successful++;
        } catch (error) {
          report.failed++;
          report.errors.push({
            entityId: company.id,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      hasMore = !!response.paging?.next;
      after = response.paging?.next?.after;

      if (hasMore && this.client.isApproachingRateLimit()) {
        await this.sleep(10000);
      }
    }
  }

  /**
   * Push companies to HubSpot
   * Companies are typically created as part of contact/deal creation
   */
  private async pushCompanies(
    report: SyncReport,
    options?: { incremental?: boolean }
  ): Promise<void> {
    // Companies are typically created during onboarding or contact sync
    // The company field on contacts is used to auto-associate
    console.log('Company push: Companies are synced via contact association during onboarding');
  }

  /**
   * Full sync - all entities
   */
  async fullSync(options?: {
    direction?: 'push' | 'pull' | 'both';
  }): Promise<{
    contacts: SyncReport;
    deals: SyncReport;
    companies: SyncReport;
  }> {
    console.log('Starting full HubSpot sync...');

    const contacts = await this.syncContacts({
      direction: options?.direction,
      incremental: false,
    });

    const deals = await this.syncDeals({
      direction: options?.direction,
      incremental: false,
    });

    const companies = await this.syncCompanies({
      direction: options?.direction,
      incremental: false,
    });

    console.log('Full sync completed', {
      contacts: `${contacts.successful}/${contacts.totalProcessed}`,
      deals: `${deals.successful}/${deals.totalProcessed}`,
      companies: `${companies.successful}/${companies.totalProcessed}`,
    });

    return { contacts, deals, companies };
  }

  /**
   * Incremental sync - only changed records since last sync
   */
  async incrementalSync(options?: {
    direction?: 'push' | 'pull' | 'both';
  }): Promise<{
    contacts: SyncReport;
    deals: SyncReport;
    companies: SyncReport;
  }> {
    console.log('Starting incremental HubSpot sync...');

    const contacts = await this.syncContacts({
      direction: options?.direction,
      incremental: true,
    });

    const deals = await this.syncDeals({
      direction: options?.direction,
      incremental: true,
    });

    const companies = await this.syncCompanies({
      direction: options?.direction,
      incremental: true,
    });

    console.log('Incremental sync completed', {
      contacts: `${contacts.successful}/${contacts.totalProcessed}`,
      deals: `${deals.successful}/${deals.totalProcessed}`,
      companies: `${companies.successful}/${companies.totalProcessed}`,
    });

    return { contacts, deals, companies };
  }

  /**
   * Resolve conflict between local and HubSpot records
   */
  private resolveConflict<T>(
    localRecord: T & { updatedAt?: string },
    hubspotRecord: HubSpotResponse<any>
  ): 'use-local' | 'use-hubspot' | 'merge' {
    switch (this.conflictStrategy) {
      case 'last-write-wins':
        const localTime = new Date(localRecord.updatedAt || 0).getTime();
        const hubspotTime = new Date(hubspotRecord.updatedAt).getTime();
        return hubspotTime > localTime ? 'use-hubspot' : 'use-local';

      case 'hubspot-wins':
        return 'use-hubspot';

      case 'local-wins':
        return 'use-local';

      case 'manual':
        // TODO: Queue for manual review
        return 'use-hubspot'; // Default fallback

      default:
        return 'use-hubspot';
    }
  }

  /**
   * Get sync history
   */
  getSyncHistory(options?: {
    entityType?: 'contacts' | 'deals' | 'companies';
    status?: 'success' | 'error' | 'skipped';
    limit?: number;
  }): SyncLog[] {
    return syncTracker.getHistory(options);
  }

  /**
   * Get sync statistics
   */
  getSyncStats() {
    return syncTracker.getStats();
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Export singleton instance
 */
let syncServiceInstance: HubSpotSyncService | null = null;

export function getSyncService(options?: SyncOptions): HubSpotSyncService {
  if (!syncServiceInstance) {
    syncServiceInstance = new HubSpotSyncService(options);
  }
  return syncServiceInstance;
}

/**
 * Reset sync service (for testing)
 */
export function resetSyncService(): void {
  syncServiceInstance = null;
}
