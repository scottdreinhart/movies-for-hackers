/**
 * No-op haptics — null object for environments where
 * haptic feedback is unavailable or disabled.
 *
 * @pattern Null Object Pattern
 */

import type { HapticsPort } from '../../domain/ports';

export const noopHaptics: HapticsPort = {
  trigger(): void {
    /* intentionally empty */
  },
};
