import { useState, useMemo, useCallback } from 'react';
import { compareEntries } from '../utils/sortUtils';

/**
 * Hook to manage sort state and produce a sorted copy of entries.
 *
 * @param {Array} entries - Entries to sort (typically the filtered set)
 * @returns {{ sortCol, sortDir, toggleSort, resetSort, sortedEntries }}
 */
export function useSort(entries) {
  const [sortCol, setSortCol] = useState('title');
  const [sortDir, setSortDir] = useState('asc');

  const toggleSort = useCallback(
    (col) => {
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
    () => [...entries].sort((a, b) => compareEntries(a, b, sortCol, sortDir)),
    [entries, sortCol, sortDir],
  );

  return { sortCol, sortDir, toggleSort, resetSort, sortedEntries };
}
