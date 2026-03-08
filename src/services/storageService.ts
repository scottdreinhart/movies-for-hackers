/**
 * Storage service for persisting user state via localStorage.
 */

import type { ThemePreference } from '../types';

const WATCHED_KEY = 'movies-for-hackers-watched';
const THEME_KEY = 'movies-for-hackers-theme';

/** Load the watched URLs set from localStorage. */
export function loadWatchedSet(): Set<string> {
  try {
    const raw = localStorage.getItem(WATCHED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

/** Persist the watched URLs set to localStorage. */
export function saveWatchedSet(watched: Set<string>): void {
  try {
    localStorage.setItem(WATCHED_KEY, JSON.stringify([...watched]));
  } catch {
    /* storage full or disabled — silently ignore */
  }
}

/** Load the saved theme preference. */
export function loadTheme(): ThemePreference | null {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw ? (JSON.parse(raw) as ThemePreference) : null;
  } catch {
    return null;
  }
}

/** Persist theme preference to localStorage. */
export function saveTheme(theme: ThemePreference): void {
  try {
    localStorage.setItem(THEME_KEY, JSON.stringify(theme));
  } catch {
    /* storage full or disabled — silently ignore */
  }
}
