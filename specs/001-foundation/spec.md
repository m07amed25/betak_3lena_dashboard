# Feature Specification: Phase 0 (Foundation)

**Feature Branch**: `[001-foundation]`

**Created**: 2026-07-20

**Status**: Draft

**Input**: User description: "/speckit-specify Create a detailed functional specification for Phase 0 (Foundation) of a modern frontend admin dashboard built with Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, and next-intl..."

## Clarifications

### Session 2026-07-20

- Q: Which HTTP client should be used as the base for the API abstraction? → A: Native `fetch`
- Q: Which mocking approach should be implemented for the data layer? → A: Abstracted Fetch Client returning mocked JSON
- Q: How should URL search parameters be synchronized for the DataTable? → A: `nuqs` library
- Q: What is the expected visual structure for the Authentication layout shell? → A: Centered Card
- Q: How should the initial theme be determined for a first-time visitor? → A: System Preference (via `next-themes`)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Developer Setup and Project Architecture (Priority: P1)

As a developer, I need a strictly defined folder structure and tooling setup so that I can immediately start building business features without worrying about configuration or inconsistent patterns.

**Why this priority**: Essential prerequisite for any future development on the project.

**Independent Test**: Can be fully tested by verifying the project folder structure against the specification, ensuring ESLint/TypeScript configurations correctly flag violations (e.g., `any` types, physical CSS properties), and successfully compiling the project.

**Acceptance Scenarios**:

1. **Given** a newly cloned repository, **When** a developer runs the linting tools, **Then** the rules strictly enforce the use of logical CSS properties and prohibit the `any` type.
2. **Given** the source code directory, **When** a developer examines the structure, **Then** it strictly separates shared components, features, hooks, stores, and types according to feature-based organization.

---

### User Story 2 - Internationalization and Layout System (Priority: P1)

As a global user, I need the application to support both Arabic (RTL) and English (LTR) layouts perfectly, with a responsive dashboard shell.

**Why this priority**: Internationalization and layout are structural foundations that are extremely difficult to retrofit if not built first.

**Independent Test**: Can be fully tested by navigating through placeholder pages, toggling the language, and observing the layout direction and translations change seamlessly.

**Acceptance Scenarios**:

1. **Given** the dashboard shell, **When** the user switches the locale to Arabic, **Then** the layout switches to RTL, breadcrumbs mirror correctly, and all hardcoded strings translate to Arabic.
2. **Given** the dashboard shell on a mobile device, **When** the user views the application, **Then** the sidebar collapses into a hamburger menu and the layout adapts responsively.

---

### User Story 3 - Generic Data Table and Data Layer (Priority: P2)

As a developer, I need a fully featured, generic Data Table and data fetching abstraction so that I can rapidly build list views for different business modules.

**Why this priority**: List views are the most common interface in an admin dashboard; standardizing this accelerates all subsequent feature work.

**Independent Test**: Can be fully tested by rendering the generic DataTable component with mock data and interacting with its controls.

**Acceptance Scenarios**:

1. **Given** the generic DataTable rendered with mock data, **When** a user clicks to sort a column or change the page, **Then** the corresponding URL parameters update automatically and the table reflects the new state.
2. **Given** the TanStack Query setup, **When** replacing the mock handlers with real API endpoints in the future, **Then** the components using the queries require zero structural changes.

### Edge Cases

- What happens when a translation key is missing for a specific locale?
- How does the system handle hydration mismatches between server and client rendering in Next.js?
- What happens when URL parameters for the DataTable contain invalid or out-of-bounds values?
- How does the UI respond when a user's system preference conflicts with the stored theme preference?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST establish a feature-based folder structure under `src/` (e.g., `src/features`, `src/components/shared`).
- **FR-002**: System MUST configure ESLint and Prettier to enforce code quality, specifically banning the `any` type and physical Tailwind CSS direction classes (e.g., `ml-4` must be `ms-4`).
- **FR-003**: System MUST define a comprehensive set of design tokens (colors, spacing, typography) using CSS variables that support both light and dark themes.
- **FR-004**: System MUST implement internationalization using `next-intl` supporting Arabic (default) and English, ensuring every visible string is translatable.
- **FR-005**: System MUST provide a responsive dashboard shell layout including a collapsible sidebar, header, and dynamic breadcrumbs, as well as an authentication layout shell featuring a focused, centered card design.
- **FR-006**: System MUST implement a shared component library comprising generic, composable, and accessible UI elements built on shadcn/ui and the design tokens.
- **FR-007**: System MUST set up TanStack Query for server state management and establish an Abstracted Fetch Client mock data architecture based on native `fetch` that mirrors future API contracts.
- **FR-008**: System MUST provide a generic DataTable component supporting server-side pagination, filtering, sorting, searching, faceted filtering, column visibility, and URL-synchronized state via the `nuqs` library.
- **FR-009**: System MUST restrict Zustand usage strictly to global UI state (e.g., sidebar toggle, theme, locale) and NEVER store server data.

### Key Entities

_(No business data entities are introduced in Phase 0; however, foundational configuration abstractions apply.)_

- **ThemeConfig**: CSS variables defining the design system tokens.
- **LocaleConfig**: Namespaces and dictionaries for next-intl.
- **TableState**: Interface mapping URL parameters to sorting, pagination, and filtering states for the generic DataTable.

## Technical Requirements & Design _(mandatory)_

### UI & Layout

- **Page Layout**: A primary dashboard shell consisting of a side navigation menu (sidebar) and a top header containing user profile, theme toggle, and locale switcher. The authentication layout shell features a focused, centered card design.
- **Theme Support**: The initial theme for a first-time visitor is determined by their System Preference (implemented via `next-themes`).
- **Responsive Behavior**: Sidebar becomes an off-canvas drawer on mobile/tablet. Content areas use fluid widths bounded by a maximum width.
- **Loading States**: Global route transition loaders and localized skeleton loaders for components (specifically the generic DataTable) when data is fetching.
- **Error States**: Global error boundaries and localized error states for failed data fetches (e.g., in TanStack Query).

### Architecture

- **Component Breakdown**:
  - `components/ui`: Primitive shadcn/ui components.
  - `components/layout`: Shell, Sidebar, Header, Breadcrumbs.
  - `components/data-table`: Generic DataTable, Pagination, Toolbar.
- **State Management**:
  - **Zustand**: Local UI preferences (sidebar state, theme).
  - **TanStack Query**: Server state and caching abstraction.
  - **URL State**: Source of truth for all filtering, sorting, and pagination logic, managed via the `nuqs` library.
- **API Integration Requirements**: Abstracted Fetch Client built on native `fetch` that directly returns delayed mock JSON when mocking is enabled. This skips HTTP interception entirely to ensure 100% reliability with React Server Components, designed to be swapped seamlessly with real API endpoints later.

### Quality

- **Accessibility Notes**: All components must comply with WCAG 2.1 AA. The generic DataTable must support keyboard navigation (tabbing through rows/actions) and screen reader announcements for sorting/filtering changes.
- **Performance**: Ensure minimal client-side JavaScript by leveraging React 19 Server Components where appropriate.
- **Security**: Base security headers in Next.js config; frontend routes prepared for middleware-based route guards.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: The application renders a fully functional dashboard shell layout with placeholder pages and 0 console errors.
- **SC-002**: Locale switching instantly toggles between Arabic (RTL) and English (LTR) layouts without layout breaks or untranslated fallback strings.
- **SC-003**: The generic DataTable operates end-to-end with mock data, successfully updating the URL query parameters on every pagination, sort, or filter interaction.
- **SC-004**: CI/CD linting checks pass with 100% compliance on the prohibition of physical CSS direction properties and the `any` TypeScript type.
- **SC-005**: All shared UI components consistently consume design tokens via CSS variables rather than hardcoded hex codes or pixel values.
- **SC-006**: The project can be handed off to product developers to begin Phase 1 business logic without requiring architectural refactoring.

## Assumptions

- No backend APIs or databases exist yet; all data layer work is strictly mock-based.
- Arabic is the default locale and RTL is the primary design orientation.
- All subsequent feature phases will strictly adhere to the foundations laid out in this specification.
