# changelog-demo

Local demo app for `@asafarim/changelog-timeline`.

## Run

From `packages/changelog-timeline/changelog-demo`:

```bash
pnpm dev
```

## React usage example

### 1) Import the component + styles

```tsx
import { ChangelogTimeline } from "@asafarim/changelog-timeline";
import "@asafarim/changelog-timeline/styles.css";
import "@asafarim/shared-tokens/styles.css";
```

### 2) Provide entries

```tsx
import type { ChangelogEntry } from "@asafarim/changelog-timeline";

const entries: ChangelogEntry[] = [
  {
    id: "1",
    version: "2.1.0",
    date: "2024-12-10",
    category: "feature",
    title: "Add dark mode support",
    description: "Implemented full dark mode with automatic theme detection",
    tags: ["ui", "theme"],
  },
  {
    id: "2",
    version: "2.1.0",
    date: "2024-12-09",
    category: "fix",
    title: "Fix pagination button alignment",
    description: "Corrected flexbox alignment for pagination controls",
    tags: ["ui"],
  },
];
```

### 3) Render

```tsx
export function App() {
  return (
    <ChangelogTimeline
      entries={entries}
      maxVisible={6}
      showPagination={true}
    />
  );
}
```

## Notes

- **CSS is required**: if you don’t import `@asafarim/changelog-timeline/styles.css`, the timeline will render unstyled.

