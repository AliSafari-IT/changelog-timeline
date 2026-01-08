import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.BASE_PATH || '/changelog-timeline/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5187,
  },
  css: {
    devSourcemap: true,
  },
});