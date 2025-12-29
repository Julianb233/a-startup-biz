/**
 * Voice Agent System Tests
 *
 * Unit tests for voice agent functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateRoomName,
  validateSystemPrompt,
  getVoiceDisplayName,
  getAvailableVoices,
  formatUptime,
  estimateConversationCost,
  parseApiError,
  retryWithBackoff,
} from '../voice-agent-utils';
import type { OpenAIVoice, AgentSession } from '../voice-agent-types';

describe('Voice Agent Utils', () => {
  describe('validateRoomName', () => {
    it('should accept valid room names', () => {
      expect(validateRoomName('test-room')).toEqual({ valid: true });
      expect(validateRoomName('room_123')).toEqual({ valid: true });
      expect(validateRoomName('MyRoom2024')).toEqual({ valid: true });
    });

    it('should reject empty room names', () => {
      const result = validateRoomName('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Room name is required');
    });

    it('should reject room names that are too long', () => {
      const longName = 'a'.repeat(101);
      const result = validateRoomName(longName);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Room name must be less than 100 characters');
    });

    it('should reject room names with invalid characters', () => {
      const result = validateRoomName('room name!@#');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('can only contain');
    });
  });

  describe('validateSystemPrompt', () => {
    it('should accept valid prompts', () => {
      const prompt = 'You are a helpful AI assistant.';
      expect(validateSystemPrompt(prompt)).toEqual({ valid: true });
    });

    it('should reject empty prompts', () => {
      const result = validateSystemPrompt('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('System prompt is required');
    });

    it('should reject prompts that are too long', () => {
      const longPrompt = 'a'.repeat(2001);
      const result = validateSystemPrompt(longPrompt);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('System prompt must be less than 2000 characters');
    });
  });

  describe('getVoiceDisplayName', () => {
    it('should return display name for each voice', () => {
      expect(getVoiceDisplayName('alloy')).toBe('Alloy (Neutral)');
      expect(getVoiceDisplayName('echo')).toBe('Echo (Male)');
      expect(getVoiceDisplayName('nova')).toBe('Nova (Female)');
    });
  });

  describe('getAvailableVoices', () => {
    it('should return all available voices', () => {
      const voices = getAvailableVoices();
      expect(voices).toHaveLength(6);
      expect(voices[0]).toHaveProperty('value');
      expect(voices[0]).toHaveProperty('label');
    });
  });

  describe('formatUptime', () => {
    it('should format seconds correctly', () => {
      expect(formatUptime(30)).toBe('30s');
      expect(formatUptime(90)).toBe('1m 30s');
      expect(formatUptime(3665)).toBe('1h 1m 5s');
    });

    it('should handle zero uptime', () => {
      expect(formatUptime(0)).toBe('0s');
    });
  });

  describe('estimateConversationCost', () => {
    it('should calculate costs for GPT-4', () => {
      const cost = estimateConversationCost({
        durationMinutes: 5,
        model: 'gpt-4',
      });

      expect(cost.whisperCost).toBeGreaterThan(0);
      expect(cost.llmCost).toBeGreaterThan(0);
      expect(cost.ttsCost).toBeGreaterThan(0);
      expect(cost.totalCost).toBe(
        cost.whisperCost + cost.llmCost + cost.ttsCost
      );
    });

    it('should calculate costs for GPT-3.5', () => {
      const gpt4Cost = estimateConversationCost({
        durationMinutes: 5,
        model: 'gpt-4',
      });

      const gpt35Cost = estimateConversationCost({
        durationMinutes: 5,
        model: 'gpt-3.5-turbo',
      });

      expect(gpt35Cost.llmCost).toBeLessThan(gpt4Cost.llmCost);
    });

    it('should scale with duration', () => {
      const cost5min = estimateConversationCost({ durationMinutes: 5 });
      const cost10min = estimateConversationCost({ durationMinutes: 10 });

      expect(cost10min.totalCost).toBeGreaterThan(cost5min.totalCost);
    });
  });

  describe('parseApiError', () => {
    it('should parse Error objects', () => {
      const error = new Error('Test error');
      expect(parseApiError(error)).toBe('Test error');
    });

    it('should parse error objects with error property', () => {
      const error = { error: 'API error' };
      expect(parseApiError(error)).toBe('API error');
    });

    it('should handle unknown errors', () => {
      expect(parseApiError('string error')).toBe('An unknown error occurred');
      expect(parseApiError(null)).toBe('An unknown error occurred');
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first try', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      const result = await retryWithBackoff(fn);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');

      const result = await retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelay: 10,
      });

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('fail'));

      await expect(
        retryWithBackoff(fn, {
          maxRetries: 2,
          initialDelay: 10,
        })
      ).rejects.toThrow('fail');

      expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
  });
});

describe('Voice Agent Types', () => {
  it('should have correct AgentSession structure', () => {
    const session: AgentSession = {
      roomName: 'test-room',
      agentIdentity: 'agent-123',
      token: 'jwt-token',
      createdAt: new Date(),
      status: 'active',
      metadata: {
        systemPrompt: 'Test prompt',
        voice: 'alloy',
      },
    };

    expect(session).toHaveProperty('roomName');
    expect(session).toHaveProperty('agentIdentity');
    expect(session).toHaveProperty('token');
    expect(session).toHaveProperty('status');
    expect(session.metadata).toHaveProperty('systemPrompt');
  });

  it('should accept all valid OpenAI voices', () => {
    const voices: OpenAIVoice[] = [
      'alloy',
      'echo',
      'fable',
      'onyx',
      'nova',
      'shimmer',
    ];

    voices.forEach(voice => {
      expect(typeof voice).toBe('string');
    });
  });
});

describe('VoiceAgentClient', () => {
  // Note: These are integration tests that would require mocking fetch
  // In a real test environment, you'd mock the fetch API

  it('should construct with default base URL', async () => {
    const { VoiceAgentClient } = await import('../voice-agent-utils');
    const client = new VoiceAgentClient();
    expect(client).toBeDefined();
  });

  it('should construct with custom base URL', async () => {
    const { VoiceAgentClient } = await import('../voice-agent-utils');
    const client = new VoiceAgentClient('https://example.com');
    expect(client).toBeDefined();
  });
});
