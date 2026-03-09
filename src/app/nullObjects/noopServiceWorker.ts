/**
 * No-op service worker — null object for environments where
 * service workers are unavailable or disabled.
 *
 * @pattern Null Object Pattern
 */

import type { ServiceWorkerPort } from '../../domain/ports';

export const noopServiceWorker: ServiceWorkerPort = {
  async register(): Promise<void> {
    /* intentionally empty */
  },
};
