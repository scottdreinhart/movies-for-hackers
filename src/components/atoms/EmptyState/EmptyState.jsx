import PropTypes from 'prop-types';
import styles from './EmptyState.module.css';

export default function EmptyState({ icon = '🔍', message = 'No entries match your filters' }) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.icon}>{icon}</div>
      <p>{message}</p>
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.string,
  message: PropTypes.string,
};
