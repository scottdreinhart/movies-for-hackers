/// <reference types="vite/client" />

/** CSS Modules — every import resolves to a string-keyed map of class names. */
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

/** Virtual module: pre-parsed movie data injected by Vite plugin at build time. */
declare module 'virtual:movie-data' {
  import type { MovieEntry } from './index';
  const entries: MovieEntry[];
  export default entries;
}
