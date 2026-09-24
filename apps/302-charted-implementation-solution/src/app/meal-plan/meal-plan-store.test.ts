import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import { MealPlanStore } from './meal-plan-store';

describe(MealPlanStore.name, () => {
  it.todo('replaces the recipe on a weekday', () => {
    TestBed.resetTestingModule();
    const store = TestBed.inject(MealPlanStore);

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
    TestBed.resetTestingModule();
    const store = TestBed.inject(MealPlanStore);
    store.assign({ weekday: 'monday', recipeId: 'shakshuka' });

    store.clear({ weekday: 'monday' });

    expect(store.assignments()).toEqual({
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });
  });

  it.todo('allows add only when the recipe is not already planned', () => {
    TestBed.resetTestingModule();
    const store = TestBed.inject(MealPlanStore);
    store.assign({ weekday: 'wednesday', recipeId: 'shakshuka' });

    expect(store.canAdd({ recipeId: 'shakshuka' })).toBe(false);
    expect(store.canAdd({ recipeId: 'hummus' })).toBe(true);
  });
});
