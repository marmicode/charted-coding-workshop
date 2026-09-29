import { describe, it } from 'vitest';
import { MealPlan } from './meal-plan.ng';

describe(MealPlan.name, () => {
  it.todo('shows seven empty weekdays', () => {
    // Arrange `MealPlanStore` with every day null.
    // Mount `MealPlan`.
    // Assert Monday through Sunday are shown, in that order.
    // Assert each day says no recipe is planned.
  });

  it.todo('shows the name and picture of a planned recipe', () => {
    // Arrange Monday as Shakshuka's id. `findById` returns Shakshuka.
    // Mount `MealPlan`.
    // Assert Monday shows "Shakshuka" and Shakshuka's picture.
    // Assert the other days say no recipe is planned.
  });

  it.todo('renders a missing recipe as an empty day', () => {
    // Arrange Monday as `'missing'`. `findById` returns undefined.
    // Mount `MealPlan`.
    // Assert Monday says no recipe is planned.
    // Assert the Monday slot is still shown.
  });

  it.todo('clears a day', () => {
    // Arrange Monday as Shakshuka.
    // Mount `MealPlan`.
    // Remove Monday's recipe.
    // Assert `clear({ weekday: 'monday' })` ran.
    // Assert Monday says no recipe is planned.
  });
});
