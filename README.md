# @asafarim/changelog-timeline

A responsive, paginated vertical changelog timeline component built with React, TypeScript, and ASafariM design tokens. See demo at [https://alisafari-it.github.io/changelog-timeline/](https://alisafari-it.github.io/changelog-timeline/).

![Changelog Timeline Demo](https://github.com/AliSafari-IT/changelog-timeline/blob/main/changelog-demo/public/changelog-demo.png?raw=true)

![Version](https://img.shields.io/badge/version-0.7.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

`@asafarim/changelog-timeline` is a lightweight, token-driven React timeline component for changelogs and release notes, with filtering, pagination, and version grouping—packaged as a reusable library with a live demo and GitHub Pages preview.

- ✨ **Vertical timeline layout**
- 🎨 **Powered by `@asafarim/design-tokens`** – no hard-coded colors
- 📱 **Fully responsive** - adapts from mobile to desktop
- 🔄 **Client-side pagination** with configurable page size
- 🏷️ **Category filtering** with visual badges
- 📦 **Version grouping** for organized display
- ♿ **Accessible** - ARIA labels, keyboard navigation, semantic HTML
- 🌗 **Automatic light/dark theme** support via tokens
- 🎯 **TypeScript** - fully typed API
- 🌳 **Tree-shakable** - import only what you need

---

## Installation

```bash
pnpm add @asafarim/changelog-timeline
```

### Peer Dependencies

```bash
pnpm add react react-dom
```

---

## Quick Start

```tsx
import { ChangelogTimeline } from '@asafarim/changelog-timeline';
import '@asafarim/changelog-timeline/css';

const entries = [
  {
    id: '1',
    version: '2.1.0',
    date: '2025-01-15T00:00:00Z',
    category: 'feature',
    title: 'Added dark mode support',
    description: 'Users can now toggle between light and dark themes.',
    tags: ['ui', 'accessibility'],
  },
  {
    id: '2',
    version: '2.0.1',
    date: '2025-01-10T00:00:00Z',
    category: 'fix',
    title: 'Fixed pagination bug',
    description: 'Resolved issue where pagination would skip entries.',
    tags: ['bug', 'pagination'],
  },
];

function App() {
  return (
    <ChangelogTimeline
      entries={entries}
      maxVisible={8}
      showPagination={true}
      searchable
    />
  );
}
```

---

## Comprehensive Tutorial: Build a Product Changelog in 5 Steps

> Everything below assumes a React 18 + TypeScript project that already uses PNPM.  
> The component auto-imports `@asafarim/design-tokens`, so **never hard-code colors, spacing, or typography**.

1. **Install dependencies**

   ```bash
   pnpm add @asafarim/changelog-timeline
   pnpm add react react-dom
   ```

2. **Model entries with `ChangelogEntry`**

   ```ts
   import type { ChangelogEntry } from '@asafarim/changelog-timeline';

   const entries: ChangelogEntry[] = [
     {
       id: 'release-2.1.0-feature-dark-mode',
       version: '2.1.0',
       date: '2025-01-15',
       category: 'feature',
       title: 'Added dark mode',
       description: 'Timeline now follows the active theme automatically.',
       tags: ['ui', 'accessibility'],
     },
   ];
   ```

3. **Import CSS tokens once**

   ```ts
   import '@asafarim/changelog-timeline/css';
   ```

4. **Render the component**

   ```tsx
   import { ChangelogTimeline } from '@asafarim/changelog-timeline';

   export const ProductChangelog = () => (
     <ChangelogTimeline
       entries={entries}
       title="Product updates"
       subtitle="Fresh releases and fixes"
       layout="center"
       maxVisible={6}
       showPagination
     />
   );
   ```

5. **Deploy with confidence**

   Works in Vite, Next.js (SSR/ISR), CRA, Remix, and any bundler that understands ESM. The component is fully typed, accessible, and token-driven.

---

## Design Token Usage

This library is **100% token-based**. All colors, spacing, typography, shadows, and transitions come from `@asafarim/design-tokens` (auto-imported when you import `@asafarim/changelog-timeline/css`).

### Token Categories Used

| Token Type | Examples |
|------------|----------|
| **Colors** | `var(--asm-color-brand-primary-600)`, `var(--asm-color-semantic-success)`, `var(--asm-color-text)` |
| **Spacing** | `var(--asm-space-2)`, `var(--asm-space-4)`, `var(--asm-space-8)` |
| **Typography** | `var(--asm-font-size-sm)`, `var(--asm-font-size-md)`, `var(--asm-line-height-relaxed)` |
| **Radius** | `var(--asm-radius-sm)`, `var(--asm-radius-md)` |
| **Shadows** | `var(--asm-effect-shadow-sm)`, `var(--asm-effect-shadow-md)` |
| **Transitions** | `var(--asm-motion-duration-fast)`, `var(--asm-motion-easing-standard)` |

### Category Color Mapping

Each changelog category automatically maps to semantic token colors:

| Category | Primary Token | Notes |
|----------|---------------|-------|
| `feature` | `--asm-color-semantic-success` | Used for icon & label text |
| `fix` | `--asm-color-semantic-error` | |
| `improvement` | `--asm-color-semantic-info` | |
| `security` | `--asm-color-semantic-warning` | |
| `breaking` | `--asm-color-semantic-error` | |
| `docs` | `--asm-color-brand-primary-600` | |

---

## Component API

### `<ChangelogTimeline>`

Main timeline component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entries` | `ChangelogEntry[]` | **required** | Entries displayed in the timeline |
| `className` | `string` | `''` | Additional CSS class for the timeline |
| `headerClassName` | `string` | `''` | Additional CSS class for the header |
| `maxVisible` | `number` | `8` | Entries per page |
| `showPagination` | `boolean` | `true` | Show pagination controls |
| `searchable` | `boolean` | `false` | Show text search across title, description, version, and tags |
| `layout` | `'left' | 'center'` | `'left'` | Timeline alignment |
| `title` | `string` | — | Optional timeline heading |
| `subtitle` | `string` | — | Optional timeline subheading |

---

### `ChangelogEntry`

```typescript
interface ChangelogEntry {
  id: string;
  version: string;
  date: string; // ISO 8601 format
  category: 'feature' | 'fix' | 'improvement' | 'security' | 'breaking' | 'docs';
  title: string;
  description: string;
  tags: string[];
}
```
---

## Usage Examples

### Basic Timeline

```tsx
<ChangelogTimeline entries={entries} />
```

### With Category Filtering

Category filter chips are included by default:

```tsx
<ChangelogTimeline entries={entries} />
```

### Centered Layout

```tsx
<ChangelogTimeline
  entries={entries}
  layout="center"
  title="Product updates"
  subtitle="Fresh releases and fixes"
/>
```

### Client-Side Pagination

```tsx
<ChangelogTimeline
  entries={entries}
  maxVisible={10}
  showPagination={true}
/>
```

### Rich Media and Markdown

Markdown parsing and rich media rendering are planned features. Until then, pass plain text descriptions to `ChangelogTimeline` or preprocess content in your application.

---

## Theming

The timeline automatically adapts to light/dark themes via `@asafarim/design-tokens`.

### Custom Theme Extension

You can extend the theme by overriding token variables:

```css
:root {
  /* Override timeline-specific tokens */
  --timeline-dot-size: 20px;
  --timeline-gap: var(--asm-space-10);

  /* Override category colors */
  --category-feature-bg: rgba(34, 197, 94, 0.15);
  --category-feature-text: var(--asm-color-semantic-success);
}
```

---

## Accessibility

- ✅ Semantic HTML (`<time>`, `<h2>`, `<h3>`)
- ✅ ARIA labels (`role="list"`, `aria-label`, `aria-pressed`)
- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Focus indicators (`outline`, `focus-visible`)
- ✅ Screen reader friendly

---

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Development

The repository uses PNPM workspaces. CI runs Node.js 20 with pnpm 10.28.2 for reproducible installs and builds.

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

### Clean

```bash
pnpm clean
```

### Run the demo

```bash
pnpm demo
```

The demo builds the library first, then starts Vite at `http://localhost:5187/changelog-timeline/`.

---

## Demo App

The `changelog-demo` app includes:

- Live changelog filtering and pagination
- Light/dark theme toggle
- Responsive token-based layout
- `Live Demo` and `Roadmap / Coming Soon` views
- Roadmap cards for shipped search plus upcoming rich media, render slots, feed utilities, and date grouping

The hosted demo is available at [alisafari-it.github.io/changelog-timeline](https://alisafari-it.github.io/changelog-timeline/).

---

## License

MIT © ASafariM

---

## Contributing

Contributions welcome! Please ensure:

- All colors/spacing use tokens from `@asafarim/design-tokens`
- TypeScript types are complete
- Components are accessible
- Code follows existing patterns

---
