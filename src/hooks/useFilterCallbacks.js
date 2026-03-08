import { useCallback, useMemo } from 'react';

/**
 * Hook to generate stable per-key filter callbacks from a single onFilterChange.
 * Eliminates repetitive useCallback wrappers like:
 *   const onGenre = useCallback((v) => onFilterChange('genre', v), [onFilterChange]);
 *
 * @param {Function} onFilterChange - Callback accepting (key, value)
 * @returns {object} Named callbacks: onSearch, onGenre, onFormat, onRated, onYearMin, etc.
 */
export function useFilterCallbacks(onFilterChange) {
  const make = useCallback(
    (key) => (value) => onFilterChange(key, value),
    [onFilterChange],
  );

  return useMemo(
    () => ({
      onSearch: make('search'),
      onGenre: make('genre'),
      onFormat: make('format'),
      onRated: make('rated'),
      onYearMin: make('yearMin'),
      onYearMax: make('yearMax'),
      onRatingMin: make('ratingMin'),
      onRatingMax: make('ratingMax'),
    }),
    [make],
  );
}
