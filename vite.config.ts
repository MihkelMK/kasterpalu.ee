import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Vite externalises node_modules by default, so anything left external has to be a
  // runtime dependency and ship in the production image. Bundling these keeps them dev
  // dependencies instead.
  //
  // altcha-lib is pure ESM and lists @sveltejs/kit as an optional peer, which pnpm then
  // links, pulling kit, svelte, vite, esbuild and typescript into the image.
  // @spotify/web-api-ts-sdk has no runtime dependencies of its own; bundling it just drops
  // one more package from the image.
  ssr: {
    noExternal: ['altcha-lib', '@spotify/web-api-ts-sdk'],
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
