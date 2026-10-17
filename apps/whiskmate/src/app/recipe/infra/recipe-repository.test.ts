import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, it } from 'vitest';
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
  it('searches recipes', async () => {
    const { repository, httpTesting } = setUpRecipeRepository();

    const result = firstValueFrom(
      repository.search({
        keywords: 'shak',
        maxIngredientCount: 5,
        maxStepCount: 3,
        courses: ['main'],
      }),
    );

    const request = httpTesting.expectOne({
      method: 'POST',
      url: '/api/recipes/search',
    });
    expect(request.request.body).toEqual({
      keywords: 'shak',
      maxIngredientCount: 5,
      maxStepCount: 3,
      courses: ['main'],
    });
    request.flush([shakshuka]);

    expect(await result).toEqual([shakshuka]);
  });

  it('fetches a recipe by id', async () => {
    const { repository, httpTesting } = setUpRecipeRepository();

    const result = firstValueFrom(repository.findById({ id: 'shakshuka' }));

    httpTesting
      .expectOne({ method: 'GET', url: '/api/recipes/shakshuka' })
      .flush(shakshuka);

    expect(await result).toEqual(shakshuka);
  });

  it('returns undefined when the recipe is not found', async () => {
    const { repository, httpTesting } = setUpRecipeRepository();

    const result = firstValueFrom(repository.findById({ id: 'missing' }));

    httpTesting
      .expectOne({ method: 'GET', url: '/api/recipes/missing' })
      .flush(null, { status: 404, statusText: 'Not Found' });

    expect(await result).toBeUndefined();
  });
});

function setUpRecipeRepository() {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  return {
    repository: TestBed.inject(RecipeRepository),
    httpTesting: TestBed.inject(HttpTestingController),
  };
}
