import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import { LocalStorage } from '@whiskmate/shared/infra';
import { MealPlanStore, type WeekdayAssignments } from './meal-plan-store';

const MEAL_PLAN_STORAGE_KEY = 'whiskmate:meal-plan';

class MemoryStorage implements LocalStorage {
  private readonly items = new Map<string, string>();

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }
}

describe(MealPlanStore.name, () => {
  it('replaces the recipe on a weekday', () => {
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

  it('clears a weekday', () => {
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

  it('allows add only when the recipe is not already planned', () => {
    TestBed.resetTestingModule();
    const store = TestBed.inject(MealPlanStore);
    store.assign({ weekday: 'wednesday', recipeId: 'shakshuka' });

    expect(store.canAdd({ recipeId: 'shakshuka' })).toBe(false);
    expect(store.canAdd({ recipeId: 'hummus' })).toBe(true);
  });

  it('restores assignments after reload', () => {
    TestBed.resetTestingModule();
    const storage = new MemoryStorage();
    const storedWeek: WeekdayAssignments = {
      monday: 'shakshuka',
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    };
    storage.setItem(MEAL_PLAN_STORAGE_KEY, JSON.stringify(storedWeek));
    TestBed.overrideProvider(LocalStorage, { useValue: storage });
    const store = TestBed.inject(MealPlanStore);

    expect(store.assignments()).toEqual(storedWeek);

    store.assign({ weekday: 'tuesday', recipeId: 'hummus' });

    expect(JSON.parse(storage.getItem(MEAL_PLAN_STORAGE_KEY) ?? '')).toEqual({
      ...storedWeek,
      tuesday: 'hummus',
    });
  });
});
