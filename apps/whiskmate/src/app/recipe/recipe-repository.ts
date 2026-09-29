import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { Recipe } from './recipe';
import { RECIPES } from './recipe-data';
import {
  createDefaultRecipeFilterCriteria,
  RecipeFilterCriteria,
} from './recipe-filter-criteria';

export interface RecipeRepositoryDef {
  /**
   * Undefined when the id is not in the catalog.
   * Meal Plan renders that day as empty. The weekday slot stays.
   */
  findById(params: { id: string }): Observable<Recipe | undefined>;
  search(filter: RecipeFilterCriteria): Observable<Recipe[]>;
}

@Injectable({ providedIn: 'root' })
export class RecipeRepository implements RecipeRepositoryDef {
  /**
   * @deprecated 🚧 work in progress
   */
  findById(_params: { id: string }): Observable<Recipe | undefined> {
    throw new Error(`🚧 work in progress`);
  }

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
}
