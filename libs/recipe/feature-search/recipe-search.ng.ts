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
  type Recipe,
  type RecipeFilterCriteria,
} from '@whiskmate/shared-recipe/model';
import { RecipePreview } from './recipe-preview.ng';
import { NoRecipes, RecipeFilter } from '@whiskmate/recipe/search-ui';
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
            <wm-recipe-preview [recipe]="recipe" />
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
}
