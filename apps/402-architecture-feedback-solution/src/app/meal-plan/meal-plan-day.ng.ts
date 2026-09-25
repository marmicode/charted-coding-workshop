import { Component, computed, input, output } from '@angular/core';
import type { Recipe } from '../recipe/recipe';
import { Card } from '../shared/card.ng';
import type { Weekday } from './meal-plan-store';

@Component({
  selector: 'wm-meal-plan-day',
  imports: [Card],
  template: `
    <p>{{ label() }}</p>
    @if (recipe(); as planned) {
      <wm-card [pictureUri]="planned.pictureUri" [pictureAlt]="planned.name">
        {{ planned.name }}
      </wm-card>
      <button type="button" (click)="remove.emit()">Remove</button>
    } @else {
      <p>No recipe is planned</p>
    }
  `,
})
export class MealPlanDay {
  weekday = input.required<Weekday>();
  recipe = input.required<Recipe | null>();
  remove = output<void>();

  label = computed(() => {
    const weekday = this.weekday();
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  });
}
