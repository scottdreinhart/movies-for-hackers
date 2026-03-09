/**
 * Theme preferences repository.
 *
 * Encapsulates persistence of theme mode + palette behind
 * the StoragePort.
 *
 * @pattern Repository Pattern
 */

import type { StoragePort } from '../../domain/ports';
import type { ThemePreference } from '../../types';

const THEME_KEY = 'movies-for-hackers-theme';

export interface ThemeRepository {
  load(): ThemePreference | null;
  save(theme: ThemePreference): void;
}

export function createThemeRepository(storage: StoragePort): ThemeRepository {
  return {
    load(): ThemePreference | null {
      return storage.get<ThemePreference>(THEME_KEY);
    },

    save(theme: ThemePreference): void {
      storage.set(THEME_KEY, theme);
    },
  };
}
