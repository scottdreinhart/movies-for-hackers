/**
 * Movie selectors — derived read models for rendering.
 *
 * Separates state mutation (commands/write side) from derived
 * view models (read side).  Each selector is a pure function,
 * trivially memoizable.
 *
 * @pattern CQRS-lite / Selector Pattern
 * @pattern Presenter / ViewModel
 */

import type { MovieEntry, SectionCounts, RatingTier, FilterState } from '../../types';
import {
  classifyRating,
  getTierColor,
  formatRating,
  ratingPercentage,
} from '../policies/ratingPolicy';
import { SECTION_META } from '../../constants/sectionMeta';

// ── Aggregate selectors ────────────────────────────────────────

/** Extract unique sorted genres from the full entry set. */
export function selectGenres(entries: ReadonlyArray<MovieEntry>): string[] {
  const set = new Set<string>();
  for (const e of entries) {
    for (const g of e.genre.split('/')) {
      const trimmed = g.trim();
      if (trimmed) set.add(trimmed);
    }
  }
  return [...set].sort();
}

/** Extract unique sorted years from the full entry set. */
export function selectYears(entries: ReadonlyArray<MovieEntry>): number[] {
  const set = new Set<number>();
  for (const e of entries) set.add(e.year);
  return [...set].sort((a, b) => a - b);
}

/** Extract unique sorted ratings from the full entry set. */
export function selectRatings(entries: ReadonlyArray<MovieEntry>): number[] {
  const set = new Set<number>();
  for (const e of entries) set.add(e.rating);
  return [...set].sort((a, b) => a - b);
}

/** Count entries per section. */
export function selectSectionCounts(entries: ReadonlyArray<MovieEntry>): SectionCounts {
  const counts: SectionCounts = {};
  for (const e of entries) {
    counts[e.section] = (counts[e.section] || 0) + 1;
  }
  return counts;
}

// ── Row-level view model ───────────────────────────────────────

export interface MovieRowViewModel {
  readonly url: string;
  readonly title: string;
  readonly section: string;
  readonly sectionShort: string;
  readonly sectionVariant: string;
  readonly genre: string;
  readonly format: string;
  readonly year: number;
  readonly rated: string;
  readonly rating: number;
  readonly ratingFormatted: string;
  readonly ratingTier: RatingTier;
  readonly ratingColor: string;
  readonly ratingPercent: number;
  readonly description: string;
  readonly notes: string;
  readonly hasNotes: boolean;
}

/** Transform a raw MovieEntry into a rendering-ready view model. */
export function selectMovieRowVM(entry: MovieEntry): MovieRowViewModel {
  const meta = SECTION_META[entry.section] || { variant: '', short: entry.section };
  const tier = classifyRating(entry.rating);

  return {
    url: entry.url,
    title: entry.title,
    section: entry.section,
    sectionShort: meta.short,
    sectionVariant: meta.variant,
    genre: entry.genre,
    format: entry.format,
    year: entry.year,
    rated: entry.rated,
    rating: entry.rating,
    ratingFormatted: formatRating(entry.rating),
    ratingTier: tier,
    ratingColor: getTierColor(tier),
    ratingPercent: ratingPercentage(entry.rating),
    description: entry.description,
    notes: entry.notes,
    hasNotes: entry.notes.length > 0,
  };
}

// ── Composite selectors ────────────────────────────────────────

/** Derive the announcement message for screen readers. */
export function selectAnnouncementMessage(
  loading: boolean,
  filteredCount: number,
  totalCount: number,
): string {
  if (loading) return 'Loading movie data';
  return `Showing ${filteredCount} of ${totalCount} movies`;
}

/** Check whether we should show the "no results" empty state. */
export function selectShouldShowEmptyState(
  entries: ReadonlyArray<MovieEntry>,
  loading: boolean,
): boolean {
  return !loading && entries.length === 0;
}

/** Check whether the user can interact (filtering, sorting). */
export function selectCanInteract(loading: boolean, errorWithNoData: boolean): boolean {
  return !loading && !errorWithNoData;
}

/** Derive the result count display string. */
export function selectResultCountLabel(filtered: number, total: number): string {
  return `${filtered} of ${total}`;
}

/** Check if a specific filter key has a non-default value. */
export function selectIsFilterActive(filters: FilterState, key: keyof FilterState): boolean {
  return filters[key] !== '';
}
