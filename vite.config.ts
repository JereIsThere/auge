import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

const pagesDir = resolve(__dirname, 'pages');

const pageEntries = readdirSync(pagesDir)
  .filter((name) => statSync(resolve(pagesDir, name)).isDirectory())
  .reduce<Record<string, string>>((acc, name) => {
    acc[name] = resolve(pagesDir, name, 'index.html');
    return acc;
  }, {});

export default defineConfig({
  root: 'pages',
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'pages/index.html'),
        ...pageEntries,
      },
    },
  },
});
