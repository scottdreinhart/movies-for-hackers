/**
 * No-op theme — null object for environments where
 * DOM theme application is unavailable (SSR, tests).
 *
 * @pattern Null Object Pattern
 */

import type { ThemePort } from '../../domain/ports';

export const noopTheme: ThemePort = {
  apply(): void {
    /* intentionally empty */
  },
};
