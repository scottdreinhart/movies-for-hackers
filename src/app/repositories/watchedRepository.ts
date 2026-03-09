/**
 * Watched movies repository.
 *
 * Encapsulates persistence of the watched-movies set behind
 * the StoragePort, preventing localStorage leakage through app code.
 *
 * @pattern Repository Pattern
 */

import type { StoragePort } from '../../domain/ports';

const WATCHED_KEY = 'movies-for-hackers-watched';

export interface WatchedRepository {
  load(): Set<string>;
  save(watched: Set<string>): void;
}

export function createWatchedRepository(storage: StoragePort): WatchedRepository {
  return {
    load(): Set<string> {
      const data = storage.get<string[]>(WATCHED_KEY);
      return data ? new Set(data) : new Set();
    },

    save(watched: Set<string>): void {
      storage.set(WATCHED_KEY, [...watched]);
    },
  };
}
