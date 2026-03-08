/**
 * Get rating tier based on numeric value.
 * @param {number} rating - Rating value (0-10)
 * @returns {'high'|'mid'|'low'}
 */
export function getRatingTier(rating) {
  if (rating >= 7.5) return 'high';
  if (rating >= 5.5) return 'mid';
  return 'low';
}

const TIER_COLORS = {
  high: 'var(--rating-high)',
  mid: 'var(--rating-mid)',
  low: 'var(--rating-low)',
};

/**
 * Get CSS custom property for a rating tier.
 * @param {'high'|'mid'|'low'} tier - Pre-computed tier from getRatingTier
 * @returns {string} CSS variable reference
 */
export function getRatingColor(tier) {
  return TIER_COLORS[tier];
}
