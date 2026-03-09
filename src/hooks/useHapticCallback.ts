import { useCallback, useRef, useEffect } from 'react';
import { hapticLight, hapticMedium, hapticHeavy } from '../utils/haptics';
import type { HapticIntensity } from '../types';

/**
 * Mapping from intensity label to haptic trigger function.
 *
 * Duration thresholds are defined in {@link ../domain/policies/debouncePolicy}
 * and consumed by the browser haptics adapter. This legacy mapping remains
 * for backward compatibility with the imperative util functions.
 *
 * @pattern Strategy Pattern (intensity → haptic function)
 */
const HAPTIC_MAP: Record<HapticIntensity, () => void> = {
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
};

/**
 * Hook that wraps a callback with haptic feedback.
 *
 * The hook follows Tell-Don't-Ask: callers supply the intensity and
 * the hook internally selects the correct function — the consumer
 * never inspects the resulting strategy.
 *
 * @pattern Strategy Pattern — selects haptic function via intensity key
 * @pattern Tell Don't Ask — callers never inspect the haptic map
 * @pattern Command Pattern — wraps the original callback as a command
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
