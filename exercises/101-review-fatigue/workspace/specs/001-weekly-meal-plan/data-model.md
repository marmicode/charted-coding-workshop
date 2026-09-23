# Data Model: Weekly Meal Plan

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

## Overview

The meal plan links existing `Recipe` entities to day slots within the current calendar week. No new recipe fields are introduced; assignments store recipe IDs only.

## Entities

### Weekday

Represents one of the seven days in a weekly plan (Monday-first).

| Value | Display label |
|-------|---------------|
| `monday` | Monday |
| `tuesday` | Tuesday |
| `wednesday` | Wednesday |
| `thursday` | Thursday |
| `friday` | Friday |
| `saturday` | Saturday |
| `sunday` | Sunday |

**Ordering**: Fixed array `[sunday, monday, tuesday, wednesday, thursday, friday, saturday]` used for rendering and iteration.

### Recipe (existing)

Defined in `apps/whiskmate/src/app/recipe/recipe.ts`. Referenced by meal plan assignments; not owned or modified by the meal plan feature.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | Stored in assignments |
| `name` | `string` | Displayed on plan (FR-010) |
| `pictureUri` | `string` | Optional thumbnail on day slot |
| Other fields | — | Not required for plan display in v1 |

### RecipeAssignment

A link between a weekday slot and a recipe ID for the current week.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `day` | `Weekday` | yes | Must be unique within a week (one assignment per day) |
| `recipeId` | `string` | yes | Must exist in recipe collection at assignment time (FR-011) |

### DaySlot (view model)

Runtime representation of a single day in the UI. Not persisted directly.

| Field | Type | Description |
|-------|------|-------------|
| `day` | `Weekday` | Which day this slot represents |
| `recipeId` | `string \| null` | Assigned recipe ID, or null if unplanned |
| `status` | `'empty' \| 'assigned' \| 'broken'` | Derived state for rendering |
| `recipe` | `Recipe \| null` | Resolved recipe when `status === 'assigned'` |

**Status transitions**:

```text
empty ──assign(valid recipeId)──► assigned
assigned ──remove──► empty
assigned ──replace(valid recipeId)──► assigned
assigned ──recipe deleted from collection──► broken
broken ──clear or replace──► empty | assigned
empty ──move from other day──► assigned (source day becomes empty)
```

### WeeklyMealPlan

The persisted plan for one calendar week.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `weekKey` | `string` | yes | ISO week format `YYYY-Www` (e.g. `2026-W36`) |
| `assignments` | `Record<Weekday, string \| null>` | yes | Exactly seven keys; each value is a recipe ID or `null` |

**Invariants**:

- Every `Weekday` key is always present in `assignments`.
- At most one recipe ID per day (enforced by map structure).
- A `recipeId` may appear on at most one day in the week. `assignRecipe` is a no-op if that recipe is already assigned to another day.
- When `weekKey` ≠ current ISO week, the plan is discarded and a new empty plan is created.

## Storage schema

**Key**: `whiskmate:meal-plan`  
**Format**: JSON

```json
{
  "weekKey": "2026-W36",
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

| Rule | Source | Enforcement |
|------|--------|-------------|
| Assign only existing recipes | FR-011 | `MealPlan.assignRecipe` checks `RecipeRepository` before persisting |
| Recipe unique in week | Data model | `assignRecipe` no-ops when `recipeId` is already used on another day |
| One recipe per day | Spec assumption | `assignRecipe` overwrites existing ID for that day (FR-004) |
| Current week only | Spec assumption | `weekKey` checked on service init and before reads |
| Persist on mutation | FR-007 | Every assign/remove/move writes to `localStorage` |
| Broken reference handling | FR-012 | Resolve at read time; `status: 'broken'` when ID not found |

## Relationships

```text
WeeklyMealPlan 1 ── contains ──► 7 DaySlots (logical)
DaySlot 0..1 ── references ──► Recipe (by recipeId)
Recipe * ── referenced by ──► 0..7 DaySlots (same recipe allowed on multiple days)
```

## Helper functions (implementation)

| Function | Purpose |
|----------|---------|
| `getCurrentWeekKey(): string` | Compute ISO week key for today |
| `createEmptyPlan(weekKey): WeeklyMealPlan` | Initialize all assignments to `null` |
| `parseStoredPlan(json): WeeklyMealPlan \| null` | Safe deserialize with schema validation |
| `resolveDaySlot(day, plan, recipes): DaySlot` | Map stored ID to `DaySlot` view model |
