import { existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

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

const OUTPUT_DIR = resolve(__dirname, '..', 'public_html');

export default defineConfig({
  root: 'pages',
  publicDir: resolve(__dirname, 'public'),
  server: {
    allowedHosts: [
      "test.jeremias-groehl.de"
    ]
  },
  build: {
    outDir: OUTPUT_DIR,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'pages/index.html'),
        ...pageEntries,
      },
    },
  },
});
