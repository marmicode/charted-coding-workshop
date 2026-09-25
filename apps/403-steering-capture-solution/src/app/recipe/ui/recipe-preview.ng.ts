import { Component, input, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
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
        [attr.aria-pressed]="favorite()"
        [attr.aria-label]="
          favorite() ? 'Remove from favorites' : 'Add to favorites'
        "
        (click)="toggleFavorite.emit()"
      >
        <mat-icon>{{ favorite() ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
      <button type="button" [disabled]="!canAdd()" (click)="onAddToMealPlan()">
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
  favorite = input(false);
  canAdd = input(true);

  toggleFavorite = output<void>();
  addToMealPlan = output<Weekday>();

  pickerOpen = signal(false);

  onAddToMealPlan(): void {
    if (!this.canAdd()) {
      return;
    }

    this.pickerOpen.set(true);
  }

  onWeekday(weekday: Weekday): void {
    this.addToMealPlan.emit(weekday);
    this.pickerOpen.set(false);
  }
}
