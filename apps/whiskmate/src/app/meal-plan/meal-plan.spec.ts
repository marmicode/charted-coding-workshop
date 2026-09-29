import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LocalStorage } from '../shared/local-storage';
import { MealPlan } from './meal-plan.ng';

describe(MealPlan.name, () => {
  it.todo('shows seven empty weekdays', async () => {
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
