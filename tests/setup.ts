import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.UPSTASH_REDIS_REST_URL = 'http://localhost:8079';
process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token';

// Mock Next.js headers function
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: vi.fn((key) => {
      if (key === 'x-forwarded-for') return '127.0.0.1';
      if (key === 'user-agent') return 'Test User Agent';
      return null;
    }),
  })),
}));

// Mock Clerk
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(async () => ({ userId: 'test-user-123' })),
  currentUser: vi.fn(async () => ({
    id: 'test-user-123',
    publicMetadata: { role: 'user' },
    privateMetadata: {},
  })),
}));

// Setup global test utilities
global.fetch = vi.fn();