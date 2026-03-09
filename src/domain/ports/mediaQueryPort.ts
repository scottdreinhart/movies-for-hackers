/**
 * Port: Media-query / system-preference abstraction.
 *
 * Decouples theme resolution from `window.matchMedia`.
 *
 * @pattern Hexagonal / Ports & Adapters
 */

export interface MediaQueryPort {
  /** Returns `true` when the user's OS prefers the light color scheme. */
  prefersLightMode(): boolean;

  /** Subscribe to changes in the light-mode media query. Returns an unsubscribe function. */
  onLightModeChange(callback: (prefersLight: boolean) => void): () => void;
}
