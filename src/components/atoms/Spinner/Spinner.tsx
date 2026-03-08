import styles from './Spinner.module.css';

interface SpinnerProps {
  message?: string;
}

export default function Spinner({ message = 'Loading...' }: SpinnerProps) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
