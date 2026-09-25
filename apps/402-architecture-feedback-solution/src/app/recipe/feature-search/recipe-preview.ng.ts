import { Component, computed, inject, input, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserFavorites } from '@whiskmate/recipe/domain';
import { MealPlanStore } from '@whiskmate/shared-meal-plan/domain';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import type { Weekday } from '@whiskmate/shared/model';
import { Card, WeekdayPicker } from '@whiskmate/shared/ui';

@Component({
  selector: 'wm-recipe-preview',
  imports: [Card, MatIcon, MatIconButton, WeekdayPicker],
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
      <button
        type="button"
        [disabled]="!canAdd()"
        (click)="onAddToMealPlan()"
      >
        Add to meal plan
      </button>
    </div>
    @if (pickerOpen()) {
      <wm-weekday-picker
        (select)="onWeekday($event)"
        (dismissed)="pickerOpen.set(false)"
      />
    }
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
  private readonly _mealPlanStore = inject(MealPlanStore);

  pickerOpen = signal(false);

  isFavorite = computed(() =>
    this._userFavorites.favoriteIds().has(this.recipe().id),
  );

  canAdd = computed(() =>
    this._mealPlanStore.canAdd({ recipeId: this.recipe().id }),
  );

  onLikeClick(): void {
    if (this.isFavorite()) {
      this._userFavorites.removeFavorite(this.recipe().id);
    } else {
      this._userFavorites.addFavorite(this.recipe().id);
    }
  }

  onAddToMealPlan(): void {
    if (!this.canAdd()) {
      return;
    }

    this.pickerOpen.set(true);
  }

  onWeekday(weekday: Weekday): void {
    this._mealPlanStore.assign({
      weekday,
      recipeId: this.recipe().id,
    });
    this.pickerOpen.set(false);
  }
}
