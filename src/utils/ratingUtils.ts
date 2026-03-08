import type { RatingTier } from '../types';

/** Get rating tier based on numeric value (0–10). */
export function getRatingTier(rating: number): RatingTier {
  if (rating >= 7.5) return 'high';
  if (rating >= 5.5) return 'mid';
  return 'low';
}

const TIER_COLORS: Record<RatingTier, string> = {
  high: 'var(--rating-high)',
  mid: 'var(--rating-mid)',
  low: 'var(--rating-low)',
};

/** Get CSS custom property for a rating tier. */
export function getRatingColor(tier: RatingTier): string {
  return TIER_COLORS[tier];
}
