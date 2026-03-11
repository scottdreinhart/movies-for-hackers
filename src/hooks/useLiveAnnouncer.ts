import { useState, useEffect, useRef } from 'react';
import { ANNOUNCE_DELAY_MS } from '../domain/policies/debouncePolicy';

/**
 * Hook that provides a debounced live-region message for screen readers.
 *
 * Default delay is sourced from the {@link ANNOUNCE_DELAY_MS} policy constant.
 *
 * @pattern Policy Object — timing driven by debouncePolicy
 */
export function useLiveAnnouncer(message: string, delay: number = ANNOUNCE_DELAY_MS): string {
  const [announced, setAnnounced] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setAnnounced(message);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, delay]);

  return announced;
}
