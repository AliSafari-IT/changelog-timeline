import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts({ include: ['src'] })],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ChangelogTimeline',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // Match subpaths too (react/jsx-runtime, react-dom/client) so the
      // host app's React is used instead of a bundled copy.
      external: [/^react(\/.*)?$/, /^react-dom(\/.*)?$/],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});