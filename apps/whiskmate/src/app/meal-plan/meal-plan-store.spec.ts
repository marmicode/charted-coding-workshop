import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LocalStorage } from '../shared/local-storage';
import { WeekdayAssignments } from './meal-plan';
import { MealPlanStore } from './meal-plan-store';

describe(MealPlanStore.name, () => {
  beforeEach(() => {
    const items = new Map<string, string>();
    const localStorage: LocalStorage = {
      getItem: (key) => items.get(key) ?? null,
      setItem: (key, value) => {
        items.set(key, value);
      },
    };

    TestBed.resetTestingModule();
    TestBed.overrideProvider(LocalStorage, { useValue: localStorage });
  });

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

  it('restores assignments after reload', () => {
    const storedWeek: WeekdayAssignments = {
      monday: 'shakshuka',
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    };
    const items = new Map<string, string>([
      ['whiskmate:meal-plan', JSON.stringify(storedWeek)],
    ]);
    const localStorage: LocalStorage = {
      getItem: (key) => items.get(key) ?? null,
      setItem: (key, value) => {
        items.set(key, value);
      },
    };

    TestBed.resetTestingModule();
    TestBed.overrideProvider(LocalStorage, { useValue: localStorage });
    const store = TestBed.runInInjectionContext(() => new MealPlanStore());

    expect(store.assignments()).toEqual(storedWeek);

    store.assign({ weekday: 'tuesday', recipeId: 'hummus' });

    expect(JSON.parse(localStorage.getItem('whiskmate:meal-plan')!)).toEqual({
      ...storedWeek,
      tuesday: 'hummus',
    });
  });
});
