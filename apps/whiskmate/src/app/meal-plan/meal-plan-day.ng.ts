import { Component, input, output } from '@angular/core';
import type { Recipe } from '../recipe/recipe';
import type { Weekday } from './meal-plan';

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  selector: 'wm-meal-plan-day',
  template: `Meal Plan Day - 🚧 work in progress`,
})
export class MealPlanDay {
  weekday = input.required<Weekday>();
  recipe = input.required<Recipe | null>();
  remove = output<void>();
}
