import PropTypes from 'prop-types';
import styles from './Spinner.module.css';

export default function Spinner({ message = 'Loading...' }) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

Spinner.propTypes = {
  message: PropTypes.string,
};
