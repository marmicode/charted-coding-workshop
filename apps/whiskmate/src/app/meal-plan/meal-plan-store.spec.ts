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

  it('allows add only when the recipe is not already planned', () => {
    const store = TestBed.runInInjectionContext(() => new MealPlanStore());
    store.assign({ weekday: 'wednesday', recipeId: 'shakshuka' });

    expect(store.canAdd({ recipeId: 'shakshuka' })).toBe(false);
    expect(store.canAdd({ recipeId: 'hummus' })).toBe(true);
  });

  it.todo('restores assignments after reload', () => {
    // Arrange `LocalStorage` with Monday `'shakshuka'` and the other days null.
    // Construct `MealPlanStore`.
    // Assert `assignments()` matches that stored week.
    // `assign({ weekday: 'tuesday', recipeId: 'hummus' })`.
    // Assert `LocalStorage` now has Tuesday `'hummus'`.
  });
});
