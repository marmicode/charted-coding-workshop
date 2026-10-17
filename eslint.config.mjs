import nx from '@nx/eslint-plugin';
import {
  depConstraints,
  testDepConstraints,
} from './tools/eslint/dep-constraints.mts';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/vitest.config.*.timestamp*'],
  },
  {
    files: ['**/*.ts'],
    ignores: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/test-setup.ts',
      '**/vite.config.ts',
      '**/workspace/**/*.ts',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          depConstraints,
        },
      ],
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          depConstraints: testDepConstraints,
        },
      ],
    },
  },
];
