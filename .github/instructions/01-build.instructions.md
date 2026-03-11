---
applyTo: "scripts/**,vite.config.js,package.json,tsconfig.json,.github/workflows/**"
---

# Build System & Script Routing

> Governs build scripts, shell routing, and the Vite/TypeScript/SWC toolchain.
> Defers to [AGENTS.md](../../AGENTS.md) for top-level rules.

---

## Package Manager — pnpm Only

- **Version:** pnpm 10.30.3 (pinned via `packageManager` in `package.json`)
- **Lockfile:** `pnpm-lock.yaml` — never create `package-lock.json` or `yarn.lock`
- **CI:** `pnpm install --frozen-lockfile` — lockfile must not be modified during CI
- **Native compile whitelist:** `pnpm.onlyBuiltDependencies` restricts native compilation to `@swc/core`, `esbuild`, `electron`, `electron-winstaller`

### Forbidden Commands

Never use `npm`, `npx` (except `npx cap`), `yarn`, `bun`, or `bunx`.

---

## Shell & Environment Routing

### Rules

1. `:win` scripts → **PowerShell** on Windows. Never WSL.
2. `:linux` scripts → **Bash** in WSL: Ubuntu. Never PowerShell.
3. `:mac` / `:ios` scripts → **Bash / Zsh** on native Apple hardware.
4. Unsuffixed scripts (`dev`, `build`, `lint`, etc.) → **any shell**.

### Platform-Swap Scripts

| Script | Shell | Purpose |
|--------|-------|---------|
| `pnpm setup:win` | PowerShell | Runs `scripts/platform-swap.ps1` — cleans Linux-native `.node` binaries via robocopy, then `pnpm install` for Windows |
| `pnpm setup:linux` | Bash/WSL | Runs `scripts/platform-swap.sh` — cleans Windows-native binaries via ext4+tar, then `pnpm install` for Linux |

These scripts resolve cross-platform native binary conflicts when switching between Windows and WSL on the same filesystem.

---

## Complete Script Inventory

All scripts are defined in `package.json`. Do not invent new ones without adding them there.

### Cross-Platform Setup

| Script | Command | Shell |
|--------|---------|-------|
| `setup:win` | `powershell -ExecutionPolicy Bypass -File scripts/platform-swap.ps1` | PowerShell |
| `setup:linux` | `bash scripts/platform-swap.sh` | Bash/WSL |

### Development

| Script | Command | Shell |
|--------|---------|-------|
| `dev` | `vite` | Any |
| `dev:win` | `pnpm setup:win && vite` | PowerShell |
| `dev:linux` | `pnpm setup:linux && vite` | Bash/WSL |
| `build` | `tsc --noEmit && vite build` | Any |
| `build:win` | `pnpm setup:win && pnpm build` | PowerShell |
| `build:linux` | `pnpm setup:linux && pnpm build` | Bash/WSL |
| `preview` | `vite preview` | Any |

### Code Quality

| Script | Command | Shell |
|--------|---------|-------|
| `typecheck` | `tsc --noEmit` | Any |
| `lint` | `eslint src/` | Any |
| `lint:fix` | `eslint src/ --fix` | Any |
| `format` | `prettier --write "src/**/*.{ts,tsx,css}"` | Any |
| `format:check` | `prettier --check "src/**/*.{ts,tsx,css}"` | Any |
| `check` | `pnpm lint && pnpm format:check` | Any |
| `fix` | `pnpm lint:fix && pnpm format` | Any |
| `validate` | `pnpm check && pnpm build` | Any |
| `prebuild` | `pnpm lint` | Any (auto-hook) |

### Cleanup

| Script | Command | Shell |
|--------|---------|-------|
| `clean` | `rimraf dist release android ios .vite` | Any |
| `clean:modules` | `rimraf node_modules` | Any |
| `reinstall` | `pnpm clean:modules && pnpm install` | Any |

### Electron

| Script | Command | Shell |
|--------|---------|-------|
| `electron:dev` | `concurrently -k "vite" "wait-on http://localhost:5175 && electron ."` | Any |
| `electron:dev:win` | `pnpm setup:win && pnpm electron:dev` | PowerShell |
| `electron:build` | `pnpm clean && pnpm build && electron-builder` | Any |
| `electron:build:win` | `pnpm setup:win && pnpm clean && pnpm build && electron-builder --win` | PowerShell |
| `electron:build:linux` | `pnpm setup:linux && pnpm clean && pnpm build && electron-builder --linux` | Bash/WSL |
| `electron:build:mac` | `pnpm clean && pnpm build && electron-builder --mac` | macOS |
| `electron:build:all` | `pnpm clean && pnpm build && electron-builder --win --linux --mac` | macOS (or CI matrix) |

### Capacitor

| Script | Command | Shell |
|--------|---------|-------|
| `cap:sync` | `pnpm build && npx cap sync` | Any |
| `cap:init:android` | `npx cap add android` | Any |
| `cap:init:ios` | `npx cap add ios` | macOS |
| `cap:open:android` | `npx cap open android` | Any |
| `cap:open:ios` | `npx cap open ios` | macOS |
| `cap:run:android` | `npx cap run android` | Any |
| `cap:run:ios` | `npx cap run ios` | macOS |
| `cap:dev:android` | `pnpm cap:sync && pnpm cap:run:android` | Any |
| `cap:dev:ios` | `pnpm cap:sync && pnpm cap:run:ios` | macOS |

### Release

| Script | Command | Shell |
|--------|---------|-------|
| `release:web` | `pnpm validate` | Any |
| `release:desktop` | `pnpm validate && electron-builder` | Depends on target |
| `release:mobile` | `pnpm validate && npx cap sync` | Any |

---

## Vite Configuration

- **Config file:** `vite.config.js`
- **Base path:** `./` (relative — required for Electron file:// loading)
- **Dev server port:** 5175 (strictPort)
- **HMR host:** `localhost` (explicitly set to prevent WSL WebSocket failures)
- **Build target:** `esnext`
- **Compiler:** SWC via `@vitejs/plugin-react-swc`

### Virtual Module

`virtual:movie-data` — Vite plugin reads `movie_list.md`, parses via shared `markdownParser` service, emits pre-parsed JSON. Zero runtime parse cost in production.

### Manual Chunks

| Chunk | Contents |
|-------|----------|
| `vendor-react` | `react`, `react-dom` |
| `vendor-virtual` | `@tanstack/react-virtual` |

### Dev Middleware

Custom middleware serves `movie_list.md` at `/movie_list.md` during development for runtime fetch+parse (async, non-blocking).

---

## TypeScript Configuration

- **Target:** ESNext
- **Strict mode:** enabled
- **noEmit:** true (Vite/SWC handles emit)
- Type checking via `pnpm typecheck` (`tsc --noEmit`)

---

## CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`):

```yaml
runs-on: ubuntu-latest
steps:
  - pnpm install --frozen-lockfile
  - pnpm lint
  - pnpm build
```

Uses `pnpm/action-setup@v4` and `actions/setup-node@v4` with `.nvmrc`.
