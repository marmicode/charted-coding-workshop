---
sidebar_label: 401. Fast Feedback
---

# Fast Feedback

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 401-fast-feedback
```

An eslint rule already forbids `Date` and recommends usage of `ClockAdapter` instead.

We want the agent to catch these simple issues as early as possible.

## 🎯 Goal

Write the on-write ESLint hook so a lint failure comes back to the agent.

## 📝 Steps

#### 1. Paste this prompt before you wire the hook

```text
In apps/whiskmate/src/app/meal-plan/meal-plan-store.ts `assign`,
prompt user with "are you still hungry?" if current date is december 25th
```

Make sure the generated code is using `Date` instead of `ClockAdapter` then revert the change.

#### 2. Implement the hook

- Edit `.claude/hooks/eslint-on-write.mts`.

- Parse `input.tool_input` with `toolInputSchema`. _(See [hook input schema](https://code.claude.com/docs/en/hooks#:~:text=Creates%20or%20overwrites%20a%20file))_

- Use `zx` to run eslint on the file:

```ts
$`pnpm eslint --flag v10_config_lookup_from_file ${toolInput.file_path}`.nothrow();
```

- If the eslint command exits with code 0, then everything is fine. Return nothing.

- If there is a proble, return an output with `hookSpecificOutput` containing `additionalContext` which will be served as a prompt to the agent:

```text
ESLint reported issues in the file you just edited (${toolInput.file_path}).
Fix the issues that are related to the changes you made even if it's not caused by the changes you made.
Boy scout rule: leave the code better than you found it.

${lintErr}
```

#### 3. Wire the hook

Register the hook in `.claude/settings.json`.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/eslint-on-write.mts",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

#### 4. Try the prompt again in a new session
