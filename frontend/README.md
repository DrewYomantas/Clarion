# Clarion Frontend

React/Vite frontend for Clarion's public site, authenticated workspace, sample workspace, reports, and partner-brief review surfaces.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI primitives
- React Router
- TanStack Query
- Vitest
- Playwright

## Setup

```bash
npm install
npm run dev
```

The dev server proxies API requests to the Flask backend. Start the backend separately from `../backend`.

## Scripts

```bash
npm run dev       # local Vite server
npm run build     # production build
npm run lint      # ESLint
npm run test      # Vitest
npm run test:e2e  # seeded Playwright flow
```

## Notes For Reviewers

- Route-level screens live in `src/pages/`.
- Shared governance/workspace components live in `src/components/`.
- API wrappers live in `src/api/`.
- The product direction is brief-first: the governance brief is the center of gravity, not the dashboard.
