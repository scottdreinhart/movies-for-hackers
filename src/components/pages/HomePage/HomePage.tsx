import { useCallback, useMemo } from 'react';
import { Spinner, EmptyState } from '../../atoms';
import { Header, SectionTabs, MovieTable } from '../../organisms';
import MainLayout from '../../templates/MainLayout/MainLayout';
import { useAppContainer } from '../../providers';
import { useMovieData } from '../../../hooks/useMovieData';
import { useFilters } from '../../../hooks/useFilters';
import { useSort } from '../../../hooks/useSort';
import { useWatched } from '../../../hooks/useWatched';
import { useTheme } from '../../../hooks/useTheme';
import { useLiveAnnouncer } from '../../../hooks/useLiveAnnouncer';
import { selectAnnouncementMessage } from '../../../domain/selectors';
import { DomainEvents } from '../../../domain/types/events';

/**
 * Page: wires data hooks to organisms via the MainLayout template.
 *
 * Consumes the composition root via `useAppContainer()` and distributes
 * services / ports to child hooks.  Emits domain events through the
 * event bus so side-effect subscribers stay decoupled.
 *
 * @pattern Composition Root (UI wiring point)
 * @pattern Tell, Don't Ask
 * @pattern CQRS-lite (selectors for derived view data)
 */
export default function HomePage() {
  const { eventBus } = useAppContainer();
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

  // Selector: derive the announcement message (CQRS-lite read model)
  const announcement = useMemo(
    () => selectAnnouncementMessage(loading, sortedEntries.length, entries.length),
    [loading, sortedEntries.length, entries.length],
  );

  const liveMessage = useLiveAnnouncer(announcement);

  // Command: reset all filters + sort (Tell, Don't Ask)
  const handleReset = useCallback(() => {
    resetFilters();
    resetSort();
    eventBus.emit(DomainEvents.filtersReset(entries.length));
  }, [resetFilters, resetSort, eventBus, entries.length]);

  // Command: select section (emits domain event)
  const handleSectionSelect = useCallback(
    (section: string) => {
      updateFilter('section', section);
      eventBus.emit(DomainEvents.sectionSelected(section));
    },
    [updateFilter, eventBus],
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
