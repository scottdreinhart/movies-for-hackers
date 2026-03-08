import type { MovieEntry } from '../types';

/**
 * Parse a single table row into a movie entry object.
 */
function parseRow(line: string, section: string): MovieEntry | null {
  // Split on pipes, trim each cell — handles descriptions containing '|'
  const cells = line
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean);
  if (cells.length < 7) return null;

  // First cell: [Title](url)
  const titleMatch = cells[0].match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (!titleMatch) return null;

  const genre = cells[1] || '';
  const format = cells[2] || 'Live Action';
  const yearMatch = (cells[3] || '').match(/(\d{4})/);
  const rated = (cells[4] || 'NR').trim();
  const ratingMatch = (cells[5] || '').match(/([\d.]+)\/10/);
  if (!yearMatch || !ratingMatch) return null;

  // Description is cell[6]; Notes is cell[7] if present
  const description = cells[6] || '';
  const notes = cells.length > 7 ? cells[7].replace(/_/g, '').trim() : '';

  return {
    title: titleMatch[1].trim(),
    url: titleMatch[2].trim(),
    genre: genre.trim(),
    format: format.trim(),
    year: parseInt(yearMatch[1], 10),
    rated,
    rating: parseFloat(ratingMatch[1]),
    description: description.trim(),
    notes,
    section,
  };
}

/**
 * Parse raw content into an array of movie entry objects.
 */
export function parseMarkdown(md: string): MovieEntry[] {
  const lines = md.split('\n');
  const entries: MovieEntry[] = [];
  let currentSection = '';

  for (const line of lines) {
    // Detect ## section headers (e.g., "## Sci-Fi / Fantasy (167)")
    const h2Match = line.match(/^##\s+(.+?)\s*\(\d+\)/);
    if (h2Match) {
      currentSection = h2Match[1].trim();
      continue;
    }

    // Detect # section headers (e.g., "# TV Shows (76)")
    const h1Match = line.match(/^#\s+(.+?)\s*\(\d+\)/);
    if (h1Match) {
      currentSection = h1Match[1].trim();
      continue;
    }

    // Skip sub-section headers (### Films, ### TV Shows inside Pending)
    if (line.match(/^###\s/)) continue;

    // End parsing at non-data sections
    if (line.match(/^#\s+(Other Cool Lists|Contributing)/)) {
      currentSection = '';
      continue;
    }

    if (!currentSection) continue;

    // Skip table separator rows (e.g., "|---|---|---|")
    if (line.match(/^\|[-\s|]+\|$/)) continue;

    // Skip table header rows (MOVIE or TITLE)
    if (line.match(/^\|\s*(MOVIE|TITLE)\s*\|/i)) continue;

    // Data rows start with "| ["
    if (line.match(/^\|\s*\[/)) {
      const entry = parseRow(line, currentSection);
      if (entry) entries.push(entry);
    }
  }

  return entries;
}
