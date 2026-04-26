import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync, existsSync, writeFileSync } from 'fs';

const pagesDir = resolve(__dirname, 'pages');

const pageNames = readdirSync(pagesDir).filter((name) => {
  const dir = resolve(pagesDir, name);
  return statSync(dir).isDirectory() && existsSync(resolve(dir, 'index.html'));
});

const pageEntries = pageNames.reduce<Record<string, string>>((acc, name) => {
  acc[name] = resolve(pagesDir, name, 'index.html');
  return acc;
}, {});

writeFileSync(
  resolve(pagesDir, 'pages.json'),
  JSON.stringify(pageNames, null, 2),
);

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
