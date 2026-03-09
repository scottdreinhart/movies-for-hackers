/**
 * Debounce and timing policy.
 *
 * Centralizes all timing-related constants that were previously
 * scattered as default parameters or magic numbers.
 *
 * @pattern Policy Objects
 */

/** Debounce delay for the search input (ms). */
export const SEARCH_DEBOUNCE_MS = 200;

/** Delay before the live announcer speaks (ms). */
export const ANNOUNCE_DELAY_MS = 500;

/** Haptic vibration durations (ms). */
export const HAPTIC_DURATION = {
  light: 10,
  medium: 25,
  heavy: 50,
} as const;
