import { useState, useMemo, useCallback } from 'react';
import { compareEntries } from '../utils/sortUtils';
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
 */
export function useSort(entries: MovieEntry[]): UseSortResult {
  const [sortCol, setSortCol] = useState('title');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

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
    setSortCol('title');
    setSortDir('asc');
  }, []);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => compareEntries(a, b, sortCol as keyof MovieEntry, sortDir)),
    [entries, sortCol, sortDir],
  );

  return { sortCol, sortDir, toggleSort, resetSort, sortedEntries };
}
