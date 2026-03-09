/**
 * Port: Persistence abstraction.
 *
 * Hexagonal Architecture — the domain defines WHAT it needs stored,
 * not HOW or WHERE.  Adapters in `app/adapters/` implement this for
 * localStorage, IndexedDB, or any other backing store.
 *
 * @pattern Hexagonal / Ports & Adapters
 */

/** Generic key-value persistence port. */
export interface StoragePort {
  /** Retrieve a value by key.  Returns `null` when absent. */
  get<T>(key: string): T | null;

  /** Persist a value under the given key. */
  set<T>(key: string, value: T): void;

  /** Remove a key from storage. */
  remove(key: string): void;

  /** List all keys currently stored (optional, may return empty). */
  keys(): string[];
}
