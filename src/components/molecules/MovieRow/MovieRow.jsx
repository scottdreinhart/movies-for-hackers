import { memo } from 'react';
import PropTypes from 'prop-types';
import { Badge, RatingBar } from '../../atoms';
import { SECTION_META } from '../../../constants/sectionMeta';
import { useHapticCallback } from '../../../hooks/useHapticCallback';
import styles from './MovieRow.module.css';

/**
 * Single movie/show table row. Memoized for performance with 400+ entries.
 */
function MovieRow({ entry, isWatched, isFocused, onToggleWatched }) {
  const meta = SECTION_META[entry.section] || { variant: '', short: entry.section };
  const handleToggle = useHapticCallback(
    () => onToggleWatched(entry.url),
    'light',
  );

  const rowClass = [styles.row, isWatched && styles.watched, isFocused && styles.focused]
    .filter(Boolean)
    .join(' ');

  return (
    <tr className={rowClass}>
      <td className={styles.checkCell}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={isWatched}
          onChange={handleToggle}
          aria-label={`Mark ${entry.title} as watched`}
        />
      </td>
      <td className={styles.titleCell}>
        <a href={entry.url} target="_blank" rel="noopener noreferrer">
          {entry.title}
        </a>
      </td>
      <td className={styles.sectionCell}>
        <Badge variant={meta.variant}>{meta.short}</Badge>
      </td>
      <td className={styles.genreCell}>{entry.genre}</td>
      <td className={styles.formatCell}>{entry.format}</td>
      <td className={styles.yearCell}>{entry.year}</td>
      <td className={styles.ratedCell}>{entry.rated}</td>
      <td className={styles.ratingCell}>
        <RatingBar rating={entry.rating} />
      </td>
      <td className={styles.descCell}>
        {entry.description}
        {entry.notes && <Badge variant="notes">{entry.notes}</Badge>}
      </td>
    </tr>
  );
}

export default memo(MovieRow);

MovieRow.propTypes = {
  entry: PropTypes.shape({
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    section: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    year: PropTypes.number.isRequired,
    rated: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    notes: PropTypes.string,
  }).isRequired,
  isWatched: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  onToggleWatched: PropTypes.func.isRequired,
};
