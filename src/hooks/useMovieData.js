import { useState, useEffect } from 'react';

/**
 * Hook to load and parse movie data.
 *
 * In production builds, data is pre-parsed at build time via `virtual:movie-data`.
 * In development, movie_list.md is fetched and parsed at runtime.
 *
 * @returns {{ entries: Array, loading: boolean, error: Error|null }}
 */
export function useMovieData() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        let data;

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
      } catch (err) {
        if (!cancelled) setError(err);
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
