import { useState, useMemo, useCallback } from 'react';
import { defaultSortStrategy, applySortStrategy } from '../domain/strategies/sortStrategy';
import { DEFAULT_SORT_STATE } from '../domain/types/commands';
import type { MovieEntry, SortDirection } from '../types';

interface UseSortResult {
  sortCol: string;
  sortDir: SortDirection;
  toggleSort: (col: string) => void;
  resetSort: () => void;
  sortedEntries: MovieEntry[];
}

/**
 * Hook to manage sort state and produce a sorted copy of entries.
 *
 * Uses the Strategy Pattern for sort algorithms — the default is
 * `naturalSortStrategy` with article-stripping for titles.
 *
 * @pattern Strategy Pattern (sort algorithm)
 * @pattern Command Pattern (toggleSort / resetSort)
 */
export function useSort(entries: MovieEntry[]): UseSortResult {
  const [sortCol, setSortCol] = useState(DEFAULT_SORT_STATE.column);
  const [sortDir, setSortDir] = useState<SortDirection>(DEFAULT_SORT_STATE.direction);

  const toggleSort = useCallback(
    (col: string) => {
      if (sortCol === col) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortCol(col);
        setSortDir('asc');
      }
    },
    [sortCol],
  );

  const resetSort = useCallback(() => {
    setSortCol(DEFAULT_SORT_STATE.column);
    setSortDir(DEFAULT_SORT_STATE.direction);
  }, []);

  const sortedEntries = useMemo(
    () => applySortStrategy(entries, defaultSortStrategy, sortCol as keyof MovieEntry, sortDir),
    [entries, sortCol, sortDir],
  );

  return { sortCol, sortDir, toggleSort, resetSort, sortedEntries };
}
