/**
 * Search utilities — haystack cache and matching logic.
 * Extracted from useFilters for separation of concerns and testability.
 */

import type { MovieEntry } from '../types';

/** Cache search haystack strings without mutating entry objects. */
const haystackCache = new WeakMap<MovieEntry, string>();

/** Build a lowercase haystack string for an entry, using a WeakMap cache. */
function getHaystack(entry: MovieEntry): string {
  let h = haystackCache.get(entry);
  if (!h) {
    h =
      `${entry.title} ${entry.genre} ${entry.format} ${entry.rated} ${entry.description} ${entry.notes} ${entry.section}`.toLowerCase();
    haystackCache.set(entry, h);
  }
  return h;
}

/** Check if an entry matches all search words. */
export function matchesSearch(entry: MovieEntry, searchWords: string[] | null): boolean {
  if (!searchWords) return true;
  const h = getHaystack(entry);
  return searchWords.every((w) => h.includes(w));
}
