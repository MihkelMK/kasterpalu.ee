import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
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
