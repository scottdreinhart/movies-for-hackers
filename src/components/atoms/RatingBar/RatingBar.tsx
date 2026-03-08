import { memo } from 'react';
import styles from './RatingBar.module.css';
import { getRatingTier, getRatingColor } from '../../../utils/ratingUtils';

interface RatingBarProps {
  rating: number;
}

const RatingBar = memo(function RatingBar({ rating }: RatingBarProps) {
  const tier = getRatingTier(rating);
  const percentage = (rating / 10) * 100;
  const color = getRatingColor(tier);

  return (
    <div
      className={styles.wrapper}
      role="meter"
      aria-valuenow={rating}
      aria-valuemin={0}
      aria-valuemax={10}
      aria-label={`Rating: ${rating.toFixed(1)} out of 10`}
    >
      <span className={`${styles.value} ${styles[tier]}`}>{rating.toFixed(1)}</span>
      <div className={styles.track} aria-hidden="true">
        <div className={styles.fill} style={{ width: `${percentage}%`, background: color }} />
      </div>
    </div>
  );
});

export default RatingBar;
