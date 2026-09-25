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

The starter is the finished meal plan, with the Charted Coding skills and the checked design doc. It does not include `skill-creator`.

:::info
Skip this exercise if 301 needs the time. 201 already shows what a skill is when an agent reads one.
:::

## 🎯 Goal

A skill is authored markdown. Install `skill-creator` and write a short `codesign` skill. Stop when that skill file exists and encodes the interview.

## 📝 Steps

#### 1. Install `skill-creator` only.

```sh
npx skills add anthropics/skills --skill skill-creator
```

Do not install anything else for this exercise.

#### 2. Paste this prompt.

```text
/skill-creator create a "codesign" skill that interviews me step by step using AskUserQuestion tool
   to build a design doc markdown file in design-docs folder following this structure
  - Goals
  - Non-Goals
  - Desired Behavior
  - Design & Implementation Details
  - Testing Strategy
  - Alternatives Considered

  After each chapter interview, write the chapter to the design doc file, and pause so that I can steer or continue

  DO NOT USE READ ANY FILE FROM THIS WORKSPACE TO LEARN FROM WHILE CREATING THIS SKILL
```

#### 3. Stop when the skill exists.

`skill-creator` will try to continue into evals. That is optional. The exercise is done when a `codesign` skill file exists and describes the interview.
