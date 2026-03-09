# Architecture Guide — Movies for Hackers

> Patterns implemented in this codebase, how they map to the source tree,
> and extension points for future work.

---

## Layer Overview

```
src/
  domain/          ← Functional core (pure, framework-agnostic)
  app/             ← Imperative shell (adapters, repositories, wiring)
  components/      ← UI layer (React, Atomic Design)
  hooks/           ← React hooks (thin wrappers over domain + app)
  services/        ← Legacy service wrappers (being migrated to ports)
  utils/           ← Legacy utility functions (being migrated to policies)
```

---

## Patterns by Number

### 1. Hexagonal / Ports & Adapters

| Concept   | Location |
|-----------|----------|
| Ports (interfaces) | `domain/ports/` — `StoragePort`, `HapticsPort`, `MediaQueryPort`, `ServiceWorkerPort`, `ThemePort` |
| Browser adapters | `app/adapters/` — concrete implementations for real browser APIs |
| Null-object adapters | `app/nullObjects/` — safe no-ops for test/disabled contexts |

### 2. Functional Core / Imperative Shell

* **Core** — `domain/` contains zero side-effects: selectors, policies, strategies, contracts, FSM transition function, and branded-type constructors are all pure functions.
* **Shell** — `app/` performs all I/O: localStorage, DOM mutation, event bus subscriptions, service-worker registration.
* React hooks in `hooks/` bridge the two, calling pure domain functions and delegating side-effects to app-layer adapters.

### 3. Finite State Machine (FSM)

* Phases: `idle → loading → ready | error`
* Type: `domain/types/appPhase.ts` — discriminated union `AppPhase`
* Transition function: `domain/state/appStateMachine.ts` — `transition(phase, event)`
* Guards: `canLoad()`, `isInteractive()`

### 4. Command Pattern

* Command types: `domain/types/commands.ts` — union `AppCommand`
* Dispatcher: `app/commands/commandDispatcher.ts` — `createCommandDispatcher()`
* Per-type and global handlers; commands flow unidirectionally from UI into the shell.

### 5. CQRS-lite / Selectors

* Write side: commands dispatched via `commandDispatcher.dispatch(cmd)`
* Read side: pure selectors in `domain/selectors/movieSelectors.ts`
* View models are derived data (e.g. `selectMovieRowVM`, `selectAnnouncementMessage`), never stored.

### 6. Strategy Pattern

* **Search** — `domain/strategies/searchStrategy.ts`: `substringStrategy`, `exactPhraseStrategy`, `fuzzyStrategy`
* **Sort** — `domain/strategies/sortStrategy.ts`: `naturalSortStrategy`, `ratingFirstSortStrategy`
* Each strategy implements a common interface (`SearchStrategy` / `SortStrategy`), selected by key at runtime via a strategy registry.

### 7. Discriminated Unions (Exhaustive State Modeling)

* `AppPhase` — 4 variants, each with phase-specific payload
* `AppCommand` — 10 command variants
* `DomainEvent` — 10 event variants
* `matchPhase()` helper enforces exhaustive handling at the type level.

### 8. Design by Contract

* `domain/contracts/assertions.ts` — `assert()`, `assertValidMovieEntry()`, `assertValidFilterState()`, `assertValidSortColumn()`, `assertNever()`
* `ContractViolation` error class for clear debugging
* Branded types (`Rating`, `Year`, `MovieTitle`, `MovieUrl`) enforce structural contracts at construction time

### 9. Tell Don't Ask / Law of Demeter

* Components never inspect adapter internals — they call high-level methods (`trigger`, `apply`, `register`).
* Hooks expose only the data they own; callers never reach through to nested objects.
* Convenience hooks (`useEventBus`, `useHapticsPort`, etc.) in `components/providers/` follow Law of Demeter by exposing only the sub-system the consumer needs.

### 10. Repository Pattern

* `app/repositories/watchedRepository.ts` — `WatchedRepository` (key: `movies-for-hackers-watched`)
* `app/repositories/themeRepository.ts` — `ThemeRepository` (key: `movies-for-hackers-theme`)
* `app/repositories/settingsRepository.ts` — `SettingsRepository` (key: `movies-for-hackers-settings`)
* All repositories accept a `StoragePort`, decoupling persistence from the storage medium.

### 11. Adapter Pattern

* Each `app/adapters/*` file adapts a browser API to a domain port interface.
* Example: `browserThemeAdapter.ts` wraps `document.documentElement.setAttribute(…)` behind the `ThemePort.apply(mode, palette)` API.

### 12. Composition Root

* `app/compositionRoot.ts` — `createAppContainer(flagOverrides?)`
* Single place that wires all concrete adapters, repositories, event bus, command dispatcher, feature flags, and event logger.
* `components/providers/AppProvider.tsx` distributes the container via React context.

### 13. Presenter / ViewModel

* Pure selector functions in `domain/selectors/movieSelectors.ts` transform raw domain data into view-ready shapes:
  - `selectMovieRowVM` → `MovieRowViewModel`
  - `selectAnnouncementMessage` → screen-reader string
  - `selectResultCountLabel` → human-readable count
* Components are thin rendering shells; all formatting logic lives in selectors.

### 14. Feature Flags

* `domain/featureFlags/flags.ts` — `FeatureFlags` interface (10 flags)
* `DEFAULT_FLAGS` constant, `isEnabled(flags, name)` guard
* Flags control: fuzzy search, rating-first sort, event log, contract assertions, haptics, service worker, keyboard hints, watched tracking, d-pad navigation, live announcements.
* `settingsRepository` persists user overrides.
* `compositionRoot` consults flags to choose real adapter vs null-object adapter.

### 15. Null Object Pattern

* `app/nullObjects/` — `noopHaptics`, `noopStorage`, `noopServiceWorker`, `noopMediaQuery`, `noopTheme`
* Each implements the corresponding port interface with no-op methods.
* Used by `compositionRoot` when a feature flag is disabled, eliminating `if` checks throughout the codebase.

### 16. Policy Objects

* `domain/policies/filterPolicy.ts` — initial filter state, year/rating ranges, parsers
* `domain/policies/ratingPolicy.ts` — tier thresholds, classification, colors, formatting
* `domain/policies/debouncePolicy.ts` — `SEARCH_DEBOUNCE_MS`, `ANNOUNCE_DELAY_MS`, `HAPTIC_DURATION`
* `domain/policies/virtualScrollPolicy.ts` — `ROW_HEIGHT_PX`, `OVERSCAN_ROWS`
* Policies are pure objects/functions — no side-effects, easily testable and overridable.

### 17. Snapshot + Replay / Event Log

* `app/eventLog/eventLogger.ts` — `createEventLogger(eventBus, maxSize)`
* Ring buffer of the last *N* domain events
* Methods: `snapshot()`, `ofType(type)`, `last()`, `clear()`, `disconnect()`
* Only activated when feature flag `eventLog` is enabled.

### 18. Event-Driven Architecture

* `domain/events/eventBus.ts` — `createEventBus()` with pub/sub, wildcard listeners
* `domain/types/events.ts` — `DomainEvent` discriminated union + `DomainEvents` constructor namespace
* Events are emitted after state changes; subscribers handle side-effects (persistence, analytics, logging).

### 19. Selector Pattern

* All derived/computed state is produced by pure selector functions.
* `selectGenres()`, `selectYears()`, `selectRatings()` — filter metadata
* `selectSectionCounts()` — per-section counts for tab badges
* `selectShouldShowEmptyState()`, `selectCanInteract()` — boolean UI conditions
* Selectors compose — higher-level selectors call lower-level ones.

### 20. Branded / Opaque Types

* `domain/types/brandedTypes.ts` — `Rating`, `Year`, `MovieTitle`, `MovieUrl`
* Smart constructors (`createRating`, `createYear`, etc.) validate at the boundary.
* Unwrappers (`unwrapRating`, etc.) extract the raw value when needed.
* Prevents mixing raw `number` or `string` values across incompatible domains.

---

## Additional Compatible Patterns (Extension Points)

These patterns are not currently implemented but are architecturally compatible:

| Pattern | How to add it |
|---------|--------------|
| **Middleware / Pipeline** | Wrap `commandDispatcher.dispatch` with a middleware chain (logging, analytics, undo). |
| **Undo / Redo** | Combine the event log with a command-inverse map to replay or revert state changes. |
| **Saga / Process Manager** | Long-running multi-step workflows (e.g. "bulk import from external API") can be orchestrated as sagas listening on the event bus. |
| **Specification Pattern** | Replace filter predicate functions with composable `Specification<MovieEntry>` objects for complex query building. |
| **Interpreter Pattern** | Parse and evaluate a custom search DSL (e.g. `genre:sci-fi year:>2000 rating:>=8`). |
| **Observer (fine-grained)** | Per-field observable state atoms (like Jotai/Zustand) instead of re-rendering entire component trees. |
| **Circuit Breaker** | Wrap external API calls (e.g. movie metadata fetches) with a circuit breaker to handle transient failures. |

---

## Quick Reference: File → Pattern

| File | Patterns |
|------|----------|
| `domain/ports/*.ts` | Hexagonal |
| `domain/types/appPhase.ts` | FSM, Discriminated Unions |
| `domain/types/commands.ts` | Command Pattern |
| `domain/types/events.ts` | Event-Driven Architecture |
| `domain/types/brandedTypes.ts` | Design by Contract, Branded Types |
| `domain/contracts/assertions.ts` | Design by Contract |
| `domain/policies/*.ts` | Policy Objects |
| `domain/state/appStateMachine.ts` | FSM |
| `domain/events/eventBus.ts` | Event-Driven Architecture |
| `domain/selectors/movieSelectors.ts` | CQRS-lite, Selector, Presenter/ViewModel |
| `domain/strategies/*.ts` | Strategy Pattern |
| `domain/featureFlags/flags.ts` | Feature Flags |
| `app/adapters/*.ts` | Adapter, Hexagonal |
| `app/nullObjects/*.ts` | Null Object Pattern |
| `app/repositories/*.ts` | Repository Pattern |
| `app/commands/commandDispatcher.ts` | Command Pattern |
| `app/eventLog/eventLogger.ts` | Snapshot + Replay |
| `app/compositionRoot.ts` | Composition Root |
| `components/providers/AppProvider.tsx` | Composition Root, DI |
| `components/providers/useAppContainerHooks.ts` | Composition Root, Law of Demeter |
| `hooks/useTheme.ts` | Functional Core / Imperative Shell (legacy storageService) |
| `hooks/useHapticCallback.ts` | Strategy, Tell Don't Ask |
| `hooks/useDebouncedInput.ts` | Policy Object |
| `hooks/useLiveAnnouncer.ts` | Policy Object |
