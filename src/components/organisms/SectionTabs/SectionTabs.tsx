import { memo, useCallback } from 'react';
import { SectionTab } from '../../atoms';
import { SECTION_META, SECTION_ORDER } from '../../../constants/sectionMeta';
import type { SectionCounts } from '../../../types';
import styles from './SectionTabs.module.css';

interface MemoTabProps {
  section: string;
  label: string;
  count: number;
  active: boolean;
  onSelect: (section: string) => void;
}

/**
 * Memoized tab for a single section — avoids re-creating onClick closures.
 */
const MemoTab = memo(function MemoTab({ section, label, count, active, onSelect }: MemoTabProps) {
  const handleClick = useCallback(() => onSelect(section), [section, onSelect]);
  return <SectionTab label={label} count={count} active={active} onClick={handleClick} />;
});

interface SectionTabsProps {
  activeSection: string;
  sectionCounts: SectionCounts;
  totalCount: number;
  onSelect: (section: string) => void;
}

const SectionTabs = memo(function SectionTabs({ activeSection, sectionCounts, totalCount, onSelect }: SectionTabsProps) {
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

export default SectionTabs;
