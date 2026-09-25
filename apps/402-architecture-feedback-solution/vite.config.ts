import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/402-architecture-feedback-solution',
  publicDir: 'public',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [angular()],
});
