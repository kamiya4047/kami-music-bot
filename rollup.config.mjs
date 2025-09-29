import { resolve } from 'node:path';

import { defineConfig } from 'rollup';

import alias from '@rollup/plugin-alias';
import builtins from 'builtin-modules';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json' with { type: 'json' };

const external = [
  ...Object.keys(pkg.dependencies),
  ...builtins,
];

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
  },
  external: (id) => {
    if (external.includes(id)) return true;
    for (const name of external) if (id.startsWith(name + '/')) return true;
    return false;
  },
  plugins: [
    json(),
    terser(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
    alias({
      entries: [
        { find: '@', replacement: resolve(import.meta.dirname, 'src') },
        { find: '~', replacement: resolve(import.meta.dirname) },
      ],
    }),
  ],
});
