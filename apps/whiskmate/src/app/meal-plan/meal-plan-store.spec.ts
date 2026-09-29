import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MealPlanStore } from './meal-plan-store';

describe(MealPlanStore.name, () => {
  it('replaces the recipe on a weekday', () => {
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

  it('clears a weekday', () => {
    const store = TestBed.runInInjectionContext(() => new MealPlanStore());
    store.assign({ weekday: 'monday', recipeId: 'shakshuka' });
    store.assign({ weekday: 'tuesday', recipeId: 'hummus' });

    store.clear({ weekday: 'monday' });

    expect(store.assignments()).toEqual({
      monday: null,
      tuesday: 'hummus',
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });
  });

  it.todo('allows add only when the recipe is not already planned', () => {
    // Arrange Wednesday as `'shakshuka'`.
    // Assert `canAdd({ recipeId: 'shakshuka' })` is false.
    // Assert `canAdd({ recipeId: 'hummus' })` is true.
  });
});
