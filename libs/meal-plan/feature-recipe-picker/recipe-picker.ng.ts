import {
  Component,
  inject,
  input,
  output,
  resourceFromSnapshots,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { UserFavorites } from '@whiskmate/recipe/domain';
import { RecipeRepository } from '@whiskmate/recipe/infra';
import {
  createDefaultRecipeFilterCriteria,
  type Recipe,
  type RecipeFilterCriteria,
} from '@whiskmate/recipe/model';
import { RecipePreview } from '@whiskmate/recipe/feature-search';
import { NoRecipes, RecipeFilter } from '@whiskmate/recipe/search-ui';
import { Catalog } from '@whiskmate/shared/ui';

@Component({
  selector: 'wm-recipe-picker',
  imports: [
    Catalog,
    MatButton,
    NoRecipes,
    RecipeFilter,
    RecipePreview,
  ],
  template: `
    <div
      class="picker-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-picker-title"
    >
      <header class="picker-header">
        <h2 id="recipe-picker-title">Choose a recipe</h2>
        <button type="button" mat-button (click)="closed.emit()">Close</button>
      </header>

      <wm-recipe-filter [(filter)]="filter" />

      <wm-catalog>
        @if (filteredRecipes.hasValue()) {
          @if (filteredRecipes.value().length === 0) {
            <wm-no-recipes />
          } @else {
            @for (recipe of filteredRecipes.value(); track recipe.id) {
              <wm-recipe-preview
                [recipe]="recipe"
                [pickMode]="true"
                (recipePicked)="recipeSelected.emit($event)"
              />
            }
          }
        }
      </wm-catalog>
    </div>
  `,
  styles: `
    .picker-panel {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      max-height: min(90vh, 900px);
      overflow: auto;
      padding: 1rem 1rem 1.5rem;
      width: min(960px, 96vw);
    }

    .picker-header {
      align-items: center;
      display: flex;
      gap: 1rem;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .picker-header h2 {
      margin: 0;
      font-size: 1.35rem;
    }
  `,
})
export class RecipePicker {
  open = input(false);

  recipeSelected = output<Recipe>();
  closed = output<void>();

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
      return recipes.filter((recipe) => favoriteIds.has(recipe.id));
    }

    return recipes;
  }
}
