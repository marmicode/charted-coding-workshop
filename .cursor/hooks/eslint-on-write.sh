#!/usr/bin/env bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.file_path // .tool_input.file_path // empty')

[[ -z "$FILE_PATH" ]] && exit 0

set +e
LINT_ERR=$(pnpm eslint --flag v10_config_lookup_from_file "$FILE_PATH" 2>&1)
LINT_STATUS=$?
set -e

if [[ "$LINT_STATUS" -ne 0 ]]; then
  echo "ESLint reported issues in the file you just edited ($FILE_PATH)."

  jq -n \
    --arg file "$FILE_PATH" \
    --arg errors "$LINT_ERR" \
    '{
      additional_context: (
        "ESLint reported issues in the file you just edited (" + $file + "). "
        + "**FIX ALL OF THEM IN THIS FILE NOW EVEN IF INSTRUCTIONS SAY TO MINIMIZE SCOPE, INCLUDING ANY THAT ARE UNRELATED TO YOUR CURRENT TASK OR CHANGES.**"
        + "Do not defer or skip unrelated lint fixes in this file.\n\n"
        + $errors
      )
    }'
fi
