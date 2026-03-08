import { memo } from 'react';
import { SearchInput, SelectDropdown, Button } from '../../atoms';
import ThemePicker from '../../molecules/ThemePicker/ThemePicker';
import { FORMAT_OPTIONS, RATED_OPTIONS } from '../../../constants/sectionMeta';
import { useFilterCallbacks } from '../../../hooks/useFilterCallbacks';
import type { FilterState, ThemeMode, ThemePalette } from '../../../types';
import styles from './Header.module.css';

interface HeaderProps {
  totalCount: number;
  filteredCount: number;
  filters: FilterState;
  genres: string[];
  years: number[];
  ratings: number[];
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  themeMode: ThemeMode;
  themePalette: ThemePalette;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemePaletteChange: (palette: ThemePalette) => void;
}

const Header = memo(function Header({
  totalCount,
  filteredCount,
  filters,
  genres,
  years,
  ratings,
  onFilterChange,
  onReset,
  themeMode,
  themePalette,
  onThemeModeChange,
  onThemePaletteChange,
}: HeaderProps) {
  const { onSearch, onGenre, onFormat, onRated, onYearMin, onYearMax, onRatingMin, onRatingMax } =
    useFilterCallbacks(onFilterChange);

  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <h1 className={styles.title}>
          <span className={styles.icon}>🎬</span>
          Movies for Hackers
        </h1>
        <ThemePicker
          mode={themeMode}
          palette={themePalette}
          onModeChange={onThemeModeChange}
          onPaletteChange={onThemePaletteChange}
        />
      </div>

      <div className={styles.controls}>
        <SearchInput
          value={filters.search}
          onChange={onSearch}
          placeholder="Search titles, genres, descriptions..."
        />

        <SelectDropdown
          value={filters.genre}
          onChange={onGenre}
          options={genres}
          placeholder="All Genres"
        />

        <SelectDropdown
          value={filters.format}
          onChange={onFormat}
          options={FORMAT_OPTIONS}
          placeholder="All Formats"
        />

        <SelectDropdown
          value={filters.rated}
          onChange={onRated}
          options={RATED_OPTIONS}
          placeholder="MPAA / TV Rating"
        />

        <div className={styles.rangeGroup}>
          <span className={styles.rangeLabel}>Year</span>
          <SelectDropdown
            value={filters.yearMin}
            onChange={onYearMin}
            options={years.map(String)}
            placeholder="Min"
          />
          <span className={styles.rangeSep}>–</span>
          <SelectDropdown
            value={filters.yearMax}
            onChange={onYearMax}
            options={years.map(String)}
            placeholder="Max"
          />
        </div>

        <div className={styles.rangeGroup}>
          <span className={styles.rangeLabel}>IMDb</span>
          <SelectDropdown
            value={filters.ratingMin}
            onChange={onRatingMin}
            options={ratings.map(String)}
            placeholder="Min"
          />
          <span className={styles.rangeSep}>–</span>
          <SelectDropdown
            value={filters.ratingMax}
            onChange={onRatingMax}
            options={ratings.map(String)}
            placeholder="Max"
          />
        </div>

        <Button onClick={onReset} title="Reset all filters">
          Reset
        </Button>

        <span className={styles.resultCount}>
          {filteredCount} of {totalCount}
        </span>
      </div>
    </header>
  );
});

export default Header;
