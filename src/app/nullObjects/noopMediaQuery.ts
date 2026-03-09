/**
 * No-op media query — null object for environments where
 * window.matchMedia is unavailable (SSR, tests).
 *
 * @pattern Null Object Pattern
 */

import type { MediaQueryPort } from '../../domain/ports';

export const noopMediaQuery: MediaQueryPort = {
  prefersLightMode(): boolean {
    return false;
  },
  onLightModeChange(): () => void {
    return () => {};
  },
};
