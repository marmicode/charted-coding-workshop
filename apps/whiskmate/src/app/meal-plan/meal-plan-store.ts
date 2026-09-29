import { Injectable } from '@angular/core';
import type { Weekday, WeekdayAssignments } from './meal-plan';

/**
 * @deprecated 🚧 work in progress
 */
@Injectable({ providedIn: 'root' })
export class MealPlanStore {
  /**
   * @deprecated 🚧 work in progress
   */
  assignments(): WeekdayAssignments {
    throw new Error(`🚧 work in progress`);
  }

  /**
   * Stores the recipe id on that weekday and replaces any id already there.
   * No confirmation.
   * Callers disable the action when `canAdd` is false, so the same id is not assigned twice.
   *
   * @deprecated 🚧 work in progress
   */
  assign(_params: { weekday: Weekday; recipeId: string }): void {
    throw new Error(`🚧 work in progress`);
  }

  /**
   * @deprecated 🚧 work in progress
   */
  clear(_params: { weekday: Weekday }): void {
    throw new Error(`🚧 work in progress`);
  }

  /**
   * False when that recipe id is already on a weekday.
   *
   * @deprecated 🚧 work in progress
   */
  canAdd(_params: { recipeId: string }): boolean {
    throw new Error(`🚧 work in progress`);
  }
}
