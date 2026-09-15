import { Component, computed, inject, signal } from '@angular/core';
import { RECIPES } from '@whiskmate/recipe/infra';
import type { Recipe } from '@whiskmate/recipe/model';
import { MealPlanStore } from '@whiskmate/meal-plan/domain';
import { RecipePicker } from '@whiskmate/meal-plan/recipe-picker-feature';
import { MealPlanDay } from '@whiskmate/meal-plan/ui';
import type { Weekday } from '@whiskmate/shared/model';
import { WEEKDAYS_MONDAY_THROUGH_SUNDAY } from '@whiskmate/shared/model';

@Component({
  selector: 'wm-meal-plan',
  imports: [MealPlanDay, RecipePicker],
  template: `
    <div class="meal-plan-page">
      <h1>Meal Plan</h1>

      <div class="week">
        @for (day of planDays(); track day.weekday) {
          <wm-meal-plan-day
            [weekday]="day.weekday"
            [recipe]="day.recipe"
            (addRequested)="openPickerFor($event)"
            (removeRequested)="clearDay($event)"
            (moveRequested)="moveRecipe($event)"
          />
        }
      </div>
    </div>

    @if (pickerOpen()) {
      <button
        type="button"
        class="picker-backdrop"
        aria-label="Close recipe picker"
        (click)="closePicker()"
      >
        <span
          class="picker-panel-wrapper"
          role="presentation"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <wm-recipe-picker
            (recipeSelected)="assignPickedRecipe($event)"
            (closed)="closePicker()"
          />
        </span>
      </button>
    }
  `,
  styles: `
    .meal-plan-page {
      padding: 1.5rem 1rem 3rem;
    }

    h1 {
      margin: 0 0 1.5rem;
      text-align: center;
    }

    .week {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      justify-content: center;
    }

    .picker-backdrop {
      align-items: flex-start;
      background: rgba(0, 0, 0, 0.45);
      border: none;
      cursor: default;
      display: flex;
      inset: 0;
      justify-content: center;
      padding: 2rem 1rem;
      position: fixed;
      width: 100%;
      z-index: 1000;
    }

    .picker-panel-wrapper {
      cursor: auto;
      display: block;
    }
  `,
  host: {
    '(document:keydown.escape)': 'onEscape($event)',
  },
})
export class MealPlan {
  pickerOpen = signal(false);
  pickerWeekday = signal<Weekday | null>(null);

  private _mealPlanStore = inject(MealPlanStore);

  planDays = computed(() => {
    const slots = this._mealPlanStore.slots();
    return WEEKDAYS_MONDAY_THROUGH_SUNDAY.map((weekday) => ({
      weekday,
      recipe: this._recipeForSlot(slots.get(weekday) ?? null),
    }));
  });

  openPickerFor(weekday: Weekday): void {
    this.pickerWeekday.set(weekday);
    this.pickerOpen.set(true);
  }

  closePicker(): void {
    this.pickerOpen.set(false);
    this.pickerWeekday.set(null);
  }

  assignPickedRecipe(recipe: Recipe): void {
    const weekday = this.pickerWeekday();
    if (weekday == null) {
      return;
    }

    this._mealPlanStore.assign({ weekday, recipeId: recipe.id });
    this.closePicker();
  }

  clearDay(weekday: Weekday): void {
    this._mealPlanStore.clear({ weekday });
  }

  moveRecipe(params: { from: Weekday; to: Weekday }): void {
    this._mealPlanStore.move(params);
  }

  onEscape(event: Event): void {
    if (!this.pickerOpen()) {
      return;
    }

    event.preventDefault();
    this.closePicker();
  }

  private _recipeForSlot(recipeId: string | null): Recipe | null {
    if (recipeId == null) {
      return null;
    }

    return RECIPES.find((recipe) => recipe.id === recipeId) ?? null;
  }
}
