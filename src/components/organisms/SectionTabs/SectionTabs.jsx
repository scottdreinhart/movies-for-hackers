import { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SectionTab } from '../../atoms';
import { SECTION_META, SECTION_ORDER } from '../../../constants/sectionMeta';
import styles from './SectionTabs.module.css';

/**
 * Memoized tab for a single section — avoids re-creating onClick closures.
 */
const MemoTab = memo(function MemoTab({ section, label, count, active, onSelect }) {
  const handleClick = useCallback(() => onSelect(section), [section, onSelect]);
  return <SectionTab label={label} count={count} active={active} onClick={handleClick} />;
});

const SectionTabs = memo(function SectionTabs({ activeSection, sectionCounts, totalCount, onSelect }) {
  return (
    <div className={styles.tabs}>
      <MemoTab
        section=""
        label="All"
        count={totalCount}
        active={activeSection === ''}
        onSelect={onSelect}
      />
      {SECTION_ORDER.map((section) =>
        sectionCounts[section] ? (
          <MemoTab
            key={section}
            section={section}
            label={SECTION_META[section].short}
            count={sectionCounts[section]}
            active={activeSection === section}
            onSelect={onSelect}
          />
        ) : null,
      )}
    </div>
  );
});

MemoTab.propTypes = {
  section: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

SectionTabs.propTypes = {
  activeSection: PropTypes.string.isRequired,
  sectionCounts: PropTypes.objectOf(PropTypes.number).isRequired,
  totalCount: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SectionTabs;
