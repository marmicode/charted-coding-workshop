import { describe, it } from 'vitest';
import { MealPlanDay } from './meal-plan-day.ng';

describe(MealPlanDay.name, () => {
  it.todo('shows the empty state', () => {
    // Mount `MealPlanDay` with `weekday` `'monday'` and `recipe` null.
    // Assert the label is Monday.
    // Assert it says no recipe is planned.
    // Assert there is no remove control.
  });

  it.todo('shows the recipe', () => {
    // Mount `MealPlanDay` with Shakshuka.
    // Assert the name "Shakshuka" and Shakshuka's picture.
  });

  it.todo('emits remove', () => {
    // Mount `MealPlanDay` with Shakshuka.
    // Trigger remove.
    // Assert `remove` emitted.
  });
});
