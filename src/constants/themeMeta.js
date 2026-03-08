/**
 * Theme palette definitions.
 * Each palette defines the full set of CSS custom properties used in variables.css.
 * Palettes are organized by mode (dark/light) and accessibility needs (colorblind).
 */

export const THEME_MODES = ['system', 'dark', 'light'];

export const THEME_PALETTES = [
  { id: 'default', label: 'Default', group: 'standard' },
  { id: 'protanopia', label: 'Protanopia', group: 'colorblind' },
  { id: 'deuteranopia', label: 'Deuteranopia', group: 'colorblind' },
  { id: 'tritanopia', label: 'Tritanopia', group: 'colorblind' },
];

/**
 * Mode labels for display.
 */
export const MODE_LABELS = {
  system: 'System',
  dark: 'Dark',
  light: 'Light',
};
