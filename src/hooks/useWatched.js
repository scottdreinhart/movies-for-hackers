import { useState, useCallback } from 'react';
import { loadWatchedSet, saveWatchedSet } from '../services/storageService';

/**
 * Hook to manage "watched" state backed by localStorage.
 * Storage access is delegated to storageService for testability.
 *
 * @returns {{ watched: Set<string>, toggleWatched: (url: string) => void }}
 */
export function useWatched() {
  const [watched, setWatched] = useState(loadWatchedSet);

  const toggleWatched = useCallback((url) => {
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
