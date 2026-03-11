# Build Matrix — Movies for Hackers

> Complete mapping of every build target, script, shell environment, and output.
> Source of truth: `package.json` scripts + `AGENTS.md` governance.

---

## Build Target Matrix

| Target | Script | Shell | Host OS | Output | Notes |
|--------|--------|-------|---------|--------|-------|
| **Web (dev)** | `pnpm dev` | Any | Any | `localhost:5175` | Vite dev server, HMR enabled |
| **Web (dev, Windows setup)** | `pnpm dev:win` | PowerShell | Windows | `localhost:5175` | Runs `setup:win` first for native binary swap |
| **Web (dev, Linux setup)** | `pnpm dev:linux` | Bash/WSL | Linux/WSL | `localhost:5175` | Runs `setup:linux` first for native binary swap |
| **Web (build)** | `pnpm build` | Any | Any | `dist/` | `tsc --noEmit` + `vite build` |
| **Web (build, Windows setup)** | `pnpm build:win` | PowerShell | Windows | `dist/` | Runs `setup:win` first |
| **Web (build, Linux setup)** | `pnpm build:linux` | Bash/WSL | Linux/WSL | `dist/` | Runs `setup:linux` first |
| **Web (preview)** | `pnpm preview` | Any | Any | `localhost:4173` | Vite preview of production build |
| **Web (release)** | `pnpm release:web` | Any | Any | `dist/` | Full validation + build |
| **Desktop (dev)** | `pnpm electron:dev` | Any | Any | Electron window → `localhost:5175` | Vite + Electron concurrent |
| **Desktop (dev, Windows)** | `pnpm electron:dev:win` | PowerShell | Windows | Electron window → `localhost:5175` | Runs `setup:win` first |
| **Desktop (build, default)** | `pnpm electron:build` | Any | Current OS | `release/` | Builds for current platform |
| **Desktop (Windows)** | `pnpm electron:build:win` | PowerShell | Windows | `release/` — NSIS + portable | Runs `setup:win` first |
| **Desktop (Linux)** | `pnpm electron:build:linux` | Bash/WSL | Linux/WSL | `release/` — AppImage + deb | Runs `setup:linux` first |
| **Desktop (macOS)** | `pnpm electron:build:mac` | Bash/Zsh | macOS | `release/` — DMG | Requires macOS host |
| **Desktop (all)** | `pnpm electron:build:all` | Bash/Zsh | macOS (or CI matrix) | `release/` — all formats | Cross-platform; best on CI matrix |
| **Desktop (release)** | `pnpm release:desktop` | Depends | Current OS | `release/` | Full validation + electron-builder |
| **Mobile (Android)** | `pnpm cap:dev:android` | Any | Any | APK on device/emulator | Build + sync + run |
| **Mobile (iOS)** | `pnpm cap:dev:ios` | Bash/Zsh | macOS | IPA on simulator | Build + sync + run — Xcode required |
| **Mobile (sync)** | `pnpm cap:sync` | Any | Any | `android/`, `ios/` | Build + copy dist/ to native projects |
| **Mobile (release)** | `pnpm release:mobile` | Any | Any | Synced native projects | Full validation + cap sync |

---

## Platform Setup Scripts

| Script | Shell | Purpose |
|--------|-------|---------|
| `pnpm setup:win` | PowerShell | `scripts/platform-swap.ps1` — cleans Linux `.node` binaries via robocopy + `pnpm install` |
| `pnpm setup:linux` | Bash/WSL | `scripts/platform-swap.sh` — cleans Windows `.node` binaries via ext4+tar + `pnpm install` |

These resolve native binary conflicts when switching between Windows and WSL on a shared filesystem.

---

## Code Quality Scripts

| Script | Command | Shell | Gate |
|--------|---------|-------|------|
| `pnpm typecheck` | `tsc --noEmit` | Any | Type safety |
| `pnpm lint` | `eslint src/` | Any | Code rules |
| `pnpm lint:fix` | `eslint src/ --fix` | Any | Auto-fix lint |
| `pnpm format` | `prettier --write "src/**/*.{ts,tsx,css}"` | Any | Auto-format |
| `pnpm format:check` | `prettier --check "src/**/*.{ts,tsx,css}"` | Any | Format check |
| `pnpm check` | `pnpm lint && pnpm format:check` | Any | Lint + format |
| `pnpm fix` | `pnpm lint:fix && pnpm format` | Any | Auto-fix all |
| `pnpm validate` | `pnpm check && pnpm build` | Any | **Full gate** |
| `pnpm prebuild` | `pnpm lint` | Any | Auto-hook (runs before every build) |

---

## Cleanup Scripts

| Script | Command | Shell | Removes |
|--------|---------|-------|---------|
| `pnpm clean` | `rimraf dist release android ios .vite` | Any | Build outputs + native projects |
| `pnpm clean:modules` | `rimraf node_modules` | Any | All dependencies |
| `pnpm reinstall` | `pnpm clean:modules && pnpm install` | Any | Full re-install |

---

## Capacitor Scripts

| Script | Command | Shell | Platform |
|--------|---------|-------|----------|
| `pnpm cap:sync` | `pnpm build && npx cap sync` | Any | Both |
| `pnpm cap:init:android` | `npx cap add android` | Any | Android |
| `pnpm cap:init:ios` | `npx cap add ios` | macOS | iOS |
| `pnpm cap:open:android` | `npx cap open android` | Any | Android |
| `pnpm cap:open:ios` | `npx cap open ios` | macOS | iOS |
| `pnpm cap:run:android` | `npx cap run android` | Any | Android |
| `pnpm cap:run:ios` | `npx cap run ios` | macOS | iOS |
| `pnpm cap:dev:android` | `pnpm cap:sync && pnpm cap:run:android` | Any | Android |
| `pnpm cap:dev:ios` | `pnpm cap:sync && pnpm cap:run:ios` | macOS | iOS |

**Note:** All `npx cap` usage is the Capacitor CLI convention — the only authorized `npx` in this project.

---

## Electron Builder Targets

| Platform | Formats | AppId | Output Dir |
|----------|---------|-------|-----------|
| Windows | NSIS installer, portable exe | `com.scottdreinhart.movies-for-hackers` | `release/` |
| Linux | AppImage, .deb | `com.scottdreinhart.movies-for-hackers` | `release/` |
| macOS | DMG | `com.scottdreinhart.movies-for-hackers` | `release/` |

---

## Vendor Chunks (Vite Build)

| Chunk | Contents | Size | Gzipped |
|-------|---------|------|---------|
| `vendor-react` | react, react-dom | 142.79 KB | 45.72 KB |
| `vendor-virtual` | @tanstack/react-virtual | 16.26 KB | 5.15 KB |
| `virtual:movie-data` | Pre-parsed movie_list.md JSON | 102.88 KB | 21.52 KB |
| `index` (app) | Application code | 22.48 KB | 8.45 KB |
| CSS | All styles | 16.32 KB | 4.06 KB |

---

## CI Pipeline

| Runner | Steps | Lockfile |
|--------|-------|---------|
| `ubuntu-latest` | `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build` | `pnpm-lock.yaml` (frozen) |

Uses `pnpm/action-setup@v4` + `actions/setup-node@v4` (reads `.nvmrc` for Node 22+).

---

## Shell / Environment Quick Reference

| Shell | When to use | Never use for |
|-------|------------|--------------|
| **PowerShell** | `:win` scripts, Windows Electron builds | `:linux` scripts, Linux builds |
| **Bash (WSL: Ubuntu)** | `:linux` scripts, Linux Electron builds | `:win` scripts, Windows builds |
| **Bash / Zsh (macOS)** | `:mac` scripts, iOS builds, `electron:build:all` | — |
| **Any** | Unsuffixed scripts (dev, build, lint, etc.) | — |
