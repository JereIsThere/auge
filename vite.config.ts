import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

const pagesDir = resolve(__dirname, 'pages');

import { existsSync } from 'fs';

const pageEntries = readdirSync(pagesDir)
  .filter((name) => {
    const dir = resolve(pagesDir, name);
    return statSync(dir).isDirectory() && existsSync(resolve(dir, 'index.html'));
  })
  .reduce<Record<string, string>>((acc, name) => {
    acc[name] = resolve(pagesDir, name, 'index.html');
    return acc;
  }, {});

export default defineConfig({
  root: 'pages',
  publicDir: resolve(__dirname, 'public'),
  server: {
    allowedHosts: [
      "test.jeremias-groehl.de"
    ]
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'pages/index.html'),
        ...pageEntries,
      }, output: {
        dir: "../public_html"
      }
    },
  },
});
