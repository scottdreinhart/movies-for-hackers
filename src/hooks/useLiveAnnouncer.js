import { useState, useEffect, useRef } from 'react';

/**
 * Hook that provides a debounced live-region message for screen readers.
 * Prevents rapid-fire announcements when filters change quickly.
 *
 * @param {string} message - The message to announce
 * @param {number} [delay=500] - Debounce delay in ms
 * @returns {string} The debounced message for the aria-live region
 */
export function useLiveAnnouncer(message, delay = 500) {
  const [announced, setAnnounced] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setAnnounced(message);
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [message, delay]);

  return announced;
}
