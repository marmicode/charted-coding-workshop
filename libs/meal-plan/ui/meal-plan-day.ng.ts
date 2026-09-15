import { Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import type { Recipe } from '@whiskmate/shared-recipe/model';
import type { Weekday } from '@whiskmate/shared/model';
import { weekdayLabel } from '@whiskmate/shared/model';
import { Card, WeekdayPicker } from '@whiskmate/shared/ui';

export type MealPlanDayMove = { from: Weekday; to: Weekday };

@Component({
  selector: 'wm-meal-plan-day',
  imports: [Card, MatButton, WeekdayPicker],
  template: `
    <section class="day" [attr.aria-labelledby]="headingId()">
      <h2 [id]="headingId()">{{ label() }}</h2>

      @if (recipe(); as plannedRecipe) {
        <wm-card
          [pictureUri]="plannedRecipe.pictureUri"
          [pictureAlt]="plannedRecipe.name"
        >
          <p class="recipe-name" data-testid="meal-plan-recipe-name">
            {{ plannedRecipe.name }}
          </p>
          <div class="day-actions">
            <button
              type="button"
              mat-button
              data-testid="meal-plan-remove"
              (click)="removeRequested.emit(weekday())"
            >
              Remove
            </button>
            <wm-weekday-picker
              [exclude]="weekday()"
              (weekdaySelected)="
                moveRequested.emit({ from: weekday(), to: $event })
              "
            >
              Move
            </wm-weekday-picker>
          </div>
        </wm-card>
      } @else {
        <div class="empty-day">
          <p data-testid="meal-plan-empty-day">No recipe planned for this day.</p>
          <button
            type="button"
            mat-button
            data-testid="meal-plan-add-recipe"
            (click)="addRequested.emit(weekday())"
          >
            Add recipe
          </button>
        </div>
      }
    </section>
  `,
  styles: `
    .day {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
      width: 100%;
      max-width: 320px;
    }

    h2 {
      margin: 0;
      font-size: 1.25rem;
      text-align: center;
    }

    .recipe-name {
      margin: 0 0 0.75rem;
      font-weight: 600;
      text-align: center;
    }

    .day-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    .empty-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1.5rem 1rem;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .empty-day p {
      margin: 0;
      color: #666;
    }
  `,
})
export class MealPlanDay {
  weekday = input.required<Weekday>();
  recipe = input<Recipe | null>(null);

  addRequested = output<Weekday>();
  removeRequested = output<Weekday>();
  moveRequested = output<MealPlanDayMove>();

  headingId = computed(() => `meal-plan-${this.weekday()}`);

  label = computed(() => weekdayLabel(this.weekday()));
}
