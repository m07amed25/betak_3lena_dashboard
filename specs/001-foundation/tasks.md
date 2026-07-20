# Phase 0 (Foundation) - Implementation Backlog

## Epic 1: Project Structure & Configuration

- [x] **T001: Establish Feature-Based Architecture**
  - **Objective**: Create the foundational Next.js App Router folder structure.
  - **Description**: Implement feature-based architecture by creating `src/features`, `src/components/shared`, `src/components/layout`, `src/components/ui`, `src/components/data-table`, `src/hooks`, `src/stores`, `src/types`, and `src/lib`.
  - **Dependencies**: None
  - **Estimated effort**: S
  - **Priority**: Critical
  - **Deliverables**: Directory skeleton
  - **Acceptance criteria**: All required folders exist.
  - **Definition of Done**: Folders are committed with `.gitkeep` or placeholder files.

## Epic 2: Development Tooling

- [x] **T002: Configure ESLint and Prettier**
  - **Objective**: Enforce code quality and logical CSS properties.
  - **Description**: Update `.eslintrc.json` and `.prettierrc` to ban the `any` type (strict TS) and prohibit physical Tailwind CSS direction classes (e.g., `ml-4`, `pr-2`) using custom rules or plugins.
  - **Dependencies**: T001
  - **Estimated effort**: S
  - **Priority**: Critical
  - **Deliverables**: Updated linter and formatter configuration.
  - **Acceptance criteria**: Linter fails when `any` or `ml-4` is used.
  - **Definition of Done**: `npm run lint` passes on the repository.

- [x] **T003: Configure TypeScript Strict Mode**
  - **Objective**: Guarantee type safety across the frontend.
  - **Description**: Ensure `tsconfig.json` has `strict: true`, `noImplicitAny: true`, and path aliases mapped to `@/*`.
  - **Dependencies**: T001
  - **Estimated effort**: S
  - **Priority**: Critical
  - **Deliverables**: Updated `tsconfig.json`
  - **Acceptance criteria**: TS compilation fails on loose typing.
  - **Definition of Done**: `tsc --noEmit` passes cleanly.

## Epic 3: Design System

- [x] **T004: Implement CSS Variables and Theme Tokens**
  - **Objective**: Centralize design tokens for light/dark themes.
  - **Description**: Define the comprehensive set of colors, spacing, and typography using CSS variables in `src/app/globals.css` and map them in `tailwind.config.ts`.
  - **Dependencies**: T001
  - **Estimated effort**: M
  - **Priority**: High
  - **Deliverables**: `globals.css` and `tailwind.config.ts` updates.
  - **Acceptance criteria**: Colors can be referenced using `bg-primary`, `text-destructive`, etc.
  - **Definition of Done**: Tailwind compiles successfully with the new tokens.

## Epic 4: Internationalization

- [x] **T005: Setup next-intl and Locale Routing**
  - **Objective**: Enable Arabic (default, RTL) and English (LTR) support.
  - **Description**: Install `next-intl`. Configure middleware for locale routing. Set up the locale dictionary files (`messages/ar.json`, `messages/en.json`). Wrap the root layout with the intl provider and set the `dir` attribute dynamically.
  - **Dependencies**: T001
  - **Estimated effort**: M
  - **Priority**: Critical
  - **Deliverables**: Middleware, root layout, translation files.
  - **Acceptance criteria**: Navigating to `/ar` and `/en` loads correctly with the proper HTML `dir` attribute.
  - **Definition of Done**: Default route correctly redirects to `/ar`.

## Epic 5: Layout Shell

- [x] **T006: Build Authentication Shell**
  - **Objective**: Provide a foundational layout for authentication pages.
  - **Description**: Create a focused, centered card layout shell in `src/app/[locale]/(auth)/layout.tsx` for login/signup flows.
  - **Dependencies**: T004, T005
  - **Estimated effort**: S
  - **Priority**: High
  - **Deliverables**: Auth layout component.
  - **Acceptance criteria**: Content renders perfectly centered on screen.
  - **Definition of Done**: A placeholder login page renders within the auth shell.

- [x] **T007: Build Dashboard Shell**
  - **Objective**: Provide the main responsive application shell.
  - **Description**: Implement `src/components/layout/Shell.tsx`, `Sidebar.tsx`, and `Header.tsx`. Sidebar must be collapsible and become an off-canvas drawer on mobile. Header must contain theme toggle and locale switcher placeholders.
  - **Dependencies**: T004, T005
  - **Estimated effort**: L
  - **Priority**: Critical
  - **Deliverables**: Dashboard layout and constituent components.
  - **Acceptance criteria**: Layout is responsive across mobile, tablet, and desktop viewports.
  - **Definition of Done**: A placeholder dashboard page renders correctly inside the shell.

## Epic 6: Shared Components

- [x] **T008: Initialize shadcn/ui and Primitives**
  - **Objective**: Seed the project with accessible UI primitives.
  - **Description**: Install and configure shadcn/ui. Add base components (Button, Input, Select, DropdownMenu, Skeleton) to `src/components/ui`. Ensure they consume the design tokens defined in Epic 3.
  - **Dependencies**: T003, T004
  - **Estimated effort**: M
  - **Priority**: High
  - **Deliverables**: `components.json` and base components in `src/components/ui`.
  - **Acceptance criteria**: Components are imported and render correctly.
  - **Definition of Done**: Components pass linting and type-checking.

## Epic 7: Mock Data Layer

- [x] **T009: Implement Abstracted Fetch Client**
  - **Objective**: Abstract HTTP calls to support seamless mock injection.
  - **Description**: Create an HTTP client wrapper using native `fetch` in `src/lib/api-client.ts`. Add a mechanism to intercept and return delayed mock JSON data when `NEXT_PUBLIC_MOCK=true`, skipping actual network requests.
  - **Dependencies**: T001
  - **Estimated effort**: M
  - **Priority**: High
  - **Deliverables**: `api-client.ts` utility.
  - **Acceptance criteria**: Calling the client with `MOCK=true` returns mock data; otherwise, it executes `fetch`.
  - **Definition of Done**: The client is strongly typed and handles basic error responses.

## Epic 8: TanStack Query Integration

- [x] **T010: Configure React Query Provider**
  - **Objective**: Enable server-state management.
  - **Description**: Install `@tanstack/react-query`. Create a global query client provider and wrap the dashboard shell/app. Configure sensible defaults (staleTime, gcTime).
  - **Dependencies**: T001
  - **Estimated effort**: S
  - **Priority**: High
  - **Deliverables**: QueryProvider component.
  - **Acceptance criteria**: `useQuery` hooks function without context errors.
  - **Definition of Done**: Provider is integrated into the Next.js layout without hydration warnings.

## Epic 9: Generic DataTable System

- [x] **T011: Implement URL State Sync with nuqs**
  - **Objective**: Bind table state (pagination, sorting, filters) to URL parameters.
  - **Description**: Set up `nuqs` library. Create generic hooks to parse and serialize table state parameters (page, pageSize, sort, filters) into the URL without triggering full page reloads.
  - **Dependencies**: T001
  - **Estimated effort**: M
  - **Priority**: High
  - **Deliverables**: URL state management hooks.
  - **Acceptance criteria**: Modifying state immediately reflects in URL search params.
  - **Definition of Done**: Deep linking with specific params accurately hydrates the state.

- [x] **T012: Build Generic DataTable Component**
  - **Objective**: Provide a highly reusable data table.
  - **Description**: Implement a generic DataTable component using `@tanstack/react-table` in `src/components/data-table/`. Support server-side pagination, column sorting, and faceted filtering. Connect to the URL state hooks (T011).
  - **Dependencies**: T008, T011
  - **Estimated effort**: L
  - **Priority**: Critical
  - **Deliverables**: `DataTable`, `DataTablePagination`, `DataTableToolbar` components.
  - **Acceptance criteria**: Renders tabular data, handles loading/error states, and updates URL state on interaction.
  - **Definition of Done**: Component is typed generically to accept any data shape and column definition.

## Epic 10: UI State Management

- [x] **T013: Setup Zustand for Global UI State**
  - **Objective**: Manage ephemeral client-side preferences.
  - **Description**: Create a Zustand store in `src/stores/ui-store.ts` to manage the sidebar toggle state (collapsed/expanded). Integrate `next-themes` for system preference dark/light mode.
  - **Dependencies**: T007
  - **Estimated effort**: S
  - **Priority**: Medium
  - **Deliverables**: `ui-store.ts` and theme provider.
  - **Acceptance criteria**: Sidebar collapse state persists or updates instantly. Theme respects system defaults on first load.
  - **Definition of Done**: UI components react accurately to store changes.

## Epic 11: Integration & Validation

- [x] **T014: Validation - RTL/LTR and Layout**
  - **Objective**: Verify design system robustness.
  - **Description**: Manually and programmatically verify that all components and layouts automatically switch directionality when Arabic is selected. Ensure no layout breakage on mobile.
  - **Dependencies**: T005, T007, T008, T012
  - **Estimated effort**: S
  - **Priority**: High
  - **Deliverables**: Validation report.
  - **Acceptance criteria**: All UI elements respect logical direction.
  - **Definition of Done**: Verification complete and any regressions fixed.

- [x] **T015: Validation - Accessibility and Tooling**
  - **Objective**: Ensure compliance with accessibility and code quality standards.
  - **Description**: Run axe-core or Lighthouse accessibility scans on the dashboard. Run full ESLint and TypeScript checks to confirm `any` and physical CSS properties are absent.
  - **Dependencies**: T002, T003, T008
  - **Estimated effort**: S
  - **Priority**: High
  - **Deliverables**: Scan results and linting logs.
  - **Acceptance criteria**: 0 a11y violations on core shell, 0 linting errors.
  - **Definition of Done**: All automated checks pass in CI or local equivalent.
