# changelog-demo

Local demo app for `@asafarim/changelog-timeline`.

## Run

From `packages/changelog-timeline/changelog-demo`:

```bash
pnpm dev
```

## Usage

The demo renders the component directly from `src/main.tsx`.

Required imports:

```ts
import "@asafarim/changelog-timeline/styles.css";
import "@asafarim/shared-tokens/styles.css";
```

If you don’t include the `styles.css` import, the timeline will render unstyled because the library’s CSS is emitted as a separate bundle in Vite library mode.
