import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: string;
  message?: string;
}

export default function EmptyState({
  icon = '🔍',
  message = 'No entries match your filters',
}: EmptyStateProps) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.icon}>{icon}</div>
      <p>{message}</p>
    </div>
  );
}
