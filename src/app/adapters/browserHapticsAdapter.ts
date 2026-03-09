/**
 * Browser haptics adapter.
 *
 * Implements the HapticsPort using navigator.vibrate.
 *
 * @pattern Adapter Pattern
 * @pattern Hexagonal / Ports & Adapters
 */

import type { HapticsPort } from '../../domain/ports';
import type { HapticIntensity } from '../../types';
import { HAPTIC_DURATION } from '../../domain/policies';

export function createBrowserHapticsAdapter(): HapticsPort {
  return {
    trigger(intensity: HapticIntensity): void {
      try {
        if (navigator.vibrate) {
          navigator.vibrate(HAPTIC_DURATION[intensity]);
        }
      } catch {
        /* no-op — vibrate not supported */
      }
    },
  };
}
