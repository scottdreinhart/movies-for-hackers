import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { readFileSync, readFile, copyFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Vite plugin: pre-parse movie_list.md → JSON at build time.
 * Exposes a virtual module `virtual:movie-data` that exports the parsed array,
 * eliminating the runtime fetch + parse cost in production builds.
 *
 * Imports the shared parseMarkdown() from src/services/markdownParser.js
 * so parsing logic is never duplicated.
 */
function movieDataPlugin() {
  const virtualId = 'virtual:movie-data';
  const resolvedVirtualId = '\0' + virtualId;
  const mdPath = resolve(__dirname, 'movie_list.md');

  return {
    name: 'movie-data',
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId;
    },
    async load(id) {
      if (id !== resolvedVirtualId) return;
      const { parseMarkdown } = await import('./src/services/markdownParser.ts');
      const md = readFileSync(mdPath, 'utf-8');
      const entries = parseMarkdown(md);
      return `export default ${JSON.stringify(entries)};`;
    },
  };
}

export default defineConfig({
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-virtual';
          }
        },
      },
    },
  },
  plugins: [
    react(),
    movieDataPlugin(),
    {
      name: 'serve-movie-list',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/movie_list.md') {
            const filePath = resolve(__dirname, 'movie_list.md');
            readFile(filePath, 'utf-8', (err, content) => {
              if (err) return next();
              res.setHeader('Content-Type', 'text/plain; charset=utf-8');
              res.setHeader('Cache-Control', 'no-cache');
              res.end(content);
            });
          } else {
            next();
          }
        });
      },
      closeBundle() {
        const src = resolve(__dirname, 'movie_list.md');
        const distDir = resolve(__dirname, 'dist');
        if (existsSync(src)) {
          if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });
          copyFileSync(src, resolve(distDir, 'movie_list.md'));
        }
      },
    },
  ],
});
