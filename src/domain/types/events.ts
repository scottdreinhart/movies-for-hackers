/**
 * Domain event types.
 *
 * Events describe things that HAVE happened (past tense).
 * They are emitted after state changes and consumed by
 * side-effect subscribers:  persistence, sounds, analytics,
 * notifications, UI effects, logging, etc.
 *
 * @pattern Event-Driven Architecture (local)
 */

import type { FilterState, ThemeMode, ThemePalette, SortDirection } from '../../types';

// ── Event base ─────────────────────────────────────────────────

interface DomainEventBase {
  readonly timestamp: number;
}

// ── Data lifecycle events ──────────────────────────────────────

export interface DataLoadedEvent extends DomainEventBase {
  readonly type: 'DataLoaded';
  readonly count: number;
}

export interface DataLoadFailedEvent extends DomainEventBase {
  readonly type: 'DataLoadFailed';
  readonly error: string;
}

// ── Filter events ──────────────────────────────────────────────

export interface FilterChangedEvent extends DomainEventBase {
  readonly type: 'FilterChanged';
  readonly key: keyof FilterState;
  readonly value: string;
  readonly resultCount: number;
}

export interface FiltersResetEvent extends DomainEventBase {
  readonly type: 'FiltersReset';
  readonly resultCount: number;
}

// ── Sort events ────────────────────────────────────────────────

export interface SortChangedEvent extends DomainEventBase {
  readonly type: 'SortChanged';
  readonly column: string;
  readonly direction: SortDirection;
}

// ── Watched events ─────────────────────────────────────────────

export interface WatchedToggledEvent extends DomainEventBase {
  readonly type: 'WatchedToggled';
  readonly url: string;
  readonly isWatched: boolean;
}

// ── Theme events ───────────────────────────────────────────────

export interface ThemeModeChangedEvent extends DomainEventBase {
  readonly type: 'ThemeModeChanged';
  readonly mode: ThemeMode;
}

export interface ThemePaletteChangedEvent extends DomainEventBase {
  readonly type: 'ThemePaletteChanged';
  readonly palette: ThemePalette;
}

// ── Section events ─────────────────────────────────────────────

export interface SectionSelectedEvent extends DomainEventBase {
  readonly type: 'SectionSelected';
  readonly section: string;
}

// ── Movie action events ────────────────────────────────────────

export interface MovieOpenedEvent extends DomainEventBase {
  readonly type: 'MovieOpened';
  readonly url: string;
  readonly title: string;
}

// ── Union of all events ────────────────────────────────────────

export type DomainEvent =
  | DataLoadedEvent
  | DataLoadFailedEvent
  | FilterChangedEvent
  | FiltersResetEvent
  | SortChangedEvent
  | WatchedToggledEvent
  | ThemeModeChangedEvent
  | ThemePaletteChangedEvent
  | SectionSelectedEvent
  | MovieOpenedEvent;

// ── Event type names ───────────────────────────────────────────

export type DomainEventType = DomainEvent['type'];

// ── Event constructors ─────────────────────────────────────────

function ts(): number {
  return Date.now();
}

export const DomainEvents = {
  dataLoaded: (count: number): DataLoadedEvent => ({ type: 'DataLoaded', count, timestamp: ts() }),

  dataLoadFailed: (error: string): DataLoadFailedEvent => ({
    type: 'DataLoadFailed',
    error,
    timestamp: ts(),
  }),

  filterChanged: (
    key: keyof FilterState,
    value: string,
    resultCount: number,
  ): FilterChangedEvent => ({ type: 'FilterChanged', key, value, resultCount, timestamp: ts() }),

  filtersReset: (resultCount: number): FiltersResetEvent => ({
    type: 'FiltersReset',
    resultCount,
    timestamp: ts(),
  }),

  sortChanged: (column: string, direction: SortDirection): SortChangedEvent => ({
    type: 'SortChanged',
    column,
    direction,
    timestamp: ts(),
  }),

  watchedToggled: (url: string, isWatched: boolean): WatchedToggledEvent => ({
    type: 'WatchedToggled',
    url,
    isWatched,
    timestamp: ts(),
  }),

  themeModeChanged: (mode: ThemeMode): ThemeModeChangedEvent => ({
    type: 'ThemeModeChanged',
    mode,
    timestamp: ts(),
  }),

  themePaletteChanged: (palette: ThemePalette): ThemePaletteChangedEvent => ({
    type: 'ThemePaletteChanged',
    palette,
    timestamp: ts(),
  }),

  sectionSelected: (section: string): SectionSelectedEvent => ({
    type: 'SectionSelected',
    section,
    timestamp: ts(),
  }),

  movieOpened: (url: string, title: string): MovieOpenedEvent => ({
    type: 'MovieOpened',
    url,
    title,
    timestamp: ts(),
  }),
} as const;
