import { useCallback, useMemo } from 'react';
import { Spinner, EmptyState } from '../../atoms';
import { Header, SectionTabs, MovieTable } from '../../organisms';
import MainLayout from '../../templates/MainLayout/MainLayout';
import { useMovieData } from '../../../hooks/useMovieData';
import { useFilters } from '../../../hooks/useFilters';
import { useSort } from '../../../hooks/useSort';
import { useWatched } from '../../../hooks/useWatched';
import { useTheme } from '../../../hooks/useTheme';
import { useLiveAnnouncer } from '../../../hooks/useLiveAnnouncer';

/**
 * Page: wires data hooks to organisms via the MainLayout template.
 * This is the composition root — all data flows from hooks through props.
 */
export default function HomePage() {
  const { entries, loading, error } = useMovieData();
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredEntries,
    genres,
    years,
    ratings,
    sectionCounts,
  } = useFilters(entries);
  const { sortCol, sortDir, toggleSort, resetSort, sortedEntries } = useSort(filteredEntries);
  const { watched, toggleWatched } = useWatched();
  const { mode, palette, setMode, setPalette } = useTheme();

  const announcement = useMemo(() => {
    if (loading) return 'Loading movie data';
    return `Showing ${sortedEntries.length} of ${entries.length} movies`;
  }, [loading, sortedEntries.length, entries.length]);

  const liveMessage = useLiveAnnouncer(announcement);

  const handleReset = useCallback(() => {
    resetFilters();
    resetSort();
  }, [resetFilters, resetSort]);

  const handleSectionSelect = useCallback(
    (section: string) => updateFilter('section', section),
    [updateFilter],
  );

  let content;
  if (loading) {
    content = <Spinner message="Loading movie data..." />;
  } else if (error && entries.length === 0) {
    content = (
      <EmptyState icon="⚠️" message="Unable to load movie data. Please try refreshing the page." />
    );
  } else {
    content = (
      <MovieTable
        entries={sortedEntries}
        sortCol={sortCol}
        sortDir={sortDir}
        onSort={toggleSort}
        watched={watched}
        onToggleWatched={toggleWatched}
      />
    );
  }

  return (
    <MainLayout
      liveMessage={liveMessage}
      header={
        <Header
          totalCount={entries.length}
          filteredCount={sortedEntries.length}
          filters={filters}
          genres={genres}
          years={years}
          ratings={ratings}
          onFilterChange={updateFilter}
          onReset={handleReset}
          themeMode={mode}
          themePalette={palette}
          onThemeModeChange={setMode}
          onThemePaletteChange={setPalette}
        />
      }
      tabs={
        entries.length > 0 ? (
          <SectionTabs
            activeSection={filters.section}
            sectionCounts={sectionCounts}
            totalCount={entries.length}
            onSelect={handleSectionSelect}
          />
        ) : null
      }
    >
      {content}
    </MainLayout>
  );
}
