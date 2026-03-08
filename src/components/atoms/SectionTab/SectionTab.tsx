import { useHapticCallback } from '../../../hooks/useHapticCallback';
import styles from './SectionTab.module.css';

interface SectionTabProps {
  label: string;
  count: number;
  active?: boolean;
  onClick: () => void;
}

export default function SectionTab({ label, count, active = false, onClick }: SectionTabProps) {
  const handleClick = useHapticCallback(onClick, 'light');

  return (
    <button
      className={`${styles.tab} ${active ? styles.active : ''}`}
      onClick={handleClick}
      type="button"
      aria-pressed={active}
    >
      {label}
      <span className={styles.count}>{count}</span>
    </button>
  );
}
