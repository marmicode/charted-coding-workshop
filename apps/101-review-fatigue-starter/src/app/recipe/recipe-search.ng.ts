import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Catalog } from '../shared/catalog.ng';
import {
  RecipeFilterCriteria,
  createDefaultRecipeFilterCriteria,
} from './recipe-filter-criteria';
import { RecipeFilter } from './recipe-filter.ng';
import { RecipePreview } from './recipe-preview.ng';
import { RecipeRepository } from './recipe-repository';

@Component({
  selector: 'wm-recipe-search',
  imports: [Catalog, RecipeFilter, RecipePreview],
  template: `
    <wm-recipe-filter (filterChange)="filter.set($event)" />
    <wm-catalog>
      @if (recipes.hasValue()) {
        @for (recipe of recipes.value(); track recipe.id) {
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

  private _recipeRepository = inject(RecipeRepository);
}
