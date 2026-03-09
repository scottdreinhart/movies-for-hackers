import { useState, useMemo, useCallback } from 'react';
import { matchesSearch } from '../utils/searchUtils';
import {
  INITIAL_FILTERS,
  parseYearFilter,
  parseRatingFilter,
  YEAR_RANGE,
  RATING_RANGE,
} from '../domain/policies/filterPolicy';
import {
  selectGenres,
  selectYears,
  selectRatings,
  selectSectionCounts,
} from '../domain/selectors/movieSelectors';
import type { MovieEntry, FilterState, SectionCounts } from '../types';

interface UseFiltersResult {
  filters: FilterState;
  updateFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  filteredEntries: MovieEntry[];
  genres: string[];
  years: number[];
  ratings: number[];
  sectionCounts: SectionCounts;
}

/**
 * Hook to manage filter state and derive filtered entries + metadata.
 *
 * Filter defaults come from the filter policy (Policy Objects pattern).
 * Aggregate metadata is derived via selectors (CQRS-lite).
 *
 * @pattern Policy Objects (filter defaults)
 * @pattern CQRS-lite / Selector Pattern (derived metadata)
 * @pattern Functional Core (pure filter logic)
 */
export function useFilters(entries: MovieEntry[]): UseFiltersResult {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const updateFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const filteredEntries = useMemo(() => {
    const { search, genre, format, rated, section, yearMin, yearMax, ratingMin, ratingMax } =
      filters;
    const yMin = parseYearFilter(yearMin, YEAR_RANGE.min);
    const yMax = parseYearFilter(yearMax, YEAR_RANGE.max);
    const rMin = parseRatingFilter(ratingMin, RATING_RANGE.min);
    const rMax = parseRatingFilter(ratingMax, RATING_RANGE.max);

    const searchWords: string[] | null = search ? search.toLowerCase().trim().split(/\s+/) : null;

    return entries.filter((entry) => {
      if (section && entry.section !== section) return false;
      if (format && entry.format !== format) return false;
      if (rated && entry.rated !== rated) return false;
      if (genre) {
        const entryGenres = entry.genre.split('/').map((g) => g.trim());
        if (!entryGenres.includes(genre)) return false;
      }
      if (entry.year < yMin || entry.year > yMax) return false;
      if (entry.rating < rMin || entry.rating > rMax) return false;

      if (searchWords) {
        if (!matchesSearch(entry, searchWords)) return false;
      }

      return true;
    });
  }, [entries, filters]);

  /** Aggregate metadata derived via selectors (single-pass). */
  const genres = useMemo(() => selectGenres(entries), [entries]);
  const years = useMemo(() => selectYears(entries), [entries]);
  const ratings = useMemo(() => selectRatings(entries), [entries]);
  const sectionCounts = useMemo(() => selectSectionCounts(entries), [entries]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredEntries,
    genres,
    years,
    ratings,
    sectionCounts,
  };
}
