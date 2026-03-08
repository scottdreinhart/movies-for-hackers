import styles from './SortArrow.module.css';
import type { SortDirection } from '../../../types';

interface SortArrowProps {
  active?: boolean;
  direction?: SortDirection;
}

export default function SortArrow({ active = false, direction = 'asc' }: SortArrowProps) {
  const arrow = direction === 'asc' ? '▲' : '▼';
  return (
    <span className={`${styles.arrow} ${active ? styles.active : ''}`} aria-hidden="true">
      {arrow}
    </span>
  );
}
