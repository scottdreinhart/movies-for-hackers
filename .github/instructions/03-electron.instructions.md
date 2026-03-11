---
applyTo: "electron/**,package.json"
---

# Electron — Desktop Development & Packaging

> Governs the Electron main process, dev/build workflows, and desktop packaging.
> Defers to [AGENTS.md](../../AGENTS.md) for top-level rules.

---

## Overview

Electron 40 wraps the Vite-built SPA for desktop distribution. The main process is a single CommonJS file (`electron/main.cjs`) with a hardened security configuration. **Do not modify the security settings.**

---

## Entry Point

**File:** `electron/main.cjs`

```
electron/
  main.cjs    # Main process — window creation, security guards, dev/prod loading
```

### Window Configuration

| Property | Value |
|----------|-------|
| Width | 1400 × 900 (min: 800 × 600) |
| Title | Movies for Hackers |
| nodeIntegration | `false` |
| contextIsolation | `true` |
| sandbox | `true` |
| webSecurity | `true` |

### Loading

| Mode | Loads |
|------|-------|
| Development (`!app.isPackaged`) | `http://localhost:5175` (Vite dev server) |
| Production | `dist/index.html` (file://) |

### Security — DO NOT MODIFY

These settings are final:

1. **`sandbox: true`** — renderer runs in sandboxed process
2. **`contextIsolation: true`** — preload and renderer worlds are isolated
3. **`nodeIntegration: false`** — no Node.js APIs in renderer
4. **`webSecurity: true`** — enforces same-origin policy
5. **`will-navigate` guard** — prevents navigation to untrusted origins; external URLs open in default browser
6. **`setWindowOpenHandler`** — all `window.open()` calls redirect to `shell.openExternal()` and are denied internally
7. **DevTools** — toggled via F12 in development mode only

---

## Scripts

### Development

| Script | Shell | What it does |
|--------|-------|-------------|
| `pnpm electron:dev` | Any | Starts Vite + waits for `localhost:5175` + launches Electron |
| `pnpm electron:dev:win` | PowerShell | Runs `setup:win` first, then `electron:dev` |

`electron:dev` uses `concurrently` to run Vite and Electron in parallel, with `wait-on` ensuring the dev server is ready before Electron connects.

### Build & Package

| Script | Shell | Targets | Output |
|--------|-------|---------|--------|
| `pnpm electron:build` | Any | Default platform | `release/` |
| `pnpm electron:build:win` | **PowerShell** | Windows (NSIS + portable) | `release/` |
| `pnpm electron:build:linux` | **Bash/WSL** | Linux (AppImage + deb) | `release/` |
| `pnpm electron:build:mac` | **macOS** | macOS (DMG) | `release/` |
| `pnpm electron:build:all` | **macOS** (or CI matrix) | All platforms | `release/` |

### Build Pipeline (Each Build Script)

```
pnpm clean          →  rimraf dist release android ios .vite
pnpm build          →  pnpm lint  (prebuild hook)
                    →  tsc --noEmit
                    →  vite build
electron-builder    →  Package dist/ + electron/ into installer
```

---

## electron-builder Configuration

Defined in the `"build"` key of `package.json`:

| Property | Value |
|----------|-------|
| `appId` | `com.scottdreinhart.movies-for-hackers` |
| `productName` | `Movies for Hackers` |
| `directories.output` | `release` |
| `files` | `dist/**/*`, `electron/**/*` |

### Platform Targets

| Platform | Target Formats | Category |
|----------|---------------|----------|
| **Windows** | NSIS installer, portable exe | — |
| **Linux** | AppImage, .deb | Utility |
| **macOS** | DMG | public.app-category.entertainment |

### Output Structure

```
release/
  ├── Movies for Hackers Setup X.X.X.exe     # NSIS installer (Windows)
  ├── Movies for Hackers X.X.X.exe           # Portable (Windows)
  ├── Movies for Hackers-X.X.X.AppImage       # AppImage (Linux)
  ├── movies-for-hackers_X.X.X_amd64.deb      # Debian package (Linux)
  ├── Movies for Hackers-X.X.X.dmg            # DMG (macOS)
  ├── builder-debug.yml
  ├── builder-effective-config.yaml
  ├── latest-linux.yml
  └── linux-unpacked/                          # Unpacked Linux build
```

---

## Shell Routing — Critical

| Build Target | Required Shell | Why |
|-------------|---------------|-----|
| Windows | PowerShell | `setup:win` runs `platform-swap.ps1` (robocopy); Windows-native `.node` binaries required |
| Linux | Bash (WSL: Ubuntu) | `setup:linux` runs `platform-swap.sh` (ext4+tar); Linux-native `.node` binaries required |
| macOS | macOS Bash/Zsh | Requires Apple code signing tools; only builds on macOS host |

- **Never run `electron:build:win` in WSL.**
- **Never run `electron:build:linux` in PowerShell.**
- `electron:build:mac` requires macOS — it cannot run on Windows or Linux.
- `electron:build:all` is intended for macOS hosts or CI matrix builds that fan out to per-platform runners.

---

## Vite ↔ Electron Integration

- Vite dev server runs on `localhost:5175` (strict port).
- HMR WebSocket host is explicitly set to `localhost` to prevent WebSocket failures in WSL/cross-network environments.
- Electron loads `http://localhost:5175` in dev and `file://dist/index.html` in production.
- Base path is `./` (relative) — required for `file://` protocol in packaged builds.

---

## Dependencies

| Package | Type | Purpose |
|---------|------|---------|
| `electron` | devDependency | Electron runtime (ships its own) |
| `electron-builder` | devDependency | Packaging & installer creation |
| `concurrently` | devDependency | Run Vite + Electron in parallel during dev |
| `wait-on` | devDependency | Wait for dev server before launching Electron |

---

## Do Not

1. Modify `electron/main.cjs` security settings (sandbox, contextIsolation, nodeIntegration, webSecurity)
2. Add preload scripts without explicit user request (roadmap item — not yet implemented)
3. Enable `nodeIntegration` or disable `contextIsolation`
4. Remove navigation guards or window-open handlers
5. Change the dev server port (5175 is hardcoded in `main.cjs`)
6. Run platform-mismatched builds (Linux build on PowerShell, etc.)
7. Move `electron` or `electron-builder` from devDependencies to dependencies
