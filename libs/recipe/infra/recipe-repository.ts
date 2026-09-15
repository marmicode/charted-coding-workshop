import { Service } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import {
  createDefaultRecipeFilterCriteria,
  type RecipeFilterCriteria,
  type Recipe,
} from '@whiskmate/recipe/model';
import { RECIPES } from './recipe-data';

export interface RecipeRepositoryDef {
  search(filter: RecipeFilterCriteria): Observable<Recipe[]>;
  getById(params: { id: string }): Observable<Recipe | undefined>;
}

@Service()
export class RecipeRepository implements RecipeRepositoryDef {
  search(
    {
      keywords,
      maxIngredientCount,
      maxStepCount,
    }: RecipeFilterCriteria = createDefaultRecipeFilterCriteria(),
  ): Observable<Recipe[]> {
    return defer(() => {
      const recipes = RECIPES.filter((recipe) => {
        const conditions = [
          () =>
            keywords
              ? recipe.name.toLowerCase().includes(keywords.toLowerCase())
              : true,
          () =>
            maxIngredientCount != null
              ? recipe.ingredients.length <= maxIngredientCount
              : true,
          () =>
            maxStepCount != null ? recipe.steps.length <= maxStepCount : true,
        ];

        return conditions.every((condition) => condition());
      });

      return of(recipes);
    });
  }

  getById(params: { id: string }): Observable<Recipe | undefined> {
    return of(RECIPES.find((recipe) => recipe.id === params.id));
  }
}
