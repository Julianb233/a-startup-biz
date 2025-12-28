import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Import or recreate schemas being tested
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  businessStage: z.string().optional(),
  services: z.array(z.string()).optional().default([]),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  source: z.string().optional(),
});

describe('Schema Validation - Contact Form', () => {
  it('should validate correct contact form data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      company: 'Tech Corp',
      businessStage: 'growth',
      services: ['web-development', 'consulting'],
      message: 'I am interested in your services for our growing business.',
      source: 'contact_form',
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const invalidData = {
      email: 'john@example.com',
      message: 'This is my message',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid email format', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'not-an-email',
      message: 'This is my message',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some(e => e.path[0] === 'email')).toBe(true);
    }
  });

  it('should reject name shorter than 2 characters', () => {
    const invalidData = {
      name: 'J',
      email: 'john@example.com',
      message: 'This is my message',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject message shorter than 10 characters', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Short',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept optional fields as undefined', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is a valid message',
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
      expect(result.data.company).toBeUndefined();
      expect(result.data.services).toEqual([]);
    }
  });

  it('should provide helpful error messages', () => {
    const invalidData = {
      name: 'X',
      email: 'invalid-email',
      message: 'Hi',
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.errors;
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.message.includes('at least'))).toBe(true);
    }
  });

  it('should handle array of services correctly', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is my message',
      services: ['service1', 'service2', 'service3'],
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(Array.isArray(result.data.services)).toBe(true);
      expect(result.data.services.length).toBe(3);
    }
  });

  it('should reject invalid service array (non-strings)', () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is my message',
      services: [1, 2, 3],
    };

    const result = contactSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should default services to empty array', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'This is my message',
    };

    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.services).toEqual([]);
    }
  });
});
