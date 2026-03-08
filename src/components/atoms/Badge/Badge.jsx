import { memo } from 'react';
import PropTypes from 'prop-types';
import styles from './Badge.module.css';

const VARIANT_CLASSES = {
  thriller: styles.thriller,
  scifi: styles.scifi,
  action: styles.action,
  documentary: styles.documentary,
  tv: styles.tv,
  pending: styles.pending,
  notes: styles.notes,
};

const Badge = memo(function Badge({ variant, children }) {
  const variantClass = VARIANT_CLASSES[variant] || '';
  return <span className={`${styles.badge} ${variantClass}`}>{children}</span>;
});

Badge.propTypes = {
  variant: PropTypes.oneOf(['thriller', 'scifi', 'action', 'documentary', 'tv', 'pending', 'notes']),
  children: PropTypes.node.isRequired,
};

export default Badge;
