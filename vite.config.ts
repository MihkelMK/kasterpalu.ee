import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // altcha-lib is pure ESM and lists @sveltejs/kit as an optional peer. Left external it
  // has to be a runtime dependency, and pnpm then links that peer. This pulls kit, svelte,
  // vite, esbuild and typescript into the production image. Bundling it keeps it a dev
  // dependency instead.
  ssr: {
    noExternal: ['altcha-lib'],
  },
  plugins: [
    enhancedImages(),
    tailwindcss(),
    sveltekit(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
      strategy: ['url', 'cookie', 'baseLocale'],
      urlPatterns: [
        // API routes - no locale prefix
        {
          pattern: '/api/:path(.*)?',
          localized: [
            ['et', '/api/:path(.*)?'],
            ['en', '/api/:path(.*)?'], // Same path for all locales
          ],
        },
        // Other routes - use locale prefix for non baseLocale
        {
          pattern: '/:path(.*)?',
          localized: [
            ['et', '/et/:path(.*)?'],
            ['en', '/en/:path(.*)?'],
          ],
        },
      ],
    }),
  ],
});
