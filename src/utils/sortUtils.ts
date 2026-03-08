import type { MovieEntry, SortDirection } from '../types';

/** Strip leading articles for natural sort order. */
export function stripArticle(str: string): string {
  return str.toLowerCase().replace(/^(the |a |an )/, '');
}

/** Compare two entries by a given column and direction. */
export function compareEntries(
  a: MovieEntry,
  b: MovieEntry,
  col: keyof MovieEntry,
  dir: SortDirection,
): number {
  let va: string | number = a[col];
  let vb: string | number = b[col];

  if (typeof va === 'string') {
    va = col === 'title' ? stripArticle(va) : va.toLowerCase();
    vb = col === 'title' ? stripArticle(vb as string) : (vb as string).toLowerCase();
  }

  let cmp = 0;
  if (va < vb) cmp = -1;
  else if (va > vb) cmp = 1;

  return dir === 'asc' ? cmp : -cmp;
}
