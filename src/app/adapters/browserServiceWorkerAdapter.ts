/**
 * Browser service-worker adapter.
 *
 * Implements the ServiceWorkerPort using navigator.serviceWorker.
 *
 * @pattern Adapter Pattern
 * @pattern Hexagonal / Ports & Adapters
 */

import type { ServiceWorkerPort } from '../../domain/ports';

export function createBrowserServiceWorkerAdapter(): ServiceWorkerPort {
  return {
    async register(scriptPath: string): Promise<void> {
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register(scriptPath);
        } catch {
          /* silently ignore — SW registration failures are non-critical */
        }
      }
    },
  };
}
