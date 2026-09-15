import nx from '@nx/eslint-plugin';
import { modularLayeredDepConstraints } from './tools/eslint/modular-layered-dep-constraints.mjs';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: modularLayeredDepConstraints,
        },
      ],
    },
  },
  {
    files: [
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/test-setup.ts',
      '**/vitest.config.*',
    ],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
