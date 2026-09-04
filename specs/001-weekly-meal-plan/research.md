# Research: Weekly Meal Planning

## Decisions

- **Feature location**: Add a `meal-plan` feature directory under the existing Angular app. This matches the current recipe feature organization and avoids introducing another application layer.
- **Persistence**: Use the existing `LocalStorage` abstraction. Store entries keyed by the local calendar week's stable start date, so plans survive navigation and reloads while different weeks remain isolated.
- **Uniqueness**: Enforce uniqueness by stable `recipe.id` in the meal-plan repository before writing. The UI also disables or explains already-planned recipes, but the repository is the authoritative guard.
- **Recipe validation**: Resolve the selected ID through `RecipeRepository`; reject missing recipes before mutation.
- **Day validation**: Represent days as seven explicit local-date values for the selected week and accept only those values. The current week is the default.
- **Testing**: Use Vitest/jsdom unit tests for week calculation, validation, duplicate prevention, and localStorage persistence; add Angular component tests for visible assignment and feedback.

## Alternatives considered

- **Server/database persistence**: Not present in the repository and unnecessary for the requested single-user browser scope.
- **Allowing a recipe on multiple days**: Contradicts the explicit duplicate rule, including the stated different-day edge case.
- **Date strings based on UTC**: Rejected because the specification requires the user's local calendar week and UTC conversion can shift dates around midnight.
