#!/usr/bin/env node

import { z } from 'zod';
import { $ } from 'zx';
import { runHook } from './run-hook.mts';

const toolInputSchema = z.object({
  file_path: z.string(),
});

await runHook({
  hookEventName: 'PostToolUse',
  handler: async (input) => {
    throw new Error('🚧 Work in progress!');
  },
});
