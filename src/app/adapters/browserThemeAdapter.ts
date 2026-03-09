/**
 * Browser theme adapter.
 *
 * Implements the ThemePort by setting data attributes on document.documentElement.
 *
 * @pattern Adapter Pattern
 * @pattern Hexagonal / Ports & Adapters
 */

import type { ThemePort } from '../../domain/ports';
import type { ResolvedMode, ThemePalette } from '../../types';

export function createBrowserThemeAdapter(): ThemePort {
  return {
    apply(mode: ResolvedMode, palette: ThemePalette): void {
      document.documentElement.setAttribute('data-theme-mode', mode);
      document.documentElement.setAttribute('data-theme-palette', palette);
    },
  };
}
