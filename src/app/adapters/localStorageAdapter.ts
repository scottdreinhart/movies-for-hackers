/**
 * Browser localStorage adapter.
 *
 * Implements the StoragePort for browser localStorage.
 *
 * @pattern Adapter Pattern
 * @pattern Hexagonal / Ports & Adapters
 */

import type { StoragePort } from '../../domain/ports';

export function createLocalStorageAdapter(): StoragePort {
  return {
    get<T>(key: string): T | null {
      try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },

    set<T>(key: string, value: T): void {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* silently ignore — quota exceeded, private browsing, etc. */
      }
    },

    remove(key: string): void {
      try {
        localStorage.removeItem(key);
      } catch {
        /* silently ignore */
      }
    },

    keys(): string[] {
      try {
        return Object.keys(localStorage);
      } catch {
        return [];
      }
    },
  };
}
