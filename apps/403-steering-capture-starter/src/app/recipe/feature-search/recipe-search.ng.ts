import {
  Component,
  inject,
  resourceFromSnapshots,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserFavorites } from '@whiskmate/recipe/domain';
import { RecipeRepository } from '@whiskmate/recipe/infra';
import {
  createDefaultRecipeFilterCriteria,
  type RecipeFilterCriteria,
} from '@whiskmate/recipe/model';
import { RecipePreview } from '@whiskmate/recipe/ui';
import { NoRecipes, RecipeFilter } from '@whiskmate/recipe/ui-search';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import type { Weekday } from '@whiskmate/shared/model';
import { Catalog } from '@whiskmate/shared/ui';

@Component({
  selector: 'wm-recipe-search',
  imports: [Catalog, NoRecipes, RecipeFilter, RecipePreview],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)" />
    <wm-catalog>
      @if (filteredRecipes.hasValue()) {
        @if (filteredRecipes.value().length === 0) {
          <wm-no-recipes />
        } @else {
          @for (recipe of filteredRecipes.value(); track recipe.id) {
            <wm-recipe-preview
              [recipe]="recipe"
              [favorite]="isFavorite(recipe.id)"
              [canAdd]="canAdd(recipe.id)"
              (toggleFavorite)="onToggleFavorite(recipe.id)"
              (addToMealPlan)="onAddToMealPlan(recipe.id, $event)"
            />
          }
        }
      }
    </wm-catalog>
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilterCriteria>(createDefaultRecipeFilterCriteria());

  filteredRecipes = resourceFromSnapshots<Recipe[] | undefined>(() => {
    const snapshot = this._recipes.snapshot();

    if (snapshot.status === 'local' || snapshot.status === 'resolved') {
      return {
        status: snapshot.status,
        value: this._maybeFilterRecipes(snapshot.value),
      };
    }

    return snapshot;
  });

  private _userFavorites = inject(UserFavorites);
  private _recipeRepository = inject(RecipeRepository);
  private _mealPlanStore = inject(MealPlanStore);

  private _recipes = rxResource({
    params: () => this.filter(),
    stream: ({ params }) => this._recipeRepository.search(params),
  });

  private _maybeFilterRecipes(
    recipes: Recipe[] | undefined,
  ): Recipe[] | undefined {
    if (recipes != null && this.filter().favoritesOnly) {
      const favoriteIds = this._userFavorites.favoriteIds();
      return recipes?.filter((recipe) => favoriteIds.has(recipe.id));
    }

    return recipes;
  }

  isFavorite(recipeId: string): boolean {
    return this._userFavorites.favoriteIds().has(recipeId);
  }

  canAdd(recipeId: string): boolean {
    return this._mealPlanStore.canAdd({ recipeId });
  }

  onToggleFavorite(recipeId: string): void {
    if (this.isFavorite(recipeId)) {
      this._userFavorites.removeFavorite(recipeId);
    } else {
      this._userFavorites.addFavorite(recipeId);
    }
  }

  onAddToMealPlan(recipeId: string, weekday: Weekday): void {
    this._mealPlanStore.assign({ weekday, recipeId });
  }
}
