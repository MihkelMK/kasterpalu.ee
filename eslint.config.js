import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import sonarjs from 'eslint-plugin-sonarjs';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
  includeIgnoreFile(gitignorePath),
  // shadcn-svelte generated components, edited only via the CLI
  { ignores: ['src/lib/components/ui/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  sonarjs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],

    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
    rules: {
      // sonarjs cannot see that Svelte snippets ({@render foo()}) return template output;
      // it flags every snippet call as "empty return value". Disable for Svelte files.
      'sonarjs/no-use-of-empty-return-value': 'off',
    },
  }
);
