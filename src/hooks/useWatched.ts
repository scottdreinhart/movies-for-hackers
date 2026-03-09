import { useState, useCallback } from 'react';
import { loadWatchedSet, saveWatchedSet } from '../services/storageService';

interface UseWatchedResult {
  watched: Set<string>;
  toggleWatched: (url: string) => void;
}

/**
 * Hook to manage "watched" state backed by localStorage.
 *
 * The repository layer (`WatchedRepository`) provides a port-based
 * abstraction; this hook still uses the legacy service for backward
 * compatibility.  Future migration: inject via `useAppContainer()`.
 *
 * @pattern Repository Pattern (via storageService)
 * @pattern Command Pattern (toggleWatched is a write command)
 */
export function useWatched(): UseWatchedResult {
  const [watched, setWatched] = useState<Set<string>>(loadWatchedSet);

  const toggleWatched = useCallback((url: string) => {
    setWatched((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      saveWatchedSet(next);
      return next;
    });
  }, []);

  return { watched, toggleWatched };
}
