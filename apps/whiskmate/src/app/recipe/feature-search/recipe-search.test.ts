import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import { UserFavorites } from '@whiskmate/recipe/domain';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from '@whiskmate/recipe/infra';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { LocalStorage } from '@whiskmate/shared/infra';
import { RecipeSearch } from './recipe-search.ng';

const hummus: Recipe = {
  id: 'hummus',
  course: 'starter',
  name: 'Hummus',
  description: null,
  pictureUri: 'https://example.com/hummus.jpg',
  ingredients: [{ name: 'chickpeas' }, { name: 'tahini' }, { name: 'lemon' }],
  steps: ['Blend', 'Serve'],
};

const shakshuka: Recipe = {
  id: 'shakshuka',
  course: 'main',
  name: 'Shakshuka',
  description: null,
  pictureUri: 'https://example.com/shakshuka.jpg',
  ingredients: [
    { name: 'eggs' },
    { name: 'tomatoes' },
    { name: 'peppers' },
    { name: 'onion' },
  ],
  steps: ['Fry', 'Simmer', 'Poach'],
};

const cheesecake: Recipe = {
  id: 'lemon-ricotta-cheesecake',
  course: 'dessert',
  name: 'Lemon and Ricotta Cheesecake',
  description: null,
  pictureUri: 'https://example.com/cheesecake.jpg',
  ingredients: [{ name: 'ricotta' }, { name: 'lemon' }],
  steps: ['Bake'],
};

describe(RecipeSearch.name, () => {
  it('shows all recipes on load', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Hummus',
      'Shakshuka',
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('shows "no recipes" when nothing matches', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Keywords'), 'pizza');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([]);
    expect(
      fixture.nativeElement.querySelector('[data-testid="no-recipes-message"]')
        ?.textContent,
    ).toContain('No recipes found');
  });

  it('filters recipes by keywords', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Keywords'), 'shak');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual(['Shakshuka']);
  });

  it('filters recipes by max ingredients', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Max Ingredients'), '3');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Hummus',
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('filters recipes by max steps', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Max Steps'), '1');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('filters recipes by course', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'dessert');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('filters recipes by multiple courses', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'starter');
    await fixture.whenStable();
    clickCourse(fixture.nativeElement, 'dessert');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Hummus',
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('shows all recipes again once every course is unselected', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'main');
    await fixture.whenStable();
    clickCourse(fixture.nativeElement, 'main');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Hummus',
      'Shakshuka',
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('combines keywords and course', async () => {
    const { fixture } = mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Keywords'), 'lemon');
    await fixture.whenStable();
    clickCourse(fixture.nativeElement, 'main');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([]);
  });

  it('shows only favorites', async () => {
    const { fixture, userFavorites } = mountRecipeSearch();
    userFavorites.addFavorite(cheesecake.id);
    await fixture.whenStable();

    checkboxByLabel(fixture.nativeElement, 'Favorites only').click();
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('adds a recipe to favorites', async () => {
    const { fixture } = mountRecipeSearch({ recipes: [shakshuka] });
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'Add to favorites').click();
    await fixture.whenStable();

    expect(
      buttonByLabel(fixture.nativeElement, 'Remove from favorites').ariaPressed,
    ).toBe('true');
  });

  it('removes a recipe from favorites', async () => {
    const { fixture, userFavorites } = mountRecipeSearch({
      recipes: [shakshuka],
    });
    userFavorites.addFavorite(shakshuka.id);
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'Remove from favorites').click();
    await fixture.whenStable();

    expect(
      buttonByLabel(fixture.nativeElement, 'Add to favorites').ariaPressed,
    ).toBe('false');
  });

  it('assigns a recipe to the picked weekday', async () => {
    const { fixture, mealPlanStore } = mountRecipeSearch({
      recipes: [shakshuka],
    });
    await fixture.whenStable();

    buttonByText(fixture.nativeElement, 'add to meal plan').click();
    await fixture.whenStable();
    buttonByText(fixture.nativeElement, 'wednesday').click();
    await fixture.whenStable();

    expect(mealPlanStore.assignments().wednesday).toBe('shakshuka');
    expect(
      buttonByText(fixture.nativeElement, 'add to meal plan').disabled,
    ).toBe(true);
  });

  it('disables add when the recipe is already planned', async () => {
    const { fixture, mealPlanStore } = mountRecipeSearch({
      recipes: [shakshuka],
    });
    mealPlanStore.assign({ weekday: 'monday', recipeId: shakshuka.id });
    await fixture.whenStable();

    expect(
      buttonByText(fixture.nativeElement, 'add to meal plan').disabled,
    ).toBe(true);
  });
});

function mountRecipeSearch({
  recipes = [hummus, shakshuka, cheesecake],
}: { recipes?: Recipe[] } = {}) {
  TestBed.configureTestingModule({
    providers: [
      provideRecipeRepositoryFake(),
      {
        provide: LocalStorage,
        useValue: { getItem: () => null, setItem: () => undefined },
      },
    ],
  });

  TestBed.inject(RecipeRepositoryFake).configure({ recipes });
  const userFavorites = TestBed.inject(UserFavorites);
  const mealPlanStore = TestBed.inject(MealPlanStore);

  const fixture = TestBed.createComponent(RecipeSearch);

  return { fixture, userFavorites, mealPlanStore };
}

function recipeNames(root: HTMLElement): string[] {
  return [...root.querySelectorAll('[data-testid="recipe-name"]')].map(
    (el) => el.textContent?.trim() ?? '',
  );
}

function inputByLabel(root: HTMLElement, label: string): HTMLInputElement {
  const field = [...root.querySelectorAll('mat-form-field')].find(
    (el) => el.querySelector('mat-label')?.textContent?.trim() === label,
  );
  const input = field?.querySelector('input');
  if (input == null) {
    throw new Error(`Input "${label}" not found.`);
  }
  return input;
}

function typeInto(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

function clickCourse(root: HTMLElement, course: string): void {
  const toggle = [...root.querySelectorAll('mat-button-toggle')].find(
    (el) => el.textContent?.trim() === course,
  );
  const button = toggle?.querySelector('button');
  if (button == null) {
    throw new Error(`Course "${course}" not found.`);
  }
  button.click();
}

function checkboxByLabel(root: HTMLElement, label: string): HTMLInputElement {
  const checkbox = [...root.querySelectorAll('mat-checkbox')].find(
    (el) => el.textContent?.trim() === label,
  );
  const input = checkbox?.querySelector('input');
  if (input == null) {
    throw new Error(`Checkbox "${label}" not found.`);
  }
  return input;
}

function buttonByLabel(root: HTMLElement, label: string): HTMLButtonElement {
  const button = root.querySelector<HTMLButtonElement>(
    `button[aria-label="${label}"]`,
  );
  if (button == null) {
    throw new Error(`Button "${label}" not found.`);
  }
  return button;
}

function buttonByText(root: HTMLElement, text: string): HTMLButtonElement {
  const button = [...root.querySelectorAll('button')].find(
    (el) => el.textContent?.trim().toLowerCase() === text,
  );
  if (button == null) {
    throw new Error(`Button "${text}" not found.`);
  }
  return button;
}
