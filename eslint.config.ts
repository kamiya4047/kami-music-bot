import { defineConfig } from 'eslint/config';

import javascript from '@eslint/js';
import perfectionist from 'eslint-plugin-perfectionist';
import prettyImport from '@kamiya4047/eslint-plugin-pretty-import';
import stylistic from '@stylistic/eslint-plugin';
import typescript from 'typescript-eslint';

export default defineConfig(
  {
    files: [
      'src/**/*.ts',
      'tools/**/*.ts',
      'eslint.config.ts',
      'rollup.config.mjs',
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
  perfectionist.configs['recommended-alphabetical'],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/restrict-template-expressions': ['off'],
    },
  },
  {
    name: 'disables',
    rules: {
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
    },
  },
);
