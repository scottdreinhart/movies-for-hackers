---
applyTo: "src/**/*.{ts,tsx,css},index.html,eslint.config.js"
---

# Frontend — React / Vite / UI Rules

> Governs the React UI layer, TypeScript conventions, styling, and code quality tooling.
> Defers to [AGENTS.md](../../AGENTS.md) for top-level rules.

---

## Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI library |
| TypeScript | 5.9 | Static type checking (strict mode) |
| Vite | 6 | Build tool & dev server |
| SWC | via `@vitejs/plugin-react-swc` | Fast HMR & transpilation |
| @tanstack/react-virtual | 3 | Row virtualization |
| CSS Modules | — | Scoped component styling |
| ESLint | 10 | Linting (flat config) |
| Prettier | 3 | Code formatting |

---

## Architecture — Three Layers

```
src/domain/     → Functional Core (pure, zero side-effects)
src/app/        → Imperative Shell (I/O, adapters, wiring)
src/components/ → UI (React, Atomic Design)
src/hooks/      → Bridge (thin wrappers, domain ↔ UI)
```

### Dependency Direction (Strict)

- **domain/** — NO imports from `app/`, `hooks/`, or `components/`. Pure functions only.
- **app/** — imports from `domain/` only.
- **hooks/** — imports from `domain/` and `app/`.
- **components/** — imports from `hooks/`, `domain/`, and `app/`.

Violations are architecture defects. Never bypass.

---

## Atomic Design Hierarchy

| Level | Directory | Responsibility | Example |
|-------|-----------|---------------|---------|
| **Atoms** | `components/atoms/<Name>/` | Single-responsibility UI primitives | `Badge`, `Button`, `Spinner`, `SearchInput`, `RatingBar`, `SortArrow` |
| **Molecules** | `components/molecules/<Name>/` | Composed atom combinations | `MovieRow`, `TableHeaderCell`, `ThemePicker` |
| **Organisms** | `components/organisms/<Name>/` | Complex, self-contained sections | `Header`, `MovieTable`, `SectionTabs`, `ErrorBoundary` |
| **Templates** | `components/templates/<Name>/` | Page layout with content slots | `MainLayout` |
| **Pages** | `components/pages/<Name>/` | Data wiring — connects hooks to organisms | `HomePage` |

### Rules

1. Atoms have **zero** child components from higher levels.
2. Molecules compose **atoms only**.
3. Organisms compose atoms + molecules.
4. Templates define layout skeletons with slots — no data fetching.
5. Pages wire hooks to organisms — this is the only layer that orchestrates data.
6. Every component lives in its own PascalCase directory with matching `.tsx` + `.module.css` files.

---

## Component Conventions

### File Structure

```
components/atoms/Badge/
  Badge.tsx           # Component
  Badge.module.css    # Scoped styles
```

### Naming

| Item | Pattern | Example |
|------|---------|---------|
| Component file | `PascalCase.tsx` | `Badge.tsx` |
| CSS Module | `PascalCase.module.css` | `Badge.module.css` |
| Component export | Named export (PascalCase) | `export function Badge()` |
| Props type | `ComponentNameProps` | `BadgeProps` |

### Component Rules

- Use `React.memo()` on frequently re-rendered components.
- Use `useCallback` for all callback props to prevent unnecessary re-renders.
- Never put business logic inside components — delegate to hooks or domain selectors.
- Never fetch data inside atoms, molecules, or organisms — data flows down from pages via props.
- Use CSS Modules for all component styling. No inline styles except dynamic values.

---

## Hooks

All custom hooks live in `src/hooks/` and follow the `use` + camelCase + `.ts` convention.

| Hook | Purpose | Domain Integration |
|------|---------|-------------------|
| `useMovieData` | Load movie entries (build-time JSON or runtime fetch) | `markdownParser` service |
| `useFilters` | Filter state via `filterPolicy` + domain selectors | `filterPolicy`, `movieSelectors` |
| `useSort` | Sort state via domain sort strategies | `sortStrategy` |
| `useWatched` | Watched checkbox persistence (localStorage) | `watchedRepository` |
| `useTheme` | Theme mode + palette switching | `themeRepository`, `ThemePort` |
| `useDebouncedInput` | Debounced text input | `debouncePolicy` |
| `useLiveAnnouncer` | Debounced aria-live announcements | `debouncePolicy` |
| `useKeyboardShortcut` | Global keyboard shortcut registration | — |
| `useDpadNavigation` | D-pad / arrow / remote navigation | — |
| `useHapticCallback` | Wraps callbacks with haptic feedback (ref pattern) | `HapticsPort` |
| `useFilterCallbacks` | Factory for per-key filter callbacks | eliminates 8 duplicate `useCallback` wrappers |

### Hook Rules

- Hooks are **thin wrappers**. They bridge domain logic to React lifecycle.
- Business logic belongs in `domain/` (policies, selectors, strategies).
- Side-effects belong in `app/` (adapters, repositories).
- Hooks may import from both `domain/` and `app/`.

---

## Domain Layer

### Policies (`domain/policies/`)

Pure configuration objects and functions. No side-effects.

| Policy | Purpose |
|--------|---------|
| `filterPolicy` | Initial filter state, year/rating ranges, parsers |
| `ratingPolicy` | Rating tier thresholds, colors, classifications, formatting |
| `debouncePolicy` | `SEARCH_DEBOUNCE_MS` (200ms), `ANNOUNCE_DELAY_MS` (500ms), `HAPTIC_DURATION` |
| `virtualScrollPolicy` | `ROW_HEIGHT_PX` (42), `OVERSCAN_ROWS` (10) |

### Selectors (`domain/selectors/`)

Pure functions that derive view-ready data from raw domain data.

- `selectMovieRowVM` → `MovieRowViewModel`
- `selectAnnouncementMessage` → screen reader announcement string
- `selectResultCountLabel` → human-readable count
- `selectGenres`, `selectYears`, `selectRatings` → filter metadata
- `selectSectionCounts` → per-section counts for tab badges

### Strategies (`domain/strategies/`)

Interchangeable algorithms selected at runtime via a strategy registry.

- **Search:** `substringStrategy`, `exactPhraseStrategy`, `fuzzyStrategy`
- **Sort:** `naturalSortStrategy`, `ratingFirstSortStrategy`

### Ports (`domain/ports/`)

Pure interfaces with no implementations:

- `StoragePort` — `get`, `set`, `remove`, `keys`
- `HapticsPort` — `trigger(intensity)`
- `MediaQueryPort` — `prefersLightMode`, `onChange`
- `ServiceWorkerPort` — `register(path)`
- `ThemePort` — `apply(mode, palette)`

---

## App Layer

### Adapters (`app/adapters/`)

Browser-API implementations of domain ports:

- `localStorageAdapter` → `StoragePort`
- `browserHapticsAdapter` → `HapticsPort`
- `browserMediaQueryAdapter` → `MediaQueryPort`
- `browserServiceWorkerAdapter` → `ServiceWorkerPort`
- `browserThemeAdapter` → `ThemePort`

### Null Objects (`app/nullObjects/`)

Safe no-op implementations for disabled features:

- `noopStorage`, `noopHaptics`, `noopMediaQuery`, `noopServiceWorker`, `noopTheme`
- Selected by `compositionRoot` based on feature flags.

### Repositories (`app/repositories/`)

Persistence abstractions accepting a `StoragePort`:

- `watchedRepository` — tracked movies (key: `movies-for-hackers-watched`)
- `themeRepository` — user theme preference (key: `movies-for-hackers-theme`)
- `settingsRepository` — feature flag overrides (key: `movies-for-hackers-settings`)

### Composition Root (`app/compositionRoot.ts`)

Single assembly point: `createAppContainer(flagOverrides?)` wires all adapters, repositories, event bus, command dispatcher, event logger, and feature flags. Distributed to UI via `AppProvider` context.

---

## Styling

### CSS Modules

- One `.module.css` per component.
- Import as `import styles from './Component.module.css'`.
- Apply via `className={styles.className}`.

### Global Styles

| File | Purpose |
|------|---------|
| `styles/variables.css` | CSS custom properties — dark/light palettes, colorblind variants, forced-colors, print, reduced-motion |
| `styles/global.css` | Reset, base styles, `:focus-visible` outlines |
| `styles/inputs.module.css` | Shared input base class |

### Theming

- CSS attribute selectors on `<html>` — `data-theme-mode` and `data-theme-palette`.
- JS only sets two data attributes. All color switching is pure CSS.
- Palettes: default, protanopia, deuteranopia, tritanopia.
- Modes: system, dark, light.

---

## Code Quality

### ESLint 10

- Config: `eslint.config.js` (flat config)
- Plugins: `typescript-eslint`, `react-hooks`, `react-refresh`
- Scope: `src/`

### Prettier 3

- Formats: `src/**/*.{ts,tsx,css}`
- `format:check` for CI, `format` for auto-fix

### Validation Workflow

```
pnpm check     → lint + format:check
pnpm fix       → lint:fix + format (auto-fix)
pnpm validate  → check + build (full gate)
```

Always run `pnpm validate` before committing.

---

## Accessibility Requirements

All new UI code must maintain these standards:

- `:focus-visible` outlines on interactive elements
- Skip-to-content navigation link
- Keyboard-accessible column sorting (Enter/Space)
- `/` shortcut to focus search
- D-pad / arrow-key row navigation (Home/End/Enter)
- `role="grid"` with `aria-label` on table
- `aria-live` polite region for filter count announcements (500ms debounce)
- `prefers-reduced-motion` — disable all animations/transitions
- `forced-colors` / high-contrast support
- Touch-safe hover gated behind `@media (hover: hover)`
- Haptic feedback on mobile interactive elements

---

## Performance Rules

New code must not regress these optimizations:

- Row virtualization via `@tanstack/react-virtual` (42px rows, 10 overscan)
- Vendor chunk splitting (vendor-react, vendor-virtual)
- Memoized components with `React.memo`
- Stable callbacks with `useCallback`
- WeakMap search haystack cache (built once, reused)
- Single-pass metadata computation
- `content-visibility: auto` on table rows
- `touch-action: manipulation` on interactive elements
- Build-time data parsing via virtual module
