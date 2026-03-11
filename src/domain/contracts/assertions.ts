/**
 * Design by Contract — invariant assertions.
 *
 * These assertion helpers enforce domain invariants at runtime.
 * Used at domain boundaries to catch invalid states early,
 * before they propagate through the system.
 *
 * @pattern Design by Contract
 */

import type { MovieEntry, FilterState, RatingTier } from '../../types';
import { SECTION_ORDER } from '../../constants/sectionMeta';

// ── Core assertion helper ──────────────────────────────────────

export class ContractViolation extends Error {
  constructor(message: string) {
    super(`[Contract Violation] ${message}`);
    this.name = 'ContractViolation';
  }
}

export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new ContractViolation(message);
  }
}

// ── Movie entry invariants ─────────────────────────────────────

export function assertValidMovieEntry(entry: MovieEntry): void {
  assert(
    typeof entry.title === 'string' && entry.title.trim().length > 0,
    `Movie title must be a non-empty string, got: "${entry.title}"`,
  );
  assert(
    typeof entry.url === 'string' && entry.url.trim().length > 0,
    `Movie URL must be a non-empty string, got: "${entry.url}"`,
  );
  assert(
    typeof entry.rating === 'number' && entry.rating >= 0 && entry.rating <= 10,
    `Rating must be between 0 and 10, got: ${entry.rating}`,
  );
  assert(
    typeof entry.year === 'number' && Number.isInteger(entry.year) && entry.year >= 1888,
    `Year must be a valid integer >= 1888, got: ${entry.year}`,
  );
  assert(
    typeof entry.section === 'string' && entry.section.length > 0,
    `Section must be a non-empty string, got: "${entry.section}"`,
  );
}

export function assertValidMovieEntries(entries: MovieEntry[]): void {
  assert(Array.isArray(entries), 'Entries must be an array');
  for (const entry of entries) {
    assertValidMovieEntry(entry);
  }
}

// ── Filter state invariants ────────────────────────────────────

export function assertValidFilterState(filters: FilterState): void {
  assert(typeof filters.search === 'string', 'Filter search must be a string');
  assert(typeof filters.genre === 'string', 'Filter genre must be a string');
  assert(typeof filters.format === 'string', 'Filter format must be a string');
  assert(typeof filters.rated === 'string', 'Filter rated must be a string');
  assert(typeof filters.section === 'string', 'Filter section must be a string');

  if (filters.yearMin) {
    const yearMin = parseInt(filters.yearMin, 10);
    assert(!isNaN(yearMin), `yearMin must be a valid number, got: "${filters.yearMin}"`);
  }
  if (filters.yearMax) {
    const yearMax = parseInt(filters.yearMax, 10);
    assert(!isNaN(yearMax), `yearMax must be a valid number, got: "${filters.yearMax}"`);
  }
  if (filters.ratingMin) {
    const ratingMin = parseFloat(filters.ratingMin);
    assert(!isNaN(ratingMin), `ratingMin must be a valid number, got: "${filters.ratingMin}"`);
  }
  if (filters.ratingMax) {
    const ratingMax = parseFloat(filters.ratingMax);
    assert(!isNaN(ratingMax), `ratingMax must be a valid number, got: "${filters.ratingMax}"`);
  }
}

// ── Sort invariants ────────────────────────────────────────────

const VALID_SORT_COLUMNS = [
  'title',
  'section',
  'genre',
  'format',
  'year',
  'rated',
  'rating',
  'description',
] as const;

export function assertValidSortColumn(column: string): void {
  assert(
    (VALID_SORT_COLUMNS as readonly string[]).includes(column),
    `Sort column must be one of [${VALID_SORT_COLUMNS.join(', ')}], got: "${column}"`,
  );
}

// ── Rating invariants ──────────────────────────────────────────

const VALID_TIERS: readonly RatingTier[] = ['high', 'mid', 'low'];

export function assertValidRatingTier(tier: RatingTier): void {
  assert(
    (VALID_TIERS as readonly string[]).includes(tier),
    `Rating tier must be one of [${VALID_TIERS.join(', ')}], got: "${tier}"`,
  );
}

// ── Section invariants ─────────────────────────────────────────

export function assertValidSection(section: string): void {
  if (section === '') return; // empty means "all"
  assert(
    SECTION_ORDER.includes(section),
    `Section must be one of [${SECTION_ORDER.join(', ')}] or empty, got: "${section}"`,
  );
}

// ── Exhaustive check helper ────────────────────────────────────

/**
 * Use in switch default cases to ensure exhaustiveness at compile time.
 * If all cases are handled, `value` should be `never`.
 */
export function assertNever(value: never, message?: string): never {
  throw new ContractViolation(message ?? `Unexpected value: ${JSON.stringify(value)}`);
}
