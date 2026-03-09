/**
 * Port: Service-worker registration abstraction.
 *
 * @pattern Hexagonal / Ports & Adapters
 */

export interface ServiceWorkerPort {
  /** Register a service worker at the given path. Resolves when registered. */
  register(scriptPath: string): Promise<void>;
}
