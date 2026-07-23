import { describe, test, expect, vi } from 'vitest';
import { isOAuthError, logAuthHelpNote } from './logger.js';

describe('logger OAuth error helpers', () => {
  describe('isOAuthError', () => {
    test('returns true for known OAuth error strings and objects', () => {
      expect(isOAuthError(new Error('deleted_client'))).toBe(true);
      expect(isOAuthError(new Error('invalid_grant'))).toBe(true);
      expect(isOAuthError(new Error('invalid_client'))).toBe(true);
      expect(isOAuthError('unauthorized_client')).toBe(true);
      expect(isOAuthError('OAuth token expired')).toBe(true);
    });

    test('returns false for non-OAuth errors', () => {
      expect(isOAuthError(null)).toBe(false);
      expect(isOAuthError(undefined)).toBe(false);
      expect(isOAuthError(new Error('File not found'))).toBe(false);
    });
  });

  describe('logAuthHelpNote', () => {
    test('calls prompts.note when prompts object is passed', () => {
      const mockPrompts = { note: vi.fn() };
      logAuthHelpNote(mockPrompts);
      expect(mockPrompts.note).toHaveBeenCalledTimes(1);
      expect(mockPrompts.note.mock.calls[0][1]).toContain('OAuth');
    });

    test('logs to console when no prompts object is passed', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      logAuthHelpNote();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
