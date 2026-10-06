#!/usr/bin/env node

import { z } from 'zod';
import { $ } from 'zx';
import { runHook } from './internal/run-hook.mts';

const toolInputSchema = z.object({
  file_path: z.string(),
});

await runHook({
  hookEventName: 'PostToolUse',
  handler: async (input) => {
    const toolInput = toolInputSchema.parse(input.tool_input);

    const result =
      await $`pnpm eslint --flag v10_config_lookup_from_file ${toolInput.file_path}`.nothrow();

    if (result.exitCode === 0) {
      return;
    }

    const lintErr =
      `${result.stderr}${result.stdout}`.trim() ||
      'ESLint failed with no output';

    return {
      output: {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `ESLint reported issues in the file you just edited (${toolInput.file_path}).
  Fix the issues that are related to the changes you made even if it's not caused by the changes you made.
  Boy scout rule: leave the code better than you found it.
          
          ${lintErr}`,
        },
      },
    };
  },
});
