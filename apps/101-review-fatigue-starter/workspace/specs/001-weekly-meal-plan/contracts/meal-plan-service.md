# Contract: MealPlan Service

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

## Service

**Location**: `apps/whiskmate/src/app/meal-plan/meal-plan.ts`  
**Type**: `@Service()` injectable, provided in root (or via `app.config.ts` if explicit registration is preferred)

## Public interface

```typescript
export type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type DaySlotStatus = 'empty' | 'assigned';

export interface DaySlotView {
  day: Weekday;
  label: string;
  recipeId: string | null;
  status: DaySlotStatus;
  recipeName: string | null;
  recipePictureUri: string | null;
}

export interface MealPlanServiceDef {
  /** Reactive list of seven day slots, Sunday through Saturday, including empty days. Opening the plan mid-week shows today and the next six days. Past days are hidden. */
  readonly daySlots: Signal<readonly DaySlotView[]>;

  /** True when every weekday renders empty. An unknown recipe id counts as empty. */
  readonly isEmpty: Signal<boolean>;

  /** Assign a recipe to a weekday. Does nothing if that recipe is already planned on another day. Does nothing if that day already has a recipe. The cook must clear it first. Moving a recipe onto a day that already has one swaps the two recipes. No-ops if recipeId is not in the collection. */
  assignRecipe(day: Weekday, recipeId: string): void;

  /** Clear the assignment for a weekday. No-op if that day renders empty. */
  removeAssignment(day: Weekday): void;
}
```

## Behavior contract

### assignRecipe(day, recipeId)

| Precondition                                  | Postcondition                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `recipeId` exists in recipe collection        | `day` slot shows `status: 'assigned'` with resolved recipe name and picture |
| `day` already has a recipe                    | Previous recipe replaced (FR-004). No confirmation dialog                   |
| `recipeId` is already assigned to another day | Both days show that recipe (FR-008)                                         |
| `recipeId` does not exist                     | Assignment rejected; no persistence change (FR-010)                         |
| Any successful mutation                       | `localStorage` updated immediately (FR-006)                                 |

### removeAssignment(day)

| Precondition              | Postcondition                         |
| ------------------------- | ------------------------------------- |
| Day renders as assigned   | Day becomes `status: 'empty'`         |
| Day already renders empty | No-op                                 |
| Recipe in collection      | Recipe remains in collection (FR-005) |

### Load (internal, on init)

| Condition                              | Behavior                                                            |
| -------------------------------------- | ------------------------------------------------------------------- |
| Stored assignments present             | Load them. Reloading restores the same weekdays                     |
| No stored data                         | Create an empty Monday–Sunday plan                                  |
| Corrupt JSON in storage                | Fall back to an empty Monday–Sunday plan                            |
| Stored recipe id not in the collection | That day renders `status: 'empty'`. The weekday slot stays (FR-011) |

## Dependencies

| Dependency         | Usage                                         |
| ------------------ | --------------------------------------------- |
| `LocalStorage`     | Read/write `whiskmate:meal-plan` key          |
| `RecipeRepository` | Validate recipe IDs; resolve names and images |

## Storage key

```text
whiskmate:meal-plan
```

See [data-model.md](../data-model.md) for JSON schema.
