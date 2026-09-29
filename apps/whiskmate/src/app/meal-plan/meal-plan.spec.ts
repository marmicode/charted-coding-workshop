import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { RECIPES } from '../recipe/recipe-data';
import { LocalStorage } from '../shared/local-storage';
import { WeekdayAssignments } from './meal-plan';
import { MealPlan } from './meal-plan.ng';

describe(MealPlan.name, () => {
  it('shows seven empty weekdays', async () => {
    const items = new Map<string, string>();
    TestBed.resetTestingModule();
    TestBed.overrideProvider(LocalStorage, {
      useValue: {
        getItem: (key: string) => items.get(key) ?? null,
        setItem: (key: string, value: string) => {
          items.set(key, value);
        },
      } satisfies LocalStorage,
    });

    const fixture = TestBed.createComponent(MealPlan);
    await fixture.whenStable();

    const days = [...fixture.nativeElement.querySelectorAll('li')].map(
      (day: HTMLElement) => ({
        label: day.querySelector('h2')?.textContent?.trim(),
        text: day.textContent,
      }),
    );

    expect(days.map((day) => day.label)).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
    expect(
      days.every((day) => day.text?.includes('No recipe is planned')),
    ).toBe(true);
  });

  it('shows the name and picture of a planned recipe', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const storedWeek: WeekdayAssignments = {
      monday: shakshuka.id,
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

    TestBed.resetTestingModule();
    TestBed.overrideProvider(LocalStorage, {
      useValue: {
        getItem: (key: string) => items.get(key) ?? null,
        setItem: (key: string, value: string) => {
          items.set(key, value);
        },
      } satisfies LocalStorage,
    });

    const fixture = TestBed.createComponent(MealPlan);
    await fixture.whenStable();

    const days = [...fixture.nativeElement.querySelectorAll('li')];
    const monday = days[0] as HTMLElement;
    const picture = monday.querySelector('img');

    expect(monday.textContent).toContain('Shakshuka');
    expect(picture?.getAttribute('src')).toBe(shakshuka.pictureUri);
    expect(picture?.getAttribute('alt')).toBe(shakshuka.name);
    expect(
      days.slice(1).every((day) => day.textContent?.includes('No recipe is planned')),
    ).toBe(true);
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
