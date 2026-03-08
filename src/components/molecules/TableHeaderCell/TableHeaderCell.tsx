import { memo, useCallback, type KeyboardEvent } from 'react';
import { SortArrow } from '../../atoms';
import type { SortDirection } from '../../../types';
import styles from './TableHeaderCell.module.css';

interface TableHeaderCellProps {
  label: string;
  columnKey: string;
  sortCol: string;
  sortDir: SortDirection;
  onSort: (col: string) => void;
}

const TableHeaderCell = memo(function TableHeaderCell({ label, columnKey, sortCol, sortDir, onSort }: TableHeaderCellProps) {
  const isActive = sortCol === columnKey;
  const ariaSortValue = isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
  const handleSort = useCallback(() => onSort(columnKey), [onSort, columnKey]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableCellElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSort();
      }
    },
    [handleSort],
  );

  return (
    <th
      className={`${styles.th} ${isActive ? styles.sorted : ''}`}
      onClick={handleSort}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-sort={ariaSortValue}
      role="columnheader"
    >
      {label}
      <SortArrow active={isActive} direction={isActive ? sortDir : 'asc'} />
    </th>
  );
});

export default TableHeaderCell;
