import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadTheme, saveTheme } from '../services/storageService';
import type { ThemeMode, ThemePalette, ResolvedMode, ThemePreference } from '../types';

const DEFAULT_THEME: ThemePreference = { mode: 'system', palette: 'default' };

/** Resolve the effective mode from a user preference. */
function resolveMode(mode: ThemeMode): ResolvedMode {
  if (mode === 'dark' || mode === 'light') return mode;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** Apply the theme to the document root element as data attributes. */
function applyTheme(mode: ThemeMode, palette: ThemePalette): void {
  const resolved = resolveMode(mode);
  document.documentElement.setAttribute('data-theme-mode', resolved);
  document.documentElement.setAttribute('data-theme-palette', palette);
}

interface UseThemeResult {
  mode: ThemeMode;
  palette: ThemePalette;
  resolvedMode: ResolvedMode;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePalette) => void;
}

/**
 * Hook to manage theme mode and color palette.
 */
export function useTheme(): UseThemeResult {
  const [theme, setTheme] = useState<ThemePreference>(() => {
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

  const setMode = useCallback((mode: ThemeMode) => {
    setTheme((prev) => {
      const next: ThemePreference = { ...prev, mode };
      saveTheme(next);
      return next;
    });
  }, []);

  const setPalette = useCallback((palette: ThemePalette) => {
    setTheme((prev) => {
      const next: ThemePreference = { ...prev, palette };
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
