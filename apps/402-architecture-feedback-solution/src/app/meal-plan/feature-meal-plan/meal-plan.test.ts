import { TestBed } from '@angular/core/testing';
import { describe, it, vi } from 'vitest';
import { RECIPES } from '@whiskmate/recipe/infra';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import { LocalStorage } from '@whiskmate/shared/infra';
import { MealPlan } from './meal-plan.ng';

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const shakshuka = RECIPES.find((recipe) => recipe.name === 'Shakshuka');
if (shakshuka == null) {
  throw new Error('Catalog must include Shakshuka.');
}

class MemoryStorage implements LocalStorage {
  private readonly items = new Map<string, string>();

  setItem(key: string, value: string): void {
    this.items.set(key, value);
  }

  getItem(key: string): string | null {
    return this.items.get(key) ?? null;
  }
}

function mountMealPlan(
  arrange?: (store: MealPlanStore) => void,
): ReturnType<typeof TestBed.createComponent<MealPlan>> {
  TestBed.resetTestingModule();
  TestBed.overrideProvider(LocalStorage, { useValue: new MemoryStorage() });
  const store = TestBed.inject(MealPlanStore);
  arrange?.(store);
  return TestBed.createComponent(MealPlan);
}

function dayElements(fixture: { nativeElement: HTMLElement }): HTMLElement[] {
  return [...fixture.nativeElement.querySelectorAll('wm-meal-plan-day')];
}

describe(MealPlan.name, () => {
  it('shows seven empty weekdays', async () => {
    const fixture = mountMealPlan();
    await fixture.whenStable();

    const days = dayElements(fixture);
    expect(days).toHaveLength(7);
    expect(
      days.map((day) =>
        WEEKDAYS.find((weekday) => day.textContent?.includes(weekday)),
      ),
    ).toEqual(WEEKDAYS);
    for (const day of days) {
      expect(day.textContent?.toLowerCase()).toContain('no recipe is planned');
    }
  });

  it('shows the name and picture of a planned recipe', async () => {
    const fixture = mountMealPlan((store) => {
      store.assign({ weekday: 'monday', recipeId: shakshuka.id });
    });
    await fixture.whenStable();

    const days = dayElements(fixture);
    const monday = days[0];
    expect(monday?.textContent).toContain('Shakshuka');
    expect(monday?.querySelector('img')?.getAttribute('src')).toBe(
      shakshuka.pictureUri,
    );
    for (const day of days.slice(1)) {
      expect(day.textContent?.toLowerCase()).toContain('no recipe is planned');
    }
  });

  it('renders a missing recipe as an empty day', async () => {
    const fixture = mountMealPlan((store) => {
      store.assign({ weekday: 'monday', recipeId: 'missing' });
    });
    await fixture.whenStable();

    const days = dayElements(fixture);
    const monday = days[0];
    expect(monday?.textContent).toContain('Monday');
    expect(monday?.textContent?.toLowerCase()).toContain(
      'no recipe is planned',
    );
  });

  it('clears a day', async () => {
    TestBed.resetTestingModule();
    TestBed.overrideProvider(LocalStorage, { useValue: new MemoryStorage() });
    const store = TestBed.inject(MealPlanStore);
    store.assign({ weekday: 'monday', recipeId: shakshuka.id });
    const clear = vi.spyOn(store, 'clear');
    const fixture = TestBed.createComponent(MealPlan);
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button')?.click();
    await fixture.whenStable();

    expect(clear).toHaveBeenCalledWith({ weekday: 'monday' });
    expect(dayElements(fixture)[0]?.textContent?.toLowerCase()).toContain(
      'no recipe is planned',
    );
  });
});
