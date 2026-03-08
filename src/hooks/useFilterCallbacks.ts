import { useCallback, useMemo } from 'react';

import type { FilterState } from '../types';

type FilterKey = keyof FilterState;

interface FilterCallbacks {
  onSearch: (value: string) => void;
  onGenre: (value: string) => void;
  onFormat: (value: string) => void;
  onRated: (value: string) => void;
  onYearMin: (value: string) => void;
  onYearMax: (value: string) => void;
  onRatingMin: (value: string) => void;
  onRatingMax: (value: string) => void;
}

/**
 * Hook to generate stable per-key filter callbacks from a single onFilterChange.
 */
export function useFilterCallbacks(
  onFilterChange: (key: FilterKey, value: string) => void,
): FilterCallbacks {
  const make = useCallback(
    (key: FilterKey) => (value: string) => onFilterChange(key, value),
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
