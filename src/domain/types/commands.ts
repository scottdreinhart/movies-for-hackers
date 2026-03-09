/**
 * Command types for the Command Pattern.
 *
 * Every user intent or system action that mutates state is
 * modeled as an explicit command object.  This enables:
 *   - centralized dispatch
 *   - logging / event log / replay
 *   - undo/redo foundations
 *   - separation of intent from execution
 *
 * @pattern Command Pattern
 */

import type { FilterState, ThemeMode, ThemePalette, SortDirection } from '../../types';

// ── Filter commands ────────────────────────────────────────────

export interface SetFilterCommand {
  readonly type: 'SET_FILTER';
  readonly key: keyof FilterState;
  readonly value: string;
}

export interface ResetFiltersCommand {
  readonly type: 'RESET_FILTERS';
}

// ── Sort commands ──────────────────────────────────────────────

export interface ToggleSortCommand {
  readonly type: 'TOGGLE_SORT';
  readonly column: string;
}

export interface ResetSortCommand {
  readonly type: 'RESET_SORT';
}

// ── Watched commands ───────────────────────────────────────────

export interface ToggleWatchedCommand {
  readonly type: 'TOGGLE_WATCHED';
  readonly url: string;
}

// ── Theme commands ─────────────────────────────────────────────

export interface SetThemeModeCommand {
  readonly type: 'SET_THEME_MODE';
  readonly mode: ThemeMode;
}

export interface SetThemePaletteCommand {
  readonly type: 'SET_THEME_PALETTE';
  readonly palette: ThemePalette;
}

// ── Navigation commands ────────────────────────────────────────

export interface SelectSectionCommand {
  readonly type: 'SELECT_SECTION';
  readonly section: string;
}

export interface OpenMovieCommand {
  readonly type: 'OPEN_MOVIE';
  readonly url: string;
}

// ── Data lifecycle commands ────────────────────────────────────

export interface LoadDataCommand {
  readonly type: 'LOAD_DATA';
}

// ── Union of all commands ──────────────────────────────────────

export type AppCommand =
  | SetFilterCommand
  | ResetFiltersCommand
  | ToggleSortCommand
  | ResetSortCommand
  | ToggleWatchedCommand
  | SetThemeModeCommand
  | SetThemePaletteCommand
  | SelectSectionCommand
  | OpenMovieCommand
  | LoadDataCommand;

// ── Command constructors (Tell, Don't Ask) ─────────────────────

export const Commands = {
  setFilter: (key: keyof FilterState, value: string): SetFilterCommand =>
    ({ type: 'SET_FILTER', key, value }),

  resetFilters: (): ResetFiltersCommand =>
    ({ type: 'RESET_FILTERS' }),

  toggleSort: (column: string): ToggleSortCommand =>
    ({ type: 'TOGGLE_SORT', column }),

  resetSort: (): ResetSortCommand =>
    ({ type: 'RESET_SORT' }),

  toggleWatched: (url: string): ToggleWatchedCommand =>
    ({ type: 'TOGGLE_WATCHED', url }),

  setThemeMode: (mode: ThemeMode): SetThemeModeCommand =>
    ({ type: 'SET_THEME_MODE', mode }),

  setThemePalette: (palette: ThemePalette): SetThemePaletteCommand =>
    ({ type: 'SET_THEME_PALETTE', palette }),

  selectSection: (section: string): SelectSectionCommand =>
    ({ type: 'SELECT_SECTION', section }),

  openMovie: (url: string): OpenMovieCommand =>
    ({ type: 'OPEN_MOVIE', url }),

  loadData: (): LoadDataCommand =>
    ({ type: 'LOAD_DATA' }),
} as const;

// ── Sort state snapshot (for reducer-style handling) ───────────

export interface SortState {
  readonly column: string;
  readonly direction: SortDirection;
}

export const DEFAULT_SORT_STATE: SortState = {
  column: 'title',
  direction: 'asc',
};
