import type { ThemeMode, ThemePaletteEntry } from '../types';

export const THEME_MODES: ThemeMode[] = ['system', 'dark', 'light'];

export const THEME_PALETTES: ThemePaletteEntry[] = [
  { id: 'default', label: 'Default', group: 'standard' },
  { id: 'protanopia', label: 'Protanopia', group: 'colorblind' },
  { id: 'deuteranopia', label: 'Deuteranopia', group: 'colorblind' },
  { id: 'tritanopia', label: 'Tritanopia', group: 'colorblind' },
];

/** Mode labels for display. */
export const MODE_LABELS: Record<ThemeMode, string> = {
  system: 'System',
  dark: 'Dark',
  light: 'Light',
};
