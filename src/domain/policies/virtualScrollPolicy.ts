/**
 * Virtual scroll / table policy.
 *
 * Centralizes virtualizer configuration that was previously
 * hardcoded as magic numbers in MovieTable.
 *
 * @pattern Policy Objects
 */

/** Estimated height (px) of a single table row. */
export const ROW_HEIGHT_PX = 42;

/** Extra rows rendered above/below the visible viewport for smooth scrolling. */
export const OVERSCAN_ROWS = 10;
