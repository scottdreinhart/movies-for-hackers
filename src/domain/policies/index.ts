/**
 * Barrel export for all policy objects.
 *
 * @pattern Policy Objects
 */

export {
  INITIAL_FILTERS,
  YEAR_RANGE,
  RATING_RANGE,
  parseYearFilter,
  parseRatingFilter,
  hasActiveFilters,
} from './filterPolicy';

export {
  RATING_THRESHOLDS,
  classifyRating,
  TIER_CSS_VARS,
  getTierColor,
  formatRating,
  ratingPercentage,
} from './ratingPolicy';

export {
  SEARCH_DEBOUNCE_MS,
  ANNOUNCE_DELAY_MS,
  HAPTIC_DURATION,
} from './debouncePolicy';

export {
  ROW_HEIGHT_PX,
  OVERSCAN_ROWS,
} from './virtualScrollPolicy';
