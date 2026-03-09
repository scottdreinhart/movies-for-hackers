/**
 * Filter policy — default values and validation rules for filter state.
 *
 * Centralizes filter-related constants and rules that were previously
 * scattered as magic values across hooks and components.
 *
 * @pattern Policy Objects
 */

import type { FilterState } from '../../types';

/** The canonical initial filter state. */
export const INITIAL_FILTERS: Readonly<FilterState> = Object.freeze({
  search: '',
  genre: '',
  format: '',
  rated: '',
  section: '',
  yearMin: '',
  yearMax: '',
  ratingMin: '',
  ratingMax: '',
});

/** Year range boundaries. */
export const YEAR_RANGE = {
  /** Minimum sensible year (earliest known film). */
  min: 0,
  /** Maximum sensible year upper bound. */
  max: 9999,
} as const;

/** Rating range boundaries. */
export const RATING_RANGE = {
  min: 0,
  max: 10,
} as const;

/** Parse a year filter value, returning the appropriate default if empty. */
export function parseYearFilter(value: string, fallback: number): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

/** Parse a rating filter value, returning the appropriate default if empty. */
export function parseRatingFilter(value: string, fallback: number): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

/** Check whether any filter is active (non-default). */
export function hasActiveFilters(filters: FilterState): boolean {
  return Object.keys(INITIAL_FILTERS).some(
    (key) => filters[key as keyof FilterState] !== INITIAL_FILTERS[key as keyof FilterState],
  );
}
