import { existsSync, readdirSync, statSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const pagesDir = resolve(__dirname, 'pages');

// Top-level page = directory under pages/ with an index.html.
// The `claude-learnings` submodule is sourced via symlinks at the top level
// (e.g. pages/art-advanced → pages/claude-learnings/art-advanced), so its
// HTML topics show up here naturally and build to clean root URLs.
const pageNames = readdirSync(pagesDir).filter((name) => {
  if (name === 'claude-learnings') return false;
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
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    allowedHosts: [
      "test.jeremias-groehl.de"
    ]
  },
  build: {
    outDir: OUTPUT_DIR,
    emptyOutDir: true,
    rollupOptions: {
      preserveSymlinks: true,
      input: {
        index: resolve(__dirname, 'pages/index.html'),
        ...pageEntries,
      },
    },
  },
});
