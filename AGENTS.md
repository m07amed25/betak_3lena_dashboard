# AGENTS.md — Betak-Alena Admin Dashboard (Frontend)

```
Repo scope   : betak-alena-dashboard (Next.js admin dashboard only)
Company      : Omnexa Technology
Derived from : Betak-Alena Admin Dashboard Engineering Guideline v1.0 (2026-07-20)
Not this repo: mobile app, Node.js/NestJS backend — treat their details below as
               integration context, not implementation targets.
```

This file is standing context for any AI coding agent working in this repo. Read
"Hard Rules" before touching any code. Use the numbered sections as reference
when building the relevant module. If this file and the engineering guideline
ever disagree, the guideline wins — update this file to match, don't guess.

## What Betak-Alena is

Betak-Alena ("بيتك علينا") is a home-services marketplace: clients request a
service from a mobile app, technicians (leveled Bronze → Silver → Gold →
Platinum) accept and fulfill it, and the platform takes a commission on every
completed job. This repo is the **admin dashboard** — the internal web tool
operations, support, and finance staff use to run the platform. It is not
customer-facing.

**Dashboard users (the only people who log into this app):** Support Agent,
Moderator, Accountant, Operations Manager, Super Admin. Clients and
Technicians exist here only as _records_ — they never authenticate into this
app.

**Core modules:** Requests/Orders · Technicians · Clients · Categories &
Services · Approvals (KYC queue) · Technical Support · AI Chat Moderation ·
Payments · Accounting · Roles & Permissions · Analytics · Settings.

---

## Hard rules — read before writing any code

Every numbered section below expands one of these. These are the mistakes
that are expensive to unwind once real data exists.

1. **Zustand ≠ server data.** Zustand holds UI state only — sidebar
   open/closed, draft filters, selected rows, theme, locale, multi-step form
   drafts. TanStack Query owns everything that comes from the API. Never cache
   an API response inside a Zustand store.
2. **Filters live in the URL**, not component state. Every list page's
   search/sort/page/facets are query params, so views stay shareable and
   back-button-correct.
3. **All filtering, sorting, and pagination are server-side.** Never fetch a
   large list and slice/filter/sort it in the browser.
4. **No physical-direction Tailwind classes, anywhere.** `ml-` `mr-` `pl-`
   `pr-` `left-` `right-` `text-left` `text-right` `border-l` `border-r`
   `rounded-l-*` are banned — use the logical equivalents (§3.4). This is an
   ESLint deny-list rule; don't fight it.
5. **Numbers and currency never mirror in RTL** and stay in Latin digits
   (`numberingSystem: 'latn'`) unless a ticket explicitly asks for
   Arabic-Indic numerals.
6. **Zero hardcoded UI strings.** Everything goes through next-intl's
   `t('key')`. `ar.json` and `en.json` must always keep identical key sets.
7. **No hardcoded hex/color values in components.** Only the CSS variables in
   `globals.css` / Tailwind theme tokens.
8. **`any` is banned in TypeScript.** Use `unknown` and narrow, or fix the
   type.
9. **Never do money math or manual formatting on the frontend.** Treat every
   amount as an already-computed value from the backend; render it only
   through the shared currency formatter. No `parseFloat` + rounding on
   anything money-related.
10. **`PermissionGate` / `usePermission` are UX, not security.** Hiding a
    button is not access control. Assume the backend independently enforces
    every permission, and never skip a required backend check just because
    the UI already hides the trigger.
11. **A user can never edit their own role**, and the app must always keep at
    least two `super_admin`s — block demoting/deleting the last one instead of
    letting it silently fail.
12. **Destructive actions require `ConfirmDialog`**; high-risk ones (e.g.
    deleting a category with active requests) require typed confirmation, not
    a plain Yes/No.
13. **Soft delete only.** No UI path should ever be wired to a hard delete of
    business records (`deleted_at`, never `DROP`/hard `DELETE`).
14. **The dashboard never auto-bans or auto-suspends a user from an AI
    moderation score.** Every punitive moderation action is a deliberate human
    click, regardless of confidence.
15. **Don't `npm install` a shadcn "block."** Copy the code in, then
    immediately swap hardcoded colors → CSS vars, hardcoded strings → `t()`,
    physical direction classes → logical ones.
16. **Don't add:** Redux Toolkit, Moment.js, Material UI / Ant Design, SWR, or
    both `axios` and `fetch` in the same codebase (§1.3).
17. **Every list/table screen follows the one CRUD + filter pattern in §6.**
    Don't invent a bespoke variant per module.
18. **Every feature's query keys follow the exact factory shape in §6.8.**
    Don't hand-roll ad hoc key arrays.
19. **Server Components by default.** `'use client'` only on the smallest
    possible interactive leaf.

---

## 1. Tech stack

### 1.1 Confirmed

- Next.js 15+ — App Router, Server Components
- TypeScript 5.x — `strict: true`
- Tailwind CSS v4
- shadcn/ui — pick **Radix or Base UI once** at project setup, never mix
- next-intl — `ar` (default) / `en`, full RTL
- Zustand — client/UI state
- TanStack Query v5 — server state (non-negotiable, hard rule #1)

### 1.2 Supporting libraries

| Concern                | Library                                               | Notes                                                 |
| ---------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| Tables                 | `@tanstack/react-table` v8                            | Headless, pairs with shadcn `<Table>`                 |
| Forms                  | `react-hook-form`                                     | Uncontrolled, minimal re-renders                      |
| Validation             | `zod`                                                 | Source of truth for form + API types                  |
| Form↔validation bridge | `@hookform/resolvers`                                 | Connects zod to RHF                                   |
| HTTP client            | `axios` (or a `fetch` wrapper) — pick **one**         | Interceptors for auth refresh + 401                   |
| Charts                 | `recharts`, via shadcn's `chart` wrapper              | Don't use raw Recharts — see §8                       |
| Dates                  | `date-fns` + `date-fns/locale/ar-SA`                  | `date-fns-jalali` only if Hijri is confirmed (§17)    |
| Export                 | `xlsx` (SheetJS) or server-side CSV                   | Accounting/report exports                             |
| Toasts                 | `sonner`                                              | shadcn default, RTL-aware                             |
| Icons                  | `lucide-react`                                        | Consistent stroke weight                              |
| Command palette        | `cmdk`                                                | shadcn `<Command>`                                    |
| File upload            | `react-dropzone` + presigned S3 URLs                  | Technician docs, service photos                       |
| Realtime               | `socket.io-client` or Pusher                          | Live request status, tickets, AI alerts               |
| PDF                    | `@react-pdf/renderer` (client) or Puppeteer (server)  | Accounting invoices                                   |
| Phone input            | `react-phone-number-input` + `libphonenumber-js`      |                                                       |
| Animation              | `framer-motion`                                       | Optional — use sparingly, dashboards should feel fast |
| Testing                | `vitest` + `@testing-library/react` + `playwright`    | Unit + E2E                                            |
| Lint/format            | `eslint` + `prettier` + `prettier-plugin-tailwindcss` | Enforced in CI                                        |
| Git hooks              | `husky` + `lint-staged` + `commitlint`                | Conventional commits                                  |

### 1.3 Do NOT add

`Redux Toolkit` (redundant with Zustand + React Query) · `Moment.js`
(deprecated, huge bundle) · `Material UI` / `Ant Design` (conflicts with
shadcn/Tailwind) · `SWR` (overlaps React Query) · both `axios` **and** `fetch`
in the same codebase.

### 1.4 Backend — integration context only, not this repo

Node.js backend (NestJS recommended) + PostgreSQL 16 (Prisma or TypeORM) +
Redis + BullMQ + S3-compatible storage. Postgres was chosen deliberately over
MongoDB because the accounting module needs ACID transactions and the data is
relational (Request → Client → Technician → Category → Transaction →
Commission) — don't design frontend data flows that assume eventual
consistency or document-style joins. Mongo may show up later only for
high-volume append-only data (chat history, audit logs, raw AI moderation
output). API contract is REST + OpenAPI, or tRPC if the backend converges on
TypeScript and the same team owns both — **frontend types are generated from
the spec, never hand-written.**

---

## 2. Project structure

```
betak-alena-dashboard/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── forgot-password/page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx            # sidebar + header shell
│   │   │   │   ├── page.tsx              # overview / KPIs
│   │   │   │   ├── requests/
│   │   │   │   │   ├── page.tsx          # list + filters
│   │   │   │   │   ├── [id]/page.tsx     # detail
│   │   │   │   │   └── _components/
│   │   │   │   ├── technicians/
│   │   │   │   ├── clients/
│   │   │   │   ├── categories/
│   │   │   │   ├── approvals/
│   │   │   │   ├── support/
│   │   │   │   ├── moderation/
│   │   │   │   ├── payments/
│   │   │   │   ├── accounting/
│   │   │   │   ├── analytics/
│   │   │   │   ├── admins/
│   │   │   │   └── settings/
│   │   │   └── layout.tsx                # <html dir> lives here
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/route.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                           # shadcn primitives — DO NOT edit ad-hoc
│   │   ├── layout/                       # AppSidebar, Header, Breadcrumbs
│   │   ├── data-table/                   # generic DataTable + toolbar + filters
│   │   ├── charts/                       # wrapped Recharts components
│   │   ├── forms/                        # FormField wrappers, FileUpload
│   │   └── shared/                       # StatusBadge, EmptyState, ConfirmDialog
│   ├── features/                         # feature-scoped logic
│   │   ├── requests/
│   │   │   ├── api.ts                    # query/mutation fns
│   │   │   ├── hooks.ts                  # useRequests, useRequest, useUpdateRequest
│   │   │   ├── schema.ts                 # zod schemas
│   │   │   ├── types.ts
│   │   │   └── columns.tsx               # TanStack Table column defs
│   │   ├── technicians/
│   │   ├── accounting/
│   │   └── ...
│   ├── lib/
│   │   ├── api-client.ts                 # axios instance + interceptors
│   │   ├── auth.ts                       # Auth.js config
│   │   ├── permissions.ts                # RBAC helpers
│   │   ├── utils.ts                      # cn(), formatters
│   │   ├── format.ts                     # currency, date, number (locale-aware)
│   │   └── constants.ts
│   ├── stores/                           # Zustand
│   │   ├── ui-store.ts
│   │   ├── filter-store.ts
│   │   └── auth-store.ts
│   ├── hooks/                            # cross-feature hooks
│   ├── i18n/
│   │   ├── routing.ts
│   │   ├── request.ts
│   │   └── messages/
│   │       ├── ar.json
│   │       └── en.json
│   ├── types/
│   └── middleware.ts                     # locale + auth + RBAC route guard
├── public/
├── .env.example
├── components.json                       # shadcn config
├── tailwind.config.ts
└── tsconfig.json
```

**Rule:** `components/` is generic and reusable across modules. `features/` is
domain-specific. A component used by exactly one feature lives in that
feature's `_components/`, not in `components/`.

---

## 3. Design system

### 3.1 Tokens

Define once in `globals.css`. Never hardcode a hex value in a component.

**Color Palette Reference:**

- **Primary:** `#0066CC` (scale: `#E6F0FA`, `#CCE0F5`, `#99C2EB`, `#66A3E0`, `#3385D6`, `#0066CC`, `#003D7A`)
- **Secondary:** `#16A2E8` (scale: `#E8F6FD`, `#D0ECFA`, `#A2DAF6`, `#73C7F1`, `#45B5ED`, `#16A2E8`, `#0D618B`)
- **Neutral:** `#131313` (scale: `#E7E7E7`, `#D0D0D0`, `#B6B6B6`, `#929292`, `#616161`, `#424242`, `#131313`)
- **Semantic:**
  - Success: `#22C55E` (light: `#E9F9EF`)
  - Info: `#3B82F6` (light: `#EBF3FE`)
  - Warning: `#F7B13C` (light: `#FEF5E7`)
  - Error: `#EF4444` (light: `#FDECEC`)

```css
@layer base {
  :root {
    /* Brand - HSL equivalents of Primary #0066CC */
    --primary: 210 100% 40%;
    --primary-foreground: 0 0% 100%;

    /* Surfaces - HSL equivalents based on Neutral #131313 */
    --background: 0 0% 100%;
    --foreground: 0 0% 7%;
    --card: 0 0% 100%;
    --muted: 0 0% 91%; /* Neutral light #E7E7E7 */
    --border: 0 0% 82%; /* Neutral #D0D0D0 */

    /* Semantic — used by StatusBadge */
    --success: 142 71% 45%; /* #22C55E */
    --warning: 38 92% 60%; /* #F7B13C */
    --destructive: 0 84% 60%; /* #EF4444 */
    --info: 217 91% 60%; /* #3B82F6 */

    --radius: 0.625rem;
  }
  .dark {
    /* dark equivalents */
  }
}
```

### 3.2 Typography

| Locale  | Font                          | Notes                                        |
| ------- | ----------------------------- | -------------------------------------------- |
| Arabic  | IBM Plex Sans Arabic or Cairo | Load via `next/font/google`, subset `arabic` |
| English | Inter                         | Subset `latin`                               |

Set the font per locale on `<html>` — don't load both fonts on every page.
Scale: 12 / 14 / 16 / 18 / 20 / 24 / 30 / 36 px. Body is 14px in dense tables,
16px in forms and detail views.

### 3.3 Spacing & layout

- 4px base unit. Use Tailwind's default scale — never invent `p-[13px]`.
- Sidebar: 260px expanded, 64px collapsed.
- Content max-width `1440px` centered, `px-4 md:px-6 lg:px-8`.
- Card padding `p-6`. Table cell padding `px-4 py-3`.

### 3.4 RTL rules — mandatory

```tsx
// app/[locale]/layout.tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

| ❌ Never use               | ✅ Always use             |
| -------------------------- | ------------------------- |
| `ml-4` / `mr-4`            | `ms-4` / `me-4`           |
| `pl-6` / `pr-6`            | `ps-6` / `pe-6`           |
| `left-0` / `right-0`       | `start-0` / `end-0`       |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r`    | `border-s` / `border-e`   |
| `rounded-l-md`             | `rounded-s-md`            |

- **Directional icons must flip:** `<ChevronRight className="rtl:rotate-180" />`
  — back arrows, pagination chevrons, sidebar collapse toggles, breadcrumb
  separators.
- **Numbers/currency do NOT flip.** Use `Intl.NumberFormat` with
  `numberingSystem: 'latn'` so Arabic locale still renders Latin digits unless
  Arabic-Indic numerals are explicitly requested.
- **Charts don't auto-flip.** For RTL, reverse the X axis and move the Y axis
  to the right. Handle this once, inside `components/charts/`.
- An ESLint rule (deny-list on physical direction classes) fails the build —
  don't work around it, fix the class.

### 3.5 Component inventory

**Primitives (shadcn):** Button, Input, Textarea, Select, Checkbox, Radio,
Switch, Slider, Label, Badge, Avatar, Separator, Skeleton, Tooltip, Popover,
Dropdown Menu, Dialog, Sheet, Alert Dialog, Tabs, Accordion, Card, Table,
Pagination, Calendar, Command, Sonner.

**Composed (build these):** `DataTable`, `DataTableToolbar`,
`DataTableFacetedFilter`, `DateRangePicker`, `StatusBadge`, `StatCard`,
`PageHeader`, `EmptyState`, `ConfirmDialog`, `FileUploader`,
`PermissionGate`, `AuditTrail`, `MoneyDisplay`, `TechnicianLevelBadge`.

**Charts:** `AreaChartCard`, `BarChartCard`, `PieChartCard`, `LineChartCard`,
`SparklineStat`.

### 3.6 Status colors — single source of truth

Define once in `lib/constants.ts`. Every status pill reads from it.

```ts
export const REQUEST_STATUS = {
  pending: { color: "warning", ar: "قيد الانتظار", en: "Pending" },
  assigned: { color: "info", ar: "تم التعيين", en: "Assigned" },
  in_progress: { color: "info", ar: "قيد التنفيذ", en: "In Progress" },
  completed: { color: "success", ar: "مكتمل", en: "Completed" },
  cancelled: { color: "muted", ar: "ملغي", en: "Cancelled" },
  disputed: { color: "destructive", ar: "متنازع عليه", en: "Disputed" },
} as const;
```

---

## 4. shadcn/ui usage rules

### 4.1 Variant

Decide Radix vs Base UI **once**, at project setup, via `components.json`.
Never mix. Every shadcn block ships in both variants; `npx shadcn add` pulls
the one your config points to.

### 4.2 Official blocks — start here

Source: [ui.shadcn.com/blocks](https://ui.shadcn.com/blocks)

| Block                   | Use for                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| `dashboard-01`          | Main shell — sidebar + header + charts + data table. **Starting skeleton.** |
| `sidebar-07`            | Collapsible icon sidebar — best fit for this multi-module admin panel       |
| `sidebar-03`            | Sidebar with submenus — if module nesting grows                             |
| `login-03` / `login-04` | Auth screens with social provider buttons                                   |
| `calendar-*`            | Technician availability / scheduling views                                  |

```bash
npx shadcn@latest add dashboard-01
npx shadcn@latest add sidebar-07
npx shadcn@latest add login-04
```

Before hand-building `DataTable`, read the shadcn Data Table docs — it's a
documented TanStack Table integration; follow it rather than inventing a
variant. `shadcn-ui/taxonomy` + `dashboard-01` together cover most of the
patterns this dashboard needs.

### 4.3 Community block sources — reference only, not dependencies

Copy what's useful, restyle to the tokens in §3.1, and check RTL manually —
most community blocks assume LTR: Shadcn Studio, blocks.so, Shadcnblocks.com,
Shadcn Space, Shadcn UI Kit.

### 4.4 Block adoption rules

1. Never `npm install` a block library — copy the code in.
2. Immediately replace hardcoded colors with CSS variables.
3. Immediately replace hardcoded strings with `t('key')`.
4. Immediately convert physical direction classes to logical ones.
5. Delete unused variants — a half-used block is technical debt.

---

## 5. Authentication

### 5.1 Verdict and the boundary that matters

Use **Auth.js (NextAuth v5)** for the dashboard — it handles credentials
cleanly, integrates with the App Router, and gives session management, CSRF
protection, and secure cookies for free.

**The mobile app cannot use Auth.js** — it's a web/cookie-based session
library. Mobile needs a token-based flow (JWT access + refresh) issued
directly by the Node.js backend.

```
Mobile App  ──►  Node.js Backend  ◄── single source of truth for identity
                      │              (users, technicians, credentials, OAuth links)
                      │
Dashboard   ──►  Auth.js  ──► calls the same Node.js backend to verify credentials
            (owns the web session cookie only)
```

Auth.js on the dashboard does **not** own its own user table — it
authenticates against the backend and stores the backend-issued token in the
session.

### 5.2 Do you need Google/Apple on the dashboard?

Probably not. Dashboard users are employees created by a Super Admin, not
self-registered — social login on an admin panel just means you need an
allowlist anyway. Google/Apple belongs in the mobile app, where clients and
technicians self-register.

| Surface    | Auth methods                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| Dashboard  | Email + password (credentials), invitation-only, **mandatory 2FA (TOTP)** for Accountant and Super Admin |
| Mobile app | Google, Apple (required by App Store if any social login is offered), phone + OTP, email + password      |

If leadership still wants Google SSO on the dashboard, restrict it to **Google
Workspace SSO on the company domain** (`hd` parameter) — not open Google
login. Apple on the dashboard has no business justification.

### 5.3 Setup

Config lives in `auth.ts` at the repo root. v5 auto-infers env vars prefixed
`AUTH_`.

```ts
// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { loginSchema } from "@/features/auth/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 }, // 8h admin shift
  pages: { signIn: "/login", error: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {}, otp: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const res = await fetch(`${process.env.API_URL}/auth/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        if (!res.ok) return null;

        const { user, accessToken, refreshToken } = await res.json();
        return { ...user, accessToken, refreshToken };
      },
    }),
    // Only if Workspace SSO is approved:
    Google({ authorization: { params: { hd: "omnexa-technology.com" } } }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      // TODO: refresh accessToken when expired
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.permissions = token.permissions;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
```

```
AUTH_SECRET=
AUTH_URL=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
API_URL=
```

### 5.4 Security requirements — non-negotiable

- `AUTH_SECRET` via `openssl rand -base64 32`, different per environment.
- Passwords hashed with argon2id (preferred) or bcrypt cost ≥ 12 — backend
  responsibility, but never build a flow that sends/stores plaintext.
- Rate-limit login: 5 attempts / 15 min per IP + per email, then lockout.
- 2FA (TOTP) mandatory for `super_admin` and `accountant`.
- Session 8 hours, sliding refresh, hard logout on role change.
- Every login, logout, failed attempt, and permission change is written to
  the audit log.
- `httpOnly` + `secure` + `sameSite=lax` cookies.
- No secrets in `NEXT_PUBLIC_*` variables — ever.

---

## 6. CRUD + filtering pattern

Every list screen in this dashboard follows **one** pattern. Build it once in
`components/data-table/`, reuse everywhere.

### 6.1 Standard list page

```
┌──────────────────────────────────────────────────────────────┐
│ PageHeader: title + description + [Export] [+ Create]        │
├──────────────────────────────────────────────────────────────┤
│ Toolbar: [🔍 search] [Status ▾] [Category ▾] [Date range]    │
│          [Level ▾] [Reset]              [Columns ▾] [Density]│
├──────────────────────────────────────────────────────────────┤
│ Bulk bar (when rows selected): "12 selected"  [Approve][Del] │
├──────────────────────────────────────────────────────────────┤
│ ☑ │ ID │ Client │ Technician │ Category │ Status │ Amount │⋮ │
│ ☐ │ .. │ ...    │ ...        │ ...      │ [pill] │ ...    │⋮ │
├──────────────────────────────────────────────────────────────┤
│ "Showing 1–20 of 1,432"      [20 ▾]  ◀ 1 2 3 … 72 ▶         │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Filter state lives in the URL

Not React state. This keeps filtered views shareable, bookmarkable, and
back-button-correct — e.g. an accountant sending a manager "look at these
transactions."

```
/requests?q=ahmed&status=pending,disputed&category=plumbing
         &from=2026-01-01&to=2026-03-31&level=gold
         &sort=created_at&order=desc&page=2&limit=20
```

### 6.3 Standard query params

| Param         | Type            | Notes                                  |
| ------------- | --------------- | -------------------------------------- |
| `q`           | string          | Free-text search, debounced 300ms      |
| `page`        | number          | 1-indexed                              |
| `limit`       | number          | 10 / 20 / 50 / 100                     |
| `sort`        | string          | Column key                             |
| `order`       | `asc` \| `desc` |                                        |
| `from` / `to` | ISO date        | Date range                             |
| `<field>`     | csv             | Multi-select facets, e.g. `status=a,b` |

### 6.4 Standard response shape

```json
{
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 1432, "totalPages": 72 },
  "aggregations": { "status": { "pending": 120, "completed": 980 } }
}
```

`aggregations` powers faceted filter counts (`Pending (120)`) without extra
requests — insist on this from the backend.

### 6.5 Filtering rules

- **Server-side always.** Never fetch thousands of rows and filter client-side.
- **Debounce search** at 300ms; other filters apply immediately on change.
- **Reset to page 1** whenever any filter changes.
- **Persist per-user filter presets** ("My open disputes") in Zustand +
  localStorage, with an option to save to the backend.
- **Every module needs**: text search, status facet, date range, and at least
  one domain facet.

### 6.6 Per-module filter matrix

| Module      | Search                 | Facets                                                     | Date range         |
| ----------- | ---------------------- | ---------------------------------------------------------- | ------------------ |
| Requests    | ID, client name, phone | status, category, city, technician level, payment method   | created, completed |
| Technicians | name, phone, ID        | status, level, category, city, approval state, rating band | joined             |
| Clients     | name, phone, email     | status, city, has-orders                                   | joined             |
| Categories  | name AR/EN             | active, parent category                                    | —                  |
| Approvals   | applicant name         | type (technician/client), doc type, state                  | submitted          |
| Support     | ticket ID, subject     | status, priority, assigned agent, source (client/tech)     | opened, resolved   |
| Moderation  | chat ID, participant   | violation type, severity, action taken, AI confidence band | flagged            |
| Payments    | txn ID, ref            | method, status, gateway, currency                          | txn date           |
| Accounting  | invoice no.            | type, settlement state, technician                         | period             |

### 6.7 Mutation rules

- Every **destructive** action goes through `ConfirmDialog`; typed
  confirmation for high-risk ones (deleting a category with active requests).
- **Soft delete by default.** Set `deleted_at`; never wire to `DROP` or a hard
  delete of business records.
- **Optimistic updates** for toggles (activate/deactivate) — instant UI,
  rollback on error.
- **Invalidate precisely:** `queryClient.invalidateQueries({ queryKey:
['requests'] })`, not the whole cache.
- **Every mutation writes an audit log entry** server-side: actor, action,
  entity, before/after diff, IP, timestamp. Don't build a mutation path that
  bypasses this contract.

### 6.8 Query key convention

Follow this exact shape for every feature — it's what makes cache
invalidation predictable.

```ts
export const requestKeys = {
  all: ["requests"] as const,
  lists: () => [...requestKeys.all, "list"] as const,
  list: (filters: RequestFilters) => [...requestKeys.lists(), filters] as const,
  details: () => [...requestKeys.all, "detail"] as const,
  detail: (id: string) => [...requestKeys.details(), id] as const,
};
```

---

## 7. Roles & permissions (RBAC)

### 7.1 Model

Granular permissions, not hardcoded role checks scattered in components.
Format: `resource:action[:scope]`.

```
requests:read            requests:update           requests:assign
requests:delete          technicians:approve        technicians:update_level
accounting:read          accounting:export          accounting:adjust_commission
moderation:review        moderation:ban_user        admins:manage
settings:update
```

### 7.2 Default roles

| Role                 | Permissions                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `super_admin`        | `*`                                                                                                      |
| `operations_manager` | `requests:*`, `technicians:read/update/approve`, `clients:read/update`, `categories:*`, `analytics:read` |
| `support_agent`      | `support:*`, `requests:read`, `clients:read`, `technicians:read`                                         |
| `moderator`          | `moderation:*`, `approvals:*`, `clients:read/suspend`, `technicians:read/suspend`                        |
| `accountant`         | `accounting:*`, `payments:*`, `analytics:read`, `requests:read`, `technicians:read`                      |
| `viewer`             | `*:read`                                                                                                 |

Roles must be **editable in the dashboard**, not hardcoded — build a Roles
screen with a permission matrix (checkbox grid: resources × actions).

### 7.3 Enforcement — three layers

**Layer 1 — middleware (route guard):**

```ts
// middleware.ts
const ROUTE_PERMISSIONS: Record<string, string> = {
  "/accounting": "accounting:read",
  "/admins": "admins:manage",
  "/moderation": "moderation:review",
};
// redirect to /403 if session.user.permissions lacks the required one
```

**Layer 2 — UI (hide what they can't do):**

```tsx
<PermissionGate permission="technicians:approve">
  <Button onClick={approve}>{t("approve")}</Button>
</PermissionGate>
```

```ts
const can = usePermission();
if (can("accounting:export")) {
  /* show export */
}
```

**Layer 3 — backend (the only one that actually secures anything):** every
endpoint validates permissions independently. Frontend checks are UX, not
security — a hidden button is not access control (hard rule #10).

### 7.4 Rules

- Hide, don't disable — except disable-with-tooltip when the block is
  temporary (e.g. "cannot approve until documents uploaded").
- Permission changes take effect on next request; force re-auth on role
  change.
- Log every permission grant/revoke.
- Never let a user edit their own role.
- Always keep at least two super admins — block deletion of the last one.

---

## 8. Charts & analytics

### 8.1 Library

Recharts, via shadcn's `ChartContainer` / `ChartTooltip` / `ChartLegend`
wrapper (handles theming via CSS variables). Install and use it — don't use
raw Recharts.

```bash
npx shadcn@latest add chart
```

### 8.2 Overview dashboard

**KPI row** (StatCards with sparkline + % vs previous period): Total
Requests · Completed Requests · Active Technicians · Gross Revenue ·
**Platform Commission** · Avg. Completion Time · Avg. Rating · Open Disputes.

| Chart                            | Type                 | Data                                     |
| -------------------------------- | -------------------- | ---------------------------------------- |
| Revenue & Commission over time   | Stacked Area         | daily/weekly/monthly, vs previous period |
| Requests by status               | Donut                | live snapshot                            |
| Requests by category             | Horizontal Bar       | top 10 categories                        |
| Technician distribution by level | Bar                  | Bronze/Silver/Gold/Platinum              |
| Requests by city                 | Bar or Map           | geographic demand                        |
| Peak request hours               | Heatmap (day × hour) | staffing decisions                       |
| Payment method split             | Pie                  | card / wallet / cash                     |
| New users vs new technicians     | Line, dual series    | supply/demand balance                    |

### 8.3 Module-specific charts

- **Accounting:** commission by category, monthly revenue vs payouts,
  outstanding settlements aging, top 20 technicians by revenue.
- **Moderation:** violations over time by type, AI confidence distribution,
  false-positive rate after human review, repeat offenders.
- **Support:** tickets opened vs resolved, avg. first-response/resolution
  time, tickets by category, agent workload.
- **Technicians:** acceptance rate, cancellation rate, rating trend, level
  progression funnel.

### 8.4 Chart rules

- Every chart respects the global date range filter.
- Every chart has a loading skeleton, empty state, and error state — no
  exceptions.
- RTL: reverse the X axis and switch the Y axis to `right` when `dir ===
'rtl'`, handled inside the chart wrapper.
- Locale-aware formatting for axis ticks, tooltips, and legends.
- Aggregate on the server — charts consume pre-aggregated endpoints, never
  raw row dumps.
- Colorblind-safe palette; don't rely on red/green alone, pair with icons or
  labels.
- Every chart is exportable to PNG and its underlying data to CSV.

---

## 9. Accounting module — frontend rules

This is the financial core of the platform. Treat display logic here with
more rigor than any other module.

### 9.1 What it does

Calculates and reports the platform's commission from every completed
service, reconciled against what's owed to technicians.

### 9.2 Commission precedence (highest to lowest)

1. Promotional override (campaign, time-bound)
2. Technician-specific negotiated rate
3. Technician level rate (Bronze 20% → Platinum 12%)
4. Category rate (plumbing 15%, electrical 18%)
5. Global default rate

Models supported: percentage, fixed fee, percentage with min/max cap, tiered
by order value. The Commission Settings screen must show **effective dates**
— never mutate a past rate.

### 9.3 Transaction ledger + the cash-payment inversion

Every completed request produces an immutable ledger entry the Transactions
screen renders with full filters, drill-down, and Excel/CSV export:

| Field                               | Description                                             |
| ----------------------------------- | ------------------------------------------------------- |
| `request_id`                        | Source request                                          |
| `gross_amount`                      | What the client paid                                    |
| `commission_rate`                   | Rate applied                                            |
| `commission_rate_source`            | Which precedence rule fired — required for auditability |
| `commission_amount`                 | Platform revenue                                        |
| `tax_amount`                        | VAT if applicable                                       |
| `payment_gateway_fee`               | Deducted cost                                           |
| `technician_net`                    | gross − commission − tax − fees                         |
| `payment_method`                    | card / wallet / cash                                    |
| `settlement_status`                 | pending / settled / on_hold / disputed                  |
| `settled_at`, `settlement_batch_id` | Payout tracking                                         |

**Cash payments invert the flow.** When a client pays the technician in cash,
the technician _owes_ the platform its commission — a negative balance on the
technician wallet. The UI must surface this debt and reflect a block on new
job acceptance above a configurable debt threshold. Miss this in a screen and
the platform silently loses money.

### 9.4 Accountant screens

Financial Overview · Transactions (full ledger + export) · Technician
Payouts (balances, batch generation, history) · Commission Settings
(effective-dated rates) · Invoices (PDF, sequential numbering, tax-compliant)
· Reconciliation (gateway vs internal ledger, mismatch flagging) · Reports
(scheduled email delivery).

### 9.5 Financial display rules — enforce strictly

- **Never use floating point for money in any calculation.** Treat amounts
  as pre-computed integers/minor-units or decimal strings from the API;
  format for display only, never re-derive.
- Ledger entries are immutable in the UI — corrections render as new
  reversing entries, never as edits to history.
- Commission is calculated and stored at completion time; a rate change must
  never retroactively alter historical revenue shown in reports.
- Multi-currency ready even for single-currency launch — always render
  `currency` from the data, never hardcode a symbol.
- `accountant` role cannot modify requests or users in the UI — separation of
  duties, enforce via RBAC (§7).
- Financial exports must log who exported what, when, and with which filters.

---

## 10. AI chat moderation dashboard

### 10.1 What the frontend renders

Backend runs a two-stage pipeline (deterministic rules on every message, then
LLM classification on flagged/sampled messages) to catch clients and
technicians trying to bypass the platform — sharing phone numbers/socials,
arranging off-platform payment. The frontend never re-implements this
detection; it renders the pipeline's output.

### 10.2 Violation response shape

```json
{
  "violation": true,
  "type": "contact_sharing | off_platform_payment | off_platform_agreement | abuse | spam | none",
  "severity": "low | medium | high",
  "confidence": 0.0,
  "evidence": ["quoted message span"],
  "explanation": "short reason for the reviewer"
}
```

### 10.3 Actions by confidence

| Confidence | Action                                                      |
| ---------- | ----------------------------------------------------------- |
| ≥ 0.9      | Auto-block message delivery + flag for review + warn sender |
| 0.6 – 0.9  | Deliver with contact info masked + queue for human review   |
| 0.3 – 0.6  | Deliver + queue for review, no user-facing action           |
| < 0.3      | Log only                                                    |

**A human always makes the final punitive decision** (hard rule #14) — never
wire a ban/suspend action to fire automatically off the AI score alone.

### 10.4 Moderation dashboard screen

- Review queue sorted by severity × confidence.
- Full chat thread with the flagged span highlighted in context.
- Participant history: prior violations, ratings, completed jobs, revenue
  contribution.
- Actions: dismiss (false positive) / warn / suspend N days / ban / escalate.
- Every dismissal is training signal — surface false-positive rate per
  violation type so it can be tuned monthly.
- Metrics: violations by type over time, precision/recall, repeat offenders,
  revenue at risk.

### 10.5 Legal & privacy touchpoints for the UI

Users must see (elsewhere, at signup) that chats are monitored. In this
dashboard: redact PII in analytics views, audit-log every moderator access to
chat content, and provide a documented appeal path for a moderation decision.

---

## 11. Internationalization

### 11.1 Setup

```bash
npm install next-intl
```

Locales: `ar` (default), `en`. Routing via `[locale]` path segment —
`/ar/requests`, `/en/requests`. Translations resolve server-first in Server
Components. ICU MessageFormat for plurals/gender.

### 11.2 Message file convention

Namespace by feature, mirroring the folder structure:

```json
{
  "common": { "save": "حفظ", "cancel": "إلغاء", "search": "بحث" },
  "requests": {
    "title": "الطلبات",
    "status": { "pending": "قيد الانتظار", "completed": "مكتمل" },
    "count": "{count, plural, =0 {لا توجد طلبات} one {طلب واحد} two {طلبان} few {# طلبات} other {# طلبًا}}"
  },
  "accounting": { "commission": "عمولة المنصة" }
}
```

### 11.3 Rules

- Zero hardcoded strings in components — enforced by an ESLint rule.
- `ar.json` and `en.json` must have identical key sets; CI fails on drift.
- Never concatenate translated fragments — use interpolation.
- Format all dates, numbers, and currency through `next-intl`/`Intl.*`
  formatters, never manually.
- Backend error messages come back as **error codes**, translated on the
  frontend, not on the server.
- Category names, service names, and notification templates are
  user-authored bilingual content — store `name_ar` / `name_en` columns, not
  translation keys.

---

## 12. Performance

- Server Components by default; `'use client'` only for interactivity, on
  the smallest leaf.
- Virtualize tables above 100 visible rows (`@tanstack/react-virtual`).
- Code-split charts: `dynamic(() => import('./RevenueChart'), { ssr: false })`.
- `next/image` for all images, with explicit dimensions.
- Prefetch on hover for table row → detail navigation.
- Skeleton loaders matching the real layout, not spinners.
- Bundle budget: first-load JS < 200 kB per route — check with
  `@next/bundle-analyzer` in CI.
- Font subsetting — Arabic subset only, `display: swap`.

---

## 13. Code conventions

| Item             | Convention                | Example                      |
| ---------------- | ------------------------- | ---------------------------- |
| Components       | PascalCase                | `RequestTable.tsx`           |
| Hooks            | camelCase, `use` prefix   | `useRequests.ts`             |
| Utilities        | camelCase                 | `formatCurrency.ts`          |
| Types/Interfaces | PascalCase, no `I` prefix | `Request`, `TechnicianLevel` |
| Constants        | SCREAMING_SNAKE           | `REQUEST_STATUS`             |
| Folders          | kebab-case                | `technician-levels/`         |
| Booleans         | `is`/`has`/`can` prefix   | `isLoading`, `canApprove`    |

- `strict: true` in TS. `any` is banned — use `unknown` and narrow.
- Named exports everywhere except Next.js pages/layouts.
- Absolute imports via `@/`.
- Zod schema is the source of truth: `type Request = z.infer<typeof requestSchema>`.
- Component files > 200 lines get split.
- No `console.log` in committed code — use a logger with levels.
- Conventional commits: `feat(requests): add bulk assign`.

**Branching:** `main` → production · `develop` → integration · `feature/*` ·
`fix/*` · `hotfix/*`. PRs need one approval, green CI, and no TypeScript
errors.

---

## 14. Commands

Not specified verbatim in the engineering guideline — these are the expected
scripts for this stack. Verify against the actual `package.json` and correct
this section if they differ.

```bash
npm run dev         # local dev server
npm run build        # production build — also where the bundle budget (§12) is checked
npm run lint          # eslint — zero warnings required before merge
npm run typecheck     # tsc --noEmit — zero errors required before merge
npm run test          # vitest unit tests
npm run test:e2e      # playwright
npm run format        # prettier + prettier-plugin-tailwindcss
```

---

## 15. Definition of done — per feature

A feature ships only when **all** of these are true:

- [ ] Full CRUD implemented (create, read, update, soft delete)
- [ ] Server-side filtering, search, sorting, pagination — with URL state
- [ ] Permission-gated at middleware, UI, and backend
- [ ] Loading, empty, and error states for every async surface
- [ ] Fully translated — AR and EN key parity
- [ ] RTL verified visually in Arabic, not assumed
- [ ] Responsive from 1280px up (tablet nice-to-have, mobile not required)
- [ ] Keyboard navigable; focus visible; screen-reader labels present
- [ ] Export to CSV/Excel where a list exists
- [ ] Audit log entries written for every mutation
- [ ] Unit tests on business logic; E2E on the happy path
- [ ] No TypeScript errors, no ESLint warnings
- [ ] Reviewed and merged via PR

---

## 16. Roadmap (for prioritization context)

| Phase                     | Scope                                                                                                        | Est.  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | ----- |
| 0 — Foundation            | Repo, Next.js+TS, Tailwind+shadcn, i18n+RTL, tokens, layout shell, `DataTable`, `PermissionGate`, API client | 2 wks |
| 1 — Auth & RBAC           | Auth.js, login, roles/permissions screens, middleware guards, admin mgmt, audit log                          | 2 wks |
| 2 — Core Ops              | Requests, Technicians, Clients, Categories — full CRUD + filters                                             | 3 wks |
| 3 — Approvals & Support   | Approval queues, document review, support tickets                                                            | 2 wks |
| 4 — Payments & Accounting | Ledger, commission config, payouts, invoices, reconciliation, reports                                        | 3 wks |
| 5 — AI Moderation         | Rules engine, LLM integration, review queue, actions, metrics                                                | 2 wks |
| 6 — Analytics             | Overview dashboard, all charts, exports                                                                      | 2 wks |
| 7 — Hardening             | E2E, a11y audit, RTL audit, performance, security review, docs                                               | 2 wks |

Total ≈18 weeks; phases 2–6 can partially parallelize with two frontend devs.

---

## 17. Unresolved decisions — do not hardcode around these

These are open per the engineering guideline. When a feature touches one,
implement it behind a config value, enum, or prop — not a literal — and leave
a `// TODO:` referencing the open question.

1. **Currency & country** — single market or multi-country at launch? Don't
   hardcode a currency symbol or a single-locale assumption.
2. **VAT** — rate, and inclusive or exclusive of the displayed price?
3. **Cash payments** — if enabled, the technician-debt inversion (§9.3) is
   mandatory; don't ship the ledger UI without it if cash is even possibly in
   scope.
4. **Technician level criteria** — jobs/rating/revenue/tenure, automatic or
   manual? Keep the level-progression UI driven by data from the API, not a
   hardcoded formula.
5. **Payment gateway** — choice affects the shape of reconciliation and
   payout screens; don't bind shared components to one gateway's field names.
6. **Payout schedule & minimum threshold** — keep configurable in Settings,
   not a constant.
7. **Chat retention period** — affects the moderation data lifecycle; don't
   assume "keep forever."
8. **Client-facing web app** — does one exist, or is mobile the only client
   surface?
9. **Notification channels** — push only, or also SMS/email? Keep the
   notification-template screen channel-agnostic.
10. **Hijri calendar** — needed anywhere in the UI, or Gregorian only? Don't
    add `date-fns-jalali` until this is confirmed.

---

## 18. Reference docs

- shadcn/ui Blocks — https://ui.shadcn.com/blocks
- shadcn/ui Sidebar blocks — https://ui.shadcn.com/blocks/sidebar
- shadcn/ui Data Table docs (follow before hand-building `DataTable`)
- Auth.js v5 migration guide — https://authjs.dev/getting-started/migrating-to-v5
- Auth.js Next.js reference — https://authjs.dev/reference/nextjs
- next-intl App Router i18n guide
