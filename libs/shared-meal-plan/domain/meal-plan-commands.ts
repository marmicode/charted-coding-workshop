import type { Weekday } from '@whiskmate/shared/model';

export interface MealPlanCommands {
  assign(params: { weekday: Weekday; recipeId: string }): void;
}
