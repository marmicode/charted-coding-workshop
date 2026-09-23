# Contract: Routes

**Feature**: `001-weekly-meal-plan`  
**Date**: 2026-09-04

## Application routes

| Path | Component | Nav label | Description |
|------|-----------|-----------|-------------|
| `/search` | `RecipeSearch` | SEARCH | Existing recipe browse/search (unchanged) |
| `/meal-plan` | `MealPlanPage` | MEAL PLAN | Weekly meal plan view (new) |
| `/` | — | — | Redirects to `/search` (unchanged) |

## Router helper

Extend routing helpers following `recipeRouterHelper` pattern:

```typescript
// apps/whiskmate/src/app/meal-plan/meal-plan.router-helper.ts

export const mealPlanRouterHelper = {
  MEAL_PLAN_PATH: 'meal-plan' as const,

  mealPlan() {
    return ['/', this.MEAL_PLAN_PATH];
  },
};
```

## Navigation contract

- Navbar in `App` component MUST include a link to `/meal-plan` labeled `MEAL PLAN`.
- Active route styling uses existing `routerLinkActive="active"` pattern.
- Default redirect remains `/search`; meal plan is a secondary destination.

## Deep linking

- Visiting `/meal-plan` directly MUST render the current week's plan.
- No query parameters required for v1.
- No route guards; feature is available to all users (single-user app).
