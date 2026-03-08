import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadTheme, saveTheme } from '../services/storageService';

const DEFAULT_THEME = { mode: 'system', palette: 'default' };

/**
 * Resolve the effective mode ('dark' or 'light') from a user preference.
 * When mode is 'system', use the OS-level prefers-color-scheme media query.
 */
function resolveMode(mode) {
  if (mode === 'dark' || mode === 'light') return mode;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Apply the theme to the document root element as data attributes.
 * CSS uses [data-theme-mode] and [data-theme-palette] selectors.
 */
function applyTheme(mode, palette) {
  const resolved = resolveMode(mode);
  document.documentElement.setAttribute('data-theme-mode', resolved);
  document.documentElement.setAttribute('data-theme-palette', palette);
}

/**
 * Hook to manage theme mode (dark/light/system) and color palette.
 * Persisted to localStorage via storageService. Syncs with OS preference
 * when in 'system' mode.
 *
 * @returns {{ mode, palette, resolvedMode, setMode, setPalette }}
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = loadTheme();
    return saved || DEFAULT_THEME;
  });

  const resolvedMode = resolveMode(theme.mode);

  // Apply theme to DOM on every change
  useEffect(() => {
    applyTheme(theme.mode, theme.palette);
  }, [theme.mode, theme.palette]);

  // Listen for OS color-scheme changes when in 'system' mode
  useEffect(() => {
    if (theme.mode !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => applyTheme('system', theme.palette);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme.mode, theme.palette]);

  const setMode = useCallback((mode) => {
    setTheme((prev) => {
      const next = { ...prev, mode };
      saveTheme(next);
      return next;
    });
  }, []);

  const setPalette = useCallback((palette) => {
    setTheme((prev) => {
      const next = { ...prev, palette };
      saveTheme(next);
      return next;
    });
  }, []);

  return useMemo(
    () => ({
      mode: theme.mode,
      palette: theme.palette,
      resolvedMode,
      setMode,
      setPalette,
    }),
    [theme.mode, theme.palette, resolvedMode, setMode, setPalette],
  );
}
