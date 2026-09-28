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

## 🎯 Goal

Edit `.claude/hooks/learn-skills/user-prompt-submit.mts` and `.claude/hooks/learn-skills/stop.mts` hooks to respectively:

- append any steering captured from the user prompt to `learnings.txt`
- then remind you to run `/save-learnings` after the turn ends.

## 📝 Steps

#### 1. Implement the `UserPromptSubmit` hook

`user-prompt-submit.mts` already imports `runAgent` and `runHook`. The handler throws `🚧 Work in progress!`.

- Call `runAgent` with the prompt from `internal/detect-steering-in-user-prompt.md` combined with the user prompt from `input.prompt`

```ts
const prompt = `
${detectSteeringInUserPrompt}

## User prompt to classify

${input.prompt}
`;

const result = await runAgent(prompt);
```

- If there is no steering pattern, the agent returns an empty string and nothing else.

- Append the result to `learnings.txt` under a `## Session (${input.transcript_path})` heading.

```ts
import { writeFileSync } from 'node:fs';

writeFileSync('learnings.txt', `## Session (${input.transcript_path})\n${result}\n`, { flag: 'a' });
```

:::tip
Add a guard that returns if `input.prompt` contains `save-learnings` to avoid asking user to save learnings when the prompt is about saving learnings.
:::

#### 2. Implement the `Stop` hook

- Read `learnings.txt`. A missing file or an empty file returns nothing.
- Any other content sends `Stop` `additionalContext`: the learnings, then this reminder: `Remind me to run /save-learnings to save them.`

```ts
const learnings = readFileSync('learnings.txt', 'utf8');
```

#### 3. Try the following prompt

```text
In meal-planner-store.ts, use `@Service()` instead of `@Injectable()` decorator.
```

#### 4. Run `/save-learnings`
