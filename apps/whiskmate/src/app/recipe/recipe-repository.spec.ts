import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { RECIPES } from './recipe-data';
import { RecipeRepository } from './recipe-repository';

describe(RecipeRepository.name, () => {
  it('returns a recipe by id', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const repository = TestBed.inject(RecipeRepository);

    const result = await firstValueFrom(
      repository.findById({ id: shakshuka.id }),
    );

    expect(result).toEqual(shakshuka);
  });

  it('returns undefined for an unknown id', async () => {
    const repository = TestBed.inject(RecipeRepository);

    const result = await firstValueFrom(repository.findById({ id: 'missing' }));

    expect(result).toBeUndefined();
  });
});
