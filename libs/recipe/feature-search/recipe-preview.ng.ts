import { Component, computed, inject, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserFavorites } from '@whiskmate/recipe/domain';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import { Card, WeekdayPicker } from '@whiskmate/shared/ui';
import type { Weekday } from '@whiskmate/shared/model';

@Component({
  selector: 'wm-recipe-preview',
  imports: [Card, MatButton, MatIcon, MatIconButton, WeekdayPicker],
  template: `@if (pickMode()) {
      <wm-card
        [pictureUri]="recipe().pictureUri"
        [pictureAlt]="recipe().name"
      >
        <div class="recipe-header">
          <h2 data-testid="recipe-name">{{ recipe().name }}</h2>
        </div>
        <button
          type="button"
          mat-button
          class="select-recipe"
          data-testid="recipe-pick-button"
          (click)="recipePicked.emit(recipe())"
        >
          Select
        </button>
      </wm-card>
    } @else {
      <wm-card
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
            <mat-icon>{{
              isFavorite() ? 'favorite' : 'favorite_border'
            }}</mat-icon>
          </button>
        </div>
        <wm-weekday-picker (weekdaySelected)="onAddToMealPlan($event)">
          <span data-testid="add-to-meal-plan">Add to meal plan</span>
        </wm-weekday-picker>
      </wm-card>
    }`,
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

    .select-recipe {
      display: block;
      margin: 0.5rem auto 0;
    }
  `,
})
export class RecipePreview {
  recipe = input.required<Recipe>();
  pickMode = input(false);

  recipePicked = output<Recipe>();

  private _userFavorites = inject(UserFavorites);
  private _mealPlanStore = inject(MealPlanStore);

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

  onAddToMealPlan(weekday: Weekday): void {
    this._mealPlanStore.assign({ weekday, recipeId: this.recipe().id });
  }
}
