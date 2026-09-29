import { Component, computed, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Card } from '../shared/card.ng';
import type { Recipe } from './recipe';
import { UserFavorites } from './user-favorites';

@Component({
  selector: 'wm-recipe-preview',
  imports: [Card, MatIcon, MatIconButton],
  template: `<wm-card
    [pictureUri]="recipe().pictureUri"
    [pictureAlt]="recipe().name"
  >
    <div class="recipe-header">
      <h2 data-testid="recipe-name">{{ recipe().name }}</h2>
      <button
        type="button"
        mat-icon-button
        data-testid="recipe-like-button"
        [attr.aria-pressed]="isFavorite()"
        [attr.aria-label]="
          isFavorite() ? 'Remove from favorites' : 'Add to favorites'
        "
        (click)="onLikeClick()"
      >
        <mat-icon>{{ isFavorite() ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
    </div>
  </wm-card>`,
  styles: `
    .recipe-header {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    h2 {
      flex: 1;
      font-size: 1.2em;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
    }

    button[aria-pressed='true'] mat-icon {
      color: #c2185b;
    }
  `,
})
export class RecipePreview {
  recipe = input.required<Recipe>();

  private _userFavorites = inject(UserFavorites);

  isFavorite = computed(() =>
    this._userFavorites.favoriteIds().has(this.recipe().id),
  );

  onLikeClick(): void {
    if (this.isFavorite()) {
      this._userFavorites.removeFavorite(this.recipe().id);
    } else {
      this._userFavorites.addFavorite(this.recipe().id);
    }
  }
}
