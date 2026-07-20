---
target: dashboard sidebar
total_score: 14
p0_count: 2
p1_count: 1
timestamp: 2026-07-20T14-01-13Z
slug: src-components-layout-sidebar-tsx
---
| #         | Heuristic                       | Score     | Key Issue                                                             |
| --------- | ------------------------------- | --------- | --------------------------------------------------------------------- |
| 1         | Visibility of System Status     | 2         | Navigation active states exist, but unconnected to actual routing     |
| 2         | Match System / Real World       | 0         | Displays "Acme Inc" and "Playground" instead of Betak-Alena modules   |
| 3         | User Control and Freedom        | 3         | Standard collapsible sidebar behavior is intact                       |
| 4         | Consistency and Standards       | 1         | Violates project hard rules (uses hardcoded strings instead of `t()`) |
| 5         | Error Prevention                | n/a       | Not highly applicable to navigation                                   |
| 6         | Recognition Rather Than Recall  | 2         | Uses generic icons that don't map to actual marketplace domains       |
| 7         | Flexibility and Efficiency      | 3         | Keyboard shortcut (cmd+b) for toggling is implemented                 |
| 8         | Aesthetic and Minimalist Design | 2         | Clean Shadcn base, but cluttered with irrelevant template sections    |
| 9         | Error Recovery                  | n/a       |                                                                       |
| 10        | Help and Documentation          | 1         | Links to non-existent "Documentation" template paths                  |
| **Total** |                                 | **14/40** | **Poor**                                                              |

#### Anti-Patterns Verdict

**LLM assessment**: This is raw, unedited boilerplate. The component is exactly the default `shadcn` block. It still contains placeholder data for "shadcn" (m@example.com), "Acme Inc", "Evil Corp", and generic SaaS navigation ("Playground", "Models", "Documentation"). It completely ignores the Betak-Alena Admin Dashboard requirements which specify core modules like Requests, Technicians, Clients, and KYC Approvals. Additionally, it violates the project's hard rule on i18n by using hardcoded English strings instead of `next-intl`.

**Deterministic scan**: The CLI detector found 0 specific structural CSS/HTML slop patterns, as it's built on the solid Shadcn primitives.

**Visual overlays**: N/A (component-level analysis via source).

#### Overall Impression

The sidebar has a structurally sound foundation (Shadcn primitives), but it's fundamentally broken for this project because it's populated entirely with placeholder template data. It needs to be wired up to the actual Betak-Alena modules and localized.

#### What's Working

- **Solid structural foundation:** Uses the robust `Sidebar` primitives from Shadcn, including responsive behavior and keyboard shortcuts.
- **Visual hierarchy:** The standard breakdown of header (company), content (nav), and footer (user) is a good layout for an admin panel.

#### Priority Issues

- **[P0] Placeholder Data**: The sidebar displays template navigation ("Models", "Playground") and fake companies ("Acme Inc") instead of the actual platform modules (Requests/Orders, Technicians, Clients, Approvals, Accounting, etc.).
  - **Why it matters**: The dashboard is completely unusable for its actual purpose. Staff cannot navigate to their workflows.
  - **Fix**: Replace the hardcoded `data` object with the real Betak-Alena modules outlined in AGENTS.md.
  - **Suggested command**: `$impeccable shape` or `$impeccable harden`

- **[P0] Hardcoded UI Strings**: All text is hardcoded in English ("Settings", "Billing", "Team").
  - **Why it matters**: Violates Hard Rule #6. Betak-Alena is bilingual (Arabic default / English). Hardcoded strings break RTL/localization.
  - **Fix**: Wrap every string in `t('key')` via `next-intl` and ensure RTL compatibility.
  - **Suggested command**: `$impeccable harden`

- **[P1] Irrelevant UI Sections**: The template includes a Team/Company switcher and a separate "Projects" section.
  - **Why it matters**: A marketplace admin dashboard usually has a single platform context, not a multi-tenant "Team" switcher for the staff. It adds cognitive load for no reason.
  - **Fix**: Remove `SidebarCompany` and `NavProjects` unless the operations team specifically manages multiple sub-brands. Use a simple platform logo/title in the header instead.
  - **Suggested command**: `$impeccable distill`

#### Persona Red Flags

**Alex (Power User)**

- Cannot find actual work modules (Requests, Approvals). Will be confused by "Models" and "Playground" tabs which belong to an AI tool, not a home services marketplace.

**Jordan (First-Timer)**

- Will assume "Evil Corp" is a real entity in the system.
- Will try to click "Documentation" and end up on broken `#` links.

#### Minor Observations

- The icons (e.g., `BotIcon`, `TerminalSquareIcon`) are inherited from the AI SaaS template. They need to be updated to match marketplace concepts (e.g., Users, FileText, Settings, CreditCard).

#### Questions to Consider

- Does the admin dashboard actually need a "Team Switcher" at the top, or just a static Betak-Alena logo?
- Should the navigation be a flat list of modules, or categorized (e.g., "Operations", "Finance", "System")?
