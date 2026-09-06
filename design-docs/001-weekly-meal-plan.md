# Goals

- Cooks already have recipes in Whiskmate but still decide what to cook each day by memory or notes outside the app.
- Users lose the week-at-a-glance view they need when planning meals from a catalog of individual recipes.
- Assigning a known recipe to a weekday should be as easy as favoriting, so planning stays in the same flow as browsing.

# Non-Goals

- No recipe creation, editing, or deletion from the meal plan.
- No grocery lists, nutrition, servings, or leftover tracking.
- No breakfast / lunch / dinner slots — one recipe per weekday.
- No dated calendar, recurring weeks, or multiple saved plans.
- No drag-and-drop, sharing, export, or print.
- No complex behavior such as swapping recipes between days.
- No change to the recipe search page.
- No server-side persistence; local storage only.

# Desired Behavior

## Meal Plan page

- [ ] Navbar includes a Meal Plan link next to Search.
- [ ] Meal Plan page shows seven weekday slots: Monday through Sunday, even if they are all empty.
- [ ] An empty day shows that no recipe is planned for that day.
- [ ] Each filled day shows the assigned recipe's name and picture.

## Add from Search

- [ ] Each recipe card on Search page has an "Add to meal plan" button.
- [ ] Clicking "Add to meal plan" asks which weekday to assign.
- [ ] Confirming a weekday stores that recipe on that day and shows it on Meal Plan.

## Recipe picker

- [ ] An empty day has an "Add recipe" action that opens a picker of existing recipes.
- [ ] The picker reuses catalog filtering (keywords, max ingredients, max steps, favorites).
- [ ] Selecting a recipe in the picker assigns it to the day that opened the picker.
- [ ] Empty picker results show "No recipes found".
- [ ] Closing the picker without selecting a recipe leaves the day unchanged.

## Changing a day

- [ ] Assigning a recipe to a day that already has one overwrites the previous recipe.
- [ ] The same recipe may be assigned to more than one day.
- [ ] Each filled day has a control to remove the recipe from that day.
- [ ] Each filled day has a control to move the recipe to another day.
- [ ] Moving a recipe to a day that already has one swaps the two recipes.
- [ ] Removing a recipe from a day returns that day to the empty state.

## Persistence

- [ ] Reloading the app restores the same weekday assignments.

# Design

- `MealPlan` — Meal Plan page at `/meal-plan`.
- `mealPlanRouterHelper` — route helper; `App` adds the navbar link next to Search.
- `MealPlanDay` — one weekday: label, optional recipe preview, add/remove/move actions.
- `RecipePicker` — picker that embeds `RecipeFilter`, `Catalog`, and `RecipePreview`.
- `WeekdayPicker` — weekday menu on `RecipePreview` for add-from-Search.
- `MealPlanRepository` — pure storage: `load` / `save` of `MealPlanSlots` in `LocalStorage`.
- `MealPlanStore` — weekday assignments (`slots`, `assign`, `clear`); persists via `MealPlanRepository`.

## Diagram

```mermaid
flowchart TD
  RecipeRepository(("RecipeRepository"))
  MealPlanRepository(("MealPlanRepository"))
  MealPlanStore((MealPlanStore))

  MealPlan -->|"[weekday: Weekday]<br>[recipe: Recipe | null]"| MealPlanDay
  MealPlanDay -->|"(addRequested: Weekday)"| MealPlan
  MealPlanDay -->|"(removeRequested: Weekday)"| MealPlan
  MealPlan -->|"[open: boolean]"| RecipePicker
  RecipePicker -->|"(recipeSelected: Recipe)"| MealPlan
  RecipePicker -->|"search({filter: RecipeFilterCriteria}): Observable<Recipe[]>"| RecipeRepository
  MealPlan -->|"getById({id: string}): Observable<Recipe | undefined>"| RecipeRepository
  MealPlan -->|"assign({weekday: Weekday, recipeId: string}): void"| MealPlanStore
  MealPlan -->|"clear({weekday: Weekday}): void"| MealPlanStore
  MealPlan -->|"slots(): MealPlanSlots"| MealPlanStore
  MealPlanStore -->|"load(): Promise<MealPlanSlots>"| MealPlanRepository
  MealPlanStore -->|"save(slots: MealPlanSlots): Promise<void>"| MealPlanRepository

  RecipeSearch -->|"[recipe: Recipe]"| RecipePreview
  RecipePreview -->|"[recipe: Recipe]"| WeekdayPicker
  WeekdayPicker -->|"(weekdaySelected: Weekday)"| RecipePreview
  RecipePreview -->|"assign({weekday: Weekday, recipeId: string}): void"| MealPlanStore
```

## Implementation Details

### MealPlan

- If there are no recipes, hide the seven days and show only an empty message.
- The seven days appear after the first `assign(...)`.
- If the user opens the plan in the middle of the week, show only today and the next 6 days. Past days are hidden.

### MealPlanRepository / MealPlanStore

```ts
export type Weekday = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

/** Recipe ids per weekday, not recipe snapshots. */
export type MealPlanSlots = Map<Weekday, string | null>;

export interface MealPlanRepository {
  load(): Promise<MealPlanSlots>;
  save(slots: MealPlanSlots): Promise<void>;
}

export class MealPlanStore {
  /**
   * Sunday–Saturday map. Not a calendar week tied to dates.
   */
  slots(): MealPlanSlots;

  /**
   * Stores the recipe id on that weekday.
   * Does nothing if that recipe is already planned on another day. A recipe can be on only one day.
   * Replaces the recipe if that day already has one; no confirmation dialog.
   */
  assign(params: { weekday: Weekday; recipeId: string }): void;

  /** Removes the recipe from that weekday. */
  clear(params: { weekday: Weekday }): void;
}

export interface RecipeRepositoryDef {
  search(filter: RecipeFilterCriteria): Observable<Recipe[]>;
  /** A missing id renders as empty on the Meal Plan page. */
  getById(params: { id: string }): Observable<Recipe | undefined>;
}

export interface MealPlanDay {
  weekday: Weekday;
  recipe: Recipe | null;
}
```

# Alternatives Considered

- **Bag of recipes with no weekdays** — Rejected; users need to know what to cook each day, not only which recipes are "planned".
- **Breakfast / lunch / dinner grid** — Rejected; one recipe per day matches the stated need and keeps the first slice small.
- **Dated calendar weeks** — Rejected; a reusable Monday–Sunday template matches local-only state and avoids date math.
- **Navigate to Search with a `?day=` query to pick a recipe** — Rejected; a picker on Meal Plan keeps assignment on the week view.
- **Store full `Recipe` snapshots in local storage** — Rejected; ids stay aligned with `RecipeRepository` and avoid stale names/pictures.
- **Confirm before replacing a day's recipe** — Rejected; overwrite is simpler and matches a single slot per day.

# Kitchen Sink

## Open Questions

- Should a recipe already on the plan show which weekdays it occupies while browsing Search?
- Should `"Add to meal plan"` from Search default to the first empty day when one exists?

## Risks

- Stale recipe ids (catalog later drops a recipe) must render as empty, not crash the week view.
- Local storage quota is unlikely at seven ids but shares the same failure mode as favorites.

## Future Plans

- Multiple meals per day (breakfast, lunch, dinner).
- Dated weeks and copy-forward from last week.
- Drag-and-drop between days.
- Grocery list from the week's ingredients.
- Disable or label days that already include the recipe being added.
