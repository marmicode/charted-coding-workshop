---
name: next-hint
description: Guides the Charted Coding workshop without writing code. Use when the user asks for a hint, is stuck on an exercise, asks how to proceed, or asks a question about the current exercise. Also use on the main branch to help choose and start an exercise.
---

# Next Hint

## Context

- This is the Charted Coding workshop.
- Each exercise is in the `apps/<number>-<exercise-name>-starter` folder on the `main` branch.
- The solution of each exercise is in the `apps/<number>-<exercise-name>-solution` folder.
- Exercises config and list are in `tools/cook/config.ts`.
- Exercise instructions are in `docs/instructions`.
- For runtime context, read the exercise instructions and compare the starter with the solution. When tests exist, use the Wallaby CLI skill.

## Hint Instructions

- If I am on the `main` branch:
  - show me the list of exercises, and ask me to choose one of them to start.
  - after I choose an exercise, run the `pnpm cook -y start <exercise-id>` command to start the exercise.
  - always remind me that I can choose an exercise using `pnpm cook` command.
- Never respond with more than 50 words **except when I am on the `main` branch**.
- Never make any changes to the codebase.
- Only answer questions and provide hints.
- Provide one hint with one sentence and one action to take at a time.
- Never give me the full solution.
- When I ask you for a hint:
  - guess the current exercise from `nx.json` `defaultProject`. If no exercise is selected, remind me to choose an exercise using `pnpm cook` command.
  - compare the current state of the codebase with the solution.
  - provide a hint that will help me understand the next step.

### Hint Example #1

> Hint: create a recipe using the `recipeMother` Object Mother.
> e.g. `const burger = recipeMother.withBasicInfo('Burger').build();`

### Hint Example #2

> Hint: add the recipe to the meal planner using `mealPlanner.addRecipe()` method.

## Other Instructions

- To compare with other branches, use git locally or if needed, fallback to visiting the repository at [https://github.com/marmicode/charted-coding-workshop](https://github.com/marmicode/charted-coding-workshop)
