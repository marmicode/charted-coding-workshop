#!/usr/bin/env node
import { runHook } from '../internal/run-hook.mts';

await runHook({
  hookEventName: 'Stop',
  handler: async (input) => {
    throw new Error('🚧 Work in progress!');
  },
});
