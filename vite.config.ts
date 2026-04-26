import { defineConfig } from 'vite';
import { resolve } from 'path';
// @ts-expect-error — JS-Modul ohne Typdeklaration
import { discoverAndGenerate, wipeOutBuildDir } from './scripts/discover.mjs';

const pagesDir = resolve(__dirname, 'pages');
const topics = discoverAndGenerate() as Array<{ slug: string; kind: 'topic' | 'page' | 'comingsoon' }>;

const pageEntries = topics
  .filter(t => t.kind === 'topic' || t.kind === 'page')
  .reduce<Record<string, string>>((acc, t) => {
    acc[t.slug] = resolve(pagesDir, t.slug, 'index.html');
    return acc;
  }, {});

const OUTPUT_DIR = '../public_html';

export default defineConfig({
  root: 'pages',
  publicDir: resolve(__dirname, 'public', OUTPUT_DIR),
  server: {
    allowedHosts: ['test.jeremias-groehl.de'],
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'pages/index.html'),
        ...pageEntries,
      },
      output: {
        dir: OUTPUT_DIR,
      },
    },
  },
  plugins: [
    {
      name: 'wipe-build-dir',
      apply: 'build',
      enforce: 'pre',
      buildStart() {
        wipeOutBuildDir();
      },
    },
    {
      name: 'regenerate-on-md-change',
      apply: 'serve',
      configureServer(server) {
        const handler = (file: string) => {
          if (file.includes('claude-learnings') && file.endsWith('.md')) {
            discoverAndGenerate();
            server.ws.send({ type: 'full-reload' });
          }
        };
        server.watcher.on('change', handler);
        server.watcher.on('add', handler);
        server.watcher.on('unlink', handler);
      },
    },
  ],
});
