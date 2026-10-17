import { Injectable, type Provider } from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import {
  RecipeRepository,
  type RecipeRepositoryDef,
  type RecipeSearchParams,
} from './recipe-repository';

@Injectable({ providedIn: 'root' })
export class RecipeRepositoryFake implements RecipeRepositoryDef {
  private _recipes: Recipe[] = [];

  configure({ recipes }: { recipes: Recipe[] }): void {
    this._recipes = recipes;
  }

  search({
    keywords,
    maxIngredientCount,
    maxStepCount,
    courses,
  }: RecipeSearchParams): Observable<Recipe[]> {
    return defer(() => {
      const recipes = this._recipes.filter((recipe) => {
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
          () => (courses != null ? courses.includes(recipe.course) : true),
        ];

        return conditions.every((condition) => condition());
      });

      return of(recipes);
    });
  }

  findById({ id }: { id: string }): Observable<Recipe | undefined> {
    return defer(() => of(this._recipes.find((recipe) => recipe.id === id)));
  }
}

export function provideRecipeRepositoryFake(): Provider[] {
  return [
    RecipeRepositoryFake,
    { provide: RecipeRepository, useExisting: RecipeRepositoryFake },
  ];
}
