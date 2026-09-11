#!/usr/bin/env node
import type {
  PostToolUseHookInput,
  SyncHookJSONOutput,
} from '@anthropic-ai/claude-agent-sdk';
import { $, stdin } from 'zx';

process.exit(await main());

async function main(): Promise<number> {
  const input = await stdin();
  const data = JSON.parse(input) as PostToolUseHookInput;
  const filePath = _filePathFromToolInput(data.tool_input);

  if (!filePath) {
    return 0;
  }

  const result =
    await $`pnpm eslint --flag v10_config_lookup_from_file ${filePath}`.nothrow();

  if (result.exitCode === 0) {
    return 0;
  }

  const lintErr =
    `${result.stderr}${result.stdout}`.trim() || 'ESLint failed with no output';

  _printHookJsonOutput({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: `ESLint reported issues in the file you just edited (${filePath}).
Fix the issues that are related to the changes you made even if it's not caused by the changes you made.
Boy scout rule: leave the code better than you found it.
        
        ${lintErr}`,
    },
  });

  return 0;
}

function _printHookJsonOutput(output: SyncHookJSONOutput): void {
  console.log(JSON.stringify(output));
}

function _filePathFromToolInput(toolInput: unknown): string | undefined {
  if (
    typeof toolInput === 'object' &&
    toolInput !== null &&
    'file_path' in toolInput &&
    typeof toolInput.file_path === 'string'
  ) {
    return toolInput.file_path;
  }
}
