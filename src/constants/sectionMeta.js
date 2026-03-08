export const SECTION_META = {
  'Thrillers / Drama': { variant: 'thriller', short: 'Thrillers' },
  'Sci-Fi / Fantasy': { variant: 'scifi', short: 'Sci-Fi' },
  Action: { variant: 'action', short: 'Action' },
  Documentaries: { variant: 'documentary', short: 'Docs' },
  'TV Shows': { variant: 'tv', short: 'TV Shows' },
  'Pending Verification': { variant: 'pending', short: 'Pending' },
};

export const SECTION_ORDER = [
  'Thrillers / Drama',
  'Sci-Fi / Fantasy',
  'Action',
  'Documentaries',
  'TV Shows',
  'Pending Verification',
];

export const TABLE_COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'section', label: 'Section' },
  { key: 'genre', label: 'Genre' },
  { key: 'format', label: 'Format' },
  { key: 'year', label: 'Year' },
  { key: 'rated', label: 'Rated' },
  { key: 'rating', label: 'Rating' },
  { key: 'description', label: 'Description' },
];

export const FORMAT_OPTIONS = ['Animation', 'Claymation', 'Live Action'];

export const RATED_OPTIONS = [
  'G',
  'PG',
  'PG-13',
  'R',
  'NC-17',
  'TV-Y7',
  'TV-PG',
  'TV-14',
  'TV-MA',
  'NR',
];
