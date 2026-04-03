// @ts-check
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
   {
      ignores: ['build/**', 'node_modules/**'],
   },
   eslint.configs.recommended,
   ...tseslint.configs.recommended,
   ...tseslint.configs.strict,
   prettierConfig,
   {
      plugins: {
         prettier: prettierPlugin,
      },
      rules: {
         'prettier/prettier': 'error',
      },
   },
]);
