# Goals

- Users know which recipes they already decided to cook.
- People plan their meals for the week in Whiskmate.
- Users return to the site because their weekly meal plan is there.

# Non-Goals

- No recipe creation or editing from the meal plan.
- No grocery lists, nutrition, servings, or leftover tracking.
- No breakfast, lunch, and dinner slots. One recipe per day.
- No dated calendar, recurring weeks, or multiple saved plans.
- No drag-and-drop ordering, export, or print.
- No accounts, sharing a plan with someone else, or comments.
- No server-side persistence. The plan stays on this device only, matching favorites.

# Desired Behavior

- [ ] Navbar includes a Meal Plan link next to Search.
- [ ] Meal Plan page shows seven weekday slots: Monday through Sunday, not dates.
- [ ] An empty day shows that no recipe is planned for that day, even if the whole week is empty.
- [ ] Each recipe card on Search has an "Add to meal plan" action.
- [ ] Choosing "Add to meal plan" asks which weekday to assign.
- [ ] Confirming a weekday stores that recipe on that day and shows it on Meal Plan.
- [ ] Assigning a recipe to a day that already has one replaces the previous recipe.
- [ ] Each filled day shows the assigned recipe's name and picture.
- [ ] Each filled day has a control to remove the recipe from that day.
- [ ] Removing a recipe from a day returns that day to the empty state.
- [ ] Reloading the app restores the same weekday assignments.
