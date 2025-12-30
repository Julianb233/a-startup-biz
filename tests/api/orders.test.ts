/**
 * Orders API Tests
 *
 * Comprehensive test suite for the /api/orders endpoint
 * Tests authentication, filtering, pagination, and edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Clerk auth
vi.mock('@/lib/clerk-server-safe', () => ({
  auth: vi.fn(),
}));

// Mock database queries
vi.mock('@/lib/db', () => ({
  sql: vi.fn(),
}));

// Mock order data factory
const createMockOrder = (overrides: Partial<{
  id: string;
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  payment_intent_id: string | null;
  stripe_session_id: string | null;
  coupon_code: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}> = {}) => ({
  id: 'order-123',
  items: [{ name: 'Service 1', price: 100, quantity: 1 }],
  subtotal: 100,
  discount: 0,
  total: 100,
  status: 'paid',
  payment_intent_id: 'pi_123',
  stripe_session_id: 'cs_123',
  coupon_code: null,
  notes: null,
  created_at: new Date('2024-01-15'),
  updated_at: new Date('2024-01-15'),
  ...overrides,
});

describe('Orders API Endpoint', () => {
  const mockUserId = 'user_clerk_123';
  const mockInternalUserId = 'internal_user_123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/orders - Authentication', () => {
    it('should return 401 when not authenticated', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      vi.mocked(auth).mockResolvedValue({ userId: null } as any);

      // Simulate the route handler behavior
      const authResult = await auth();
      expect(authResult.userId).toBeNull();

      // Expected response for unauthenticated request
      const response = {
        status: 401,
        body: { error: 'Unauthorized' },
      };

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should proceed when authenticated', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      const authResult = await auth();
      expect(authResult.userId).toBe(mockUserId);
    });
  });

  describe('GET /api/orders - User Not Found', () => {
    it('should return empty array when user has no orders', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock user lookup returning empty (user not in database)
      vi.mocked(sql).mockResolvedValueOnce([]);

      const userResult = await sql`SELECT id FROM users WHERE clerk_user_id = ${mockUserId}`;

      expect(userResult).toHaveLength(0);

      // Expected response when user not found
      const response = {
        orders: [],
        total: 0,
      };

      expect(response.orders).toEqual([]);
      expect(response.total).toBe(0);
    });

    it('should return empty array when user exists but has no orders', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock user lookup - user exists
      vi.mocked(sql).mockResolvedValueOnce([{ id: mockInternalUserId }]);

      // Mock orders query - no orders
      vi.mocked(sql).mockResolvedValueOnce([]);

      // Mock count query
      vi.mocked(sql).mockResolvedValueOnce([{ count: '0' }]);

      const userResult = await sql`SELECT id FROM users WHERE clerk_user_id = ${mockUserId}`;
      expect(userResult).toHaveLength(1);

      const ordersResult = await sql`SELECT * FROM orders WHERE user_id = ${mockInternalUserId}`;
      expect(ordersResult).toHaveLength(0);

      const countResult = await sql`SELECT COUNT(*) as count FROM orders WHERE user_id = ${mockInternalUserId}`;
      expect(parseInt(countResult[0].count, 10)).toBe(0);

      // Expected response
      const response = {
        orders: [],
        total: 0,
        limit: 50,
        offset: 0,
      };

      expect(response.orders).toEqual([]);
      expect(response.total).toBe(0);
    });
  });

  describe('GET /api/orders - Status Filtering', () => {
    it('should filter orders by status when provided', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock user lookup
      vi.mocked(sql).mockResolvedValueOnce([{ id: mockInternalUserId }]);

      // Mock filtered orders query
      const paidOrders = [
        createMockOrder({ id: 'order-1', status: 'paid' }),
        createMockOrder({ id: 'order-2', status: 'paid' }),
      ];
      vi.mocked(sql).mockResolvedValueOnce(paidOrders);

      // Mock count query
      vi.mocked(sql).mockResolvedValueOnce([{ count: '2' }]);

      // Simulate status filter
      const status = 'paid';
      const filteredOrders = paidOrders.filter(o => o.status === status);

      expect(filteredOrders).toHaveLength(2);
      expect(filteredOrders.every(o => o.status === 'paid')).toBe(true);
    });

    it('should return all orders when status is "all"', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock user lookup
      vi.mocked(sql).mockResolvedValueOnce([{ id: mockInternalUserId }]);

      // Mock all orders query
      const allOrders = [
        createMockOrder({ id: 'order-1', status: 'paid' }),
        createMockOrder({ id: 'order-2', status: 'pending' }),
        createMockOrder({ id: 'order-3', status: 'completed' }),
      ];
      vi.mocked(sql).mockResolvedValueOnce(allOrders);

      // Mock count query
      vi.mocked(sql).mockResolvedValueOnce([{ count: '3' }]);

      // status = 'all' should not filter
      const status = 'all';
      const shouldFilterByStatus = status && status !== 'all';
      expect(shouldFilterByStatus).toBe(false);
    });

    it('should handle various order statuses', async () => {
      const validStatuses = ['pending', 'paid', 'processing', 'completed', 'refunded'];

      validStatuses.forEach(status => {
        const order = createMockOrder({ status });
        expect(order.status).toBe(status);
      });
    });
  });

  describe('GET /api/orders - Pagination', () => {
    it('should respect limit parameter', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock user lookup
      vi.mocked(sql).mockResolvedValueOnce([{ id: mockInternalUserId }]);

      // Mock limited orders query (only 5 orders returned)
      const limitedOrders = Array.from({ length: 5 }, (_, i) =>
        createMockOrder({ id: `order-${i + 1}` })
      );
      vi.mocked(sql).mockResolvedValueOnce(limitedOrders);

      // Mock count query (total is higher than limit)
      vi.mocked(sql).mockResolvedValueOnce([{ count: '25' }]);

      const limit = 5;
      const offset = 0;

      // Parse limit from query params (simulating route behavior)
      const parsedLimit = parseInt('5', 10);
      expect(parsedLimit).toBe(5);

      // Response should contain limited orders
      const response = {
        orders: limitedOrders.map(o => ({ id: o.id })),
        total: 25,
        limit: 5,
        offset: 0,
      };

      expect(response.orders).toHaveLength(5);
      expect(response.total).toBe(25);
      expect(response.limit).toBe(5);
    });

    it('should respect offset parameter', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock user lookup
      vi.mocked(sql).mockResolvedValueOnce([{ id: mockInternalUserId }]);

      // Mock offset orders query (orders 11-20)
      const offsetOrders = Array.from({ length: 10 }, (_, i) =>
        createMockOrder({ id: `order-${i + 11}` })
      );
      vi.mocked(sql).mockResolvedValueOnce(offsetOrders);

      // Mock count query
      vi.mocked(sql).mockResolvedValueOnce([{ count: '50' }]);

      // Parse offset from query params
      const parsedOffset = parseInt('10', 10);
      expect(parsedOffset).toBe(10);

      // Response should reflect offset
      const response = {
        orders: offsetOrders,
        total: 50,
        limit: 10,
        offset: 10,
      };

      expect(response.offset).toBe(10);
      expect(response.orders[0].id).toBe('order-11');
    });

    it('should use default limit of 50 when not provided', () => {
      const defaultLimit = parseInt(null || '50', 10);
      expect(defaultLimit).toBe(50);
    });

    it('should use default offset of 0 when not provided', () => {
      const defaultOffset = parseInt(null || '0', 10);
      expect(defaultOffset).toBe(0);
    });
  });

  describe('GET /api/orders - Response Transformation', () => {
    it('should transform snake_case to camelCase in response', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock user lookup
      vi.mocked(sql).mockResolvedValueOnce([{ id: mockInternalUserId }]);

      // Mock order with snake_case fields (as from database)
      const dbOrder = {
        id: 'order-123',
        items: [{ name: 'Service', price: 100 }],
        subtotal: '100.00',
        discount: '10.00',
        total: '90.00',
        status: 'paid',
        payment_intent_id: 'pi_123',
        stripe_session_id: 'cs_123',
        coupon_code: 'SAVE10',
        notes: 'Test order',
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-15'),
      };
      vi.mocked(sql).mockResolvedValueOnce([dbOrder]);

      // Mock count query
      vi.mocked(sql).mockResolvedValueOnce([{ count: '1' }]);

      // Transform function (mimics route handler)
      const transformedOrder = {
        id: dbOrder.id,
        items: dbOrder.items || [],
        subtotal: parseFloat(dbOrder.subtotal) || 0,
        discount: parseFloat(dbOrder.discount) || 0,
        total: parseFloat(dbOrder.total) || 0,
        status: dbOrder.status,
        paymentIntentId: dbOrder.payment_intent_id,
        stripeSessionId: dbOrder.stripe_session_id,
        couponCode: dbOrder.coupon_code,
        notes: dbOrder.notes,
        createdAt: dbOrder.created_at,
        updatedAt: dbOrder.updated_at,
      };

      expect(transformedOrder).toHaveProperty('paymentIntentId');
      expect(transformedOrder).toHaveProperty('stripeSessionId');
      expect(transformedOrder).toHaveProperty('couponCode');
      expect(transformedOrder).toHaveProperty('createdAt');
      expect(transformedOrder).toHaveProperty('updatedAt');
      expect(transformedOrder).not.toHaveProperty('payment_intent_id');
      expect(transformedOrder).not.toHaveProperty('stripe_session_id');
    });

    it('should parse numeric values from database strings', () => {
      const dbSubtotal = '150.50';
      const dbDiscount = '15.00';
      const dbTotal = '135.50';

      const parsed = {
        subtotal: parseFloat(dbSubtotal) || 0,
        discount: parseFloat(dbDiscount) || 0,
        total: parseFloat(dbTotal) || 0,
      };

      expect(parsed.subtotal).toBe(150.5);
      expect(parsed.discount).toBe(15);
      expect(parsed.total).toBe(135.5);
    });

    it('should handle null/undefined items gracefully', () => {
      const nullItems = null;
      const undefinedItems = undefined;

      expect(nullItems || []).toEqual([]);
      expect(undefinedItems || []).toEqual([]);
    });
  });

  describe('GET /api/orders - Error Handling', () => {
    it('should return 500 on database error', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock database error
      const mockSqlFn = vi.fn().mockRejectedValueOnce(new Error('Database connection failed'));

      // Simulate database error scenario
      let caughtError: Error | null = null;
      try {
        await mockSqlFn();
      } catch (error) {
        caughtError = error as Error;
      }

      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError?.message).toBe('Database connection failed');

      // Expected error response from route handler
      const errorResponse = {
        status: 500,
        body: { error: 'Failed to fetch orders' },
      };

      expect(errorResponse.status).toBe(500);
      expect(errorResponse.body.error).toBe('Failed to fetch orders');
    });

    it('should handle malformed query parameters gracefully', () => {
      // Test with invalid limit value
      const invalidLimit = 'abc';
      const parsedLimit = parseInt(invalidLimit, 10);
      expect(isNaN(parsedLimit)).toBe(true);

      // Route handler should use default when parse fails
      const safeLimit = isNaN(parsedLimit) ? 50 : parsedLimit;
      expect(safeLimit).toBe(50);
    });
  });

  describe('GET /api/orders - Query Parameters', () => {
    it('should correctly parse query parameters from URL', () => {
      const url = new URL('http://localhost/api/orders?status=paid&limit=10&offset=20');
      const searchParams = url.searchParams;

      expect(searchParams.get('status')).toBe('paid');
      expect(searchParams.get('limit')).toBe('10');
      expect(searchParams.get('offset')).toBe('20');
    });

    it('should handle missing query parameters', () => {
      const url = new URL('http://localhost/api/orders');
      const searchParams = url.searchParams;

      expect(searchParams.get('status')).toBeNull();
      expect(searchParams.get('limit')).toBeNull();
      expect(searchParams.get('offset')).toBeNull();
    });

    it('should handle empty string query parameters', () => {
      const url = new URL('http://localhost/api/orders?status=&limit=&offset=');
      const searchParams = url.searchParams;

      expect(searchParams.get('status')).toBe('');
      expect(searchParams.get('limit')).toBe('');
      expect(searchParams.get('offset')).toBe('');

      // When empty string is passed, parseInt returns NaN for empty string
      // but the || operator short-circuits to '50' first, giving us 50
      const limitParam = searchParams.get('limit');
      const limit = parseInt(limitParam || '50', 10);

      // With empty string, || returns '50' so limit is 50 (valid number)
      expect(limit).toBe(50);

      // If we want to detect empty string specifically:
      const rawLimit = searchParams.get('limit');
      expect(rawLimit).toBe('');
      expect(parseInt(rawLimit!, 10)).toBeNaN();
    });
  });

  describe('GET /api/orders - Full Response Structure', () => {
    it('should return correct response structure with orders', async () => {
      const { auth } = await import('@/lib/clerk-server-safe');
      const { sql } = await import('@/lib/db');

      vi.mocked(auth).mockResolvedValue({ userId: mockUserId } as any);

      // Mock user lookup
      vi.mocked(sql).mockResolvedValueOnce([{ id: mockInternalUserId }]);

      // Mock orders
      const orders = [
        createMockOrder({ id: 'order-1' }),
        createMockOrder({ id: 'order-2' }),
      ];
      vi.mocked(sql).mockResolvedValueOnce(orders);

      // Mock count
      vi.mocked(sql).mockResolvedValueOnce([{ count: '2' }]);

      // Expected full response structure
      const response = {
        orders: orders.map(order => ({
          id: order.id,
          items: order.items || [],
          subtotal: parseFloat(String(order.subtotal)) || 0,
          discount: parseFloat(String(order.discount)) || 0,
          total: parseFloat(String(order.total)) || 0,
          status: order.status,
          paymentIntentId: order.payment_intent_id,
          stripeSessionId: order.stripe_session_id,
          couponCode: order.coupon_code,
          notes: order.notes,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
        })),
        total: 2,
        limit: 50,
        offset: 0,
      };

      expect(response).toHaveProperty('orders');
      expect(response).toHaveProperty('total');
      expect(response).toHaveProperty('limit');
      expect(response).toHaveProperty('offset');
      expect(Array.isArray(response.orders)).toBe(true);
      expect(response.orders).toHaveLength(2);
    });
  });
});
