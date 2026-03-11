# Development Workflows — Movies for Hackers

> Step-by-step workflows for every development scenario.
> All commands use **pnpm** exclusively. See [AGENTS.md](../../AGENTS.md) for governance.

---

## Table of Contents

1. [First-Time Setup](#1-first-time-setup)
2. [Daily Development](#2-daily-development)
3. [Code Quality](#3-code-quality)
4. [Building for Production](#4-building-for-production)
5. [Electron Desktop](#5-electron-desktop)
6. [Capacitor Mobile](#6-capacitor-mobile)
7. [Switching Between Windows and WSL](#7-switching-between-windows-and-wsl)
8. [Cleanup & Reset](#8-cleanup--reset)
9. [Release](#9-release)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. First-Time Setup

### Prerequisites

| Requirement | Version | Check |
|------------|---------|-------|
| Node.js | 22+ | `node -v` |
| pnpm | 10.30.3 | `pnpm -v` |
| Git | any | `git --version` |

### Install pnpm (if needed)

```powershell
corepack enable
corepack prepare pnpm@10.30.3 --activate
```

### Clone & Install

```powershell
git clone https://github.com/scottdreinhart/movies-for-hackers.git
cd movies-for-hackers
pnpm install
```

### Windows-Specific Setup

```powershell
# PowerShell — swaps native binaries to Windows
pnpm setup:win
```

### Linux/WSL-Specific Setup

```bash
# Bash (WSL: Ubuntu) — swaps native binaries to Linux
pnpm setup:linux
```

---

## 2. Daily Development

### Start Dev Server

```powershell
# Any shell — starts Vite on localhost:5175
pnpm dev
```

```powershell
# PowerShell (Windows) — runs platform setup first
pnpm dev:win
```

```bash
# Bash/WSL (Linux) — runs platform setup first
pnpm dev:linux
```

The dev server starts at `http://localhost:5175` with HMR enabled. Edit any source file and changes appear instantly.

### Movie Data

In development, `movie_list.md` is served via Vite middleware and parsed at runtime. Edit the markdown file and changes appear on reload.

In production, data is pre-parsed to JSON at build time via the `virtual:movie-data` Vite plugin — zero runtime cost.

---

## 3. Code Quality

### Check Everything (Recommended Before Commits)

```powershell
# Full validation gate — lint + format check + typecheck + build
pnpm validate
```

### Individual Checks

```powershell
# Type checking only
pnpm typecheck

# Lint only
pnpm lint

# Format check only (no changes)
pnpm format:check

# Combined check (lint + format)
pnpm check
```

### Auto-Fix

```powershell
# Fix lint issues
pnpm lint:fix

# Auto-format all source files
pnpm format

# Fix everything (lint + format)
pnpm fix
```

### Quality Gate Flow

```
pnpm validate
  └── pnpm check
  │     ├── pnpm lint        ← ESLint 10 (flat config)
  │     └── pnpm format:check ← Prettier 3
  └── pnpm build
        ├── pnpm prebuild    ← pnpm lint (auto-hook)
        ├── tsc --noEmit     ← TypeScript strict mode
        └── vite build       ← SWC + production bundle
```

---

## 4. Building for Production

### Web Build

```powershell
# Any shell — produces dist/
pnpm build
```

```powershell
# PowerShell (Windows) — with platform setup
pnpm build:win
```

```bash
# Bash/WSL (Linux) — with platform setup
pnpm build:linux
```

### Preview Production Build

```powershell
# Serves the built dist/ locally
pnpm preview
```

### Build Output

```
dist/
  ├── index.html
  ├── assets/
  │   ├── index-[hash].js          (22.48 KB / 8.45 KB gzip)
  │   ├── vendor-react-[hash].js   (142.79 KB / 45.72 KB gzip)
  │   ├── vendor-virtual-[hash].js (16.26 KB / 5.15 KB gzip)
  │   ├── movie-data-[hash].js     (102.88 KB / 21.52 KB gzip)
  │   └── index-[hash].css         (16.32 KB / 4.06 KB gzip)
  ├── manifest.json
  ├── sw.js
  └── icons/
```

---

## 5. Electron Desktop

### Development

```powershell
# Any shell — starts Vite + Electron concurrently
pnpm electron:dev
```

```powershell
# PowerShell (Windows) — with platform setup
pnpm electron:dev:win
```

This runs:
1. Vite dev server on `localhost:5175`
2. `wait-on` watches for the server to be ready
3. Electron launches and loads `http://localhost:5175`

Press **F12** in the Electron window to toggle DevTools (dev mode only).

### Build & Package

#### Windows (PowerShell)

```powershell
pnpm electron:build:win
```

Produces in `release/`:
- NSIS installer (`.exe`)
- Portable executable (`.exe`)

#### Linux (Bash/WSL)

```bash
pnpm electron:build:linux
```

Produces in `release/`:
- AppImage
- Debian package (`.deb`)

#### macOS (macOS only)

```bash
pnpm electron:build:mac
```

Produces in `release/`:
- DMG disk image

#### All Platforms

```bash
# macOS host or CI matrix build
pnpm electron:build:all
```

### Build Pipeline

Each `electron:build:*` script executes:

```
pnpm clean             # Remove dist/, release/, android/, ios/, .vite/
  ↓
pnpm build             # lint (prebuild) → tsc --noEmit → vite build
  ↓
electron-builder       # Package dist/ + electron/ → release/
```

---

## 6. Capacitor Mobile

### Initial Setup

#### Android

```powershell
# Any shell — creates android/ directory
pnpm cap:init:android
```

Requires: Android Studio + Android SDK + Java 17+

#### iOS (macOS only)

```bash
# macOS with Xcode
pnpm cap:init:ios
```

Requires: Xcode 15+ + iOS Simulator

### Development Workflow

#### Android

```powershell
# Build web app + sync to native + run on device/emulator
pnpm cap:dev:android
```

#### iOS (macOS only)

```bash
pnpm cap:dev:ios
```

### Manual Steps

```powershell
# Build and sync web assets to native projects
pnpm cap:sync

# Open native IDE
pnpm cap:open:android
pnpm cap:open:ios        # macOS only

# Run on device/emulator
pnpm cap:run:android
pnpm cap:run:ios         # macOS only
```

### Capacitor Build Flow

```
pnpm build          # tsc --noEmit + vite build → dist/
  ↓
npx cap sync        # Copy dist/ → android/app/src/main/assets/public/
                    #             → ios/App/App/public/
  ↓
npx cap run *       # Compile native project + deploy
```

---

## 7. Switching Between Windows and WSL

When working on a shared filesystem (e.g., `/mnt/c/` from WSL), native `.node` binaries compiled for one platform won't work on the other. The platform-swap scripts handle this:

### From WSL → Windows

```powershell
# In PowerShell (not WSL!)
pnpm setup:win
```

### From Windows → WSL

```bash
# In WSL: Ubuntu (not PowerShell!)
pnpm setup:linux
```

### What These Scripts Do

1. **Clean** platform-incompatible native binaries (`.node` files from `@swc/core`, `esbuild`, `@rollup`)
2. **Reinstall** with `pnpm install` to fetch correct platform binaries

### Rules

- **Never** run `setup:win` in WSL
- **Never** run `setup:linux` in PowerShell
- Run the setup script **once** after switching environments, then use normal `pnpm dev` / `pnpm build`

---

## 8. Cleanup & Reset

### Clean Build Outputs

```powershell
# Removes: dist/ release/ android/ ios/ .vite/
pnpm clean
```

### Clean Node Modules

```powershell
# Removes node_modules/
pnpm clean:modules
```

### Full Reinstall

```powershell
# clean:modules + pnpm install
pnpm reinstall
```

---

## 9. Release

### Web

```powershell
# Full validation (lint + format + typecheck + build)
pnpm release:web
```

### Desktop

```powershell
# Validation + electron-builder (for current platform)
pnpm release:desktop
```

### Mobile

```powershell
# Validation + cap sync (prepares native projects)
pnpm release:mobile
```

---

## 10. Troubleshooting

### `vite: command not found` / `vite is not recognized`

Native binary shims are missing. Reinstall:

```powershell
pnpm install
```

If switching between Windows and WSL, use the appropriate setup script first.

### Vite WebSocket / HMR not connecting

The HMR WebSocket host is explicitly set to `localhost` in `vite.config.js`. If you see connection failures:

1. Ensure the dev server is running on `localhost:5175`
2. Check that no firewall is blocking WebSocket connections
3. In WSL, confirm WSL networking is forwarding ports correctly

### `electron-builder` fails with permission errors

On Windows:
- Close any running Electron instances
- Ensure no file in `release/` is open in another program
- Run PowerShell as Administrator if needed

On Linux/WSL:
- Ensure the `release/` directory has write permissions
- Check that FUSE is available for AppImage creation

### Native binary conflicts after switching platforms

```powershell
# Windows
pnpm setup:win

# Linux/WSL
pnpm setup:linux
```

If the setup scripts fail, try the nuclear option:

```powershell
pnpm reinstall
```

### TypeScript errors after dependency update

```powershell
pnpm typecheck
```

If types are out of date, check that `@types/react` and `@types/react-dom` are updated:

```powershell
pnpm add -D @types/react@latest @types/react-dom@latest
```

### ESLint errors

```powershell
# See all issues
pnpm lint

# Auto-fix what's fixable
pnpm lint:fix
```

### Formatting drift

```powershell
# Check for differences
pnpm format:check

# Auto-format everything
pnpm format
```

---

## Quick Reference Card

| Task | Command | Shell |
|------|---------|-------|
| Install dependencies | `pnpm install` | Any |
| Start dev server | `pnpm dev` | Any |
| Start dev (Windows) | `pnpm dev:win` | PowerShell |
| Start dev (Linux) | `pnpm dev:linux` | Bash/WSL |
| Build for production | `pnpm build` | Any |
| Preview build | `pnpm preview` | Any |
| Full validation | `pnpm validate` | Any |
| Auto-fix everything | `pnpm fix` | Any |
| Electron dev | `pnpm electron:dev` | Any |
| Electron build (Win) | `pnpm electron:build:win` | PowerShell |
| Electron build (Linux) | `pnpm electron:build:linux` | Bash/WSL |
| Electron build (Mac) | `pnpm electron:build:mac` | macOS |
| Mobile dev (Android) | `pnpm cap:dev:android` | Any |
| Mobile dev (iOS) | `pnpm cap:dev:ios` | macOS |
| Clean all | `pnpm clean` | Any |
| Full reinstall | `pnpm reinstall` | Any |
