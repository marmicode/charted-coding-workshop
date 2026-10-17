import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, vi } from 'vitest';
import { RecipeRepository } from '@whiskmate/recipe/infra';
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

describe(App.name, () => {
  it('redirects to the search page and searches all recipes', async () => {
    const { fixture, router, search } = await mountApp();

    await router.navigateByUrl('/');
    await fixture.whenStable();

    expect(router.url).toBe('/search');
    expect(search).toHaveBeenCalledExactlyOnceWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['starter', 'main', 'dessert'],
    });
    expect(fixture.nativeElement.textContent).toContain('Shakshuka');
  });

  it('searches all recipes again when coming back to the search page', async () => {
    const { fixture, router, search } = await mountApp();

    await router.navigateByUrl('/search');
    await fixture.whenStable();
    await router.navigateByUrl('/meal-plan');
    await fixture.whenStable();
    await router.navigateByUrl('/search');
    await fixture.whenStable();

    expect(search).toHaveBeenCalledTimes(2);
    expect(search).toHaveBeenNthCalledWith(1, {
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['starter', 'main', 'dessert'],
    });
    expect(search).toHaveBeenNthCalledWith(2, {
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['starter', 'main', 'dessert'],
    });
  });

  it('does not search recipes on the meal plan page', async () => {
    const { fixture, router, search, findById, mealPlanStore } =
      await mountApp();
    vi.spyOn(mealPlanStore, 'assignments').mockReturnValue({
      monday: 'shakshuka',
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    });

    await router.navigateByUrl('/meal-plan');
    await fixture.whenStable();

    expect(search).not.toHaveBeenCalled();
    expect(findById).toHaveBeenCalledExactlyOnceWith({ id: 'shakshuka' });
    expect(fixture.nativeElement.textContent).toContain('Shakshuka');
  });

  it('navigates from the meal plan to the search page through the navbar', async () => {
    const { fixture, router, search } = await mountApp();

    await router.navigateByUrl('/meal-plan');
    await fixture.whenStable();
    linkByText(fixture.nativeElement, 'SEARCH').click();
    await fixture.whenStable();

    expect(router.url).toBe('/search');
    expect(search).toHaveBeenCalledExactlyOnceWith({
      keywords: '',
      maxIngredientCount: null,
      maxStepCount: null,
      courses: ['starter', 'main', 'dessert'],
    });
  });
});

async function mountApp() {
  TestBed.configureTestingModule({
    providers: [
      provideRouter(appRoutes),
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
    .mockReturnValue(of([shakshuka]));
  const findById = vi
    .spyOn(recipeRepository, 'findById')
    .mockReturnValue(of(shakshuka));
  const mealPlanStore = TestBed.inject(MealPlanStore);
  const router = TestBed.inject(Router);

  const fixture = TestBed.createComponent(App);
  await fixture.whenStable();

  return { fixture, router, search, findById, mealPlanStore };
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
