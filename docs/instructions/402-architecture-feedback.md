---
sidebar_label: 402. Architecture Feedback
---

# Architecture Feedback

## Prerequisites

🚨 Did you set up `pnpm`? Are you on the right branch?

👉 [Initial Setup](./000-setup.md)

## Setup

```sh
pnpm cook start 402-architecture-feedback
```

The workspace is now using Nx implicit libraries and Nx eslint rules to enforce module boundaries.

## 🎯 Goal

Configure

## 📝 Steps

#### 1. Try this prompt

```text
In apps/whiskmate/src/app/recipe/ui-search/recipe-filter.ng.ts inject `RecipeRepository` and load categories for the dropdown.
```

Make sure the generated code is importing `RecipeRepository` within `recipe-filter.ng.ts` component then revert the change.

#### 2. Fill `tools/eslint/dep-constraints.mts`.

Update `depConstraints` to prevent modules of type `ui` from importing modules of type `infra`.

#### 3. Point ESLint at that graph.

Update `eslint.config.mjs` to point the source-file rule at `depConstraints` and the spec rule at `testDepConstraints`.

#### 4. Try the prompt again
