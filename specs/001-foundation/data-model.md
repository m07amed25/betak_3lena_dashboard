# Data Model: Phase 0 (Foundation)

_(No business data entities are introduced in Phase 0; however, foundational configuration schemas apply.)_

## ThemeConfig

- `colors`: Object mapping primary, secondary, semantic colors to CSS variables.
- `typography`: Font families and scale definitions.

## LocaleConfig

- `namespaces`: List of translation files (`common.json`, `dashboard.json`).
- `supportedLocales`: `['ar', 'en']`
- `defaultLocale`: `'ar'`

## TableState (Generic DataTable)

- `pageIndex`: Number
- `pageSize`: Number
- `sorting`: Array of `{ id: string, desc: boolean }`
- `globalFilter`: String
- `columnFilters`: Array of `{ id: string, value: any }`
