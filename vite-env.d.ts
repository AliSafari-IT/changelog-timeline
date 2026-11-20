/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// CSS-only package entry (side-effect import in src/index.ts).
declare module '@asafarim/design-tokens/css';
