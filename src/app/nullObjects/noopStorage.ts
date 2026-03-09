/**
 * No-op storage — null object for environments where
 * persistence is unavailable or disabled.
 *
 * @pattern Null Object Pattern
 */

import type { StoragePort } from '../../domain/ports';

export const noopStorage: StoragePort = {
  get(): null {
    return null;
  },
  set(): void {
    /* intentionally empty */
  },
  remove(): void {
    /* intentionally empty */
  },
  keys(): string[] {
    return [];
  },
};
