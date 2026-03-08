# Contributing to Movies for Hackers

Thanks for your interest in contributing! Here's how to add a movie to the list.

## Adding a Movie or TV Show

1. **Fork** the repository and clone it locally
2. Find the correct section in `movie_list.md`:
   - **Thrillers / Drama** — Tech thrillers, cyber dramas, conspiracy films
   - **Sci-Fi / Fantasy** — Cyberpunk, dystopian futures, AI, virtual reality
   - **Action** — High-octane tech-driven action
   - **Documentaries** — Hacking culture, privacy, tech history
   - **TV Shows** — Series covering hacking, AI, and cyber themes
3. Add your entry in **alphabetical order** (ignoring leading articles: "The", "A", "An")
4. Use this format:

```markdown
| [Movie Title](https://www.imdb.com/title/ttXXXXXXX/) | Genre | Format | Year | Rated | X.X/10 | Brief description |
```

5. Fill in every column:
   - **Format** — `Animation`, `Claymation`, or `Live Action`
   - **Rated** — `G`, `PG`, `PG-13`, `R`, `NC-17`, `TV-Y7`, `TV-PG`, `TV-14`, `TV-MA`, or `NR`
6. Make sure the IMDb link is correct and the rating is current
7. Submit a **pull request** with a brief description

## Requirements

- The movie/show must be related to hacking, cyberpunk, technology, or internet culture
- Must have a valid IMDb listing
- No duplicates — check the existing list first
- Entries with fewer than 1,000 IMDb votes go to the **Pending Verification** section

## Development

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server with HMR
pnpm check          # Run lint + format check
pnpm fix            # Auto-fix lint + formatting
pnpm validate       # Full CI pipeline locally (lint + format + build)
```

## Code Style

- **ESLint** and **Prettier** enforce style — run `pnpm fix` before committing
- React components follow **Atomic Design** (atoms → molecules → organisms → templates → pages)
- CSS Modules for scoped styling — one `.module.css` per component
- Custom hooks for state logic — keep components presentation-focused
- Use barrel exports (`index.js`) at each atomic level

## Questions?

Open an issue if you're unsure about anything.
