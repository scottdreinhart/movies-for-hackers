/**
 * Composition root — explicit dependency wiring.
 *
 * All infrastructure adapters, repositories, event bus,
 * command dispatcher, feature flags, and event logger
 * are assembled here.  This is the single place that knows
 * about concrete implementations.
 *
 * The UI layer receives only interfaces (ports) and repositories,
 * never concrete adapters.
 *
 * @pattern Composition Root
 * @pattern Hexagonal / Ports & Adapters
 * @pattern Functional Core, Imperative Shell
 */

import type { StoragePort, HapticsPort, MediaQueryPort, ServiceWorkerPort, ThemePort } from '../domain/ports';
import type { EventBus } from '../domain/events';
import type { FeatureFlags } from '../domain/featureFlags';
import type { WatchedRepository, ThemeRepository, SettingsRepository } from './repositories';
import type { CommandDispatcher } from './commands';
import type { EventLogger } from './eventLog';

import { createEventBus } from '../domain/events';
import { DEFAULT_FLAGS, isEnabled } from '../domain/featureFlags';
import { createLocalStorageAdapter } from './adapters/localStorageAdapter';
import { createBrowserHapticsAdapter } from './adapters/browserHapticsAdapter';
import { createBrowserMediaQueryAdapter } from './adapters/browserMediaQueryAdapter';
import { createBrowserServiceWorkerAdapter } from './adapters/browserServiceWorkerAdapter';
import { createBrowserThemeAdapter } from './adapters/browserThemeAdapter';
import { noopHaptics } from './nullObjects/noopHaptics';
import { noopServiceWorker } from './nullObjects/noopServiceWorker';
import { createWatchedRepository } from './repositories/watchedRepository';
import { createThemeRepository } from './repositories/themeRepository';
import { createSettingsRepository } from './repositories/settingsRepository';
import { createCommandDispatcher } from './commands/commandDispatcher';
import { createEventLogger } from './eventLog/eventLogger';

// ── Container shape ────────────────────────────────────────────

export interface AppContainer {
  // Feature flags
  readonly flags: FeatureFlags;

  // Ports (infrastructure interfaces)
  readonly storage: StoragePort;
  readonly haptics: HapticsPort;
  readonly mediaQuery: MediaQueryPort;
  readonly serviceWorker: ServiceWorkerPort;
  readonly theme: ThemePort;

  // Repositories
  readonly watchedRepo: WatchedRepository;
  readonly themeRepo: ThemeRepository;
  readonly settingsRepo: SettingsRepository;

  // Event infrastructure
  readonly eventBus: EventBus;
  readonly commandDispatcher: CommandDispatcher;
  readonly eventLogger: EventLogger | null;
}

// ── Factory ────────────────────────────────────────────────────

/**
 * Build the full application container.
 * Call once at startup.
 */
export function createAppContainer(
  flagOverrides?: Partial<FeatureFlags>,
): AppContainer {
  // 1. Storage first — repositories depend on it
  const storage = createLocalStorageAdapter();

  // 2. Settings repository + flags
  const settingsRepo = createSettingsRepository(storage);
  const flags: FeatureFlags = {
    ...DEFAULT_FLAGS,
    ...settingsRepo.load().featureOverrides,
    ...flagOverrides,
  };

  // 3. Event bus
  const eventBus = createEventBus();

  // 4. Adapters — selected based on feature flags, with null-object fallbacks
  const haptics = isEnabled(flags, 'haptics')
    ? createBrowserHapticsAdapter()
    : noopHaptics;

  const serviceWorker = isEnabled(flags, 'serviceWorker')
    ? createBrowserServiceWorkerAdapter()
    : noopServiceWorker;

  const mediaQuery = createBrowserMediaQueryAdapter();
  const theme = createBrowserThemeAdapter();

  // 5. Repositories
  const watchedRepo = createWatchedRepository(storage);
  const themeRepo = createThemeRepository(storage);

  // 6. Command dispatcher
  const commandDispatcher = createCommandDispatcher(
    isEnabled(flags, 'eventLog') ? eventBus : undefined,
  );

  // 7. Event logger (optional)
  const eventLogger = isEnabled(flags, 'eventLog')
    ? createEventLogger(eventBus)
    : null;

  return {
    flags,
    storage,
    haptics,
    mediaQuery,
    serviceWorker,
    theme,
    watchedRepo,
    themeRepo,
    settingsRepo,
    eventBus,
    commandDispatcher,
    eventLogger,
  };
}
