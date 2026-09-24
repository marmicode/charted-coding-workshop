import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, it } from 'vitest';
import { RECIPES } from './recipe-data';
import { RecipeRepository } from './recipe-repository';

describe(RecipeRepository.name, () => {
  it.todo('returns a recipe by id', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.name === 'Shakshuka');
    if (shakshuka == null) {
      throw new Error('Catalog must include Shakshuka.');
    }
    const shakshukaId = shakshuka.id;
    const repository = TestBed.inject(RecipeRepository);

    const result = await firstValueFrom(
      repository.findById({ id: shakshukaId }),
    );

    expect(result).toEqual(shakshuka);
  });

  it.todo('returns undefined for an unknown id', async () => {
    const repository = TestBed.inject(RecipeRepository);

    const result = await firstValueFrom(
      repository.findById({ id: 'missing' }),
    );

    expect(result).toBeUndefined();
  });
});
