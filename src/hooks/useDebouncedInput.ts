import { useState, useEffect, useRef, useCallback, type ChangeEvent } from 'react';

/**
 * Hook for debounced text input — manages a local value that syncs with an external
 * value and debounces change callbacks.
 */
export function useDebouncedInput(
  externalValue: string,
  onChange: (value: string) => void,
  delay: number = 200,
): [string, (e: ChangeEvent<HTMLInputElement>) => void] {
  const [local, setLocal] = useState(externalValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Sync external resets (e.g., "Reset" button) into local state
  useEffect(() => {
    setLocal(externalValue);
  }, [externalValue]);

  // Cleanup timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setLocal(v);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChange(v), delay);
    },
    [onChange, delay],
  );

  return [local, handleChange];
}
