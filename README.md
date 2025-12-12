# @asafarim/changelog-timeline

A responsive, paginated vertical changelog timeline component built with React, TypeScript, and ASafariM design tokens.

![Changelog Timeline Demo](https://unpkg.com/@asafarim/changelog-timeline@latest/changelog-demo/src/public/changelog-demo.png)

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- ✨ **Vertical timeline layout**
- 🎨 **Built entirely with `@asafarim/shared-tokens`** - no hard-coded colors
- 📱 **Fully responsive** - adapts from mobile to desktop
- 🔄 **Client & server pagination** support
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
pnpm add react react-dom @asafarim/shared-tokens
```

---

## Quick Start

```tsx
import { ChangelogTimeline } from '@asafarim/changelog-timeline';
import '@asafarim/changelog-timeline/styles.css';
import '@asafarim/shared-tokens/styles.css';

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
    />
  );
}
```

---

## Design Token Usage

This library is **100% token-based**. All colors, spacing, typography, shadows, and transitions come from `@asafarim/shared-tokens`.

### Token Categories Used

| Token Type | Examples |
|------------|----------|
| **Colors** | `var(--color-primary)`, `var(--color-success-500)`, `var(--color-text)` |
| **Spacing** | `var(--space-2)`, `var(--space-4)`, `var(--space-6)` |
| **Typography** | `var(--font-size-sm)`, `var(--font-size-base)`, `var(--line-height-relaxed)` |
| **Radius** | `var(--radius-sm)`, `var(--radius-md)` |
| **Shadows** | `var(--shadow-sm)`, `var(--shadow-md)` |
| **Transitions** | `var(--transition)`, `var(--transition-slow)` |

### Category Color Mapping

Each changelog category automatically maps to semantic token colors:

| Category | Background Token | Text Token |
|----------|------------------|------------|
| `feature` | `--color-success-100` | `--color-success-700` |
| `fix` | `--color-danger-100` | `--color-danger-700` |
| `improvement` | `--color-info-100` | `--color-info-700` |
| `security` | `--color-warning-100` | `--color-warning-700` |
| `breaking` | `--color-danger-100` | `--color-danger-900` |
| `docs` | `--color-accent-100` | `--color-accent-700` |

---

## Component API

### `<ChangelogTimeline>`

Main timeline component.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `entries` | `ChangelogEntry[]` | **required** | Array of changelog entries |
| `maxVisible` | `number` | `8` | Entries per page |
| `showPagination` | `boolean` | `true` | Show pagination controls |
| `className` | `string` | `''` | Additional CSS class |

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

### With Category Filter

```tsx
<ChangelogTimeline
  entries={entries}
/>
```

### Grouped by Version

```tsx
<ChangelogTimeline
  entries={entries}
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

### With Markdown Descriptions

```tsx
import { marked } from 'marked';

const entries = data.map(entry => ({
  ...entry,
  description: marked(entry.description),
}));

<ChangelogTimeline entries={entries} />
```

---

## Theming

The timeline automatically adapts to light/dark themes via `@asafarim/shared-tokens`.

### Custom Theme Extension

You can extend the theme by overriding token variables:

```css
:root {
  /* Override timeline-specific tokens */
  --timeline-dot-size: 20px;
  --timeline-item-gap: var(--space-8);
  
  /* Override category colors */
  --category-feature-bg: var(--color-primary-100);
  --category-feature-text: var(--color-primary-800);
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

---

## Demo App

See `changelog-demo` in this repository for a full working example with:

- Sample data
- All features demonstrated
- Light/dark theme toggle
- Responsive layout

---

## License

MIT © ASafariM

---

## Contributing

Contributions welcome! Please ensure:

- All colors/spacing use tokens from `@asafarim/shared-tokens`
- TypeScript types are complete
- Components are accessible
- Code follows existing patterns

---
