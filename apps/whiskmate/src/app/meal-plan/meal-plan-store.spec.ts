import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MealPlanStore } from './meal-plan-store';

describe(MealPlanStore.name, () => {
  it.todo('replaces the recipe on a weekday', () => {
    const store = TestBed.runInInjectionContext(() => new MealPlanStore());

    store.assign({ weekday: 'monday', recipeId: 'shakshuka' });
    store.assign({ weekday: 'monday', recipeId: 'hummus' });

    expect(store.assignments()).toEqual({
      monday: 'hummus',
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });
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
