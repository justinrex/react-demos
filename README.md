# React Demos

Interactive lessons on React, CSS, and accessible UI. Each page pairs a problematic pattern with a better approach, with controls that make the tradeoffs visible.

## Explore

| Lesson | What it demonstrates |
| --- | --- |
| Memoization | Render behavior, stable props, and when caching adds overhead |
| Effects | Derived state, stale closures, request races, and cleanup |
| Lazy loading | Suspense boundaries, intent preloading, and list virtualization |
| CSS foundations | Relative units, custom properties, and theme tokens |
| Accessibility | Semantic HTML, native controls, labels, and error association |
| Forms | Controlled inputs, validation timing, and async submission states |

Built with React 19, TypeScript, React Router, and Vite. The examples use local simulated data; no API keys or backend are required. Some examples deliberately demonstrate incorrect patterns and label them in the UI. Narrow ESLint exceptions identify these cases and the ref-based counters used to visualize render attempts; those counters are teaching instrumentation, not a production pattern.

## Run locally

Use Node.js 24 LTS and pnpm (the version is pinned in `package.json`).

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open [localhost:3000](http://localhost:3000). The default route opens the memoization lesson; the sidebar links to each topic.

## Checks

```sh
pnpm check          # lint, tests with coverage, and production build
pnpm test          # route and effect interaction tests
pnpm build         # type checking and production output in dist/
pnpm start         # preview the production build locally
```

Tests cover loading each lesson through the router and preserving a scoped connection across theme changes. They do not yet exhaustively cover every interactive example.

## Structure

- `src/pages/` — individual lessons and examples
- `src/components/` — shared lesson UI
- `src/routes.tsx` — lazy route registry and preloading
- `src/shell.tsx` — navigation and application layout
- `src/App.test.tsx` — route smoke tests

To add a lesson, create a page in `src/pages/`, register it in `src/routes.tsx`, and add a route test.
