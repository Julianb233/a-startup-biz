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
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

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

// Mock our local Clerk wrapper (the actual @clerk/nextjs package has been removed)
vi.mock('@/components/clerk-safe', () => ({
  useUser: () => ({ isLoaded: true, isSignedIn: true, user: { id: 'test-user-123' } }),
  useAuth: () => ({ isLoaded: true, isSignedIn: true, userId: 'test-user-123' }),
  useClerk: () => ({ signOut: vi.fn() }),
  SignedIn: ({ children }: { children: React.ReactNode }) => children,
  SignedOut: () => null,
  SignIn: () => null,
  SignUp: () => null,
  UserButton: () => null,
}));

// Setup global test utilities
global.fetch = vi.fn();