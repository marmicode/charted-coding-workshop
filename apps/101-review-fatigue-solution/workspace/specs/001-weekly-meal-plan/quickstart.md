# Quickstart: Weekly Meal Plan

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

Validation guide for confirming the feature works end-to-end after implementation. See [data-model.md](./data-model.md) and [contracts/](./contracts/) for structural details.

## Prerequisites

- Node.js and dependencies installed (`npm install` or `pnpm install` at repo root)
- No backend services required (client-side app with `localStorage`)

## Run the application

```sh
npx nx serve whiskmate
```

Open `http://localhost:4200/meal-plan` (port may vary; check terminal output).

## Run tests

```sh
npx nx test whiskmate
```

Expected: all meal plan service and component tests pass.

## Lint

```sh
npx nx lint whiskmate
```

## Manual validation scenarios

### Scenario 1: View empty weekly plan (P2)

**Steps**:

1. Clear meal plan storage: DevTools → Application → Local Storage → remove `whiskmate:meal-plan`
2. Navigate to `/meal-plan`

**Expected**:

- `[data-testid="meal-plan-page"]` is visible
- Seven day slots (`day-slot-monday` through `day-slot-sunday`) are shown
- `[data-testid="meal-plan-empty"]` prompts user to start planning
- Each empty day shows `[data-testid="day-slot-empty"]`

### Scenario 2: Assign a recipe to a day (P1)

**Steps**:

1. On `/meal-plan`, click `[data-testid="day-slot-add"]` on Tuesday
2. In `[data-testid="recipe-picker"]`, select any recipe
3. The picker closes after the selection

**Expected**:

- `[data-testid="day-slot-tuesday"]` shows `[data-testid="day-slot-recipe-name"]` with the chosen recipe name
- `[data-testid="meal-plan-empty"]` is no longer visible
- Other days remain empty

### Scenario 3: Replace a recipe (P1 / FR-004)

**Steps**:

1. With Tuesday assigned, click `[data-testid="day-slot-change"]` on Tuesday
2. Select a different recipe

**Expected**:

- Tuesday shows the new recipe name (not the previous one)

### Scenario 4: Remove a recipe (P3)

**Steps**:

1. Click `[data-testid="day-slot-remove"]` on Tuesday

**Expected**:

- Tuesday shows `[data-testid="day-slot-empty"]`
- Recipe still appears on `/search` (not deleted from collection)

### Scenario 5: Same recipe on multiple days (FR-008)

**Steps**:

1. Assign recipe A to Monday
2. Assign the same recipe A to Thursday

**Expected**:

- Both Monday and Thursday show recipe A
- Removing from Monday leaves Thursday unchanged

### Scenario 6: Persistence across refresh (SC-003)

**Steps**:

1. Assign at least one recipe
2. Refresh the browser
3. Return to `/meal-plan`

**Expected**:

- Assignments are unchanged (same week)

### Scenario 7: Missing recipe id (FR-011)

**Steps**:

1. Assign a recipe to a day
2. In DevTools, edit `whiskmate:meal-plan` JSON and set that recipe ID to a non-existent value
3. Refresh `/meal-plan`

**Expected**:

- The affected day shows `[data-testid="day-slot-empty"]`
- The weekday slot is still present
- `[data-testid="day-slot-broken"]` is absent
- The user can add a recipe to that day

### Scenario 8: Template does not reset with the calendar

**Steps**:

1. Assign recipes to Monday and Sunday
2. In DevTools, confirm `whiskmate:meal-plan` has weekday keys and no `weekKey`
3. Refresh `/meal-plan`

**Expected**:

- Monday and Sunday still show those recipes
- The page still lists Monday through Sunday

## Navigation check

1. From any page, click **MEAL PLAN** in the navbar
2. Confirm route is `/meal-plan` and link has `active` class
3. Click **SEARCH** and confirm navigation back to `/search`

## Success criteria mapping

| Criterion                       | Validated by                                                           |
| ------------------------------- | ---------------------------------------------------------------------- |
| SC-001: Assign in under 30s     | Scenarios 2–3 (subjective timing during manual run)                    |
| SC-002: Identify today's meal   | Scenario 2 + locate current weekday slot                               |
| SC-003: Persist across sessions | Scenario 6                                                             |
| SC-004: Add, replace, or remove | Scenarios 2–5. Replace overwrites without a confirmation dialog        |
| SC-005: Return visits           | Out of scope for automated quickstart; track in analytics post-release |

## Troubleshooting

| Issue                           | Check                                                                  |
| ------------------------------- | ---------------------------------------------------------------------- |
| Plan always empty after refresh | `whiskmate:meal-plan` in localStorage contains the weekday assignments |
| Recipe picker shows no recipes  | `/search` works; `RecipeRepository` returns data                       |
| Stored JSON has a `weekKey`     | The template has no week key. Assignments are the seven weekday fields |
