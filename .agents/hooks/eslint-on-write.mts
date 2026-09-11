#!/usr/bin/env node
import { $, stdin } from 'zx';

const input = await stdin();
const data = JSON.parse(input) as {
  file_path?: string;
  tool_input?: { file_path?: string };
};
const filePath = data.file_path ?? data.tool_input?.file_path;

if (!filePath) {
  process.exit(0);
}

const result =
  await $`pnpm eslint --flag v10_config_lookup_from_file ${filePath}`.nothrow();

if (result.exitCode !== 0) {
  const lintErr =
    `${result.stderr}${result.stdout}`.trim() || 'ESLint failed with no output';

  const additional_context =
    `ESLint reported issues in the file you just edited (${filePath}). ` +
    '**FIX ALL OF THEM IN THIS FILE NOW EVEN IF INSTRUCTIONS SAY TO MINIMIZE SCOPE, INCLUDING ANY THAT ARE UNRELATED TO YOUR CURRENT TASK OR CHANGES.**' +
    'Do not defer or skip unrelated lint fixes in this file.\n\n' +
    lintErr;

  console.log(JSON.stringify({ additional_context }));
}
