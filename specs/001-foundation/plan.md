# Implementation Plan: Phase 0 (Foundation)

**Branch**: `[001-foundation]` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-foundation/spec.md`

## Summary

This phase establishes the non-business foundational architecture for the Betak-Alena frontend admin dashboard. It implements the project skeleton, layout shell, global UI state, localization, and generic data table tooling required to build all subsequent feature modules efficiently.

## Technical Context

**Language/Version**: TypeScript 5.x (Strict Mode), React 19
**Framework**: Next.js 15 (App Router)
**Styling**: Tailwind CSS v4, shadcn/ui, Lucide React
**Data Fetching**: TanStack Query v5
**State Management**: Zustand (UI state only)
**Internationalization**: next-intl (Arabic/English, RTL/LTR)
**Tables**: TanStack Table v8
**Project Type**: Enterprise Admin Dashboard

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **Simplicity/Consistency:** ✅ Architecture relies on standard Next.js conventions and widely adopted tools.
- **Component Design:** ✅ shadcn/ui ensures headless, reusable atomic components.
- **State Management:** ✅ Strict separation enforced: Zustand for UI, TanStack Query for server state.
- **Performance:** ✅ Using React Server Components for layout and translations.
- **Data Presentation & Forms:** ✅ Generic DataTable will standardize all list views.

## Project Structure

### Documentation (this feature)

```text
specs/001-foundation/
├── plan.md              # This file
├── research.md          # Technical decisions
├── data-model.md        # N/A for Phase 0
├── quickstart.md        # Validation scenarios
└── contracts/           # N/A for Phase 0
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── [locale]/
│   │   ├── (auth)/
│   │   └── (dashboard)/
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Sidebar, Header, Shell
│   └── data-table/       # Generic DataTable
├── features/             # Business modules (empty for now)
├── hooks/                # Shared custom hooks
├── lib/                  # Utilities (Tailwind merge, etc.)
├── stores/               # Zustand UI stores
├── types/                # Global TypeScript definitions
└── i18n/                 # next-intl configuration
```

## Workstreams and Execution Strategy

The implementation is broken down into ordered workstreams. Strict adherence to this sequence is required to avoid rework.

### 1. Project Restructuring and Configuration

**Objective**: Establish the base folder structure, path aliases, and fundamental Next.js configuration.
**Scope**: `tsconfig.json`, `next.config.mjs`, `src/` folder layout.
**Dependencies**: None.
**Deliverables**: A compiling Next.js project with the target folder structure.
**Complexity**: Small
**Risks**: Path alias misconfiguration breaking imports.
**Mitigation**: Run `npm run build` immediately after configuring aliases.
**Git/PR Boundary**: `build: configure project structure and path aliases` (1 Commit, 1 PR).
**Validation**: Project builds successfully.
**Definition of Done**: Folders exist, `next.config` is set, and `tsconfig` strict mode is confirmed.

### 2. Development Tooling and Linting

**Objective**: Guarantee code quality and stylistic consistency.
**Scope**: ESLint, Prettier, Husky (optional), lint-staged.
**Dependencies**: Workstream 1.
**Deliverables**: Strict linting rules prohibiting `any` types and enforcing logical CSS properties (`eslint-plugin-tailwindcss` / `eslint-plugin-rtl`).
**Complexity**: Medium
**Risks**: Overly strict rules slowing down initial development.
**Mitigation**: Focus only on the non-negotiable rules (any, physical css, exhaustive-deps).
**Git/PR Boundary**: `chore: setup linting and code quality tooling` (1 Commit, 1 PR).
**Validation**: Running `npm run lint` successfully flags an intentionally placed `ml-4` or `any`.

### 3. Design System and Design Tokens

**Objective**: Establish the visual foundation to decouple components from hardcoded colors/sizing.
**Scope**: `globals.css`, `tailwind.config.ts`.
**Dependencies**: Workstream 1.
**Deliverables**: CSS variables for light/dark themes; typography and spacing scales.
**Complexity**: Small
**Risks**: Incomplete token mapping forcing developers to use hardcoded values later.
**Mitigation**: Map all primary shadcn/ui variables explicitly.
**Git/PR Boundary**: `feat(design): implement css variables and tailwind theme` (1 Commit).

### 4. Internationalization Foundation

**Objective**: Setup `next-intl` for Server and Client components.
**Scope**: Middleware for locale detection, routing setup, translation dictionaries (`ar.json`, `en.json`).
**Dependencies**: Workstream 1.
**Deliverables**: Locale-aware routing (`/ar/dashboard`, `/en/dashboard`), RTL/LTR `dir` attribute injection.
**Complexity**: Medium
**Risks**: Server component translation mismatches causing hydration errors.
**Mitigation**: Follow the official Next.js 15 App Router guide for `next-intl` strictly.
**Git/PR Boundary**: `feat(i18n): configure next-intl for ar and en locales` (1 Commit, Combine with WS3 for PR).

### 5. Shared Component Library

**Objective**: Scaffold the atomic components required for the layout.
**Scope**: shadcn/ui installation of base elements (Button, Input, DropdownMenu, Avatar, Sheet).
**Dependencies**: Workstream 3.
**Deliverables**: Accessible UI primitives fully styled with design tokens.
**Complexity**: Medium
**Risks**: Unmodified shadcn components containing physical direction classes (e.g., `mr-2`).
**Mitigation**: Manually audit every installed component to replace `mr-*`/`ml-*` with `me-*`/`ms-*`.
**Git/PR Boundary**: `feat(ui): scaffold base shadcn components` (Multiple commits by component, 1 PR).

### 6. UI State Management

**Objective**: Implement global UI preferences store.
**Scope**: Zustand store for sidebar state (collapsed/expanded) and theme.
**Dependencies**: Workstream 1.
**Deliverables**: `useUIStore` hook.
**Complexity**: Small
**Risks**: Hydration mismatch if reading from localStorage before initial render.
**Mitigation**: Use `zustand/middleware` `persist` with a hydration guard.
**Git/PR Boundary**: `feat(store): implement ui state management` (1 Commit).

### 7. Shared Layout Shell

**Objective**: Build the dashboard container.
**Scope**: Sidebar, Header, Auth Layout, Dashboard Layout.
**Dependencies**: Workstreams 3, 4, 5, 6.
**Deliverables**: A responsive shell that toggles theme, locale, and sidebar collapse.
**Complexity**: Large
**Risks**: Mobile responsiveness breaking due to sidebar width conflicts.
**Mitigation**: Use mobile-first Tailwind breakpoints and the `Sheet` component for the mobile sidebar.
**Git/PR Boundary**: `feat(layout): implement responsive dashboard shell` (Multiple commits, 1 PR).

### 8. Mock Data Architecture & TanStack Query

**Objective**: Establish the data-fetching foundation.
**Scope**: React Query Provider, API client (axios/fetch abstraction), mock setup.
**Dependencies**: Workstream 1.
**Deliverables**: A query client provider wrapping the application, and a mock service intercepting requests.
**Complexity**: Medium
**Risks**: Mocks leaking into production builds.
**Mitigation**: Strictly conditional initialization `if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled')`.
**Git/PR Boundary**: `feat(api): setup tanstack query and mock service` (1 Commit, 1 PR).

### 9. Generic DataTable System

**Objective**: Create the universal list-view component.
**Scope**: TanStack Table integration, pagination controls, URL-sync hooks (e.g., `nuqs` or custom).
**Dependencies**: Workstreams 5, 8.
**Deliverables**: `DataTable` component that accepts columns and data, with server-side pagination driven by URL parameters.
**Complexity**: Large
**Risks**: Over-engineering the generic component making it hard to use for simple cases.
**Mitigation**: Provide sensible defaults and keep complex faceted filtering optional.
**Git/PR Boundary**: `feat(table): implement generic data table system` (Multiple commits, 1 PR).

### 10. Final Integration, Testing, and Validation

**Objective**: Prove the foundation works end-to-end.
**Scope**: A placeholder page rendering the DataTable with mock data inside the layout shell.
**Dependencies**: All prior workstreams.
**Deliverables**: A working demonstration route.
**Complexity**: Small
**Risks**: Missing translations or layout issues in RTL mode.
**Mitigation**: Comprehensive manual verification against the quickstart guide.
**Git/PR Boundary**: `test: add placeholder validation page` (1 Commit, 1 PR).

## Execution Strategy

### Critical Path

1 (Structure) → 3 (Tokens) → 4 (i18n) → 5 (UI Primitives) → 7 (Layout) → 9 (DataTable).

### Parallel Work Opportunities

Once Workstream 1 is complete:

- Developer A can work on WS2 (Linting) & WS4 (i18n).
- Developer B can work on WS3 (Tokens) & WS5 (UI Components).
  Once Workstream 4 & 5 are complete:
- Developer A can work on WS8 (Query) & WS9 (DataTable).
- Developer B can work on WS6 (Zustand) & WS7 (Layout).

### Exit Criteria (Definition of Done for Phase 0)

- The application launches without console errors.
- The user can switch between Arabic/RTL and English/LTR flawlessly.
- The sidebar is responsive and its state is persisted.
- A placeholder page demonstrates the Generic DataTable fetching mock data, sorting, and paginating via URL parameters.
- ESLint passes successfully, guaranteeing no physical CSS direction rules exist.
- All code is committed to `main` with passing CI checks.
