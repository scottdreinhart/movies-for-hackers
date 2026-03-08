/**
 * Strip leading articles for natural sort order.
 * @param {string} str
 * @returns {string} Lowercased string without leading article
 */
export function stripArticle(str) {
  return str.toLowerCase().replace(/^(the |a |an )/, '');
}

/**
 * Compare two entries by a given column and direction.
 * @param {object} a - First entry
 * @param {object} b - Second entry
 * @param {string} col - Column key to sort by
 * @param {'asc'|'desc'} dir - Sort direction
 * @returns {number} Comparison result
 */
export function compareEntries(a, b, col, dir) {
  let va = a[col];
  let vb = b[col];

  if (typeof va === 'string') {
    va = col === 'title' ? stripArticle(va) : va.toLowerCase();
    vb = col === 'title' ? stripArticle(vb) : vb.toLowerCase();
  }

  let cmp = 0;
  if (va < vb) cmp = -1;
  else if (va > vb) cmp = 1;

  return dir === 'asc' ? cmp : -cmp;
}
