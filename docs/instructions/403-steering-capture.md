---
sidebar_label: 403. Steering Capture
---

# Steering Capture

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 403-steering-capture
```

`save-learnings` is already installed and already reads `learnings.txt`. The two learn-skills hooks throw.

:::warning
Ignore `learning-session-repository.mts` and `detect-steering-in-user-prompt.md`. They are not the path for this exercise.
:::

## 🎯 Goal

Replace the two throws so a steer is appended to `learnings.txt`, and so the agent reminds you to run `/save-learnings`. Finish both hooks before you paste the prompt.

## 📝 Steps

#### 1. Leave `.claude/settings.json` as it is.

It already wires `UserPromptSubmit` to `.claude/hooks/learn-skills/user-prompt-submit.mts` (`async`, timeout 120) and `Stop` to `.claude/hooks/learn-skills/stop.mts` (timeout 30).

#### 2. Replace the `UserPromptSubmit` throw.

`user-prompt-submit.mts` already imports `runAgent` and `runHook`. The handler throws `🚧 Work in progress!`.

- If `input.prompt` contains `save-learnings`, return.
- Otherwise call `runAgent` with the prompt and ask for reusable steering as a list of descriptions (`- Do X instead of Y`).
- If there is no steering pattern, the agent returns an empty string and nothing else.
- Append the result to `learnings.txt` under a `## Session (${input.transcript_path})` heading.

#### 3. Replace the `Stop` throw.

`stop.mts` already imports `runHook`. The handler throws `🚧 Work in progress!`.

- If `input.stop_hook_active` is set, return.
- Read `learnings.txt`. A missing file or an empty file returns nothing.
- Any other content sends `Stop` `additionalContext`: the learnings, then this reminder: `Remind me to run /save-learnings to save them.`

`runHook`, `runAgent`, and `save-learnings` are already written. Do not edit that skill.

#### 4. Paste this prompt only after neither handler throws.

```text
When a store exposes a signal, return it with asReadonly(). Do not return the writable signal.
```

#### 5. Run `/save-learnings`.

That command contains `save-learnings`, so `UserPromptSubmit` should not append it.
