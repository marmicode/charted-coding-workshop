import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, vi } from 'vitest';
import { UserFavorites } from '@whiskmate/recipe/domain';
import { RecipeRepository } from '@whiskmate/recipe/infra';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { LocalStorage } from '@whiskmate/shared/infra';
import { RecipeSearch } from './recipe-search.ng';

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

describe(RecipeSearch.name, () => {
  it('searches all recipes on load', async () => {
    const { fixture, search } = await mountRecipeSearch();
    await fixture.whenStable();

    expect(search).toHaveBeenCalledTimes(1);
    expect(search).toHaveBeenCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
  });

  it('renders the recipes returned by the repository', async () => {
    const { fixture, search } = await mountRecipeSearch();
    search.mockReturnValue(of([shakshuka, cheesecake]));
    await fixture.whenStable();

    expect(search).toHaveBeenCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Shakshuka',
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('shows "no recipes" when the repository returns nothing', async () => {
    const { fixture, search } = await mountRecipeSearch();
    search.mockReturnValue(of([]));
    await fixture.whenStable();

    expect(search).toHaveBeenCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
    expect(
      fixture.nativeElement.querySelector('[data-testid="no-recipes-message"]')
        ?.textContent,
    ).toContain('No recipes found');
  });

  it('searches by keywords', async () => {
    const { fixture, search } = await mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Keywords'), 'shak');
    await fixture.whenStable();

    expect(search).toHaveBeenLastCalledWith({
      keywords: 'shak',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
  });

  it('searches by max ingredients', async () => {
    const { fixture, search } = await mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Max Ingredients'), '5');
    await fixture.whenStable();

    expect(search).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: 5,
      maxStepCount: null,
      courses: [],
    });
  });

  it('searches by max steps', async () => {
    const { fixture, search } = await mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Max Steps'), '3');
    await fixture.whenStable();

    expect(search).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: 3,
      courses: [],
    });
  });

  it('searches by course', async () => {
    const { fixture, search } = await mountRecipeSearch();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'dessert');
    await fixture.whenStable();

    expect(search).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['dessert'],
    });
  });

  it('searches by multiple courses', async () => {
    const { fixture, search } = await mountRecipeSearch();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'starter');
    await fixture.whenStable();
    clickCourse(fixture.nativeElement, 'dessert');
    await fixture.whenStable();

    expect(search).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['starter', 'dessert'],
    });
  });

  it('searches all courses once every course is unselected', async () => {
    const { fixture, search } = await mountRecipeSearch();
    await fixture.whenStable();

    clickCourse(fixture.nativeElement, 'main');
    await fixture.whenStable();
    clickCourse(fixture.nativeElement, 'main');
    await fixture.whenStable();

    expect(search).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
  });

  it('combines keywords and course', async () => {
    const { fixture, search } = await mountRecipeSearch();
    await fixture.whenStable();

    typeInto(inputByLabel(fixture.nativeElement, 'Keywords'), 'lemon');
    await fixture.whenStable();
    clickCourse(fixture.nativeElement, 'dessert');
    await fixture.whenStable();

    expect(search).toHaveBeenLastCalledWith({
      keywords: 'lemon',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['dessert'],
    });
  });

  it('shows only favorites without sending favorites to the repository', async () => {
    const { fixture, search, userFavorites } = await mountRecipeSearch();
    search.mockReturnValue(of([shakshuka, cheesecake]));
    vi.spyOn(userFavorites, 'favoriteIds').mockReturnValue(
      new Set([cheesecake.id]),
    );
    await fixture.whenStable();

    checkboxByLabel(fixture.nativeElement, 'Favorites only').click();
    await fixture.whenStable();

    expect(search).toHaveBeenLastCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('adds a recipe to favorites', async () => {
    const { fixture, search, userFavorites } = await mountRecipeSearch();
    search.mockReturnValue(of([shakshuka]));
    const addFavorite = vi
      .spyOn(userFavorites, 'addFavorite')
      .mockImplementation(() => undefined);
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'Add to favorites').click();
    await fixture.whenStable();

    expect(search).toHaveBeenCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
    expect(addFavorite).toHaveBeenCalledExactlyOnceWith('shakshuka');
  });

  it('removes a recipe from favorites', async () => {
    const { fixture, search, userFavorites } = await mountRecipeSearch();
    search.mockReturnValue(of([shakshuka]));
    vi.spyOn(userFavorites, 'favoriteIds').mockReturnValue(
      new Set([shakshuka.id]),
    );
    const removeFavorite = vi
      .spyOn(userFavorites, 'removeFavorite')
      .mockImplementation(() => undefined);
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'Remove from favorites').click();
    await fixture.whenStable();

    expect(search).toHaveBeenCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
    expect(removeFavorite).toHaveBeenCalledExactlyOnceWith('shakshuka');
  });

  it('assigns a recipe to the picked weekday', async () => {
    const { fixture, search, mealPlanStore } = await mountRecipeSearch();
    search.mockReturnValue(of([shakshuka]));
    vi.spyOn(mealPlanStore, 'canAdd').mockReturnValue(true);
    const assign = vi
      .spyOn(mealPlanStore, 'assign')
      .mockImplementation(() => undefined);
    await fixture.whenStable();

    buttonByText(fixture.nativeElement, 'add to meal plan').click();
    await fixture.whenStable();
    buttonByText(fixture.nativeElement, 'wednesday').click();
    await fixture.whenStable();

    expect(search).toHaveBeenCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
    expect(assign).toHaveBeenCalledExactlyOnceWith({
      weekday: 'wednesday',
      recipeId: 'shakshuka',
    });
  });

  it('disables add when the store says the recipe cannot be added', async () => {
    const { fixture, search, mealPlanStore } = await mountRecipeSearch();
    search.mockReturnValue(of([shakshuka]));
    const canAdd = vi.spyOn(mealPlanStore, 'canAdd').mockReturnValue(false);
    await fixture.whenStable();

    expect(search).toHaveBeenCalledWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: [],
    });
    expect(canAdd).toHaveBeenCalledWith({ recipeId: 'shakshuka' });
    expect(
      buttonByText(fixture.nativeElement, 'add to meal plan').disabled,
    ).toBe(true);
  });
});

async function mountRecipeSearch() {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: LocalStorage,
        useValue: {
          getItem: vi.fn().mockReturnValue(null),
          setItem: vi.fn(),
        },
      },
    ],
  });

  const recipeRepository = TestBed.inject(RecipeRepository);
  const search = vi
    .spyOn(recipeRepository, 'search')
    .mockReturnValue(of([shakshuka, cheesecake]));
  const userFavorites = TestBed.inject(UserFavorites);
  const mealPlanStore = TestBed.inject(MealPlanStore);

  const fixture = TestBed.createComponent(RecipeSearch);

  return { fixture, search, userFavorites, mealPlanStore };
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
