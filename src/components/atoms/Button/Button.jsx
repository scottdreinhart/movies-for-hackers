import PropTypes from 'prop-types';
import { useHapticCallback } from '../../../hooks/useHapticCallback';
import styles from './Button.module.css';

export default function Button({ onClick, active = false, children, title, className = '' }) {
  const handleClick = useHapticCallback(onClick, 'medium');

  return (
    <button
      className={`${styles.btn} ${active ? styles.active : ''} ${className}`}
      onClick={handleClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
};
