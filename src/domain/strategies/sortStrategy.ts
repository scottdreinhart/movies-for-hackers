/**
 * Sort strategies — interchangeable sorting algorithms.
 *
 * The default strategy handles alphabetical and numeric sorting.
 * Titles strip leading articles (The, A, An) for natural sort order.
 *
 * @pattern Strategy Pattern
 */

import type { MovieEntry, SortDirection } from '../../types';

// ── Strategy interface ─────────────────────────────────────────

export interface SortStrategy {
  readonly name: string;
  /** Compare two entries for the given column and direction. */
  compare(a: MovieEntry, b: MovieEntry, column: keyof MovieEntry, direction: SortDirection): number;
}

// ── Helpers ────────────────────────────────────────────────────

/** Strip leading articles for natural title sorting. */
export function stripArticle(str: string): string {
  return str.toLowerCase().replace(/^(the |a |an )/, '');
}

// ── Concrete strategies ────────────────────────────────────────

/**
 * Natural sort: alphabetical for strings (title-aware article stripping),
 * numeric for numbers.
 */
export const naturalSortStrategy: SortStrategy = {
  name: 'natural',
  compare(a: MovieEntry, b: MovieEntry, column: keyof MovieEntry, direction: SortDirection): number {
    let va: string | number = a[column];
    let vb: string | number = b[column];

    if (typeof va === 'string') {
      va = column === 'title' ? stripArticle(va) : va.toLowerCase();
      vb = column === 'title' ? stripArticle(vb as string) : (vb as string).toLowerCase();
    }

    let cmp = 0;
    if (va < vb) cmp = -1;
    else if (va > vb) cmp = 1;

    return direction === 'asc' ? cmp : -cmp;
  },
};

/**
 * Rating-first sort: always sort by rating descending as the primary key,
 * then by the requested column as secondary.
 */
export const ratingFirstSortStrategy: SortStrategy = {
  name: 'rating-first',
  compare(a: MovieEntry, b: MovieEntry, column: keyof MovieEntry, direction: SortDirection): number {
    // Primary: rating descending
    if (a.rating !== b.rating) {
      return b.rating - a.rating;
    }
    // Secondary: requested column
    return naturalSortStrategy.compare(a, b, column, direction);
  },
};

// ── Default strategy ───────────────────────────────────────────

export const defaultSortStrategy: SortStrategy = naturalSortStrategy;

// ── Strategy registry ──────────────────────────────────────────

export const sortStrategies: Record<string, SortStrategy> = {
  natural: naturalSortStrategy,
  'rating-first': ratingFirstSortStrategy,
};

// ── Apply strategy to an array ─────────────────────────────────

export function applySortStrategy(
  entries: ReadonlyArray<MovieEntry>,
  strategy: SortStrategy,
  column: keyof MovieEntry,
  direction: SortDirection,
): MovieEntry[] {
  return [...entries].sort((a, b) => strategy.compare(a, b, column, direction));
}
