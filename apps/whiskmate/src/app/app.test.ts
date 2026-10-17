import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, it } from 'vitest';
import {
  provideRecipeRepositoryFake,
  RecipeRepositoryFake,
} from '@whiskmate/recipe/infra';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { LocalStorage } from '@whiskmate/shared/infra';
import { App } from './app';
import { appRoutes } from './app.routes';

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

describe(App.name, () => {
  it('redirects to the search page and shows all recipes', async () => {
    const { fixture, router } = await mountApp();

    await router.navigateByUrl('/');
    await fixture.whenStable();

    expect(router.url).toBe('/search');
    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Shakshuka',
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('shows all recipes again when coming back to the search page', async () => {
    const { fixture, router } = await mountApp();

    await router.navigateByUrl('/search');
    await fixture.whenStable();
    await router.navigateByUrl('/meal-plan');
    await fixture.whenStable();
    await router.navigateByUrl('/search');
    await fixture.whenStable();

    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Shakshuka',
      'Lemon and Ricotta Cheesecake',
    ]);
  });

  it('shows planned recipes on the meal plan page', async () => {
    const { fixture, router } = await mountApp();
    TestBed.inject(MealPlanStore).assign({
      weekday: 'monday',
      recipeId: shakshuka.id,
    });

    await router.navigateByUrl('/meal-plan');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Shakshuka');
    expect(fixture.nativeElement.textContent).not.toContain(
      'Lemon and Ricotta Cheesecake',
    );
  });

  it('navigates from the meal plan to the search page through the navbar', async () => {
    const { fixture, router } = await mountApp();

    await router.navigateByUrl('/meal-plan');
    await fixture.whenStable();
    linkByText(fixture.nativeElement, 'SEARCH').click();
    await fixture.whenStable();

    expect(router.url).toBe('/search');
    expect(recipeNames(fixture.nativeElement)).toEqual([
      'Shakshuka',
      'Lemon and Ricotta Cheesecake',
    ]);
  });
});

async function mountApp() {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(appRoutes),
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
  const router = TestBed.inject(Router);

  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();

  return { fixture, router };
}

function recipeNames(root: HTMLElement): string[] {
  return [...root.querySelectorAll('[data-testid="recipe-name"]')].map(
    (el) => el.textContent?.trim() ?? '',
  );
}

function linkByText(root: HTMLElement, text: string): HTMLAnchorElement {
  const link = [...root.querySelectorAll('a')].find(
    (el) => el.textContent?.trim() === text,
  );
  if (link == null) {
    throw new Error(`Link "${text}" not found.`);
  }
  return link;
}
