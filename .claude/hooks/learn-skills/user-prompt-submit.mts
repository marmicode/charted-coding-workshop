#!/usr/bin/env node

import { runAgent } from '../internal/agent.mts';
import { runHook } from '../internal/run-hook.mts';

await runHook({
  hookEventName: 'UserPromptSubmit',
  handler: async (input) => {
    throw new Error('🚧 Work in progress!');
  },
});
