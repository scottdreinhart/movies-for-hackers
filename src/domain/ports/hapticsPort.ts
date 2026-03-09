/**
 * Port: Haptic feedback abstraction.
 *
 * Allows domain / app code to request tactile feedback without
 * depending on navigator.vibrate, Capacitor Haptics, or any other API.
 *
 * @pattern Hexagonal / Ports & Adapters
 */

import type { HapticIntensity } from '../../types';

export interface HapticsPort {
  /** Trigger a haptic pulse at the given intensity. */
  trigger(intensity: HapticIntensity): void;
}
