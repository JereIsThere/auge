import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone-Build: erzeugt server.js + alle Deps gebündelt
  // → kein node_modules auf dem Server nötig, rsync des standalone/-Ordners reicht
  output: 'standalone',
  typedRoutes: true,
};

export default nextConfig;
