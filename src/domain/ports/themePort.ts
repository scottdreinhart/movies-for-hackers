/**
 * Port: DOM / theme application abstraction.
 *
 * Decouples theme state changes from direct DOM manipulation.
 *
 * @pattern Hexagonal / Ports & Adapters
 */

import type { ResolvedMode, ThemePalette } from '../../types';

export interface ThemePort {
  /** Apply the resolved theme mode and palette to the current environment. */
  apply(mode: ResolvedMode, palette: ThemePalette): void;
}
