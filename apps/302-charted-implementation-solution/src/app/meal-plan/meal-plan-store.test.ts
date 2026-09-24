import { describe, it } from 'vitest';
import { MealPlanStore } from './meal-plan-store';

describe(MealPlanStore.name, () => {
  it.todo('replaces the recipe on a weekday', () => {
    // Arrange an empty `MealPlanStore`.
    // `assign({ weekday: 'monday', recipeId: 'shakshuka' })`.
    // `assign({ weekday: 'monday', recipeId: 'hummus' })`.
    // Assert Monday is `'hummus'` and the other six days are null.
  });

  it.todo('clears a weekday', () => {
    // Arrange Monday as `'shakshuka'`.
    // `clear({ weekday: 'monday' })`.
    // Assert Monday is null and the other days are unchanged.
  });

  it.todo('allows add only when the recipe is not already planned', () => {
    // Arrange Wednesday as `'shakshuka'`.
    // Assert `canAdd({ recipeId: 'shakshuka' })` is false.
    // Assert `canAdd({ recipeId: 'hummus' })` is true.
  });
});
