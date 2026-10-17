import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';
import { describe, it, vi } from 'vitest';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { RecipeRepository } from './recipe-repository';

const shakshuka: Recipe = {
  id: 'shakshuka',
  course: 'main',
  name: 'Shakshuka',
  description: null,
  pictureUri: 'https://example.com/shakshuka.jpg',
  ingredients: [],
  steps: [],
};

describe(RecipeRepository.name, () => {
  it('searches recipes with only the required courses param', async () => {
    const { repository, get } = setUpRecipeRepository();
    get.mockReturnValue(of([shakshuka]));

    const recipes = await firstValueFrom(
      repository.search({
        keywords: '',
        maxIngredientCount: null,
        maxStepCount: null,
        courses: ['main'],
      }),
    );

    expect(get).toHaveBeenCalledExactlyOnceWith('/api/recipes', {
      params: { courses: 'main' },
    });
    expect(recipes).toEqual([shakshuka]);
  });

  it('sends keywords, max ingredients and max steps', async () => {
    const { repository, get } = setUpRecipeRepository();

    await firstValueFrom(
      repository.search({
        keywords: 'shak',
        maxIngredientCount: 5,
        maxStepCount: 3,
        courses: ['main'],
      }),
    );

    expect(get).toHaveBeenCalledExactlyOnceWith('/api/recipes', {
      params: {
        keywords: 'shak',
        maxIngredientCount: 5,
        maxStepCount: 3,
        courses: 'main',
      },
    });
  });

  it('sends courses separated by commas', async () => {
    const { repository, get } = setUpRecipeRepository();

    await firstValueFrom(
      repository.search({
        keywords: '',
        maxIngredientCount: null,
        maxStepCount: null,
        courses: ['starter', 'dessert'],
      }),
    );

    expect(get).toHaveBeenCalledExactlyOnceWith('/api/recipes', {
      params: { courses: 'starter,dessert' },
    });
  });

  it('fetches a recipe by id', async () => {
    const { repository, get } = setUpRecipeRepository();
    get.mockReturnValue(of(shakshuka));

    const recipe = await firstValueFrom(
      repository.findById({ id: 'shakshuka' }),
    );

    expect(get).toHaveBeenCalledExactlyOnceWith('/api/recipes/shakshuka');
    expect(recipe).toEqual(shakshuka);
  });

  it('returns undefined when the recipe is not found', async () => {
    const { repository, get } = setUpRecipeRepository();
    get.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404 })),
    );

    const recipe = await firstValueFrom(repository.findById({ id: 'missing' }));

    expect(get).toHaveBeenCalledExactlyOnceWith('/api/recipes/missing');
    expect(recipe).toBeUndefined();
  });
});

function setUpRecipeRepository() {
  const get = vi
    .spyOn(TestBed.inject(HttpClient), 'get')
    .mockReturnValue(of([]));
  const repository = TestBed.inject(RecipeRepository);
  return { repository, get };
}
