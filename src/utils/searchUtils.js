/**
 * Search utilities — haystack cache and matching logic.
 * Extracted from useFilters for separation of concerns and testability.
 */

/** Cache search haystack strings without mutating entry objects. */
const haystackCache = new WeakMap();

/**
 * Build a lowercase haystack string for an entry, using a WeakMap cache
 * to avoid recomputing on every filter change.
 *
 * @param {object} entry - Movie entry object
 * @returns {string} Concatenated lowercase searchable string
 */
function getHaystack(entry) {
  let h = haystackCache.get(entry);
  if (!h) {
    h =
      `${entry.title} ${entry.genre} ${entry.format} ${entry.rated} ${entry.description} ${entry.notes} ${entry.section}`.toLowerCase();
    haystackCache.set(entry, h);
  }
  return h;
}

/**
 * Check if an entry matches all search words.
 *
 * @param {object}      entry       - Movie entry object
 * @param {string[]|null} searchWords - Array of lowercase search terms, or null to match all
 * @returns {boolean} Whether the entry matches
 */
export function matchesSearch(entry, searchWords) {
  if (!searchWords) return true;
  const h = getHaystack(entry);
  return searchWords.every((w) => h.includes(w));
}
