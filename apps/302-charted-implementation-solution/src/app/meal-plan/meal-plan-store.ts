import { Injectable } from '@angular/core';

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

/**
 * @deprecated 🚧 work in progress
 */
@Injectable({ providedIn: 'root' })
export class MealPlanStore {
  assignments(): WeekdayAssignments {
    throw new Error('🚧 work in progress');
  }

  assign(params: { weekday: Weekday; recipeId: string }): void {
    void params;
    throw new Error('🚧 work in progress');
  }

  clear(params: { weekday: Weekday }): void {
    void params;
    throw new Error('🚧 work in progress');
  }

  canAdd(params: { recipeId: string }): boolean {
    void params;
    throw new Error('🚧 work in progress');
  }
}
