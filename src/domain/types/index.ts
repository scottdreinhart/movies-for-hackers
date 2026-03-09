/**
 * Barrel export for domain types.
 *
 * Re-exports from the core `types/` directory as well as
 * domain-specific type modules.
 */

export type { AppPhase } from './appPhase';
export { AppPhases, isIdle, isLoading, isReady, isError, matchPhase } from './appPhase';

export type {
  AppCommand,
  SetFilterCommand,
  ResetFiltersCommand,
  ToggleSortCommand,
  ResetSortCommand,
  ToggleWatchedCommand,
  SetThemeModeCommand,
  SetThemePaletteCommand,
  SelectSectionCommand,
  OpenMovieCommand,
  LoadDataCommand,
  SortState,
} from './commands';
export { Commands, DEFAULT_SORT_STATE } from './commands';

export type {
  DomainEvent,
  DomainEventType,
  DataLoadedEvent,
  DataLoadFailedEvent,
  FilterChangedEvent,
  FiltersResetEvent,
  SortChangedEvent,
  WatchedToggledEvent,
  ThemeModeChangedEvent,
  ThemePaletteChangedEvent,
  SectionSelectedEvent,
  MovieOpenedEvent,
} from './events';
export { DomainEvents } from './events';

export type { Rating, Year, MovieTitle, MovieUrl } from './brandedTypes';
export { toRating, toYear, toMovieTitle, toMovieUrl, unwrapRating, unwrapYear, unwrapTitle, unwrapUrl } from './brandedTypes';
