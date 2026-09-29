import { Component, computed, input, output } from '@angular/core';
import type { Recipe } from '../recipe/recipe';
import type { Weekday } from './meal-plan';

const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  selector: 'wm-meal-plan-day',
  template: `<h2>{{ label() }}</h2>
    @if (recipe(); as plannedRecipe) {
      <p>{{ plannedRecipe.name }}</p>
      <img [src]="plannedRecipe.pictureUri" [alt]="plannedRecipe.name" />
    } @else {
      <p>No recipe is planned</p>
    }`,
})
export class MealPlanDay {
  readonly weekday = input.required<Weekday>();
  readonly recipe = input.required<Recipe | null>();
  readonly remove = output<void>();

  protected readonly label = computed(
    () => WEEKDAY_LABELS[this.weekday()],
  );
}
