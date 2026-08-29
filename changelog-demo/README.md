# Changelog Timeline Demo

A Vite + React demo for [`@asafarim/changelog-timeline`](https://www.npmjs.com/package/@asafarim/changelog-timeline).

- Hosted demo: <https://alisafari-it.github.io/changelog-timeline/>
- Repository: <https://github.com/AliSafari-IT/changelog-timeline>

The app includes a live changelog timeline and a `Roadmap / Coming Soon` view showcasing planned package features.

![Changelog Timeline Demo](https://github.com/AliSafari-IT/changelog-timeline/blob/main/changelog-demo/public/changelog-demo.png?raw=true)

## Run locally

Install dependencies from the repository root:

```bash
pnpm install
```

Start the demo from the repository root:

```bash
pnpm demo
```

Or run it from this directory after building the library once:

```bash
pnpm dev
```

The demo runs at <http://localhost:5187/changelog-timeline/>.

## Views

### Live Demo

The live demo shows sample entries with:

- Category filter chips
- Version grouping
- Client-side pagination
- Left and centered timeline layouts
- Light/dark theme switching

### Roadmap / Coming Soon

The roadmap view presents the planned feature direction for the package:

- Live search and text filtering
- Markdown and rich media support
- Custom render props and slot APIs
- RSS, Atom, and JSON feed utilities
- Date-based grouping separators

## React usage example

### 1. Import the component and styles

```tsx
import { ChangelogTimeline } from "@asafarim/changelog-timeline";
import "@asafarim/changelog-timeline/css";
```

The package CSS imports `@asafarim/design-tokens`, which provides the `--asm-*` variables used by the timeline.

### 2. Provide typed entries

```tsx
import type { ChangelogEntry } from "@asafarim/changelog-timeline";

const entries: ChangelogEntry[] = [
  {
    id: "1",
    version: "2.1.0",
    date: "2024-12-10",
    category: "feature",
    title: "Add dark mode support",
    description: "Implemented full dark mode with automatic theme detection.",
    tags: ["ui", "theme"],
  },
  {
    id: "2",
    version: "2.1.0",
    date: "2024-12-09",
    category: "fix",
    title: "Fix pagination button alignment",
    description: "Corrected flexbox alignment for pagination controls.",
    tags: ["ui"],
  },
];
```

### 3. Render the timeline

```tsx
export function App() {
  return (
    <ChangelogTimeline
      entries={entries}
      title="Product updates"
      subtitle="Fresh releases and fixes"
      layout="center"
      maxVisible={6}
      showPagination
    />
  );
}
```

## Development commands

Run these commands from `changelog-demo`:

```bash
pnpm build    # Build the demo with Vite
pnpm preview  # Preview the production build
pnpm deploy   # Publish demo/dist to GitHub Pages
```

The root package must be built before `pnpm build` when the workspace library output is unavailable:

```bash
cd ..
pnpm build
cd changelog-demo
pnpm build
```

## Notes

- The timeline stylesheet is required. Import `@asafarim/changelog-timeline/css` once in the app entry point.
- Descriptions currently accept plain text. Markdown parsing and rich media rendering are roadmap items.
- The demo uses the workspace version of `@asafarim/changelog-timeline`.
