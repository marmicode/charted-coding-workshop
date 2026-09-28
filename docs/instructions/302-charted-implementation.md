---
sidebar_label: 302. Charted Implementation
---

# Charted Implementation

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 302-charted-implementation
```

The design doc is already at `design-docs/001-weekly-meal-plan.md`. There is no meal-plan code yet.

## 🎯 Goal

Implement the meal plan using charted coding skills.

**The goal is to try and feel the right step granularity.**

Design doc is at `design-docs/001-weekly-meal-plan.md`.

### Skills usage

```text
/charted-scaffold <design-doc> <PR-number>
/charted-red <design-doc> <PR-number>
/charted-green <design-doc> <PR-number>

# Or if you do not even remember where you are at:
/charted-continue [design-doc] [PR-number]
```

:::tip
You can write all tests or fix all tests at once with such prompts: `/charted-red all tests` or `/charted-green all tests`
:::

:::tip
You can compose the skills with prompts such as:

```text
Keep on invoking `charted-continue` skill with PR#YOUR_PR_NUMBER_HERE until all tasks and tests are completed.
Do not start working on another PR automatically.
```

:::
