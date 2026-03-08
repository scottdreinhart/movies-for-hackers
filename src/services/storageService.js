/**
 * Storage service for persisting user state via localStorage.
 * Centralizes all localStorage access for testability and reuse.
 */

const WATCHED_KEY = 'movies-for-hackers-watched';
const THEME_KEY = 'movies-for-hackers-theme';

/**
 * Load the watched URLs set from localStorage.
 * @returns {Set<string>} Set of IMDb URLs the user has marked as watched
 */
export function loadWatchedSet() {
  try {
    const raw = localStorage.getItem(WATCHED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/**
 * Persist the watched URLs set to localStorage.
 * @param {Set<string>} watched
 */
export function saveWatchedSet(watched) {
  try {
    localStorage.setItem(WATCHED_KEY, JSON.stringify([...watched]));
  } catch {
    /* storage full or disabled — silently ignore */
  }
}

/**
 * Load the saved theme preference.
 * @returns {{ mode: string, palette: string } | null}
 */
export function loadTheme() {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Persist theme preference to localStorage.
 * @param {{ mode: string, palette: string }} theme
 */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  } catch {
    /* storage full or disabled — silently ignore */
  }
}
