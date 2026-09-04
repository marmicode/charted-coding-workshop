# Data Model

## WeeklyMealPlan

- `weekStart`: ISO local calendar date identifying the Monday (or project-defined first day) of the week.
- `entries`: meal-plan entries for the week.

A user has one plan per selected calendar week. Persistence key: `meal-plan:{weekStart}`.

## MealPlanEntry

- `recipeId`: stable `Recipe.id`.
- `day`: ISO local calendar date within `weekStart` and the following six days.

Validation:

- `recipeId` must resolve to an existing recipe.
- `day` must be one of the seven dates in the plan week.
- `recipeId` must occur at most once in `entries`, regardless of `day`.

## Recipe

The existing `Recipe` entity remains the source of display data. Meal-plan storage keeps only `recipeId` and `day`; the UI joins entries with the repository's recipes so renamed or updated recipe details are reflected.
