import { useRef, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { EmptyState } from '../../atoms';
import { TableHeaderCell, MovieRow } from '../../molecules';
import { TABLE_COLUMNS } from '../../../constants/sectionMeta';
import { useDpadNavigation } from '../../../hooks/useDpadNavigation';
import type { MovieEntry, SortDirection } from '../../../types';
import styles from './MovieTable.module.css';

/** Estimated height (px) of a single row — used by the virtualizer. */
const ROW_HEIGHT = 42;
/** Extra rows rendered above/below the visible window for smooth scrolling. */
const OVERSCAN = 10;

interface MovieTableProps {
  entries: MovieEntry[];
  sortCol: string;
  sortDir: SortDirection;
  onSort: (col: string) => void;
  watched: Set<string>;
  onToggleWatched: (url: string) => void;
}

export default function MovieTable({
  entries,
  sortCol,
  sortDir,
  onSort,
  watched,
  onToggleWatched,
}: MovieTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Reset scroll position when the entries list changes (e.g., section switch). */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [entries]);

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  });

  const handleActivate = useCallback(
    (index: number) => {
      if (entries[index]) {
        window.open(entries[index].url, '_blank', 'noopener,noreferrer');
      }
    },
    [entries],
  );

  const { focusedIndex, containerProps } = useDpadNavigation({
    itemCount: entries.length,
    virtualizer,
    onActivate: handleActivate,
  });

  if (entries.length === 0) {
    return <EmptyState />;
  }

  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  /* Spacer heights keep the scrollbar accurate without rendering every row. */
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0 ? totalSize - virtualItems[virtualItems.length - 1].end : 0;

  /* Total columns: watched checkbox + TABLE_COLUMNS */
  const colCount = TABLE_COLUMNS.length + 1;

  return (
    <div ref={scrollRef} className={styles.container} {...containerProps}>
      <table className={styles.table}>
        <caption className={styles.srOnly}>
          Movies for Hackers — sortable and filterable movie list
        </caption>
        <thead className={styles.stickyHead}>
          <tr>
            <th className={styles.watchedHeader} aria-label="Watched" />
            {TABLE_COLUMNS.map((col) => (
              <TableHeaderCell
                key={col.key}
                label={col.label}
                columnKey={col.key}
                sortCol={sortCol}
                sortDir={sortDir}
                onSort={onSort}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr aria-hidden="true">
              <td colSpan={colCount} style={{ height: paddingTop, padding: 0, border: 0 }} />
            </tr>
          )}
          {virtualItems.map((virtualRow) => {
            const entry = entries[virtualRow.index];
            return (
              <MovieRow
                key={`${entry.url}-${entry.section}`}
                entry={entry}
                isWatched={watched.has(entry.url)}
                isFocused={focusedIndex === virtualRow.index}
                onToggleWatched={onToggleWatched}
              />
            );
          })}
          {paddingBottom > 0 && (
            <tr aria-hidden="true">
              <td colSpan={colCount} style={{ height: paddingBottom, padding: 0, border: 0 }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
