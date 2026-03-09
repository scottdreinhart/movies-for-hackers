/**
 * Branded types and type-level invariants.
 *
 * Branded types encode domain rules at the type level so incorrect
 * values cannot accidentally flow through the system.
 *
 * @pattern Design by Contract
 * @pattern Exhaustive State Modeling with Discriminated Unions
 */

// ── Branding infrastructure ────────────────────────────────────

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

// ── Branded primitives ─────────────────────────────────────────

/** A movie rating clamped to [0, 10]. */
export type Rating = Brand<number, 'Rating'>;

/** A valid 4-digit year. */
export type Year = Brand<number, 'Year'>;

/** A non-empty trimmed string used as a movie title. */
export type MovieTitle = Brand<string, 'MovieTitle'>;

/** A valid URL string. */
export type MovieUrl = Brand<string, 'MovieUrl'>;

// ── Smart constructors with validation ─────────────────────────

export function toRating(value: number): Rating {
  if (value < 0 || value > 10) {
    throw new RangeError(`Rating must be between 0 and 10, got ${value}`);
  }
  return value as Rating;
}

export function toYear(value: number): Year {
  if (!Number.isInteger(value) || value < 1888 || value > 2100) {
    throw new RangeError(`Year must be between 1888 and 2100, got ${value}`);
  }
  return value as Year;
}

export function toMovieTitle(value: string): MovieTitle {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new TypeError('Movie title cannot be empty');
  }
  return trimmed as MovieTitle;
}

export function toMovieUrl(value: string): MovieUrl {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new TypeError('Movie URL cannot be empty');
  }
  return trimmed as MovieUrl;
}

// ── Type-safe unwrap helpers ───────────────────────────────────

export function unwrapRating(r: Rating): number { return r as number; }
export function unwrapYear(y: Year): number { return y as number; }
export function unwrapTitle(t: MovieTitle): string { return t as string; }
export function unwrapUrl(u: MovieUrl): string { return u as string; }
