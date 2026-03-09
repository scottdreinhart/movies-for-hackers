import { memo } from 'react';
import styles from './RatingBar.module.css';
import {
  classifyRating,
  getTierColor,
  formatRating,
  ratingPercentage,
} from '../../../domain/policies/ratingPolicy';

interface RatingBarProps {
  rating: number;
}

/**
 * Displays a numeric rating with a colored progress bar.
 *
 * Tier classification, formatting, and color mapping are delegated to
 * {@link ratingPolicy} domain policy functions.
 *
 * @pattern Policy Object — business rules in ratingPolicy
 * @pattern Presenter / ViewModel — view logic is pure, component is a thin shell
 * @pattern Tell Don't Ask — component never inspects tier internals
 */
const RatingBar = memo(function RatingBar({ rating }: RatingBarProps) {
  const tier = classifyRating(rating);
  const percentage = ratingPercentage(rating);
  const color = getTierColor(tier);
  const label = formatRating(rating);

  return (
    <div
      className={styles.wrapper}
      role="meter"
      aria-valuenow={rating}
      aria-valuemin={0}
      aria-valuemax={10}
      aria-label={`Rating: ${label} out of 10`}
    >
      <span className={`${styles.value} ${styles[tier]}`}>{label}</span>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
});

export default RatingBar;
