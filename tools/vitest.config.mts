import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      reporters: ['default'],
      coverage: {
        reportsDirectory: '../coverage/tools',
        provider: 'v8',
      },
      environment: 'node',
      include: ['**/*.spec.ts'],
      watch: false,
      pool: 'threads',
      isolate: false,
    },
  }),
);
