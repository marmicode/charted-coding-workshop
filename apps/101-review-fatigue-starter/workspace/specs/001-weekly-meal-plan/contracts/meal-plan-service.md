# Contract: MealPlan Service

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

## Service

**Location**: `apps/whiskmate/src/app/meal-plan/meal-plan.ts`  
**Type**: `@Service()` injectable, provided in root (or via `app.config.ts` if explicit registration is preferred)

## Public interface

```typescript
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type DaySlotStatus = 'empty' | 'assigned' | 'broken';

export interface DaySlotView {
  day: Weekday;
  label: string;
  recipeId: string | null;
  status: DaySlotStatus;
  recipeName: string | null;
  recipePictureUri: string | null;
}

export interface MealPlanServiceDef {
  /** Reactive list of seven day slots for the current week, Sunday-first (matches `Date.getDay()`). */
  readonly daySlots: Signal<readonly DaySlotView[]>;

  /** Whether the entire week has no assignments (for empty-state messaging). */
  readonly isEmpty: Signal<boolean>;

  /** ISO week key for the loaded plan (e.g. "2026-W36"). */
  readonly weekKey: Signal<string>;

  /** Assign a recipe to a day. Replaces any existing assignment. Throws or no-ops if recipeId invalid. */
  assignRecipe(day: Weekday, recipeId: string): void;

  /** Clear the assignment for a day. No-op if already empty. */
  removeAssignment(day: Weekday): void;

  /** Move assignment from one day to another. Target day receives recipe; source becomes empty. */
  moveAssignment(fromDay: Weekday, toDay: Weekday): void;
}
```

## Behavior contract

### assignRecipe(day, recipeId)

| Precondition                           | Postcondition                                                   |
| -------------------------------------- | --------------------------------------------------------------- |
| `recipeId` exists in recipe collection | `day` slot shows `status: 'assigned'` with resolved recipe name |
| `day` already has a recipe             | Previous recipe replaced (FR-004)                               |
| `recipeId` does not exist              | Assignment rejected; no persistence change (FR-011)             |
| Any successful mutation                | `localStorage` updated immediately (FR-007)                     |

### removeAssignment(day)

| Precondition                    | Postcondition                         |
| ------------------------------- | ------------------------------------- |
| Day has assigned or broken slot | Day becomes `status: 'empty'`         |
| Day already empty               | No-op                                 |
| Recipe in collection            | Recipe remains in collection (FR-005) |

### moveAssignment(fromDay, toDay)

| Precondition                           | Postcondition                                 |
| -------------------------------------- | --------------------------------------------- |
| Source day has assignment              | Source becomes empty; target shows recipe     |
| Source day empty                       | No-op                                         |
| Target day has assignment              | Target assignment overwritten by moved recipe |
| Same recipe on multiple days elsewhere | Unaffected (FR-009)                           |

### Week rollover (internal, on init and before reads)

| Condition                         | Behavior                                                |
| --------------------------------- | ------------------------------------------------------- |
| Stored `weekKey` === current week | Load assignments as-is                                  |
| Stored `weekKey` !== current week | Discard stored data; create empty plan for current week |
| No stored data                    | Create empty plan for current week                      |
| Corrupt JSON in storage           | Fall back to empty plan for current week                |

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
