/**
 * Partner Portal API Tests
 *
 * Comprehensive test suite for partner portal backend APIs
 * Tests authentication, authorization, CRUD operations, and edge cases
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import type {
  DashboardResponse,
  LeadsListResponse,
  CommissionsResponse,
  ProfileResponse,
  LeadDetailResponse
} from '@/lib/types/partner'

// Mock Clerk auth
vi.mock('@/lib/clerk-server-safe', () => ({
  auth: vi.fn()
}))

// Mock database queries
vi.mock('@/lib/db-queries', () => ({
  getPartnerByUserId: vi.fn(),
  getPartnerStats: vi.fn(),
  getPartnerLeads: vi.fn(),
  getPartnerCommissions: vi.fn(),
  createPartnerLead: vi.fn(),
  updatePartnerLeadStatus: vi.fn(),
  sql: vi.fn()
}))

describe('Partner Portal APIs', () => {
  const mockUserId = 'user_123'
  const mockPartnerId = 'partner_123'

  describe('Dashboard API', () => {
    it('should return 401 when not authenticated', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      vi.mocked(auth).mockResolvedValue({ userId: null } as any)

      const response = await fetch('/api/partner/dashboard')
      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toContain('Unauthorized')
    })

    it('should return 404 when partner not found', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const { getPartnerByUserId } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue(null)

      const response = await fetch('/api/partner/dashboard')
      expect(response.status).toBe(404)

      const data = await response.json()
      expect(data.error).toContain('Partner account not found')
    })

    it('should return 403 when partner is not active', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const { getPartnerByUserId } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue({
        id: mockPartnerId,
        user_id: mockUserId,
        company_name: 'Test Company',
        status: 'pending',
        commission_rate: 10,
        total_referrals: 0,
        total_earnings: 0,
        paid_earnings: 0,
        pending_earnings: 0,
        rank: 'Bronze',
        created_at: new Date(),
        updated_at: new Date()
      })

      const response = await fetch('/api/partner/dashboard')
      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data.canAccessDashboard).toBe(false)
      expect(data.message).toContain('pending approval')
    })

    it('should return dashboard data when authenticated and active', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const {
        getPartnerByUserId,
        getPartnerStats,
        getPartnerLeads,
        getPartnerCommissions
      } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue({
        id: mockPartnerId,
        user_id: mockUserId,
        company_name: 'Test Company',
        status: 'active',
        commission_rate: 15,
        total_referrals: 10,
        total_earnings: 5000,
        paid_earnings: 3000,
        pending_earnings: 2000,
        rank: 'Gold',
        created_at: new Date('2024-01-01'),
        updated_at: new Date()
      })

      vi.mocked(getPartnerStats).mockResolvedValue({
        partner: null,
        leads: {
          total: 10,
          pending: 2,
          contacted: 3,
          qualified: 1,
          converted: 3,
          lost: 1
        },
        earnings: {
          total_commission: 5000,
          paid_commission: 3000,
          pending_commission: 2000,
          this_month_earnings: 1500,
          last_month_earnings: 1000
        }
      })

      vi.mocked(getPartnerLeads).mockResolvedValue({
        leads: [],
        total: 10
      })

      vi.mocked(getPartnerCommissions).mockResolvedValue({
        total_earned: 5000,
        pending_commission: 2000,
        paid_commission: 3000,
        this_month_earnings: 1500,
        last_month_earnings: 1000,
        average_commission: 500
      })

      const response = await fetch('/api/partner/dashboard')
      expect(response.status).toBe(200)

      const data: DashboardResponse = await response.json()
      expect(data.partner.companyName).toBe('Test Company')
      expect(data.partner.status).toBe('active')
      expect(data.stats.totalLeads).toBe(10)
      expect(data.stats.conversionRate).toBe(30) // 3/10 * 100
      expect(data.canAccessDashboard).toBe(true)
    })
  })

  describe('Leads API', () => {
    describe('GET /api/partner/leads', () => {
      it('should list leads with pagination', async () => {
        const { auth } = await import('@/lib/clerk-server-safe')
        const { getPartnerByUserId, getPartnerLeads } = await import('@/lib/db-queries')

        vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
        vi.mocked(getPartnerByUserId).mockResolvedValue({
          id: mockPartnerId,
          status: 'active'
        } as any)

        const mockLeads = [
          {
            id: 'lead_1',
            partner_id: mockPartnerId,
            client_name: 'Client 1',
            client_email: 'client1@example.com',
            client_phone: '555-0001',
            service: 'Website Development',
            status: 'pending',
            commission: 500,
            commission_paid: false,
            created_at: new Date(),
            converted_at: null
          }
        ]

        vi.mocked(getPartnerLeads).mockResolvedValue({
          leads: mockLeads as any,
          total: 1
        })

        const response = await fetch('/api/partner/leads?limit=10&offset=0')
        expect(response.status).toBe(200)

        const data: LeadsListResponse = await response.json()
        expect(data.leads).toHaveLength(1)
        expect(data.total).toBe(1)
        expect(data.leads[0].clientName).toBe('Client 1')
      })

      it('should filter leads by status', async () => {
        const { auth } = await import('@/lib/clerk-server-safe')
        const { getPartnerByUserId, getPartnerLeads } = await import('@/lib/db-queries')

        vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
        vi.mocked(getPartnerByUserId).mockResolvedValue({
          id: mockPartnerId,
          status: 'active'
        } as any)

        vi.mocked(getPartnerLeads).mockImplementation(async (partnerId, filters) => {
          expect(filters?.status).toBe('converted')
          return { leads: [], total: 0 }
        })

        const response = await fetch('/api/partner/leads?status=converted')
        expect(response.status).toBe(200)
      })
    })

    describe('POST /api/partner/leads', () => {
      it('should create a new lead', async () => {
        const { auth } = await import('@/lib/clerk-server-safe')
        const { getPartnerByUserId, createPartnerLead } = await import('@/lib/db-queries')

        vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
        vi.mocked(getPartnerByUserId).mockResolvedValue({
          id: mockPartnerId,
          status: 'active'
        } as any)

        const newLead = {
          id: 'new_lead_123',
          partner_id: mockPartnerId,
          client_name: 'New Client',
          client_email: 'new@example.com',
          client_phone: null,
          service: 'SEO Services',
          status: 'pending',
          commission: 300,
          commission_paid: false,
          created_at: new Date()
        }

        vi.mocked(createPartnerLead).mockResolvedValue(newLead as any)

        const response = await fetch('/api/partner/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: 'New Client',
            clientEmail: 'new@example.com',
            service: 'SEO Services',
            commission: 300
          })
        })

        expect(response.status).toBe(201)

        const data = await response.json()
        expect(data.lead.clientName).toBe('New Client')
        expect(data.lead.status).toBe('pending')
      })

      it('should return 400 for missing required fields', async () => {
        const { auth } = await import('@/lib/clerk-server-safe')
        const { getPartnerByUserId } = await import('@/lib/db-queries')

        vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
        vi.mocked(getPartnerByUserId).mockResolvedValue({
          id: mockPartnerId,
          status: 'active'
        } as any)

        const response = await fetch('/api/partner/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: 'Test'
            // Missing required fields
          })
        })

        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toContain('Missing required fields')
      })
    })
  })

  describe('Lead Update API', () => {
    it('should update lead status', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const { getPartnerByUserId, updatePartnerLeadStatus } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue({
        id: mockPartnerId,
        status: 'active'
      } as any)

      const updatedLead = {
        id: 'lead_123',
        partner_id: mockPartnerId,
        client_name: 'Test Client',
        client_email: 'test@example.com',
        client_phone: null,
        service: 'Website',
        status: 'contacted',
        commission: 500,
        commission_paid: false,
        created_at: new Date(),
        converted_at: null
      }

      vi.mocked(updatePartnerLeadStatus).mockResolvedValue(updatedLead as any)

      const response = await fetch('/api/partner/leads/lead_123', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'contacted' })
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.lead.status).toBe('contacted')
      expect(data.message).toContain('updated to contacted')
    })

    it('should return 400 for invalid status', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const { getPartnerByUserId } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue({
        id: mockPartnerId,
        status: 'active'
      } as any)

      const response = await fetch('/api/partner/leads/lead_123', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'invalid_status' })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toContain('Invalid status')
    })

    it('should return 404 for non-existent lead', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const { getPartnerByUserId, updatePartnerLeadStatus } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue({
        id: mockPartnerId,
        status: 'active'
      } as any)

      vi.mocked(updatePartnerLeadStatus).mockResolvedValue(null)

      const response = await fetch('/api/partner/leads/nonexistent', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'contacted' })
      })

      expect(response.status).toBe(404)
    })
  })

  describe('Commissions API', () => {
    it('should return commission data', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const { getPartnerByUserId, getPartnerCommissions } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue({
        id: mockPartnerId,
        status: 'active',
        commission_rate: 15
      } as any)

      vi.mocked(getPartnerCommissions).mockResolvedValue({
        total_earned: 5000,
        pending_commission: 2000,
        paid_commission: 3000,
        this_month_earnings: 1500,
        last_month_earnings: 1000,
        average_commission: 500
      })

      const response = await fetch('/api/partner/commissions')
      expect(response.status).toBe(200)

      const data: CommissionsResponse = await response.json()
      expect(data.totalEarned).toBe(5000)
      expect(data.pendingCommission).toBe(2000)
      expect(data.commissionRate).toBe(15)
      expect(data.payoutSchedule).toBe('Monthly')
    })
  })

  describe('Profile API', () => {
    it('should return partner profile', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const { getPartnerByUserId, sql } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue({
        id: mockPartnerId,
        user_id: mockUserId,
        company_name: 'Test Company',
        status: 'active',
        commission_rate: 15,
        rank: 'Gold',
        created_at: new Date()
      } as any)

      vi.mocked(sql).mockResolvedValue([
        {
          id: mockPartnerId,
          user_id: mockUserId,
          company_name: 'Test Company',
          status: 'active',
          commission_rate: 15,
          rank: 'Gold',
          payment_email: 'payments@test.com',
          payment_method: 'stripe',
          notifications_enabled: true,
          created_at: new Date()
        }
      ] as any)

      const response = await fetch('/api/partner/profile')
      expect(response.status).toBe(200)

      const data: ProfileResponse = await response.json()
      expect(data.profile.companyName).toBe('Test Company')
      expect(data.profile.paymentEmail).toBe('payments@test.com')
    })

    it('should update partner profile', async () => {
      const { auth } = await import('@/lib/clerk-server-safe')
      const { getPartnerByUserId, sql } = await import('@/lib/db-queries')

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any)
      vi.mocked(getPartnerByUserId).mockResolvedValue({
        id: mockPartnerId,
        status: 'active'
      } as any)

      // Mock profile exists check
      vi.mocked(sql).mockResolvedValueOnce([{ id: 'profile_123' }] as any)

      // Mock update query
      vi.mocked(sql).mockResolvedValueOnce([] as any)

      // Mock final select
      vi.mocked(sql).mockResolvedValueOnce([
        {
          id: mockPartnerId,
          company_name: 'Test Company',
          payment_email: 'new@test.com',
          notifications_enabled: false
        }
      ] as any)

      const response = await fetch('/api/partner/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentEmail: 'new@test.com',
          notificationsEnabled: false
        })
      })

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.message).toContain('updated successfully')
    })
  })
})
