/**
 * Search strategies — interchangeable search algorithms.
 *
 * The default strategy is multi-word substring matching.
 * Additional strategies can be added for fuzzy search,
 * regex search, exact match, etc.
 *
 * @pattern Strategy Pattern
 */

import type { MovieEntry } from '../../types';

// ── Strategy interface ─────────────────────────────────────────

export interface SearchStrategy {
  readonly name: string;
  /** Returns true if the entry matches the search query. */
  matches(entry: MovieEntry, query: string): boolean;
}

// ── Haystack cache (shared across strategies) ──────────────────

const haystackCache = new WeakMap<MovieEntry, string>();

function getHaystack(entry: MovieEntry): string {
  let h = haystackCache.get(entry);
  if (!h) {
    h = `${entry.title} ${entry.genre} ${entry.format} ${entry.rated} ${entry.description} ${entry.notes} ${entry.section}`.toLowerCase();
    haystackCache.set(entry, h);
  }
  return h;
}

// ── Concrete strategies ────────────────────────────────────────

/**
 * Multi-word substring search (AND logic).
 * All space-separated words must appear somewhere in the entry.
 */
export const substringStrategy: SearchStrategy = {
  name: 'substring',
  matches(entry: MovieEntry, query: string): boolean {
    if (!query.trim()) return true;
    const words = query.toLowerCase().trim().split(/\s+/);
    const h = getHaystack(entry);
    return words.every((w) => h.includes(w));
  },
};

/**
 * Exact phrase search.
 * The entire query string must appear as a contiguous substring.
 */
export const exactPhraseStrategy: SearchStrategy = {
  name: 'exact',
  matches(entry: MovieEntry, query: string): boolean {
    if (!query.trim()) return true;
    const h = getHaystack(entry);
    return h.includes(query.toLowerCase().trim());
  },
};

/**
 * Fuzzy character search.
 * Characters in the query must appear in order (not necessarily adjacent).
 */
export const fuzzyStrategy: SearchStrategy = {
  name: 'fuzzy',
  matches(entry: MovieEntry, query: string): boolean {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const h = getHaystack(entry);
    let qi = 0;
    for (let hi = 0; hi < h.length && qi < q.length; hi++) {
      if (h[hi] === q[qi]) qi++;
    }
    return qi === q.length;
  },
};

// ── Default strategy ───────────────────────────────────────────

export const defaultSearchStrategy: SearchStrategy = substringStrategy;

// ── Strategy registry ──────────────────────────────────────────

export const searchStrategies: Record<string, SearchStrategy> = {
  substring: substringStrategy,
  exact: exactPhraseStrategy,
  fuzzy: fuzzyStrategy,
};
