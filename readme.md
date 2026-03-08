<div align="center">

# 🎬 Movies for Hackers

**A curated list of movies every hacker & cyberpunk fan must watch.**

[![Built with React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Electron](https://img.shields.io/badge/Electron-40-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![CI](https://img.shields.io/github/actions/workflow/status/scottdreinhart/movies-for-hackers/ci.yml?label=CI&logo=github)](https://github.com/scottdreinhart/movies-for-hackers/actions)
[![License: All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE.md)

> ⚠️ **PROPRIETARY SOFTWARE — All Rights Reserved**
>
> © 2026 Scott Reinhart. This software is proprietary and confidential.
> Unauthorized reproduction, distribution, or use is strictly prohibited. See [LICENSE](LICENSE.md) file for complete terms and conditions.

[Project Structure](#project-structure) · [Getting Started](#getting-started) · [Scripts](#scripts) · [Device Compatibility](#device-compatibility) · [Movie List](#movie-list-sections) · [Tech Stack](#tech-stack) · [Roadmap](#roadmap) · [Contributors](#contributors) · [Contributing](contributing.md)

</div>

---

## Overview

A cross-platform interactive viewer for a curated collection of **401 movies, TV shows, and documentaries** that every hacker, cyberpunk enthusiast, and tech-lover should watch. Runs as a web app, desktop app (Electron), or mobile/tablet app (Capacitor). The list spans thrillers, sci-fi, action, documentaries, and TV series — from classics like _WarGames_ and _Blade Runner_ to modern entries like _Mr. Robot_ and _The Matrix Resurrections_.

### Features

- **Cross-platform** — Web, Desktop (Electron), Mobile & Tablet (Capacitor)
- **Watched tracking** — checkbox per entry, persisted in localStorage
- **Sortable columns** — click any header to sort ascending/descending; keyboard accessible (Enter/Space)
- **Full-text search** — debounced 200ms search across all fields; press `/` to focus
- **Section filter tabs** — Thrillers, Sci-Fi, Action, Docs, TV, Pending
- **Genre dropdown** — filter by specific genre
- **Format dropdown** — Animation, Claymation, or Live Action
- **MPAA / TV Rating filter** — G, PG, PG-13, R, NC-17, TV-Y7, TV-PG, TV-14, TV-MA, NR
- **Year & IMDb Score range filters** — narrow results via dropdown ranges
- **Color-coded ratings** — green (≥7.5), yellow (≥5.5), red (below)
- **Row virtualization** — only visible rows render via `@tanstack/react-virtual` (~94% DOM reduction)
- **PWA installable** — web app manifest + service worker for offline capability and install prompts
- **D-pad / remote navigation** — arrow-key and remote-control traversal for TV and 10-foot UI
- **Haptic feedback** — `navigator.vibrate()` on checkbox toggles, tab switches, and button presses
- **Touch-optimized** — `touch-action: manipulation` prevents double-tap-to-zoom on all interactive elements
- **Skip navigation** — keyboard-accessible skip-to-content link
- **Responsive design** — adapts from desktop to mobile
- **Theme system** — dark/light/system mode toggle with colorblind-safe palettes (protanopia, deuteranopia, tritanopia)
- **Strict TypeScript** — full type annotations on all components, hooks, services, and utilities
- **Accessible by default** — `prefers-reduced-motion`, `forced-colors`, `aria-live` announcements, print stylesheet

---

## Device Compatibility

The app runs anywhere with a modern browser. Native distribution uses Electron (desktop) and Capacitor (mobile/TV).

| Category     | Platform               | Runtime                   | Distribution                 | Input                     | Status |
| ------------ | ---------------------- | ------------------------- | ---------------------------- | ------------------------- | ------ |
| **Web**      | Any modern browser     | Vite dev / static hosting | URL                          | Mouse, keyboard, touch    | ✅     |
| **Desktop**  | Windows                | Electron 40               | NSIS installer, Portable EXE | Mouse, keyboard           | ✅     |
|              | macOS                  | Electron 40               | DMG                          | Mouse, keyboard, trackpad | ✅     |
|              | Linux                  | Electron 40               | AppImage, .deb               | Mouse, keyboard           | ✅     |
| **Mobile**   | Android                | Capacitor 8               | Google Play / APK            | Touch                     | ✅     |
|              | iOS                    | Capacitor 8               | App Store / IPA              | Touch                     | ✅     |
| **Tablet**   | Android tablets        | Capacitor 8               | Google Play / APK            | Touch                     | ✅     |
|              | iPad                   | Capacitor 8               | App Store / IPA              | Touch                     | ✅     |
|              | Amazon Fire tablets    | Capacitor 8               | Amazon Appstore / APK        | Touch                     | ✅     |
| **Smart TV** | Android TV / Google TV | Capacitor 8               | Google Play / APK            | D-pad remote              | ✅     |
|              | Amazon Fire TV         | Capacitor 8               | Amazon Appstore / APK        | D-pad remote              | ✅     |

### Browser Compatibility

| Browser | Min Version | Notes                                      |
| ------- | ----------- | ------------------------------------------ |
| Chrome  | 80+         | Full support                               |
| Firefox | 80+         | Full support                               |
| Safari  | 14+         | Full support                               |
| Edge    | 80+         | Chromium-based; feature parity with Chrome |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22+ (see `.nvmrc`; recommend [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/) v10+

### Install & Run

```bash
git clone https://github.com/scottdreinhart/movies-for-hackers.git
cd movies-for-hackers
pnpm install
pnpm dev
```

Open http://localhost:5175 in your browser.

---

## Scripts

All scripts are run via `pnpm <script>`.

### Development

| Script    | Description                      |
| --------- | -------------------------------- |
| `dev`     | Start Vite dev server with HMR   |
| `build`   | Production build to `dist/`      |
| `preview` | Preview production build locally |

### Code Quality

| Script         | Description                                  |
| -------------- | -------------------------------------------- |
| `typecheck`    | Run TypeScript type checker (`tsc --noEmit`) |
| `lint`         | Run ESLint on `src/`                         |
| `lint:fix`     | Run ESLint with auto-fix                     |
| `format`       | Format source files with Prettier            |
| `format:check` | Check formatting without writing             |
| `check`        | Run lint + format check                      |
| `fix`          | Run lint:fix + format                        |
| `validate`     | Run check + build (full CI pipeline locally) |

### Cleanup

| Script          | Description                                         |
| --------------- | --------------------------------------------------- |
| `clean`         | Remove `dist/`, `release/`, platform dirs, `.vite/` |
| `clean:modules` | Remove `node_modules/`                              |
| `reinstall`     | Clean modules + fresh install                       |

### Electron (Desktop)

| Script                 | Description                               |
| ---------------------- | ----------------------------------------- |
| `electron:dev`         | Start Vite + open Electron window         |
| `electron:build`       | Build for current platform                |
| `electron:build:win`   | Build Windows installer (NSIS + portable) |
| `electron:build:linux` | Build Linux packages (AppImage + .deb)    |
| `electron:build:mac`   | Build macOS installer (DMG)               |
| `electron:build:all`   | Build for all platforms                   |

Output goes to `release/`.

### Capacitor (Mobile & Tablet)

| Script             | Description                               |
| ------------------ | ----------------------------------------- |
| `cap:sync`         | Build web + sync into native projects     |
| `cap:init:android` | Add Android platform                      |
| `cap:init:ios`     | Add iOS platform                          |
| `cap:open:android` | Open project in Android Studio            |
| `cap:open:ios`     | Open project in Xcode                     |
| `cap:run:android`  | Build & deploy to Android device/emulator |
| `cap:run:ios`      | Build & deploy to iOS device/simulator    |
| `cap:dev:android`  | Sync + run Android                        |
| `cap:dev:ios`      | Sync + run iOS                            |

### Release

| Script            | Description                         |
| ----------------- | ----------------------------------- |
| `release:web`     | Validate + build web                |
| `release:desktop` | Validate + build Electron installer |
| `release:mobile`  | Validate + sync Capacitor           |

> **Electron platform note:** `pnpm install` installs platform-native Electron binaries. If switching between PowerShell (Windows) and WSL (Linux), run `pnpm reinstall` to get the correct binaries.

---

## Project Structure

```
movies-for-hackers/
├── index.html                  # Entry point with meta tags + manifest link
├── movie_list.md               # Curated movie data (401 entries)
├── package.json                # Project config + Electron builder config
├── vite.config.js              # Vite + SWC, virtual movie-data plugin, vendor chunks
├── tsconfig.json               # TypeScript strict config
├── capacitor.config.json       # Capacitor native app config
├── eslint.config.js            # ESLint flat config
├── .prettierrc                 # Prettier config
├── .nvmrc                      # Node version (22)
├── .editorconfig               # Editor formatting rules
│
├── public/
│   ├── manifest.json           # PWA web app manifest
│   ├── sw.js                   # Service worker (cache-first assets, network-first nav)
│   └── icons/
│       └── icon.svg            # PWA app icon
│
├── electron/
│   └── main.cjs                # Electron main process (security-hardened)
│
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Root component with ErrorBoundary
│   │
│   ├── types/                  # TypeScript type definitions
│   │   ├── index.ts            # Shared interfaces & type aliases
│   │   └── declarations.d.ts   # CSS Modules + virtual module declarations
│   │
│   ├── components/             # Atomic Design hierarchy
│   │   ├── atoms/              # UI primitives
│   │   │   ├── Badge/          # Section category badges
│   │   │   ├── Button/         # Reusable button
│   │   │   ├── EmptyState/     # No-results / error message
│   │   │   ├── RatingBar/      # Rating display with color bar
│   │   │   ├── SearchInput/    # Debounced text search (/ shortcut)
│   │   │   ├── SectionTab/     # Category pill button
│   │   │   ├── SelectDropdown/ # Generic select element
│   │   │   ├── SortArrow/      # Column sort indicator
│   │   │   └── Spinner/        # Loading spinner
│   │   │
│   │   ├── molecules/          # Composed atom combinations
│   │   │   ├── MovieRow/       # Single table row
│   │   │   ├── TableHeaderCell/# Sortable column header (keyboard accessible)
│   │   │   └── ThemePicker/    # Mode + palette segmented control
│   │   │
│   │   ├── organisms/          # Complex UI sections
│   │   │   ├── ErrorBoundary/  # React error boundary
│   │   │   ├── Header/         # App header with all filter controls
│   │   │   ├── MovieTable/     # Virtualized data table
│   │   │   └── SectionTabs/    # Tab bar for sections
│   │   │
│   │   ├── templates/          # Page layout structure
│   │   │   └── MainLayout/     # Skip nav + header + main content
│   │   │
│   │   └── pages/              # Full page compositions
│   │       └── HomePage/       # Main page (data → UI wiring)
│   │
│   ├── constants/              # Static configuration
│   │   ├── sectionMeta.ts      # Section names, colors, column defs, filter options
│   │   └── themeMeta.ts        # Theme modes, palettes, labels
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebouncedInput.ts# Debounced text input with external sync
│   │   ├── useDpadNavigation.ts# D-pad / arrow-key / remote navigation
│   │   ├── useFilterCallbacks.ts# Factory hook for per-key filter callbacks
│   │   ├── useFilters.ts       # Filter state, derived data, single-pass metadata
│   │   ├── useHapticCallback.ts# Wraps callbacks with haptic feedback
│   │   ├── useKeyboardShortcut.ts# Global keyboard shortcut registration
│   │   ├── useLiveAnnouncer.ts # Debounced aria-live message for screen readers
│   │   ├── useMovieData.ts     # Build-time JSON (prod) / fetch+parse (dev)
│   │   ├── useSort.ts          # Sort state & logic
│   │   ├── useTheme.ts         # Dark/light/system mode + palette (localStorage)
│   │   └── useWatched.ts       # Watched checkbox state (localStorage)
│   │
│   ├── services/               # Data processing & platform services
│   │   ├── markdownParser.ts   # Markdown → structured data parser (shared by Vite plugin)
│   │   ├── registerSW.ts       # Service worker registration for PWA
│   │   └── storageService.ts   # localStorage abstraction for persistence
│   │
│   ├── styles/                 # Global styles
│   │   ├── variables.css       # CSS custom properties (dark/light palettes, colorblind, forced-colors, print, reduced-motion)
│   │   ├── global.css          # Reset, base styles, focus-visible
│   │   └── inputs.module.css   # Shared input base class
│   │
│   └── utils/                  # Pure utility functions
│       ├── haptics.ts          # Cross-platform haptic feedback (vibrate API)
│       ├── ratingUtils.ts      # Rating tier/color helpers
│       ├── searchUtils.ts      # WeakMap haystack cache + search matching
│       └── sortUtils.ts        # Sort comparison with article stripping
│
└── .github/
    ├── workflows/
    │   └── ci.yml              # GitHub Actions: lint + build
    └── PULL_REQUEST_TEMPLATE.md
```

### Architecture

The project follows **Atomic Design** with clear **Separation of Concerns**:

| Layer         | Purpose                                   | Example                                                |
| ------------- | ----------------------------------------- | ------------------------------------------------------ |
| **Atoms**     | Single-responsibility UI primitives       | `Badge`, `Button`, `Spinner`, `SearchInput`            |
| **Molecules** | Composed atom combinations                | `MovieRow`, `TableHeaderCell`, `ThemePicker`           |
| **Organisms** | Complex, self-contained UI sections       | `Header`, `MovieTable`, `SectionTabs`, `ErrorBoundary` |
| **Templates** | Page layout with content slots            | `MainLayout`                                           |
| **Pages**     | Data wiring — connects hooks to organisms | `HomePage`                                             |

Data flows unidirectionally: **Hooks → Page → Organisms → Molecules → Atoms**

---

## Movie List Sections

| Section              | Count   | Description                                       |
| -------------------- | ------- | ------------------------------------------------- |
| Thrillers / Drama    | 73      | Tech thrillers, cyber dramas, conspiracy films    |
| Sci-Fi / Fantasy     | 167     | Cyberpunk, dystopian futures, AI, virtual reality |
| Action               | 13      | High-octane tech-driven action                    |
| Documentaries        | 60      | Hacking culture, privacy, tech history            |
| TV Shows             | 76      | Series covering hacking, AI, and cyber themes     |
| Pending Verification | 12      | Entries awaiting IMDb verification                |
| **Total**            | **401** |                                                   |

### Rating Distribution

| Rating | Count |
| ------ | ----- |
| R      | 147   |
| PG-13  | 74    |
| NR     | 57    |
| TV-MA  | 45    |
| TV-14  | 41    |
| PG     | 19    |
| TV-PG  | 9     |
| G      | 4     |
| TV-Y7  | 3     |
| NC-17  | 2     |

---

## Data Format

The movie list is stored in `movie_list.md` as markdown tables:

```markdown
| [Movie Title](https://www.imdb.com/title/ttXXXXXXX/) | Genre | Format | Year | Rated | X.X/10 | Description | Notes |
```

| Column | Values                                                                     |
| ------ | -------------------------------------------------------------------------- |
| Format | `Animation`, `Claymation`, `Live Action`                                   |
| Rated  | `G`, `PG`, `PG-13`, `R`, `NC-17`, `TV-Y7`, `TV-PG`, `TV-14`, `TV-MA`, `NR` |
| Notes  | Optional — italic text for additional context                              |

In development, the React app fetches and parses this markdown at runtime — edit `movie_list.md` and changes appear immediately. In production, data is pre-parsed to JSON at build time for zero-cost loading.

---

## Contributing

See [contributing.md](contributing.md) for full guidelines on adding movies and development workflow.

---

## Tech Stack

| Technology                                                | Purpose                                           |
| --------------------------------------------------------- | ------------------------------------------------- |
| [React 18](https://reactjs.org/)                          | UI library                                        |
| [TypeScript 5.9](https://www.typescriptlang.org/)         | Static type checking (strict mode)                |
| [Vite 6](https://vitejs.dev/)                             | Build tool & dev server (SWC)                     |
| [@tanstack/react-virtual](https://tanstack.com/virtual)   | Row virtualization                                |
| [Electron 40](https://www.electronjs.org/)                | Desktop app wrapper                               |
| [Capacitor 8](https://capacitorjs.com/)                   | Native mobile/tablet apps                         |
| [electron-builder](https://www.electron.build/)           | Desktop packaging & installers                    |
| [ESLint 10](https://eslint.org/)                          | Linting (flat config, typescript-eslint, react-hooks) |
| [Prettier 3](https://prettier.io/)                        | Code formatting                                   |
| [CSS Modules](https://github.com/css-modules/css-modules) | Scoped component styling                          |
| [GitHub Actions](https://github.com/features/actions)     | CI pipeline (lint + build)                        |
| [pnpm](https://pnpm.io/)                                  | Fast, disk-efficient package manager              |

### Build Output

| Chunk              | Size      | Gzipped  |
| ------------------ | --------- | -------- |
| vendor-react       | 142.79 KB | 45.72 KB |
| virtual:movie-data | 102.88 KB | 21.52 KB |
| index (app)        | 22.48 KB  | 8.45 KB  |
| vendor-virtual     | 16.26 KB  | 5.15 KB  |
| CSS                | 16.32 KB  | 4.06 KB  |

### Performance Optimizations

All planned optimizations (P0–P3) have been implemented:

- **Row virtualization** — `@tanstack/react-virtual` renders only visible rows (~94% DOM reduction)
- **Vendor chunk splitting** — React and virtual library cached independently from app code
- **SWC compiler** — `@vitejs/plugin-react-swc` for 30–70% faster HMR/builds
- **Build-time data** — `movie_list.md` pre-parsed to JSON via shared `markdownParser` service (zero runtime parse, zero duplication)
- **Memoized components** — `React.memo` on all frequently re-rendered components
- **Stable callbacks** — `useCallback` throughout to prevent unnecessary re-renders
- **Search debounce** — 200ms debounce on `SearchInput` with local state
- **Cached search haystack** — WeakMap per-entry cache in `searchUtils`, built once and reused across filter cycles
- **Single-pass metadata** — genres, years, ratings, and section counts computed in one iteration
- **CSS content-visibility** — `content-visibility: auto` on table rows for paint savings
- **Touch-safe hover** — row hover gated behind `@media (hover: hover)`
- **Touch-action CSS** — `touch-action: manipulation` on interactive elements; `pan-y` on scroll container
- **Async dev middleware** — non-blocking file reads in dev server
- **Build target** — `esnext` for optimal output
- **PWA caching** — service worker with cache-first for static assets, network-first for navigation
- **Zero-JS-at-runtime theming** — CSS attribute selectors on `<html>` swap variables; JS only sets two data attributes
- **Ref-based stable callbacks** — `useHapticCallback` uses a ref pattern to avoid re-render cascades
- **Debounced announcements** — `useLiveAnnouncer` batches screen reader updates at 500ms to prevent rapid-fire
- **Factory hook pattern** — `useFilterCallbacks` eliminates 8 identical `useCallback` wrappers in Header

---

## Accessibility

- `:focus-visible` outlines on all interactive elements
- Skip-to-content navigation link
- Keyboard-accessible column sorting (Enter/Space)
- `/` keyboard shortcut to focus search
- D-pad / arrow-key row navigation with visual focus indicator (Home/End/Enter)
- `role="grid"` on table container with descriptive `aria-label`
- Semantic HTML table structure with proper `colSpan` on spacers
- Scroll-to-top on filter/section changes
- `@media (hover: hover)` gating for touch-safe interactions
- Haptic feedback on interactive elements for mobile accessibility
- Responsive layout adapts from mobile to desktop
- `prefers-reduced-motion` — all animations/transitions disabled when user prefers reduced motion
- `aria-live` polite region — announces filter result count changes to screen readers
- Print stylesheet — clean paper layout with full table, hidden controls, link URLs shown
- `forced-colors` / high-contrast — system color keywords for Windows High Contrast mode
- Dark / Light / System mode toggle with localStorage persistence
- Colorblind-safe palettes — protanopia, deuteranopia, tritanopia

---

## Security (Electron)

The Electron wrapper enforces a hardened security configuration:

- `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`
- `webSecurity: true` enforced
- Navigation restricted via `will-navigate` guard
- External links opened in default browser via `setWindowOpenHandler`
- DevTools toggled via F12 (dev mode only)

---

## Roadmap

Planned improvements and enhancements:

### Testing & Quality

- [ ] **Test framework** — add Vitest with unit tests for parsing, filtering, and sorting logic
- [ ] **CI test step** — run tests in GitHub Actions pipeline (once test suite exists)
- [ ] **Bundle analysis** — integrate `rollup-plugin-visualizer` for build output insights

### Developer Experience

- [ ] **Dependency audit scripts** — `deps:check` and `deps:audit` scripts for supply chain security
- [ ] **`electron:preview` script** — preview production Electron build locally before packaging
- [ ] **Electron preload script** — add a preload bridge for safe IPC between renderer and main process

---

## Contributors

| Name | Role | GitHub |
| --- | --- | --- |
| **Scott Reinhart** | Creator & maintainer | [@scottdreinhart](https://github.com/scottdreinhart) |

---

## License

Copyright (c) 2026 Scott Reinhart. All Rights Reserved.

This project is proprietary software. No permission is granted to use, copy, modify, or distribute this software without the prior written consent of the owner. See the [LICENSE](LICENSE.md) file for complete terms and conditions.

---

<div align="center">

**[⬆ Back to top](#-movies-for-hackers)**

</div>
