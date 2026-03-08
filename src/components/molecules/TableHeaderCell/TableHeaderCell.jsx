import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SortArrow } from '../../atoms';
import styles from './TableHeaderCell.module.css';

const TableHeaderCell = memo(function TableHeaderCell({ label, columnKey, sortCol, sortDir, onSort }) {
  const isActive = sortCol === columnKey;
  const ariaSortValue = isActive ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none';
  const handleSort = useCallback(() => onSort(columnKey), [onSort, columnKey]);

  const handleKeyDown = useCallback(
    (e) => {
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

TableHeaderCell.propTypes = {
  label: PropTypes.string.isRequired,
  columnKey: PropTypes.string.isRequired,
  sortCol: PropTypes.string.isRequired,
  sortDir: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onSort: PropTypes.func.isRequired,
};

export default TableHeaderCell;
