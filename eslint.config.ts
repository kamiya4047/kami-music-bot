import { defineConfig } from 'eslint/config';

import javascript from '@eslint/js';
import prettyImport from '@kamiya4047/eslint-plugin-pretty-import';
import stylistic from '@stylistic/eslint-plugin';
import typescript from 'typescript-eslint';

export default defineConfig(
  {
    files: [
      'src/**/*.ts',
      'tools/**/*.ts',
      'eslint.config.ts',
      'rollup.config.ts',
      'drizzle.config.ts',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  javascript.configs.recommended,
  ...typescript.configs.recommendedTypeChecked,
  ...typescript.configs.stylisticTypeChecked,
  prettyImport.configs.warn,
  stylistic.configs.customize({
    arrowParens: true,
    semi: true,
  }),
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
);
