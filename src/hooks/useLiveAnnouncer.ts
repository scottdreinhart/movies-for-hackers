import { useState, useEffect, useRef } from 'react';

/**
 * Hook that provides a debounced live-region message for screen readers.
 */
export function useLiveAnnouncer(message: string, delay: number = 500): string {
  const [announced, setAnnounced] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setAnnounced(message);
    }, delay);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [message, delay]);

  return announced;
}
