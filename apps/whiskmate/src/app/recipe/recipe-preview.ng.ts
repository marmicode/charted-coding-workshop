import { Component, computed, inject, input, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WIP_STORAGE_KEY } from '../authz/wip.guard';
import type { Weekday } from '../meal-plan/meal-plan';
import { MealPlanStore } from '../meal-plan/meal-plan-store';
import { WeekdayPicker } from '../meal-plan/weekday-picker.ng';
import { LocalStorage } from '../shared/local-storage';
import { Card } from '../shared/card.ng';
import type { Recipe } from './recipe';
import { UserFavorites } from './user-favorites';

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
      @if (wipEnabled()) {
        <button
          type="button"
          [disabled]="!canAddRecipe()"
          (click)="openPicker()"
        >
          Add to meal plan
        </button>
      }
    </div>
    @if (pickerOpen()) {
      <wm-weekday-picker (select)="assignWeekday($event)" />
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
  private readonly _localStorage = inject(LocalStorage);

  protected readonly pickerOpen = signal(false);
  protected readonly wipEnabled = computed(
    () => this._localStorage.getItem(WIP_STORAGE_KEY) != null,
  );

  protected readonly canAddRecipe = computed(() =>
    this._mealPlanStore.canAdd({ recipeId: this.recipe().id }),
  );

  isFavorite = computed(() =>
    this._userFavorites.favoriteIds().has(this.recipe().id),
  );

  protected openPicker(): void {
    if (!this.canAddRecipe()) {
      return;
    }

    this.pickerOpen.set(true);
  }

  protected assignWeekday(weekday: Weekday): void {
    this._mealPlanStore.assign({
      weekday,
      recipeId: this.recipe().id,
    });
    this.pickerOpen.set(false);
  }

  onLikeClick(): void {
    if (this.isFavorite()) {
      this._userFavorites.removeFavorite(this.recipe().id);
    } else {
      this._userFavorites.addFavorite(this.recipe().id);
    }
  }
}
