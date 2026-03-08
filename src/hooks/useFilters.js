import { useState, useMemo, useCallback } from 'react';
import { matchesSearch } from '../utils/searchUtils';

const INITIAL_FILTERS = {
  search: '',
  genre: '',
  format: '',
  rated: '',
  section: '',
  yearMin: '',
  yearMax: '',
  ratingMin: '',
  ratingMax: '',
};

/**
 * Hook to manage filter state and derive filtered entries + metadata.
 *
 * @param {Array} entries - All parsed movie entries
 * @returns {{ filters, updateFilter, resetFilters, filteredEntries, genres, sectionCounts }}
 */
export function useFilters(entries) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const filteredEntries = useMemo(() => {
    const { search, genre, format, rated, section, yearMin, yearMax, ratingMin, ratingMax } =
      filters;
    const yMin = parseInt(yearMin, 10) || 0;
    const yMax = parseInt(yearMax, 10) || 9999;
    const rMin = parseFloat(ratingMin) || 0;
    const rMax = parseFloat(ratingMax) || 10;

    const searchWords = search ? search.toLowerCase().trim().split(/\s+/) : null;

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

  /** All metadata computed in a single pass across all entries. */
  const { genres, years, ratings, sectionCounts } = useMemo(() => {
    const genreSet = new Set();
    const yearSet = new Set();
    const ratingSet = new Set();
    const counts = {};

    for (const e of entries) {
      e.genre.split('/').forEach((g) => {
        const trimmed = g.trim();
        if (trimmed) genreSet.add(trimmed);
      });
      yearSet.add(e.year);
      ratingSet.add(e.rating);
      counts[e.section] = (counts[e.section] || 0) + 1;
    }

    return {
      genres: [...genreSet].sort(),
      years: [...yearSet].sort((a, b) => a - b),
      ratings: [...ratingSet].sort((a, b) => a - b),
      sectionCounts: counts,
    };
  }, [entries]);

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
