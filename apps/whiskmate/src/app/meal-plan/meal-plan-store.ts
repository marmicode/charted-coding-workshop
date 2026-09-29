import { Injectable, signal } from '@angular/core';
import type { Weekday, WeekdayAssignments } from './meal-plan';

const emptyAssignments = (): WeekdayAssignments => ({
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
});

@Injectable({ providedIn: 'root' })
export class MealPlanStore {
  private readonly _assignments = signal(emptyAssignments());

  assignments(): WeekdayAssignments {
    return this._assignments();
  }

  /**
   * Stores the recipe id on that weekday and replaces any id already there.
   * No confirmation.
   * Callers disable the action when `canAdd` is false, so the same id is not assigned twice.
   */
  assign({
    weekday,
    recipeId,
  }: {
    weekday: Weekday;
    recipeId: string;
  }): void {
    this._assignments.update((assignments) => ({
      ...assignments,
      [weekday]: recipeId,
    }));
  }

  clear({ weekday }: { weekday: Weekday }): void {
    this._assignments.update((assignments) => ({
      ...assignments,
      [weekday]: null,
    }));
  }

  /** False when that recipe id is already on a weekday. */
  canAdd({ recipeId }: { recipeId: string }): boolean {
    return !Object.values(this._assignments()).includes(recipeId);
  }
}
