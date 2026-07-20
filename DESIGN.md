---
name: Betak-Alena Admin Dashboard
description: Internal web tool for support, finance, and operations to run the marketplace.
colors:
  primary: "#0066cc"
  secondary: "#16a2e8"
  background: "#ffffff"
  foreground: "#121212"
  card: "#ffffff"
  muted: "#e8e8e8"
  border: "#d1d1d1"
  success: "#22c55e"
  warning: "#f7b13c"
  destructive: "#ef4444"
  info: "#3b82f6"
typography:
  display:
    fontFamily: "IBM Plex Sans Arabic, Cairo, Inter, sans-serif"
    fontSize: "36px"
    fontWeight: 700
  headline:
    fontFamily: "IBM Plex Sans Arabic, Cairo, Inter, sans-serif"
    fontSize: "24px"
    fontWeight: 600
  title:
    fontFamily: "IBM Plex Sans Arabic, Cairo, Inter, sans-serif"
    fontSize: "18px"
    fontWeight: 600
  body:
    fontFamily: "IBM Plex Sans Arabic, Cairo, Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "IBM Plex Sans Arabic, Cairo, Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 500
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
spacing:
  sm: "4px"
  md: "8px"
  lg: "16px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card-default:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
---

# Design System: Betak-Alena Admin Dashboard

## 1. Overview

**Creative North Star: "The Modern Marketplace Control Center"**

Professional, efficient, and crystal clear. Avoids unnecessary decoration to focus on speed and clarity. This system serves operations, support, and finance staff who spend their entire day in the dashboard. It explicitly rejects sketchy SVGs, playful themes, and cluttered interfaces, prioritizing cognitive ease and accessibility.

**Key Characteristics:**
- High data density with clean separation.
- Unambiguous visual hierarchy.
- Restrained color application, reserving saturation for status and critical actions.

## 2. Colors

Restrained palette with a focus on functional clarity and status indication.

### Primary
- **Trust Anchor Blue** (#0066CC): The primary interactive color, used for primary actions, selected states, and critical highlights.

### Secondary
- **Supportive Cyan** (#16A2E8): Used for secondary accents and nuanced visual separation.

### Neutral
- **Page Background** (#FFFFFF): The foundational canvas.
- **Card Background** (#FFFFFF): The surface for data blocks.
- **Muted** (#E8E8E8): For disabled states and subtle backgrounds.
- **Border** (#D1D1D1): For structural separation.
- **Text Ink** (#121212): Maximum contrast for legibility.

### Named Rules
**The One Voice Rule.** The primary accent is used on ≤10% of any given screen. Its rarity is the point.

## 3. Typography

**Display Font:** IBM Plex Sans Arabic (with Cairo fallback) / Inter
**Body Font:** IBM Plex Sans Arabic (with Cairo fallback) / Inter
**Label/Mono Font:** Inter

**Character:** Clean, highly legible, and objective, providing equal weight and clarity for Arabic and English interfaces.

### Hierarchy
- **Display** (700, 36px, 1.2): Section hero titles and major dashboard metrics.
- **Headline** (600, 24px, 1.2): Page titles and major section groupings.
- **Title** (600, 18px, 1.3): Card headers and widget titles.
- **Body** (400, 14px, 1.5): Standard text for tables, paragraphs, and descriptions. Max line length 75ch.
- **Label** (500, 12px, normal): Table headers, badges, and small utility text.

## 4. Elevation

Flat by default, shadows only for floating elements (popovers/dialogs).

### Shadow Vocabulary
- **Floating Element** (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): Used for dropdowns, popovers, and dialogs to lift them above the flat surface.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Depth is strictly reserved for transient, contextual overlays.

## 5. Components

Clean and restrained. Minimal borders, seamless integration with the background.

### Buttons
- **Shape:** Gently rounded (8px).
- **Primary:** Trust Anchor Blue background, white text (8px 16px).
- **Hover / Focus:** Slight opacity shift or color darkening.
- **Secondary / Ghost:** Transparent background with Trust Anchor Blue text, for non-critical actions.

### Cards / Containers
- **Corner Style:** Rounded (10px).
- **Background:** Solid white.
- **Shadow Strategy:** None. Flat by default.
- **Border:** Subtle 1px neutral border.
- **Internal Padding:** 24px for standard blocks.

### Inputs / Fields
- **Style:** 1px border, transparent background, 6px radius.
- **Focus:** 2px solid ring of Trust Anchor Blue.
- **Error / Disabled:** Destructive red border / muted background.

### Navigation
- **Style:** Collapsible icon sidebar, clear selected states using Trust Anchor Blue background tint.

## 6. Do's and Don'ts

### Do:
- **Do** use logical layout classes (start/end) instead of physical (left/right) to support RTL natively.
- **Do** reserve the Trust Anchor Blue strictly for interactive elements and primary status indications.
- **Do** format all dates and money using locale-aware formatters.

### Don't:
- **Don't** use sketchy SVGs, doodles, or playful themes.
- **Don't** use floating point for money in any calculation; rely on API values and formatters.
- **Don't** cache server data inside Zustand stores.
- **Don't** construct identical card grids that repeat heavily without structural variation.
