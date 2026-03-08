import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook for debounced text input — manages a local value that syncs with an external
 * value and debounces change callbacks.
 *
 * @param {string}   externalValue - Controlled value from parent
 * @param {Function} onChange      - Callback fired after debounce delay
 * @param {number}   [delay=200]  - Debounce delay in ms
 * @returns {[string, Function]} Tuple of [localValue, handleChange]
 */
export function useDebouncedInput(externalValue, onChange, delay = 200) {
  const [local, setLocal] = useState(externalValue);
  const timerRef = useRef(null);

  // Sync external resets (e.g., "Reset" button) into local state
  useEffect(() => {
    setLocal(externalValue);
  }, [externalValue]);

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleChange = useCallback(
    (e) => {
      const v = e.target.value;
      setLocal(v);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(v), delay);
    },
    [onChange, delay],
  );

  return [local, handleChange];
}
