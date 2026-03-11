/**
 * Feature flags system.
 *
 * Allows safe rollout of experimental features, accessibility modes,
 * alternate UI variants, and optional behaviors — without branching
 * conditionals scattered through the codebase.
 *
 * @pattern Feature Flags
 */

// ── Flag definitions ───────────────────────────────────────────

export interface FeatureFlags {
  /** Enable fuzzy search as the default search strategy. */
  readonly fuzzySearch: boolean;

  /** Enable rating-first sort strategy. */
  readonly ratingFirstSort: boolean;

  /** Enable the event log for debugging / replay. */
  readonly eventLog: boolean;

  /** Enable domain contract assertions (performance cost in prod). */
  readonly contractAssertions: boolean;

  /** Enable haptic feedback on supported devices. */
  readonly haptics: boolean;

  /** Enable service worker for offline support. */
  readonly serviceWorker: boolean;

  /** Enable keyboard shortcut hints in UI. */
  readonly keyboardHints: boolean;

  /** Enable the watched-movies feature. */
  readonly watchedTracking: boolean;

  /** Enable D-pad / arrow-key table navigation. */
  readonly dpadNavigation: boolean;

  /** Enable accessibility live announcements. */
  readonly liveAnnouncements: boolean;
}

// ── Default values ─────────────────────────────────────────────

export const DEFAULT_FLAGS: Readonly<FeatureFlags> = Object.freeze({
  fuzzySearch: false,
  ratingFirstSort: false,
  eventLog: false,
  contractAssertions: import.meta.env.DEV,
  haptics: true,
  serviceWorker: true,
  keyboardHints: true,
  watchedTracking: true,
  dpadNavigation: true,
  liveAnnouncements: true,
});

// ── Flag evaluation ────────────────────────────────────────────

/** Check if a specific flag is enabled. */
export function isEnabled(flags: FeatureFlags, flag: keyof FeatureFlags): boolean {
  return flags[flag];
}

/** Create a flags object by merging overrides into defaults. */
export function createFlags(overrides: Partial<FeatureFlags> = {}): FeatureFlags {
  return { ...DEFAULT_FLAGS, ...overrides };
}

/** List all enabled flags. */
export function enabledFlags(flags: FeatureFlags): (keyof FeatureFlags)[] {
  return (Object.keys(flags) as (keyof FeatureFlags)[]).filter((k) => flags[k]);
}

/** List all disabled flags. */
export function disabledFlags(flags: FeatureFlags): (keyof FeatureFlags)[] {
  return (Object.keys(flags) as (keyof FeatureFlags)[]).filter((k) => !flags[k]);
}
