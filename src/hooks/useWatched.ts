import { useState, useCallback } from 'react';
import { loadWatchedSet, saveWatchedSet } from '../services/storageService';

interface UseWatchedResult {
  watched: Set<string>;
  toggleWatched: (url: string) => void;
}

/**
 * Hook to manage "watched" state backed by localStorage.
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
