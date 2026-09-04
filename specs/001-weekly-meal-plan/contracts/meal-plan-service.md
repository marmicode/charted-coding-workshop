# Meal Plan Service Contract

Internal application contract exposed to the Angular UI.

- `getWeek(weekStart?: LocalDate): WeeklyMealPlan` — returns seven-day plan, defaulting to the current local week.
- `addRecipe(weekStart: LocalDate, recipeId: string, day: LocalDate): AddRecipeResult` — atomically validates and persists an entry.

`AddRecipeResult` is either:

- `{ ok: true, plan: WeeklyMealPlan }`
- `{ ok: false, reason: "recipe-not-found" | "invalid-day" | "duplicate-recipe", plan: WeeklyMealPlan }`

Failed operations do not modify storage or the returned plan.
