/**
 * Rating policy — tier thresholds, colors, display formatting.
 *
 * Centralizes rating-related business rules.
 *
 * @pattern Policy Objects
 */

import type { RatingTier } from '../../types';

/** Rating tier thresholds (configurable). */
export const RATING_THRESHOLDS = {
  high: 7.5,
  mid: 5.5,
} as const;

/** Map a numeric rating to its tier. */
export function classifyRating(rating: number): RatingTier {
  if (rating >= RATING_THRESHOLDS.high) return 'high';
  if (rating >= RATING_THRESHOLDS.mid) return 'mid';
  return 'low';
}

/** CSS custom property names for tier colors. */
export const TIER_CSS_VARS: Record<RatingTier, string> = {
  high: 'var(--rating-high)',
  mid: 'var(--rating-mid)',
  low: 'var(--rating-low)',
} as const;

/** Get the CSS color for a rating tier. */
export function getTierColor(tier: RatingTier): string {
  return TIER_CSS_VARS[tier];
}

/** Format a numeric rating for display (1 decimal place). */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/** Calculate fill percentage for a rating bar. */
export function ratingPercentage(rating: number): number {
  return (rating / 10) * 100;
}
