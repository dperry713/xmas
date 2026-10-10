import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';

function staticHtmlPlugin(): Plugin {
  return {
    name: 'static-html-plugin',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html
          .replace(/<script type="module" crossorigin src="\.\/assets\/index-[^"]+\.js"><\/script>/g, '<script type="module" src="./src/main.ts"></script>')
          .replace(/<link rel="stylesheet" crossorigin href="\.\/assets\/index-[^"]+\.css">/g, '<link rel="stylesheet" href="./src/style.css">');
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [staticHtmlPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
