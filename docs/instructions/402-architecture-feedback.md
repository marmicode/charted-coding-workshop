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

The starter has the meal plan, the Charted Coding skills, the ESLint hook from 401, and the implicit libraries. `depConstraints` is an empty array. The on-write hook is already wired.

## 🎯 Goal

Finish the module-boundary graph, then point ESLint at it. A boundary the agent never hears is not a wall. Finish the graph before you paste the prompt.

## 📝 Steps

#### 1. Fill `tools/eslint/dep-constraints.mts`.

`depConstraints` is `[]`. `scope()`, `type()`, and `testDepConstraints` are already there. The file comment links to the cookbook for scopes, types, and `allowedExternalImports`.

Fill the graph. Leave `scope()`, `type()`, and `testDepConstraints` as they are.

#### 2. Point ESLint at that graph.

`eslint.config.mjs` already imports `depConstraints` and `testDepConstraints`. Source files and specs both use `sourceTag: '*'` and `onlyDependOnLibsWithTags: ['*']`.

- Point the source-file rule at `depConstraints`.
- Point the spec rule at `testDepConstraints`.

The libraries, `index.ts` entry points, implicit-libs plugin, path aliases, and `.claude/hooks/eslint-on-write.mts` are already done.

#### 3. Paste this prompt only after ESLint uses your graph.

```text
in apps/whiskmate/src/app/recipe/ui-search/recipe-filter.ng.ts inject RecipeRepository and load categories for the dropdown.
```
