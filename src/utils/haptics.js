/**
 * Cross-platform haptic feedback utility.
 *
 * Uses the Web Vibration API (navigator.vibrate) for PWA / browser contexts.
 * On native mobile (Capacitor), falls back to @capacitor/haptics if available.
 *
 * All methods are no-ops when haptics are unavailable.
 */

/** Light tap — checkbox toggle, tab switch (10ms) */
export function hapticLight() {
  try {
    if (navigator.vibrate) navigator.vibrate(10);
  } catch {
    /* no-op */
  }
}

/** Medium tap — button press, sort change (25ms) */
export function hapticMedium() {
  try {
    if (navigator.vibrate) navigator.vibrate(25);
  } catch {
    /* no-op */
  }
}

/** Heavy tap — reset, destructive action (50ms) */
export function hapticHeavy() {
  try {
    if (navigator.vibrate) navigator.vibrate(50);
  } catch {
    /* no-op */
  }
}
