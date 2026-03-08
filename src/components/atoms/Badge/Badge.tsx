import { memo, type ReactNode } from 'react';
import styles from './Badge.module.css';
import type { BadgeVariant } from '../../../types';

const VARIANT_CLASSES: Record<string, string> = {
  thriller: styles.thriller,
  scifi: styles.scifi,
  action: styles.action,
  documentary: styles.documentary,
  tv: styles.tv,
  pending: styles.pending,
  notes: styles.notes,
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

const Badge = memo(function Badge({ variant, children }: BadgeProps) {
  const variantClass = variant ? VARIANT_CLASSES[variant] || '' : '';
  return <span className={`${styles.badge} ${variantClass}`}>{children}</span>;
});

export default Badge;
