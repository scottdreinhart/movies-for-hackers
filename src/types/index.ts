/** A single parsed movie/show entry from movie_list.md. */
export interface MovieEntry {
  title: string;
  url: string;
  genre: string;
  format: string;
  year: number;
  rated: string;
  rating: number;
  description: string;
  notes: string;
  section: string;
}

/** Rating tier based on numeric score. */
export type RatingTier = 'high' | 'mid' | 'low';

/** Sort direction. */
export type SortDirection = 'asc' | 'desc';

/** Theme mode preference. */
export type ThemeMode = 'system' | 'dark' | 'light';

/** Theme palette identifier. */
export type ThemePalette = 'default' | 'protanopia' | 'deuteranopia' | 'tritanopia';

/** Resolved (effective) theme mode — always dark or light. */
export type ResolvedMode = 'dark' | 'light';

/** Persisted theme preference. */
export interface ThemePreference {
  mode: ThemeMode;
  palette: ThemePalette;
}

/** Filter state for the movie list. */
export interface FilterState {
  search: string;
  genre: string;
  format: string;
  rated: string;
  section: string;
  yearMin: string;
  yearMax: string;
  ratingMin: string;
  ratingMax: string;
}

/** Section metadata entry. */
export interface SectionMetaEntry {
  variant: BadgeVariant;
  short: string;
}

/** Theme palette metadata. */
export interface ThemePaletteEntry {
  id: ThemePalette;
  label: string;
  group: string;
}

/** Table column definition. */
export interface TableColumn {
  key: string;
  label: string;
}

/** Badge variant identifiers. */
export type BadgeVariant =
  | 'thriller'
  | 'scifi'
  | 'action'
  | 'documentary'
  | 'tv'
  | 'pending'
  | 'notes';

/** Haptic intensity levels. */
export type HapticIntensity = 'light' | 'medium' | 'heavy';

/** Section counts keyed by section name. */
export type SectionCounts = Record<string, number>;
