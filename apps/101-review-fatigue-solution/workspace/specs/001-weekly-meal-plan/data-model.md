# Data Model: Weekly Meal Plan

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

## Overview

The meal plan links existing `Recipe` entities to weekday slots in a Monday–Sunday template. It is not a dated calendar week. No new recipe fields are introduced; assignments store recipe IDs only.

## Entities

### Weekday

Represents one of the seven days in a weekly plan (Monday-first).

| Value       | Display label |
| ----------- | ------------- |
| `monday`    | Monday        |
| `tuesday`   | Tuesday       |
| `wednesday` | Wednesday     |
| `thursday`  | Thursday      |
| `friday`    | Friday        |
| `saturday`  | Saturday      |
| `sunday`    | Sunday        |

**Ordering**: Fixed array `[monday, tuesday, wednesday, thursday, friday, saturday, sunday]` used for rendering and iteration.

### Recipe (existing)

Defined in `apps/whiskmate/src/app/recipe/recipe.ts`. Referenced by meal plan assignments; not owned or modified by the meal plan feature.

| Field        | Type     | Notes                               |
| ------------ | -------- | ----------------------------------- |
| `id`         | `string` | Stored in assignments               |
| `name`       | `string` | Displayed on plan (FR-009)          |
| `pictureUri` | `string` | Displayed on the day slot (FR-009)  |
| Other fields | —        | Not required for plan display in v1 |

### RecipeAssignment

A link between a weekday slot and a recipe ID in the Monday–Sunday template.

| Field      | Type      | Required | Rules                                                       |
| ---------- | --------- | -------- | ----------------------------------------------------------- |
| `day`      | `Weekday` | yes      | One assignment per weekday                                  |
| `recipeId` | `string`  | yes      | Must exist in recipe collection at assignment time (FR-010) |

### DaySlot (view model)

Runtime representation of a single day in the UI. Not persisted directly.

| Field      | Type                    | Description                                  |
| ---------- | ----------------------- | -------------------------------------------- |
| `day`      | `Weekday`               | Which day this slot represents               |
| `recipeId` | `string \| null`        | Assigned recipe ID, or null if unplanned     |
| `status`   | `'empty' \| 'assigned'` | Derived state for rendering                  |
| `recipe`   | `Recipe \| null`        | Resolved recipe when `status === 'assigned'` |

**Status transitions**:

```text
empty ──assign(valid recipeId)──► assigned
assigned ──remove──► empty
assigned ──replace(valid recipeId)──► assigned
assigned ──stored recipe missing from collection──► empty (weekday slot stays)
```

### WeeklyMealPlan

The persisted Monday–Sunday template. Not scoped to a calendar week.

| Field         | Type                              | Required | Rules                                                   |
| ------------- | --------------------------------- | -------- | ------------------------------------------------------- |
| `assignments` | `Record<Weekday, string \| null>` | yes      | Exactly seven keys; each value is a recipe ID or `null` |

**Invariants**:

- Every `Weekday` key is always present in `assignments`, including empty days.
- At most one recipe ID per day (enforced by map structure).
- The same `recipeId` may appear on multiple days (FR-008).
- Assignments stay until the user changes them. There is no week key and no automatic reset.

## Storage schema

**Key**: `whiskmate:meal-plan`  
**Format**: JSON

```json
{
  "assignments": {
    "monday": "pasta-carbonara",
    "tuesday": null,
    "wednesday": "chicken-tikka",
    "thursday": null,
    "friday": null,
    "saturday": null,
    "sunday": null
  }
}
```

## Validation rules

| Rule                         | Source          | Enforcement                                                                   |
| ---------------------------- | --------------- | ----------------------------------------------------------------------------- |
| Assign only existing recipes | FR-010          | `MealPlan.assignRecipe` checks `RecipeRepository` before persisting           |
| One recipe per day           | Spec assumption | `assignRecipe` overwrites existing ID for that day (FR-004)                   |
| Same recipe on multiple days | FR-008          | `assignRecipe` does not reject a `recipeId` already used on another day       |
| Persist on mutation          | FR-006          | Every assign and remove writes to `localStorage`                              |
| Missing recipe               | FR-011          | Resolve at read time; unknown id renders `status: 'empty'` and the slot stays |

## Relationships

```text
WeeklyMealPlan 1 ── contains ──► 7 DaySlots (logical)
DaySlot 0..1 ── references ──► Recipe (by recipeId)
Recipe * ── referenced by ──► 0..7 DaySlots (same recipe allowed on multiple days)
```

## Helper functions (implementation)

| Function                                        | Purpose                                            |
| ----------------------------------------------- | -------------------------------------------------- |
| `createEmptyPlan(): WeeklyMealPlan`             | Initialize all seven weekday assignments to `null` |
| `parseStoredPlan(json): WeeklyMealPlan \| null` | Safe deserialize with schema validation            |
| `resolveDaySlot(day, plan, recipes): DaySlot`   | Map stored ID to `DaySlot` view model              |
