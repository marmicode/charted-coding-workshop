import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from '@whiskmate/recipe/infra';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { LocalStorage } from '@whiskmate/shared/infra';
import { MealPlan } from './meal-plan.ng';

const shakshuka: Recipe = {
  id: 'shakshuka',
  course: 'main',
  name: 'Shakshuka',
  description: null,
  pictureUri: 'https://example.com/shakshuka.jpg',
  ingredients: [],
  steps: [],
};

const cheesecake: Recipe = {
  id: 'lemon-ricotta-cheesecake',
  course: 'dessert',
  name: 'Lemon and Ricotta Cheesecake',
  description: null,
  pictureUri: 'https://example.com/cheesecake.jpg',
  ingredients: [],
  steps: [],
};

describe(MealPlan.name, () => {
  it('shows seven empty weekdays when nothing is planned', async () => {
    const { fixture } = mountMealPlan();
    await fixture.whenStable();

    const days = dayElements(fixture.nativeElement);
    expect(days).toHaveLength(7);
    for (const day of days) {
      expect(day.textContent?.toLowerCase()).toContain('no recipe is planned');
    }
  });

  it('shows the name and picture of a planned recipe', async () => {
    const { fixture } = mountMealPlan((store) => {
      store.assign({ weekday: 'monday', recipeId: shakshuka.id });
    });
    await fixture.whenStable();

    const [monday, ...otherDays] = dayElements(fixture.nativeElement);
    expect(monday?.textContent).toContain('Shakshuka');
    expect(monday?.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/shakshuka.jpg',
    );
    for (const day of otherDays) {
      expect(day.textContent?.toLowerCase()).toContain('no recipe is planned');
    }
  });

  it('shows each planned recipe on its weekday', async () => {
    const { fixture } = mountMealPlan((store) => {
      store.assign({ weekday: 'monday', recipeId: shakshuka.id });
      store.assign({ weekday: 'friday', recipeId: cheesecake.id });
    });
    await fixture.whenStable();

    const days = dayElements(fixture.nativeElement);
    expect(days[0]?.textContent).toContain('Shakshuka');
    expect(days[4]?.textContent).toContain('Lemon and Ricotta Cheesecake');
  });

  it('renders a missing recipe as an empty day', async () => {
    const { fixture } = mountMealPlan((store) => {
      store.assign({ weekday: 'monday', recipeId: 'missing' });
    });
    await fixture.whenStable();

    const [monday] = dayElements(fixture.nativeElement);
    expect(monday?.textContent).toContain('Monday');
    expect(monday?.textContent?.toLowerCase()).toContain(
      'no recipe is planned',
    );
  });

  it('clears a day', async () => {
    const { fixture } = mountMealPlan((store) => {
      store.assign({ weekday: 'monday', recipeId: shakshuka.id });
    });
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button')?.click();
    await fixture.whenStable();

    expect(
      dayElements(fixture.nativeElement)[0]?.textContent?.toLowerCase(),
    ).toContain('no recipe is planned');
  });
});

function mountMealPlan(arrange?: (store: MealPlanStore) => void) {
  TestBed.configureTestingModule({
    providers: [
      provideRecipeRepositoryFake(),
      {
        provide: LocalStorage,
        useValue: { getItem: () => null, setItem: () => undefined },
      },
    ],
  });

  TestBed.inject(RecipeRepositoryFake).configure({
    recipes: [shakshuka, cheesecake],
  });
  arrange?.(TestBed.inject(MealPlanStore));

  return { fixture: TestBed.createComponent(MealPlan) };
}

function dayElements(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('wm-meal-plan-day')];
}
