/**
 * Browser media-query adapter.
 *
 * Implements the MediaQueryPort using window.matchMedia.
 *
 * @pattern Adapter Pattern
 * @pattern Hexagonal / Ports & Adapters
 */

import type { MediaQueryPort } from '../../domain/ports';

export function createBrowserMediaQueryAdapter(): MediaQueryPort {
  return {
    prefersLightMode(): boolean {
      return window.matchMedia('(prefers-color-scheme: light)').matches;
    },

    onLightModeChange(callback: (prefersLight: boolean) => void): () => void {
      const mq = window.matchMedia('(prefers-color-scheme: light)');
      const handler = (e: MediaQueryListEvent) => callback(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    },
  };
}
