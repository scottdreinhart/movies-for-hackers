import { useCallback, useRef, useEffect } from 'react';
import { hapticLight, hapticMedium, hapticHeavy } from '../utils/haptics';
import type { HapticIntensity } from '../types';

const HAPTIC_MAP: Record<HapticIntensity, () => void> = {
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
};

/**
 * Hook that wraps a callback with haptic feedback.
 */
export function useHapticCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  intensity: HapticIntensity = 'light',
): (...args: Parameters<T>) => void {
  const hapticFn = HAPTIC_MAP[intensity] || hapticLight;
  const callbackRef = useRef<T>(callback);

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
