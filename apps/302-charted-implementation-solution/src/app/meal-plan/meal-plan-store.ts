import { inject, Injectable, signal } from '@angular/core';
import { LocalStorage } from '../shared/local-storage';

const MEAL_PLAN_STORAGE_KEY = 'whiskmate:meal-plan';
const EMPTY_ASSIGNMENTS: WeekdayAssignments = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * Recipe ids per weekday, not recipe snapshots.
 * All seven days are present, including empty ones.
 * Not a calendar week tied to dates.
 */
export type WeekdayAssignments = Record<Weekday, string | null>;

@Injectable({ providedIn: 'root' })
export class MealPlanStore {
  private readonly _localStorage = inject(LocalStorage);
  private readonly _assignments = signal(this._load());

  assignments(): WeekdayAssignments {
    return this._assignments();
  }

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
    this._persist();
  }

  clear({ weekday }: { weekday: Weekday }): void {
    this._assignments.update((assignments) => ({
      ...assignments,
      [weekday]: null,
    }));
    this._persist();
  }

  canAdd({ recipeId }: { recipeId: string }): boolean {
    return !Object.values(this._assignments()).includes(recipeId);
  }

  private _load(): WeekdayAssignments {
    const storedValue = this._localStorage.getItem(MEAL_PLAN_STORAGE_KEY);

    if (storedValue == null) {
      return { ...EMPTY_ASSIGNMENTS };
    }

    try {
      return JSON.parse(storedValue) as WeekdayAssignments;
    } catch {
      return { ...EMPTY_ASSIGNMENTS };
    }
  }

  private _persist(): void {
    this._localStorage.setItem(
      MEAL_PLAN_STORAGE_KEY,
      JSON.stringify(this._assignments()),
    );
  }
}
