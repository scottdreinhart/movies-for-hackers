import { useState, useEffect } from 'react';
import type { MovieEntry } from '../types';

interface UseMovieDataResult {
  entries: MovieEntry[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to load and parse movie data.
 */
export function useMovieData(): UseMovieDataResult {
  const [entries, setEntries] = useState<MovieEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        let data: MovieEntry[];

        if (import.meta.env.PROD) {
          // Build-time pre-parsed JSON (zero fetch, zero parse cost)
          const mod = await import('virtual:movie-data');
          data = mod.default;
        } else {
          // Dev: fetch and parse at runtime
          const { parseMarkdown } = await import('../services/markdownParser');
          const res = await fetch('/movie_list.md');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const text = await res.text();
          data = parseMarkdown(text);
        }

        if (!cancelled) {
          setEntries(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { entries, loading, error };
}
