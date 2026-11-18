import { config } from '@websites/eslint-config';
import svelteConfig from './svelte.config.js';

export default config({
  root: import.meta.dirname,
  svelte: svelteConfig,
  // shadcn-svelte components, edited only via the CLI, and paraglide's project folder
  ignores: ['src/lib/components/ui/**', 'project.inlang/**'],
});
