import { inject, Injectable, signal } from '@angular/core';
import { LocalStorage } from '../shared/local-storage';
import type { Weekday, WeekdayAssignments } from './meal-plan';

const MEAL_PLAN_STORAGE_KEY = 'whiskmate:meal-plan';

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
  private readonly _localStorage = inject(LocalStorage);
  private readonly _assignments = signal(this._load());

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
    this._assignments.update((assignments) => {
      const nextAssignments = {
        ...assignments,
        [weekday]: recipeId,
      };
      this._persist(nextAssignments);
      return nextAssignments;
    });
  }

  clear({ weekday }: { weekday: Weekday }): void {
    this._assignments.update((assignments) => {
      const nextAssignments = {
        ...assignments,
        [weekday]: null,
      };
      this._persist(nextAssignments);
      return nextAssignments;
    });
  }

  /** False when that recipe id is already on a weekday. */
  canAdd({ recipeId }: { recipeId: string }): boolean {
    return !Object.values(this._assignments()).includes(recipeId);
  }

  private _load(): WeekdayAssignments {
    const storedValue = this._localStorage.getItem(MEAL_PLAN_STORAGE_KEY);

    if (storedValue == null) {
      return emptyAssignments();
    }

    return JSON.parse(storedValue) as WeekdayAssignments;
  }

  private _persist(assignments: WeekdayAssignments): void {
    this._localStorage.setItem(
      MEAL_PLAN_STORAGE_KEY,
      JSON.stringify(assignments),
    );
  }
}
