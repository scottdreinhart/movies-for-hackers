import type { ReactNode } from 'react';
import { useHapticCallback } from '../../../hooks/useHapticCallback';
import styles from './Button.module.css';

interface ButtonProps {
  onClick: () => void;
  active?: boolean;
  children: ReactNode;
  title?: string;
  className?: string;
}

export default function Button({
  onClick,
  active = false,
  children,
  title,
  className = '',
}: ButtonProps) {
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
