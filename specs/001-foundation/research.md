# Phase 0 Research & Technical Decisions

## Decisions & Rationale

- **Decision**: Feature-Based Architecture (`src/features/`) combined with a strong shared core (`src/components/shared`, `src/lib`).
  - **Rationale**: Scales infinitely better for large admin dashboards than flat type-based directories. Each module (e.g., users, orders) encapsulates its own components, hooks, and types.
- **Decision**: Mock Service Worker (MSW) or equivalent fetch-interception for Mock Data Architecture.
  - **Rationale**: Allows TanStack Query to execute network requests exactly as it would against a production API. When Phase 1 begins, replacing the API URL will require zero changes to the UI components.
- **Decision**: `next-intl` with App Router integration.
  - **Rationale**: Provides first-class support for React 19 Server Components. Localization is resolved on the server, significantly reducing client-side bundle size.
- **Decision**: CSS Variables for Design Tokens (`globals.css`).
  - **Rationale**: Direct integration with shadcn/ui and Tailwind v4. Enables instant theme and RTL/LTR switching without JavaScript recalculation overhead.
- **Decision**: Logical CSS Properties Enforcement (ESLint plugin).
  - **Rationale**: Prohibiting physical properties (`ml-4`, `text-left`) is the only reliable way to guarantee that a layout designed in English will perfectly mirror in Arabic without maintaining two sets of styles.
