# Validation & Quickstart: Phase 0

To validate the Phase 0 foundation after implementation:

## Prerequisites

- Node.js 20+
- `npm install`

## Run Application

```bash
npm run dev
```

## Validation Scenarios

### 1. Linting & Code Quality

```bash
npm run lint
```

**Expected Outcome**: 0 errors. The linter must strictly enforce the prohibition of `any` types and physical CSS properties (e.g., `ml-4`).

### 2. Locale and Layout Switching

1. Navigate to `http://localhost:3000/en/dashboard`
2. **Expected**: LTR layout, English text, sidebar on the left.
3. Switch language to Arabic via the header toggle (navigates to `/ar/dashboard`).
4. **Expected**: RTL layout, Arabic text, sidebar on the right, logical flipping of directional icons.

### 3. Generic DataTable Operation

1. Navigate to the placeholder demonstration page.
2. Click on a column header to sort.
3. Use the pagination controls to change the page index and size.
4. **Expected**: The URL updates immediately (e.g., `?sort=name.desc&page=2`), and the table fetches mock data reflecting the new state via TanStack Query and MSW.
