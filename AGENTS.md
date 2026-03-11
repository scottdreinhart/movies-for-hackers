# AGENTS.md — Repository Governance Constitution

> **Audience:** AI coding agents (GitHub Copilot, ChatGPT, Claude, Cursor, Windsurf, Cline, and any future agent).
> **Authority:** This file is the top-level governance layer. Every instruction file, workspace rule, and agent prompt in this repository defers to the constraints defined here.

---

## 1. Golden Rules

1. **pnpm only** — Never invoke `npm`, `npx`, or `yarn`. The sole authorized package manager is **pnpm 10.30.3** (pinned in `packageManager` field of `package.json`). The one narrow exception: Capacitor CLI scripts use `npx cap` — this is the upstream convention and is already encoded in `package.json` scripts. Do not generalize this exception.
2. **package.json is the script authority** — Every runnable command exists as a named script in `package.json`. Never invent scripts, wrapper shell commands, or alternative invocations. If a script doesn't exist, propose adding it to `package.json` first.
3. **Architecture preservation** — The codebase implements 20 named design patterns across three layers (Domain → App → UI). See `ARCHITECTURE.md`. Do not flatten, merge, or bypass layers. New code must follow the existing pattern inventory.
4. **Minimal-change policy** — Change only what is necessary. Do not refactor adjacent code, rename files, or reorganize imports unless the user explicitly requests it.
5. **Validate before committing** — Run `pnpm validate` (lint + format-check + build) before any commit. Fix all errors before pushing.

---

## 2. Shell & Environment Routing

All platform-specific work MUST be routed to the correct shell and environment. There is no cross-compilation; each target OS builds on its native host.

| Target | Shell | Environment | Notes |
|--------|-------|-------------|-------|
| **Windows** (desktop, web dev) | **PowerShell** | Windows host | All `:win` scripts. `scripts/platform-swap.ps1` handles native binary cleanup via robocopy. |
| **Linux** (desktop, CI) | **Bash (WSL: Ubuntu)** | WSL 2 on Windows, or native Linux | All `:linux` scripts. `scripts/platform-swap.sh` handles ext4+tar binary swap. CI runs on `ubuntu-latest`. |
| **macOS / iOS** | **Bash / Zsh** | Native Apple hardware | `electron:build:mac`, `cap:*:ios` scripts. Requires Xcode for iOS. macOS builds require macOS host. |
| **Android** | **PowerShell or Bash** | Any host with Android Studio + SDK | `cap:*:android` scripts. Works from Windows or WSL. |
| **Cross-platform** (lint, typecheck, format) | **Any** | Any | `check`, `fix`, `validate`, `typecheck`, `lint`, `format`, `preview` — these have no platform dependency. |

### Critical Rules

- When the user says "use PowerShell," they mean the Windows PowerShell terminal — **not** PowerShell Core on Linux.
- When the user says "use WSL" or "use Linux," they mean WSL: Ubuntu with Bash.
- Never suggest running `:win` scripts under WSL or `:linux` scripts under PowerShell.
- Never suggest `sudo` on Windows or `Set-ExecutionPolicy` on Linux.

---

## 3. Package Manager Policy

### Authorized

```
pnpm install
pnpm add <package>
pnpm add -D <package>
pnpm remove <package>
pnpm <script-name>
pnpm run <script-name>
pnpm exec <binary>
pnpm dlx <package>          # one-off execution (replaces npx for non-Capacitor use)
```

### Forbidden

```
npm install / npm i / npm ci
npm run / npm exec / npm create
npx <anything>              # EXCEPT: npx cap (Capacitor CLI convention, already in package.json scripts)
yarn / yarn add / yarn dlx
bun / bun add / bunx
```

### Why

- `pnpm@10.30.3` is pinned via `packageManager` in `package.json`.
- `pnpm-lock.yaml` is the lockfile. There is no `package-lock.json` or `yarn.lock`.
- CI uses `pnpm/action-setup@v4` and `pnpm install --frozen-lockfile`.
- `pnpm.onlyBuiltDependencies` restricts native compilation to: `@swc/core`, `esbuild`, `electron`, `electron-winstaller`.

---

## 4. Architecture Constraints

### Layer Dependency Rule

```
domain/   →  (no imports from app/ or components/ or hooks/)
app/      →  (imports domain/ only)
hooks/    →  (imports domain/ and app/)
components/ → (imports hooks/, domain/, app/)
```

- **Domain** (`src/domain/`) — pure functions, zero side-effects, zero framework dependencies.
- **App** (`src/app/`) — imperative shell: adapters, repositories, commands, event log, composition root.
- **UI** (`src/components/`) — React components organized by Atomic Design (atoms → molecules → organisms → templates → pages).
- **Hooks** (`src/hooks/`) — thin wrappers bridging domain ↔ UI. Never put business logic here.

### Adding New Code

| You are adding… | Put it in… | Must follow… |
|-----------------|-----------|--------------|
| Pure function / type / contract | `src/domain/` | No imports from `app/`, `hooks/`, or `components/` |
| Browser integration / I/O | `src/app/adapters/` | Implement an existing port from `domain/ports/` |
| New port interface | `src/domain/ports/` | Pure interface, no implementation |
| Persistence logic | `src/app/repositories/` | Must accept a `StoragePort` parameter |
| UI primitive (one concern) | `src/components/atoms/<Name>/` | CSS Module scoped, no business logic |
| Composed UI element | `src/components/molecules/<Name>/` | Composes atoms only |
| Complex UI section | `src/components/organisms/<Name>/` | Composes atoms + molecules |
| Layout skeleton | `src/components/templates/<Name>/` | No data fetching, slots only |
| Full page wiring | `src/components/pages/<Name>/` | Wires hooks → organisms |
| React hook | `src/hooks/` | Thin wrapper, no inline business logic |
| Config constant | `src/domain/policies/` or `src/constants/` | Pure object, no side-effects |

### 20 Implemented Patterns

Agents must not propose alternatives to patterns that are already implemented. Refer to `ARCHITECTURE.md` for the complete list:

1. Hexagonal / Ports & Adapters
2. Functional Core / Imperative Shell
3. Finite State Machine
4. Command Pattern
5. CQRS-lite / Selectors
6. Strategy Pattern
7. Discriminated Unions
8. Design by Contract
9. Tell Don't Ask / Law of Demeter
10. Repository Pattern
11. Adapter Pattern
12. Composition Root
13. Presenter / ViewModel
14. Feature Flags
15. Null Object Pattern
16. Policy Objects
17. Snapshot + Replay / Event Log
18. Event-Driven Architecture
19. Selector Pattern
20. Branded / Opaque Types

---

## 5. Build & Release Facts

### Vite Build

- **Dev server:** `localhost:5175` (strict port)
- **HMR:** WebSocket host explicitly set to `localhost` (required for WSL environments)
- **Build target:** `esnext`
- **Compiler:** SWC via `@vitejs/plugin-react-swc`
- **Data pipeline:** `movie_list.md` → parsed at build time via virtual module `virtual:movie-data` → JSON
- **Vendor chunks:** `vendor-react` (react + react-dom), `vendor-virtual` (@tanstack/react-virtual)

### Electron (electron-builder 26)

| Platform | Targets | Script |
|----------|---------|--------|
| Windows | NSIS installer + portable | `electron:build:win` |
| Linux | AppImage + deb | `electron:build:linux` |
| macOS | DMG | `electron:build:mac` |
| All | All of the above | `electron:build:all` |

- **AppId:** `com.scottdreinhart.movies-for-hackers`
- **Product name:** Movies for Hackers
- **Output directory:** `release/`
- **Included files:** `dist/**/*`, `electron/**/*`
- **Security:** `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`, `webSecurity: true`

### Capacitor 8

- **AppId:** `com.scottdreinhart.moviesforhackers`
- **Web directory:** `dist`
- **Android scheme:** `https`
- **Plugins:** StatusBar (Dark, #0d1117), Keyboard (body resize)
- **Capacitor scripts use `npx cap`** — this is the only authorized `npx` usage.

### CI (GitHub Actions)

- Runs on `ubuntu-latest`
- Uses `pnpm/action-setup@v4` + `actions/setup-node@v4` (reads `.nvmrc`)
- Steps: `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build`

---

## 6. Code Quality Gates

Before committing any change, all of the following must pass:

| Gate | Command | What it checks |
|------|---------|----------------|
| Type-check | `pnpm typecheck` | `tsc --noEmit` — zero errors |
| Lint | `pnpm lint` | ESLint 10 (flat config, typescript-eslint, react-hooks, react-refresh) |
| Format | `pnpm format:check` | Prettier 3 — no formatting drift |
| Build | `pnpm build` | Full Vite production build succeeds |
| **All-in-one** | `pnpm validate` | Runs `check` + `build` |

The `prebuild` hook automatically runs `pnpm lint` before every build.

---

## 7. File Naming & Style Conventions

| Item | Convention | Example |
|------|-----------|---------|
| React component | PascalCase directory + `.tsx` file | `components/atoms/Badge/Badge.tsx` |
| CSS Module | Component name + `.module.css` | `Badge/Badge.module.css` |
| Hook | `use` + camelCase + `.ts` | `hooks/useFilters.ts` |
| Domain module | camelCase + `.ts` | `domain/policies/filterPolicy.ts` |
| Type file | camelCase + `.ts` | `domain/types/brandedTypes.ts` |
| Test file (future) | mirrors source + `.test.ts` | `domain/policies/filterPolicy.test.ts` |
| Script (PowerShell) | kebab-case + `.ps1` | `scripts/platform-swap.ps1` |
| Script (Bash) | kebab-case + `.sh` | `scripts/platform-swap.sh` |

---

## 8. Dependency Policy

- **Runtime dependencies** must be justified. Prefer browser-native APIs.
- **Dev dependencies** require a `devDependencies` entry, never `dependencies`.
- Electron is a devDependency — it ships its own runtime.
- Capacitor CLI (`@capacitor/cli`) is a devDependency. Capacitor runtime packages (`@capacitor/core`, `@capacitor/haptics`, etc.) are runtime dependencies.
- `pnpm.onlyBuiltDependencies` whitelists native compilation targets. Adding a native dependency requires updating this list.

---

## 9. Git & Commit Conventions

- **Branch:** `master` (default)
- **Remote:** `origin` → `github.com/scottdreinhart/movies-for-hackers`
- **Commit messages:** imperative mood, lowercase first word, no trailing period
  - Good: `add filter debounce policy`
  - Bad: `Added filter debounce policy.`
- **Commit scope:** one logical change per commit. Do not bundle unrelated changes.
- **Pre-push:** always run `pnpm validate` first.

---

## 10. What Agents Must Never Do

1. Install or recommend `npm`, `npx` (except Capacitor CLI), `yarn`, or `bun`.
2. Create `package-lock.json`, `yarn.lock`, or `bun.lockb`.
3. Bypass the three-layer architecture (domain → app → UI).
4. Put business logic in React components or hooks.
5. Import from `app/` or `components/` inside `domain/`.
6. Modify `electron/main.cjs` security settings (sandbox, contextIsolation, nodeIntegration, webSecurity).
7. Remove or weaken Content Security Policy, navigation guards, or window-open handlers.
8. Run `:win` scripts under WSL/Bash or `:linux` scripts under PowerShell.
9. Suggest `sudo` on Windows or Windows-specific commands on Linux/macOS.
10. Commit without running `pnpm validate`.
11. Add dependencies without checking for browser-native alternatives first.
12. Refactor working code that the user did not ask to change.

---

## 11. Cross-References

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full pattern inventory, layer guide, extension points |
| [contributing.md](contributing.md) | Contribution workflow, code placement guidelines |
| [readme.md](readme.md) | Project overview, scripts, diagrams, tech stack |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | Copilot-specific runtime policy |
| [.github/instructions/01-build.instructions.md](.github/instructions/01-build.instructions.md) | Build system & script routing |
| [.github/instructions/02-frontend.instructions.md](.github/instructions/02-frontend.instructions.md) | React / Vite / UI rules |
| [.github/instructions/03-electron.instructions.md](.github/instructions/03-electron.instructions.md) | Electron dev & packaging |
| [.github/instructions/04-capacitor.instructions.md](.github/instructions/04-capacitor.instructions.md) | Capacitor mobile/tablet rules |
| [docs/build-matrix.md](docs/build-matrix.md) | Full build target matrix table |
| [docs/development/workflows.md](docs/development/workflows.md) | Step-by-step development workflows |
