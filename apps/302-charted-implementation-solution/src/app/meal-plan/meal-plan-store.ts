import { Injectable, signal } from '@angular/core';

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
  private readonly _assignments = signal<WeekdayAssignments>({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  });

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
  }

  clear({ weekday }: { weekday: Weekday }): void {
    this._assignments.update((assignments) => ({
      ...assignments,
      [weekday]: null,
    }));
  }

  canAdd({ recipeId }: { recipeId: string }): boolean {
    return !Object.values(this._assignments()).includes(recipeId);
  }
}
