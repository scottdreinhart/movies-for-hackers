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

## 2. Shell and Build-Environment Governance

The default development shell for this repository is **WSL: Ubuntu**.

Mandatory rule:
- Unless the task is specifically an Electron or Capacitor platform-build workflow, use **WSL: Ubuntu**
- Do not default to PowerShell
- Do not suggest PowerShell for ordinary development tasks
- Do not switch shells without a platform-specific reason

### Default shell: WSL: Ubuntu

Use **WSL: Ubuntu** for all general repository work, including:
- `pnpm install`
- `pnpm run dev`
- `pnpm run start`
- `pnpm run build`
- `pnpm run preview`
- `pnpm run build:preview`
- `pnpm run lint`
- `pnpm run lint:fix`
- `pnpm run format`
- `pnpm run format:check`
- `pnpm run typecheck`
- `pnpm run check`
- `pnpm run fix`
- `pnpm run validate`
- `pnpm run clean`
- `pnpm run clean:node`
- `pnpm run clean:all`
- `pnpm run reinstall`
- `pnpm run wasm:build`
- `pnpm run wasm:build:debug`
- general source editing
- dependency installation
- local Vite development
- general web builds
- quality checks
- maintenance tasks
- documentation tasks

If the task is not explicitly a native Electron packaging task or a Capacitor native-platform task, use **WSL: Ubuntu**.

### Exception: Electron native packaging

Use a platform-native environment only when the task is explicitly building a native Electron package for that platform.

Routing:
- `pnpm run electron:build:win` → **PowerShell**
- `pnpm run electron:build:linux` → **WSL: Ubuntu**
- `pnpm run electron:build:mac` → **native or remote macOS**

Notes:
- `pnpm run electron:dev` remains **WSL: Ubuntu**
- `pnpm run electron:preview` remains **WSL: Ubuntu**
- only native packaging should switch away from the default shell where required

### Exception: Capacitor native-platform tasks

Use a platform-native environment only when the task is explicitly a Capacitor native-platform workflow.

Routing:
- `pnpm run cap:init:android` → Android-capable environment
- `pnpm run cap:open:android` → Android-capable environment
- `pnpm run cap:run:android` → Android-capable environment
- `pnpm run cap:init:ios` → native or remote macOS
- `pnpm run cap:open:ios` → native or remote macOS
- `pnpm run cap:run:ios` → native or remote macOS
- `pnpm run cap:sync` → **WSL: Ubuntu** unless a native platform environment is explicitly required

### PowerShell restriction

PowerShell is **not** the default shell.

Use PowerShell only when:
- the task is explicitly `pnpm run electron:build:win`
- the task is explicitly Windows-native packaging or release work for Electron
- repository governance explicitly says a Windows-native tool must be used

Do not use PowerShell for:
- installs
- linting
- formatting
- typechecking
- general Vite development
- ordinary web builds
- docs
- cleanup
- WASM builds
- Electron dev mode

### Decision rule

Before suggesting commands, determine whether the task is:

1. General development or maintenance
   → use **WSL: Ubuntu**

2. Electron native packaging
   → use the target platform environment only for that packaging task

3. Capacitor native-platform work
   → use the target platform environment only for that native task

If there is no explicit Electron or Capacitor native-build requirement, use **WSL: Ubuntu**.

### Hard-stop rules

Never:
- default to PowerShell for routine development
- present PowerShell as interchangeable with WSL for ordinary tasks
- switch to PowerShell unless the task is a Windows-native Electron packaging flow
- claim iOS tasks can run fully from Windows or WSL
- use the wrong shell when the repository already defines the correct route

### Required self-check

Before responding, verify:
- Is this an ordinary dev task? → use **WSL: Ubuntu**
- Is this specifically Electron Windows packaging? → use **PowerShell**
- Is this specifically Electron mac packaging or iOS work? → use **native or remote macOS**
- Is this Android native work? → use the Android-capable environment
- Otherwise → use **WSL: Ubuntu**

### Repository shell defaults

For this repository, assume **WSL: Ubuntu** unless the user is explicitly doing one of these:

- `pnpm run electron:build:win`
- `pnpm run electron:build:mac`
- `pnpm run cap:init:android`
- `pnpm run cap:open:android`
- `pnpm run cap:run:android`
- `pnpm run cap:init:ios`
- `pnpm run cap:open:ios`
- `pnpm run cap:run:ios`

All other scripts should default to **WSL: Ubuntu**.

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
9. Default to PowerShell for routine development — use WSL: Ubuntu unless the task is explicitly Windows-native Electron packaging.
10. Suggest `sudo` on Windows or Windows-specific commands on Linux/macOS.
11. Commit without running `pnpm validate`.
12. Add dependencies without checking for browser-native alternatives first.
13. Refactor working code that the user did not ask to change.

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
