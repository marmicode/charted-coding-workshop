import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { Recipe } from './recipe';
import { RECIPES } from './recipe-data';
import {
  createDefaultRecipeFilterCriteria,
  RecipeFilterCriteria,
} from './recipe-filter-criteria';

export interface RecipeRepositoryDef {
  search(filter: RecipeFilterCriteria): Observable<Recipe[]>;

  /**
   * Undefined when the id is not in the catalog.
   * Meal Plan renders that day as empty. The weekday slot stays.
   */
  findById(params: { id: string }): Observable<Recipe | undefined>;
}

@Injectable({ providedIn: 'root' })
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

  /**
   * @deprecated 🚧 work in progress
   */
  findById(params: { id: string }): Observable<Recipe | undefined> {
    void params;
    throw new Error('🚧 work in progress');
  }
}
