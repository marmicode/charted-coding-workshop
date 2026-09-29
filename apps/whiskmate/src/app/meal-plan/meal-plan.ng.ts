import { Component, inject } from '@angular/core';
import type { Weekday } from './meal-plan';
import { MealPlanStore } from './meal-plan-store';

const WEEKDAYS: { weekday: Weekday; label: string }[] = [
  { weekday: 'monday', label: 'Monday' },
  { weekday: 'tuesday', label: 'Tuesday' },
  { weekday: 'wednesday', label: 'Wednesday' },
  { weekday: 'thursday', label: 'Thursday' },
  { weekday: 'friday', label: 'Friday' },
  { weekday: 'saturday', label: 'Saturday' },
  { weekday: 'sunday', label: 'Sunday' },
];

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  selector: 'wm-meal-plan',
  template: `<ul>
    @for (day of weekdays; track day.weekday) {
      <li>
        <h2>{{ day.label }}</h2>
        @if (assignments()[day.weekday] == null) {
          <p>No recipe is planned</p>
        }
      </li>
    }
  </ul>`,
})
export class MealPlan {
  private readonly _mealPlanStore = inject(MealPlanStore);

  protected readonly weekdays = WEEKDAYS;

  protected assignments() {
    return this._mealPlanStore.assignments();
  }
}
