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

| Target | Shell | Key scripts |
|--------|-------|-------------|
| Windows | PowerShell | `setup:win`, `dev:win`, `build:win`, `electron:dev:win`, `electron:build:win` |
| Linux | Bash (WSL: Ubuntu) | `setup:linux`, `dev:linux`, `build:linux`, `electron:build:linux` |
| macOS / iOS | Bash / Zsh (Apple) | `electron:build:mac`, `cap:*:ios` |
| Android | Any | `cap:*:android` |
| Cross-platform | Any | `dev`, `build`, `preview`, `lint`, `typecheck`, `format`, `check`, `fix`, `validate`, `clean` |

Never run `:win` scripts in WSL. Never run `:linux` scripts in PowerShell.

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
