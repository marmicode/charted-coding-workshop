import { describe, it } from 'vitest';
import { RecipeRepository } from './recipe-repository';

describe(RecipeRepository.name, () => {
  it.todo('returns a recipe by id', () => {
    // Arrange the catalog to include Shakshuka.
    // Call `findById({ id: shakshukaId })`.
    // Assert the result is Shakshuka.
  });

  it.todo('returns undefined for an unknown id', () => {
    // Call `findById({ id: 'missing' })`.
    // Assert the result is undefined.
  });
});
