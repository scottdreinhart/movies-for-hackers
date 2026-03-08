import PropTypes from 'prop-types';
import styles from './SortArrow.module.css';

export default function SortArrow({ active = false, direction = 'asc' }) {
  const arrow = direction === 'asc' ? '▲' : '▼';
  return (
    <span className={`${styles.arrow} ${active ? styles.active : ''}`} aria-hidden="true">
      {arrow}
    </span>
  );
}

SortArrow.propTypes = {
  active: PropTypes.bool,
  direction: PropTypes.oneOf(['asc', 'desc']),
};
