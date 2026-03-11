# Copilot Instructions — Movies for Hackers

> Runtime policy for GitHub Copilot Chat, inline completions, and Copilot Workspace.
> Defers to [AGENTS.md](../AGENTS.md) for the full governance constitution.

---

## Identity

- **Project:** Movies for Hackers — a cross-platform movie catalog (web, desktop, mobile)
- **Stack:** React 18 · TypeScript 5.9 · Vite 6 · SWC · Electron 40 · Capacitor 8
- **Package manager:** pnpm 10.30.3 (pinned in `packageManager` field)
- **Node:** 22+ (pinned in `.nvmrc`)

## Package Manager

**Use pnpm exclusively.** Never suggest `npm`, `npx`, `yarn`, or `bun`.

```
✅  pnpm install
✅  pnpm add <pkg>
✅  pnpm <script>
✅  pnpm dlx <one-off>

❌  npm install / npm run / npx
❌  yarn add / yarn
❌  bun / bunx
```

**Exception:** Capacitor scripts use `npx cap` — this is the Capacitor CLI convention, already encoded in `package.json`. Do not generalize.

## Shell Routing

Default to **WSL: Ubuntu** for all development work.

Use PowerShell only for Windows-native Electron packaging:
- `pnpm run electron:build:win`

Use native or remote macOS only for:
- `pnpm run electron:build:mac`
- `pnpm run cap:init:ios`
- `pnpm run cap:open:ios`
- `pnpm run cap:run:ios`

Use Android-capable tooling only for:
- `pnpm run cap:init:android`
- `pnpm run cap:open:android`
- `pnpm run cap:run:android`

All other tasks, including install, dev, lint, format, typecheck, validate, build, preview, Electron dev, Electron preview, Electron Linux build, cleanup, and WASM work, must use **WSL: Ubuntu**.

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

Never run `:win` scripts in WSL. Never run `:linux` scripts in PowerShell.

## Language Guardrails

Use the repository's approved languages only:

- **HTML** — markup and document structure
- **CSS** — styling and layout  
- **JavaScript** — runtime compatibility layer
- **TypeScript** — primary application logic and type safety
- **AssemblyScript** — WASM performance-sensitive modules (existing pipeline only)
- **WebAssembly** — compiled WASM outputs (existing build path only)

**Default to TypeScript and JavaScript for implementation.**
Use HTML/CSS for structure and presentation.
Use AssemblyScript and WebAssembly only within the existing WASM pipeline.

### No Orphaned Scripts Policy

Do not introduce helper scripts or alternate runtimes outside the approved languages.

**Never** create:
- Python helper scripts
- Bash utilities when `package.json` scripts or Node tooling exist
- PowerShell utilities for ordinary project logic
- Ruby, PHP, Perl, Go, Rust, Java, C#, Lua, or other side-language helpers
- duplicate build scripts outside the package-driven workflow
- orphaned scripts in random languages unless explicitly authorized

**If automation is needed:**

1. First: prefer an existing `package.json` script
2. Then: prefer Node-based scripts in the existing repo structure
3. Then: prefer TypeScript or JavaScript in `scripts/` aligned with conventions
4. Only: use another language if governance explicitly authorizes it

### No Parallel Tooling Rule

Do not create parallel implementations of the same concern in multiple languages.

Do not:
- add a Python build helper when the repo already uses Node
- add a shell script duplicating an existing `package.json` script
- add a second config format or duplicate linter
- create duplicate wrappers around Vite, Electron, Capacitor, or WASM

**There should be one clear implementation path per responsibility.**

### File Placement

New files must live in the correct system:

- `src/` for app code
- `src/domain/` for pure domain logic
- `src/app/` for orchestration and side effects
- `src/components/` for UI components
- `src/hooks/` for React hooks
- `assembly/` for AssemblyScript sources
- `scripts/` for Node-based build/utility scripts
- `public/` for static assets

Do not create `misc/`, `temp/`, `helpers/`, `scripts2/`, or undisciplined folders.
Do not scatter automation across multiple languages.

## Architecture

Three layers with strict dependency direction:

```
domain/  →  pure functions, no side-effects, no framework imports
app/     →  imperative shell, imports domain/ only
UI/      →  React components (Atomic Design), imports hooks/, domain/, app/
hooks/   →  thin wrappers bridging domain ↔ UI
```

- **20 design patterns** are implemented. See `ARCHITECTURE.md`.
- Do not flatten layers, bypass ports, or put business logic in components/hooks.
- New components follow Atomic Design: atoms → molecules → organisms → templates → pages.
- Domain code has zero imports from `app/`, `hooks/`, or `components/`.

## Code Quality

Before committing, run `pnpm validate` which executes:

1. `pnpm lint` — ESLint 10 (flat config)
2. `pnpm format:check` — Prettier 3
3. `pnpm build` — tsc --noEmit + Vite build

All three must pass. The `prebuild` hook runs lint automatically.

## Conventions

- **Components:** PascalCase directory + `.tsx` — `atoms/Badge/Badge.tsx`
- **CSS Modules:** component name + `.module.css` — `Badge/Badge.module.css`
- **Hooks:** `use` + camelCase + `.ts` — `hooks/useFilters.ts`
- **Domain:** camelCase + `.ts` — `domain/policies/filterPolicy.ts`
- **Commits:** imperative mood, lowercase, no trailing period

## Do Not

1. Install or suggest npm / npx (except `npx cap`) / yarn / bun
2. Import from `app/` or `components/` inside `domain/`
3. Put business logic in React components or hooks
4. Change Electron security settings in `electron/main.cjs`
5. Refactor code the user didn't ask to change
6. Commit without passing `pnpm validate`
7. Invent scripts that don't exist in `package.json`
8. Mix platform-specific scripts across wrong shells
9. Default to PowerShell for routine development — use WSL: Ubuntu
10. Create orphaned helper scripts in unapproved languages — see **Language Guardrails**
