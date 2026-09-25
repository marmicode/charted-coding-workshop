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

The starter is the finished meal plan. `ClockAdapter` is unused. An ESLint rule already forbids `Date` and says `Use ClockAdapter instead of Date.` The hook that would report that failure still throws.

## 🎯 Goal

Write the on-write ESLint hook so a lint failure comes back to the agent. Finish the hook before you paste the prompt.

## 📝 Steps

#### 1. Wire the hook.

`.claude/settings.json` ships `"hooks": {}`. Register `PostToolUse` for `Edit|Write`.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/eslint-on-write.mts",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

#### 2. Replace the throw.

`.claude/hooks/eslint-on-write.mts` already imports `zod`, `zx`, and `runHook`, and it already declares `toolInputSchema` with `file_path`. The handler throws `🚧 Work in progress!`.

- Parse `input.tool_input` with `toolInputSchema`.
- Run `pnpm eslint --flag v10_config_lookup_from_file` on `file_path`.
- Exit 0 means return nothing.
- Any other exit sends the lint output back as `PostToolUse` `additionalContext`, and tells the agent to fix the issues in the file it just edited.

`run-hook.mts` and the `Date` rule are already done. Do not rewrite them.

#### 3. Paste this prompt only after the hook no longer throws.

```text
in apps/whiskmate/src/app/meal-plan/meal-plan-store.ts's `assign`,
prompt user with "are you still hungry?" if current date is december 25th
```
