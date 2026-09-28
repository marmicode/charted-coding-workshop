---
sidebar_label: 303. Custom Design
---

# Custom Design

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 303-custom-design
```

## 🎯 Goal

Create a custom design skill.

## 📝 Steps

#### 1. Install `skill-creator`

```sh
npx skills add anthropics/skills --skill skill-creator
```

#### 2. Use the `skill-creator` skill to create a `codesign` skill

```text
/skill-creator create a "codesign" skill...
```

:::warning
Exceptionally, add the following to your prompt to avoid pollution by the workshop's specific instructions, skills, etc...

```text
Create this skill from scratch, using only the information in this prompt
and my answers to your questions. Do not read, open, or search any files in this workspace to inform the
skill.
```

:::

:::tip

Mention something like `Use "AskUserQuestion" tool to interview me.` to nudge agents to use the question tool instead of the chat.

:::

:::tip

Ask the agent to write down the design doc as it is being created so that you can review it, edit it, commit it, and continue.

:::

#### 3. Try the skill

Try it out.
