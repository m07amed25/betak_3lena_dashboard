# Phases.md — Betak-Alena Dashboard Implementation Phases

```
Document   : Implementation Phases
Source     : AGENTS.md §16 Roadmap + Engineering Guideline v1.0
Project    : betak-alena-dashboard (Next.js 16 + Tailwind v4 + shadcn Base UI)
Current    : Bare scaffold — only Button component installed, no i18n, no auth, no routing
Updated    : 2026-07-20
Strategy   : Static data first — all phases use mock/seed data, real API integration is Phase 9
```

> **Data strategy:** Every phase uses static mock data (`src/mocks/`). Components
> consume data through typed hooks that return the same shape the real API will.
> When the backend is ready, Phase 9 swaps the mock implementations for real
> `axios` calls — zero component changes needed.

> Each phase is a standalone branch (`phase-0/foundation`, `phase-1/auth-rbac`, etc.)
> merged into `develop` once it passes the Definition of Done (AGENTS.md §15).
> Sub-tasks within each phase can be individual PRs when they're large enough.

---

## Phase 0 — Foundation

**Branch:** `phase-0/foundation`
**Goal:** Establish every shared piece that all future phases depend on — design system, i18n, layout shell, reusable components, API client, ESLint rules.
**Est:** 2 weeks

### 0.1 — Project Structure & Config

- [ ] Restructure into `src/` directory per AGENTS.md §2
- [ ] Move `app/`, `components/`, `lib/` under `src/`
- [ ] Create full directory skeleton: `features/`, `stores/`, `hooks/`, `i18n/`, `types/`, `mocks/`
- [ ] Update `tsconfig.json` path aliases (`@/` → `src/`)
- [ ] Update `components.json` aliases to match new paths
- [ ] Create `.env.example` with all expected env vars
- [ ] Set `strict: true` in TypeScript config
- [ ] Setup `prettier` + `prettier-plugin-tailwindcss`
- [ ] Setup `husky` + `lint-staged` + `commitlint` (conventional commits)
- [ ] Add ESLint deny-list rule for physical direction classes (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`, `text-right`, `border-l`, `border-r`, `rounded-l-*`)
- [ ] Add ESLint rule banning `any` type

### 0.2 — Design System Tokens

- [ ] Define full CSS variable palette in `globals.css` (§3.1): brand, surfaces, semantic colors, dark mode
- [ ] Setup `next/font/google`: Cairo/IBM Plex Sans Arabic (Arabic), Inter (English)
- [ ] Configure per-locale font loading — don't load both on every page
- [ ] Define typography scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 px
- [ ] Define spacing conventions (4px base unit)
- [ ] Sidebar dimensions: 260px expanded, 64px collapsed

### 0.3 — Internationalization (next-intl)

- [ ] Install `next-intl`
- [ ] Setup `[locale]` routing (`/ar/...`, `/en/...`)
- [ ] Create `i18n/routing.ts` and `i18n/request.ts`
- [ ] Create initial `i18n/messages/ar.json` and `i18n/messages/en.json` with `common` namespace
- [ ] Create root `[locale]/layout.tsx` with `<html lang={locale} dir={...}>`
- [ ] Add RTL/LTR `dir` attribute based on locale
- [ ] Setup `middleware.ts` for locale detection and redirect

### 0.4 — shadcn Primitives

- [ ] Install all required shadcn primitives (§3.5): Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Label, Badge, Avatar, Separator, Skeleton, Tooltip, Popover, Dropdown Menu, Dialog, Sheet, Alert Dialog, Tabs, Accordion, Card, Table, Pagination, Calendar, Command, Sonner
- [ ] Audit every installed component for physical direction classes → convert to logical
- [ ] Audit for hardcoded colors → replace with CSS variables
- [ ] Audit for hardcoded strings → prepare for `t()` where applicable

### 0.5 — Layout Shell

- [ ] Install shadcn `sidebar-07` block (collapsible icon sidebar)
- [ ] Build `components/layout/AppSidebar` with full module navigation
  - Sidebar links: Overview, Requests, Technicians, Clients, Categories, Approvals, Support, Moderation, Payments, Accounting, Analytics, Admins, Settings
  - Collapsible with 260px → 64px toggle
  - All labels via `t()`, all icons from lucide-react
  - RTL: collapse icon flips via `rtl:rotate-180`
- [ ] Build `components/layout/Header` — breadcrumbs, locale switcher, user menu, notification bell placeholder
- [ ] Build `components/layout/Breadcrumbs` — auto-generated from route segments
- [ ] Create `(dashboard)/layout.tsx` — sidebar + header shell
- [ ] Create `(auth)/layout.tsx` — centered card layout, no sidebar
- [ ] Verify sidebar + header render correctly in both AR and EN / RTL and LTR

### 0.6 — Shared Components (First Batch)

- [ ] `components/shared/StatusBadge` — reads from `lib/constants.ts` status color map
- [ ] `components/shared/EmptyState` — icon, title, description, action button
- [ ] `components/shared/ConfirmDialog` — standard + typed confirmation variants
- [ ] `components/shared/PageHeader` — title, description, action buttons slot
- [ ] `components/shared/MoneyDisplay` — locale-aware currency formatter (no math, display only)
- [ ] `components/shared/PermissionGate` — conditionally renders children based on `usePermission()`

### 0.7 — Mock Data Layer & TanStack Query

- [ ] Install `@tanstack/react-query`, `@faker-js/faker`
- [ ] Create TanStack Query provider wrapping the dashboard layout
- [ ] Create `lib/format.ts` — currency, date, number formatters (locale-aware, `numberingSystem: 'latn'`)
- [ ] Create `lib/constants.ts` — `REQUEST_STATUS`, `TECHNICIAN_LEVEL`, `PAYMENT_METHOD`, etc.
- [ ] Create `mocks/` directory with the following structure:
  ```
  src/mocks/
  ├── data/                    # Static seed data files
  │   ├── admins.ts
  │   ├── requests.ts
  │   ├── technicians.ts
  │   ├── clients.ts
  │   ├── categories.ts
  │   ├── approvals.ts
  │   ├── support-tickets.ts
  │   ├── moderation-flags.ts
  │   ├── payments.ts
  │   ├── transactions.ts
  │   └── analytics.ts
  ├── handlers/                # Mock query/mutation functions
  │   └── (mirrors features/*/api.ts interface)
  └── utils.ts                 # Simulated delay, paginate, filter, sort helpers
  ```
- [ ] `mocks/utils.ts` — helper functions:
  - `simulateDelay(ms?)` — adds realistic latency (200–600ms) to mock responses
  - `paginateMockData(data, page, limit)` — returns `{ data, meta }` matching §6.4 response shape
  - `filterMockData(data, filters)` — client-side filter/search/sort that mimics server-side behavior
  - `generateAggregations(data, field)` — generates faceted counts for faceted filters
- [ ] Each mock data file exports typed arrays using `@faker-js/faker` for realistic Arabic + English names, phones, dates, amounts
- [ ] Mock handlers return the exact `{ data, meta, aggregations }` shape from §6.4 — so swapping to real API later requires zero component changes

### 0.8 — DataTable System

- [ ] Install `@tanstack/react-table` v8
- [ ] Build `components/data-table/DataTable` — generic, headless, server-side pagination/sort/filter
- [ ] Build `components/data-table/DataTableToolbar` — search input, faceted filters, date range, column visibility, density toggle
- [ ] Build `components/data-table/DataTableFacetedFilter` — multi-select facet with counts from aggregations
- [ ] Build `components/data-table/DataTablePagination` — page size selector, page info, navigation
- [ ] Build `components/forms/DateRangePicker` — date range filter component
- [ ] Implement URL-based filter state (query params sync via `useSearchParams`)
- [ ] Verify DataTable renders correctly in RTL
- [ ] Verify all filters sync to URL and survive page refresh

### 0.9 — Zustand Stores (UI Only)

- [ ] Create `stores/ui-store.ts` — sidebar open/closed, theme (light/dark), locale
- [ ] Verify: no API data is cached in Zustand (hard rule #1)

### Phase 0 Deliverable

> A fully functional, empty shell: sidebar navigates between placeholder pages,
> every page shows `PageHeader` + empty `DataTable`, locale switching works,
> RTL renders correctly, all design tokens applied, ESLint rules enforce conventions.

---

## Phase 1 — Authentication & RBAC

**Branch:** `phase-1/auth-rbac`
**Depends on:** Phase 0
**Goal:** Login flow, session management, role-based route guards, admin management screen.
**Est:** 2 weeks

> **Mock strategy:** Auth uses local mock users defined in `mocks/data/admins.ts`.
> Auth.js Credentials provider validates against this static list. No real backend
> needed — swap the `authorize()` function in Phase 9.

### 1.1 — Auth.js Setup (Mock Backend)

- [ ] Install `next-auth@beta` (v5)
- [ ] Create `auth.ts` at project root — Credentials provider, JWT strategy, 8h session
- [ ] Create `app/api/auth/[...nextauth]/route.ts` handler
- [ ] Create `features/auth/schema.ts` — `loginSchema` (email, password, optional OTP) with zod
- [ ] Create `mocks/data/admins.ts` — static list of admin users with different roles:
  - `admin@betak.com` / `password` → `super_admin` (all permissions)
  - `ops@betak.com` / `password` → `operations_manager`
  - `support@betak.com` / `password` → `support_agent`
  - `mod@betak.com` / `password` → `moderator`
  - `finance@betak.com` / `password` → `accountant`
  - `viewer@betak.com` / `password` → `viewer`
- [ ] Credentials provider `authorize()` validates against mock admins list (matches email + password, returns user with role + permissions)
- [ ] JWT callback: store `role`, `permissions` (no real tokens needed yet)
- [ ] Session callback: expose `role`, `permissions` to client
- [ ] Create `.env.example` update: `AUTH_SECRET`, `AUTH_URL`

### 1.2 — Login Page

- [ ] Create `(auth)/login/page.tsx`
- [ ] Install shadcn `login-04` block, adapt to design tokens + i18n + RTL
- [ ] Email + password form with zod validation via `react-hook-form`
- [ ] Install `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] Error handling: invalid credentials, rate-limited, account locked
- [ ] Loading state during auth
- [ ] Redirect to dashboard on success
- [ ] All strings via `t()` — both AR and EN

### 1.3 — Forgot Password (UI Only)

- [ ] Create `(auth)/forgot-password/page.tsx`
- [ ] Email input → shows success toast (mock — no real email sent)
- [ ] Success / error states, all translated

### 1.4 — Middleware Guards

- [ ] Extend `middleware.ts`: check session, redirect unauthenticated to `/login`
- [ ] Add route-level permission map (`ROUTE_PERMISSIONS` in §7.3)
- [ ] Redirect unauthorized to `/403` page
- [ ] Create `/403` forbidden page

### 1.5 — RBAC Helpers

- [ ] Create `lib/permissions.ts` — `hasPermission()`, `usePermission()` hook
- [ ] Wire `PermissionGate` component (from Phase 0) to real session data
- [ ] Test: sidebar hides links the user can't access

### 1.6 — Admin Management Screen

- [ ] Create `(dashboard)/admins/page.tsx` — list of admin users with DataTable
- [ ] `features/admins/` — `api.ts` (reads from `mocks/data/admins.ts`), `hooks.ts`, `schema.ts`, `types.ts`, `columns.tsx`
- [ ] Create admin form: name, email, role selector, status
- [ ] Permission: `admins:manage` required
- [ ] Rule: user cannot edit their own role (hard rule #11)
- [ ] Rule: block deletion/demotion of last `super_admin` (hard rule #11)
- [ ] Invite flow: create admin → mock success toast (no real email)

### 1.7 — Roles & Permissions Screen

- [ ] Create `(dashboard)/admins/roles/page.tsx`
- [ ] Checkbox grid: resources × actions (permission matrix)
- [ ] Default roles pre-populated but editable (§7.2)
- [ ] Create/edit/delete custom roles
- [ ] All changes logged in mock audit trail (local state)

### 1.8 — Audit Log Viewer

- [ ] Create `components/shared/AuditTrail` — timeline of actions on an entity
- [ ] Create basic audit log list page: `(dashboard)/admins/audit-log/page.tsx`
- [ ] Filters: actor, action type, entity type, date range

### Phase 1 Deliverable

> Users can log in, sessions are managed, routes are guarded by permissions,
> Super Admin can create/manage other admins and configure roles.

---

## Phase 2 — Core Operations

**Branch:** `phase-2/core-ops`
**Depends on:** Phase 1
**Goal:** Full CRUD for the four core entities: Requests, Technicians, Clients, Categories & Services.
**Est:** 3 weeks

> **Mock strategy:** Each module's `api.ts` imports from `mocks/data/` and uses
> `mocks/utils.ts` helpers (paginate, filter, sort, delay). Mutations update
> in-memory arrays and trigger TanStack Query invalidation — same flow as real API.

### 2.1 — Requests Module

- [ ] Create `mocks/data/requests.ts` — 50+ realistic mock requests with varied statuses, categories, cities, payment methods
- [ ] Create `features/requests/` — `api.ts` (mock), `hooks.ts`, `schema.ts`, `types.ts`, `columns.tsx`
- [ ] Query key factory: `requestKeys` (§6.8)
- [ ] List page: `(dashboard)/requests/page.tsx`
  - Client-side filtering on mock data mimicking server-side: text search (ID, client name, phone), status facet, category facet, city, technician level, payment method, date range (created/completed)
  - Bulk select + bulk actions (assign, cancel) — mutate in-memory mock data
  - Export to CSV/Excel
- [ ] Detail page: `(dashboard)/requests/[id]/page.tsx`
  - Full request info, timeline, assigned technician, client info, payment details
  - Status transitions (assign → in_progress → completed / cancelled / disputed)
  - `AuditTrail` component showing history
- [ ] Create `components/shared/TechnicianLevelBadge` — Bronze/Silver/Gold/Platinum with appropriate colors
- [ ] All statuses rendered via `StatusBadge` reading from `REQUEST_STATUS` constants
- [ ] Permissions: `requests:read`, `requests:update`, `requests:assign`, `requests:delete`

### 2.2 — Technicians Module

- [ ] Create `mocks/data/technicians.ts` — 30+ mock technicians across all levels (Bronze→Platinum), varied categories/cities
- [ ] Create `features/technicians/` — full feature scaffold
- [ ] List page: `(dashboard)/technicians/page.tsx`
  - Filters: name, phone, ID, status, level, category, city, approval state, rating band, join date range
  - Level badge column
  - Rating display
- [ ] Detail page: `(dashboard)/technicians/[id]/page.tsx`
  - Profile info, documents, level history, completed jobs, ratings, earnings summary
  - Actions: approve, suspend, update level, update categories
  - `AuditTrail` for this technician
- [ ] Edit form: personal info, categories, service areas
- [ ] Permissions: `technicians:read`, `technicians:update`, `technicians:approve`, `technicians:update_level`

### 2.3 — Clients Module

- [ ] Create `mocks/data/clients.ts` — 40+ mock clients with varied statuses, cities, order counts
- [ ] Create `features/clients/` — full feature scaffold
- [ ] List page: `(dashboard)/clients/page.tsx`
  - Filters: name, phone, email, status, city, has-orders, join date range
- [ ] Detail page: `(dashboard)/clients/[id]/page.tsx`
  - Profile, order history, support tickets, moderation flags
  - Actions: suspend, reactivate
  - `AuditTrail` for this client
- [ ] Permissions: `clients:read`, `clients:update`

### 2.4 — Categories & Services Module

- [ ] Create `mocks/data/categories.ts` — 10+ categories (plumbing, electrical, HVAC, painting, etc.) with parent→child hierarchy and services
- [ ] Create `features/categories/` — full feature scaffold
- [ ] List page: `(dashboard)/categories/page.tsx`
  - Filters: name AR/EN, active status, parent category
  - Tree/hierarchical display for parent → child categories
- [ ] Create/edit form: `name_ar`, `name_en`, icon, parent category, active toggle, commission rate override
- [ ] Services within a category — sub-table or nested accordion
- [ ] Destructive action: deleting a category with active requests requires typed confirmation (hard rule #12)
- [ ] Soft delete only (hard rule #13)
- [ ] Permissions: `categories:read`, `categories:create`, `categories:update`, `categories:delete`

### Phase 2 Deliverable

> All four core entity modules have full CRUD with mock data, client-side filtering
> mimicking server-side via URL state, permission gates, AR/EN translations,
> RTL-correct layouts, export capability. Ready to swap to real API in Phase 9.

---

## Phase 3 — Approvals & Technical Support

**Branch:** `phase-3/approvals-support`
**Depends on:** Phase 2
**Goal:** KYC approval queue for technicians/clients, document review, and the support ticket system.
**Est:** 2 weeks

> **Mock strategy:** `mocks/data/approvals.ts` and `mocks/data/support-tickets.ts`
> provide seed data. File uploads use local blob URLs (no S3) until Phase 9.

### 3.1 — Approvals Module

- [ ] Create `features/approvals/` — full feature scaffold
- [ ] List page: `(dashboard)/approvals/page.tsx`
  - Queue sorted by submission date
  - Filters: applicant name, type (technician/client), document type, state, submitted date range
  - Faceted counts for pending/approved/rejected
- [ ] Review page: `(dashboard)/approvals/[id]/page.tsx`
  - Document viewer (ID, license, certificates) — images + PDF preview
  - Install `react-dropzone` for future file upload needs
  - Side-by-side: submitted docs vs. profile data
  - Actions: approve, reject (with reason), request re-upload
  - Approval history / `AuditTrail`
- [ ] Bulk approval for straightforward cases
- [ ] Permissions: `approvals:read`, `approvals:approve`, `approvals:reject`

### 3.2 — File Upload Component

- [ ] Build `components/forms/FileUploader` — drag-and-drop with `react-dropzone`
- [ ] Mock upload: accept file, create local blob URL, show preview (no S3 yet — wired in Phase 9)
- [ ] File type validation, size limits, progress indicator (simulated progress bar)
- [ ] Preview for images, PDF icon for documents

### 3.3 — Technical Support Module

- [ ] Create `features/support/` — full feature scaffold
- [ ] List page: `(dashboard)/support/page.tsx`
  - Filters: ticket ID, subject, status, priority, assigned agent, source (client/tech), opened/resolved date range
  - Priority-based color coding
- [ ] Detail page: `(dashboard)/support/[id]/page.tsx`
  - Ticket info, conversation thread, linked request/user
  - Reply form, internal notes, file attachments
  - Status transitions: open → in_progress → waiting → resolved → closed
  - Assign/reassign to agent
  - `AuditTrail`
- [ ] Permissions: `support:read`, `support:create`, `support:update`, `support:assign`

### Phase 3 Deliverable

> Moderators can process the KYC approval queue, review documents, and
> support agents can manage the full ticket lifecycle.

---

## Phase 4 — Payments & Accounting

**Branch:** `phase-4/payments-accounting`
**Depends on:** Phase 2
**Goal:** Transaction ledger, commission configuration, technician payouts, invoices, reconciliation.
**Est:** 3 weeks

> **Mock strategy:** `mocks/data/payments.ts` and `mocks/data/transactions.ts`
> provide a realistic ledger with varied commission sources, cash vs card payments,
> and settlement statuses. All amounts are pre-computed in mock data — no frontend math.

### 4.1 — Payments Module

- [ ] Create `features/payments/` — full feature scaffold
- [ ] List page: `(dashboard)/payments/page.tsx`
  - Filters: txn ID, reference, payment method, status, gateway, currency, date range
  - `MoneyDisplay` for all amounts — no `parseFloat`, no rounding (hard rule #9)
  - Export to CSV/Excel
- [ ] Detail page: `(dashboard)/payments/[id]/page.tsx`
  - Full transaction details, linked request, gateway response
- [ ] Permissions: `payments:read`, `payments:update`

### 4.2 — Accounting — Financial Overview

- [ ] Create `features/accounting/` — full feature scaffold
- [ ] Financial overview page: `(dashboard)/accounting/page.tsx`
  - KPI cards: gross revenue, platform commission, payouts pending, outstanding settlements
  - All amounts rendered via `MoneyDisplay` — no frontend math
- [ ] Permissions: `accounting:read`

### 4.3 — Accounting — Transaction Ledger

- [ ] Transaction list page: `(dashboard)/accounting/transactions/page.tsx`
  - Full ledger per §9.3: request_id, gross_amount, commission_rate, commission_rate_source, commission_amount, tax, gateway fee, technician_net, payment_method, settlement_status
  - Immutable entries — corrections are reversing entries, not edits (§9.5)
  - Cash payment inversion highlighted (§9.3) — technician debt surfaced clearly
  - Export to Excel/CSV with audit logging of who exported what

### 4.4 — Accounting — Commission Settings

- [ ] Commission settings page: `(dashboard)/accounting/commission/page.tsx`
  - Precedence display: promo → technician-specific → level → category → global default (§9.2)
  - Models: percentage, fixed fee, percentage with min/max cap, tiered
  - Effective dates — never mutate past rates
  - History of rate changes

### 4.5 — Accounting — Technician Payouts

- [ ] Payouts page: `(dashboard)/accounting/payouts/page.tsx`
  - Technician balances, batch generation, payout history
  - Configurable payout schedule and minimum threshold (read from Settings)
  - Cash-debt technicians flagged prominently

### 4.6 — Accounting — Invoices

- [ ] Invoices page: `(dashboard)/accounting/invoices/page.tsx`
  - Sequential invoice numbering, tax-compliant
  - Install `@react-pdf/renderer` for client-side PDF generation
  - PDF preview and download
  - Invoice list with filters

### 4.7 — Accounting — Reconciliation

- [ ] Reconciliation page: `(dashboard)/accounting/reconciliation/page.tsx`
  - Gateway vs internal ledger comparison
  - Mismatch flagging and resolution workflow

### 4.8 — Accounting — Reports

- [ ] Reports page: `(dashboard)/accounting/reports/page.tsx`
  - Pre-built reports: revenue, commissions, payouts, taxes
  - Date range selection, export
  - Scheduled report delivery configuration (email, managed by backend)

### Phase 4 Deliverable

> Finance team can view the full transaction ledger, configure commissions,
> manage payouts, generate invoices, reconcile with payment gateways, and export reports.
> All running on mock data. Zero frontend money math. Amounts are display-only.

---

## Phase 5 — AI Chat Moderation

**Branch:** `phase-5/ai-moderation`
**Depends on:** Phase 2
**Goal:** Moderation review queue, chat viewer with flagged spans, moderator actions, metrics.
**Est:** 2 weeks

> **Mock strategy:** `mocks/data/moderation-flags.ts` provides sample chat threads
> with pre-flagged messages, varied violation types, confidence scores, and evidence spans.

### 5.1 — Moderation Review Queue

- [ ] Create `features/moderation/` — full feature scaffold
- [ ] List page: `(dashboard)/moderation/page.tsx`
  - Queue sorted by severity × confidence
  - Filters: chat ID, participant, violation type, severity, action taken, AI confidence band, flagged date range
  - Faceted counts by severity and violation type
  - Color-coded rows by severity

### 5.2 — Chat Review Detail

- [ ] Detail page: `(dashboard)/moderation/[id]/page.tsx`
  - Full chat thread rendered with the flagged span highlighted in context
  - Violation response data: type, severity, confidence, evidence, explanation (§10.2)
  - Participant history panel: prior violations, ratings, completed jobs, revenue contribution

### 5.3 — Moderator Actions

- [ ] Action panel: dismiss (false positive) / warn / suspend N days / ban / escalate
- [ ] Every action requires `ConfirmDialog` — ban/suspend require typed confirmation
- [ ] **No auto-ban/auto-suspend from AI score** (hard rule #14) — every punitive action is a deliberate human click
- [ ] All actions logged to audit trail

### 5.4 — Moderation Metrics

- [ ] Metrics dashboard (sub-page or tab): `(dashboard)/moderation/metrics/page.tsx`
  - Violations by type over time (line chart)
  - AI confidence distribution (histogram)
  - False-positive rate after human review
  - Repeat offenders list
  - Revenue at risk from flagged users

### Phase 5 Deliverable

> Moderators can review AI-flagged conversations, see full context,
> take human-decided actions, and track moderation quality metrics.

---

## Phase 6 — Analytics & Dashboard Overview

**Branch:** `phase-6/analytics`
**Depends on:** Phases 2–5 (data from all modules)
**Goal:** KPI overview dashboard, all charts, analytics deep-dives, chart exports.
**Est:** 2 weeks

> **Mock strategy:** `mocks/data/analytics.ts` provides pre-aggregated time-series
> data, KPI snapshots, and chart datasets. Charts render real visualizations from
> static data — same component code works when backend endpoints go live.

### 6.1 — Chart Components

- [ ] Install shadcn `chart` wrapper (Recharts)
- [ ] Build `components/charts/ChartWrapper` — handles RTL axis flipping (X reversed, Y to right), theme colors, loading/empty/error states
- [ ] Build `components/charts/AreaChartCard`
- [ ] Build `components/charts/BarChartCard`
- [ ] Build `components/charts/PieChartCard`
- [ ] Build `components/charts/LineChartCard`
- [ ] Build `components/charts/SparklineStat` — mini sparkline for StatCards
- [ ] All charts: colorblind-safe palette, locale-aware formatting, exportable to PNG + CSV

### 6.2 — Overview Dashboard

- [ ] `(dashboard)/page.tsx` — the main overview
- [ ] KPI row with `StatCard` + sparkline + % vs previous period:
  - Total Requests, Completed Requests, Active Technicians, Gross Revenue, Platform Commission, Avg. Completion Time, Avg. Rating, Open Disputes
- [ ] Charts (§8.2):
  - Revenue & Commission over time (Stacked Area)
  - Requests by status (Donut)
  - Requests by category (Horizontal Bar, top 10)
  - Technician distribution by level (Bar)
  - Requests by city (Bar)
  - Peak request hours (Heatmap: day × hour)
  - Payment method split (Pie)
  - New users vs new technicians (Line, dual series)
- [ ] Global date range filter affecting all charts
- [ ] All charts dynamically imported: `dynamic(() => import('./RevenueChart'), { ssr: false })`

### 6.3 — Analytics Deep-Dive Page

- [ ] `(dashboard)/analytics/page.tsx`
- [ ] Module-specific chart tabs (§8.3):
  - **Accounting:** commission by category, monthly revenue vs payouts, outstanding settlements aging, top 20 technicians by revenue
  - **Moderation:** violations over time by type, AI confidence distribution, false-positive rate, repeat offenders
  - **Support:** tickets opened vs resolved, avg. first-response/resolution time, tickets by category, agent workload
  - **Technicians:** acceptance rate, cancellation rate, rating trend, level progression funnel
- [ ] Permissions: `analytics:read`

### 6.4 — StatCard Component

- [ ] Build `components/charts/StatCard` — metric value, label, sparkline, trend (% up/down vs previous period)
- [ ] Loading skeleton matching layout

### Phase 6 Deliverable

> A rich, chart-filled overview dashboard and analytics section.
> All charts respect RTL, global date range, theme, and are exportable.

---

## Phase 7 — Settings & Realtime

**Branch:** `phase-7/settings-realtime`
**Depends on:** Phase 4
**Goal:** System-wide settings, notification templates, and realtime updates.
**Est:** 1.5 weeks

> **Mock strategy:** Settings read/write to Zustand + localStorage. Realtime is
> simulated with `setInterval` generating fake events. Real socket.io connection
> is wired in Phase 9.

### 7.1 — Settings Module

- [ ] Create `features/settings/` — full feature scaffold
- [ ] `(dashboard)/settings/page.tsx` — tabbed settings layout:
  - **General:** platform name, logo, default locale, timezone
  - **Commission:** link to accounting commission settings
  - **Payouts:** schedule, minimum threshold
  - **Notifications:** template management (channel-agnostic per §17.9)
  - **Security:** session duration, 2FA enforcement rules, password policy
- [ ] Permissions: `settings:read`, `settings:update`

### 7.2 — Realtime Updates (Simulated)

- [ ] Create realtime event system abstraction (`lib/realtime.ts`) — interface that both mock and real implementations satisfy
- [ ] Mock implementation: `setInterval` emitting random events every 15–30 seconds
- [ ] Live updates for:
  - New request created → notification bell + optional table refresh
  - Request status change → update in-view data
  - New support ticket → notification for assigned agent
  - New moderation flag → notification for moderators
- [ ] Notification bell in header with unread count and dropdown
- [ ] Real `socket.io-client` connection wired in Phase 9

### 7.3 — Command Palette

- [ ] Build command palette using shadcn `Command` (`cmdk`)
- [ ] Quick navigation to any module
- [ ] Quick search across entities (requests, technicians, clients)
- [ ] Keyboard shortcut: `Ctrl+K` / `⌘+K`

### Phase 7 Deliverable

> Settings are configurable from the dashboard, realtime events push
> to the UI, and power users can navigate instantly via command palette.

---

## Phase 8 — Hardening & Polish

**Branch:** `phase-8/hardening` (or split into `phase-8a/testing`, `phase-8b/a11y`, etc.)
**Depends on:** All previous phases (0–7)
**Goal:** Testing, accessibility, RTL audit, performance optimization, security review, documentation.
**Est:** 2 weeks

> All tests in this phase run against mock data. E2E tests will be re-validated
> against the real backend after Phase 9.

### 8.1 — Testing

- [ ] Install `vitest` + `@testing-library/react` + `playwright`
- [ ] Unit tests for:
  - Permission helpers (`lib/permissions.ts`)
  - Formatters (`lib/format.ts`)
  - Zod schemas (all `features/*/schema.ts`)
  - Zustand stores
- [ ] Integration tests for DataTable filter ↔ URL sync
- [ ] E2E tests (Playwright) for happy paths:
  - Login → dashboard → navigate modules
  - Create/edit/delete a request
  - Approve a technician
  - Filter and export a table
  - Role-based access (admin vs viewer)

### 8.2 — Accessibility Audit

- [ ] Keyboard navigation on every page — focus visible, tab order logical
- [ ] Screen-reader labels on all interactive elements
- [ ] ARIA attributes on DataTable, charts, modals
- [ ] Color contrast check (WCAG AA minimum)
- [ ] Focus trap in modals/dialogs

### 8.3 — RTL Audit

- [ ] Visual review of every page in Arabic — layout, alignment, icons, charts
- [ ] Verify no physical direction classes leaked through
- [ ] Charts render with reversed X axis and Y on right
- [ ] Breadcrumb separator chevrons flip correctly
- [ ] Sidebar collapse icon flips

### 8.4 — Performance Optimization

- [ ] `@next/bundle-analyzer` — verify < 200 kB first-load JS per route
- [ ] Code-split all chart components (dynamic import, `ssr: false`)
- [ ] Install `@tanstack/react-virtual` for tables > 100 rows
- [ ] `next/image` with explicit dimensions on all images
- [ ] Prefetch on hover for table row → detail navigation
- [ ] Skeleton loaders (not spinners) on every async surface
- [ ] Font subsetting — Arabic only subset, `display: swap`

### 8.5 — Security Review

- [ ] No secrets in `NEXT_PUBLIC_*` variables
- [ ] `httpOnly` + `secure` + `sameSite=lax` cookies
- [ ] Verify rate limiting on login (backend, but test from UI)
- [ ] Verify 2FA enforcement for `super_admin` and `accountant`
- [ ] No `console.log` in committed code
- [ ] CSRF protection via Auth.js

### 8.6 — Documentation

- [ ] Update `README.md` — setup instructions, env vars, scripts
- [ ] Component storybook or documentation page (optional but recommended)
- [ ] Update `AGENTS.md` §14 if scripts differ from actual `package.json`

### Phase 8 Deliverable

> Dashboard is tested, accessible, RTL-correct, performant, and documented.
> All running on mock data. Ready for real API integration in Phase 9.

---

## Phase 9 — API Integration

**Branch:** `phase-9/api-integration`
**Depends on:** Phase 8 + Backend API available
**Goal:** Replace all mock data with real backend API calls. Zero component changes — only swap the data layer.
**Est:** 2–3 weeks

> This is where the mock abstraction pays off. Every `features/*/api.ts` currently
> imports from `mocks/`. This phase swaps those imports to real `axios` calls
> against the backend. Components and hooks don't change.

### 9.1 — API Client Setup

- [ ] Install `axios`
- [ ] Create `lib/api-client.ts` — axios instance with:
  - Base URL from `process.env.API_URL`
  - Auth interceptor: attach `accessToken` from session to every request
  - 401 interceptor: attempt token refresh, then force logout
  - Error transform: normalize backend errors to a consistent shape
  - Request/response logging in development

### 9.2 — Auth Integration

- [ ] Swap Auth.js Credentials `authorize()` from mock lookup to real `POST /auth/admin/login`
- [ ] Wire token refresh flow: `refreshToken` → `POST /auth/refresh` → update session
- [ ] Wire forgot password to real `POST /auth/forgot-password`
- [ ] Verify 2FA (TOTP) flow for `super_admin` and `accountant` roles
- [ ] Test: session expires after 8h, sliding refresh works, role change forces re-auth

### 9.3 — Feature Module API Swap

For each module, replace `features/<module>/api.ts` mock imports with real axios calls:

- [ ] **Admins** — `GET/POST/PATCH/DELETE /admins`, `GET/POST/PATCH/DELETE /roles`
- [ ] **Requests** — `GET /requests` (with query params per §6.3), `GET /requests/:id`, `PATCH /requests/:id`, bulk actions
- [ ] **Technicians** — `GET /technicians`, `GET /technicians/:id`, `PATCH /technicians/:id`, approve/suspend/level-change
- [ ] **Clients** — `GET /clients`, `GET /clients/:id`, `PATCH /clients/:id`, suspend/reactivate
- [ ] **Categories** — `GET /categories` (tree), `POST/PATCH/DELETE /categories`, services CRUD
- [ ] **Approvals** — `GET /approvals`, `GET /approvals/:id`, `POST /approvals/:id/approve`, reject, re-upload
- [ ] **Support** — `GET /tickets`, `GET /tickets/:id`, `POST /tickets`, replies, assign, status transitions
- [ ] **Moderation** — `GET /moderation/flags`, `GET /moderation/flags/:id`, actions (dismiss/warn/suspend/ban)
- [ ] **Payments** — `GET /payments`, `GET /payments/:id`
- [ ] **Accounting** — `GET /transactions`, `GET /commissions`, `GET /payouts`, `GET /invoices`, `GET /reconciliation`
- [ ] **Analytics** — `GET /analytics/overview`, `GET /analytics/charts/:type`
- [ ] **Settings** — `GET/PATCH /settings`
- [ ] **Audit Log** — `GET /audit-log`

### 9.4 — File Upload Integration

- [ ] Wire `FileUploader` to real presigned S3 URL flow:
  - `POST /uploads/presign` → get presigned URL
  - `PUT` file directly to S3
  - Return S3 key to backend on form submit

### 9.5 — Realtime Integration

- [ ] Install `socket.io-client`
- [ ] Swap mock `setInterval` events with real socket.io connection
- [ ] Connect on auth, disconnect on logout
- [ ] Subscribe to channels: `requests`, `support`, `moderation`, `notifications`
- [ ] Wire events to TanStack Query invalidation for live data refresh

### 9.6 — Validation & Smoke Testing

- [ ] Verify every list page loads real data with correct pagination
- [ ] Verify every filter/search/sort works against real backend
- [ ] Verify every create/edit/delete mutation succeeds and invalidates correctly
- [ ] Verify auth flow end-to-end: login → session → refresh → logout
- [ ] Verify permission enforcement matches between frontend guards and backend rejections
- [ ] Verify file uploads complete and display correctly
- [ ] Verify realtime events arrive and update UI
- [ ] Re-run E2E tests from Phase 8 against real backend
- [ ] Load test: verify performance with production-scale data (1000+ requests, 500+ technicians)

### 9.7 — Mock Cleanup

- [ ] Add `NEXT_PUBLIC_USE_MOCKS=true` env var to conditionally load mock data in development
- [ ] Keep mock layer available for local development without backend
- [ ] Remove `@faker-js/faker` from production bundle (dev dependency only)
- [ ] Update `.env.example` with all real backend env vars

### Phase 9 Deliverable

> Dashboard is fully connected to the real backend. All CRUD operations,
> auth, file uploads, and realtime work against live endpoints.
> Mock layer preserved for offline development.

---

## Summary Timeline

| Phase | Name                  | Branch                        | Depends On         | Est.      |
| ----- | --------------------- | ----------------------------- | ------------------ | --------- |
| **0** | Foundation            | `phase-0/foundation`          | —                  | 2 weeks   |
| **1** | Auth & RBAC           | `phase-1/auth-rbac`           | Phase 0            | 2 weeks   |
| **2** | Core Operations       | `phase-2/core-ops`            | Phase 1            | 3 weeks   |
| **3** | Approvals & Support   | `phase-3/approvals-support`   | Phase 2            | 2 weeks   |
| **4** | Payments & Accounting | `phase-4/payments-accounting` | Phase 2            | 3 weeks   |
| **5** | AI Moderation         | `phase-5/ai-moderation`       | Phase 2            | 2 weeks   |
| **6** | Analytics & Charts    | `phase-6/analytics`           | Phases 2–5         | 2 weeks   |
| **7** | Settings & Realtime   | `phase-7/settings-realtime`   | Phase 4            | 1.5 weeks |
| **8** | Hardening & Polish    | `phase-8/hardening`           | Phases 0–7         | 2 weeks   |
| **9** | API Integration       | `phase-9/api-integration`     | Phase 8 + Backend  | 2–3 weeks |

**Total:** ~20 weeks sequential. Phases 3, 4, and 5 can run in parallel after Phase 2.
Phase 9 can start partially during Phase 8 if the backend is ready.

```
                                                                              ┌── Phase 9
Phase 0 ──► Phase 1 ──► Phase 2 ──┬──► Phase 3 ──┐                           │   (API
                                   ├──► Phase 4 ──┼──► Phase 6 ──► Phase 7 ──► Phase 8 ──┤   Integration)
                                   └──► Phase 5 ──┘                           │
                                                                              └── Backend Ready
```

---

## Branching Strategy

```bash
main                              # production
└── develop                       # integration
    ├── phase-0/foundation
    ├── phase-1/auth-rbac
    ├── phase-2/core-ops
    │   ├── phase-2/requests      # optional sub-branch per module
    │   ├── phase-2/technicians
    │   ├── phase-2/clients
    │   └── phase-2/categories
    ├── phase-3/approvals-support
    ├── phase-4/payments-accounting
    ├── phase-5/ai-moderation
    ├── phase-6/analytics
    ├── phase-7/settings-realtime
    ├── phase-8/hardening
    └── phase-9/api-integration
```

Each phase merges into `develop` via PR with:

- One approval minimum
- Green CI (lint + typecheck + tests)
- No TypeScript errors
- AR/EN key parity verified
