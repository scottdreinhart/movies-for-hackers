import { useCallback, useRef, useEffect } from 'react';
import { hapticLight, hapticMedium, hapticHeavy } from '../utils/haptics';

const HAPTIC_MAP = {
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
};

/**
 * Hook that wraps a callback with haptic feedback.
 * Eliminates the repeated pattern of:
 *   const handle = () => { hapticLight(); onClick(); };
 *
 * Uses a ref (synced via useEffect) to always invoke the latest callback
 * without needing it in the dependency array — the returned function is
 * stable for the component lifetime.
 *
 * @param {Function} callback     - The original callback to wrap
 * @param {string}   [intensity='light'] - 'light' | 'medium' | 'heavy'
 * @returns {Function} Stable wrapped callback that fires haptics then delegates
 */
export function useHapticCallback(callback, intensity = 'light') {
  const hapticFn = HAPTIC_MAP[intensity] || hapticLight;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback(
    (...args) => {
      hapticFn();
      callbackRef.current?.(...args);
    },
    [hapticFn],
  );
}
