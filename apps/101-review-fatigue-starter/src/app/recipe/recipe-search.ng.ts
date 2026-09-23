import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Catalog } from '../shared/catalog.ng';
import {
  RecipeFilterCriteria,
  createDefaultRecipeFilterCriteria,
} from './recipe-filter-criteria';
import { RecipeFilter } from './recipe-filter.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';
import { UserFavorites } from './user-favorites';

@Component({
  selector: 'wm-recipe-search',
  imports: [Catalog, RecipeFilter, RecipePreview],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)" />
    <wm-catalog>
      @if (recipes.hasValue()) {
        @for (recipe of filteredRecipes(); track recipe.id) {
          <wm-recipe-preview [recipe]="recipe" data-testid="recipe-preview" />
        }
      }
    </wm-catalog>
  `,
})
export class RecipeSearch {
  filter = signal<RecipeFilterCriteria>(createDefaultRecipeFilterCriteria());

  recipes = rxResource({
    params: () => this.filter(),
    stream: ({ params }) => this._recipeRepository.search(params),
  });

  filteredRecipes = computed(() => {
    if (!this.recipes.hasValue()) {
      return [];
    }

    const recipes = this.recipes.value();

    if (!this.filter().favoritesOnly) {
      return recipes;
    }

    const favoriteIds = this._userFavorites.favoriteIds();
    return recipes.filter((recipe) => favoriteIds.has(recipe.id));
  });

  private _userFavorites = inject(UserFavorites);
  private _recipeRepository = inject(RecipeRepository);
}
