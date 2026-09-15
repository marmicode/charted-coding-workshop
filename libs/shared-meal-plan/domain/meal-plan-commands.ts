import { InjectionToken } from '@angular/core';
import type { Weekday } from '@whiskmate/shared/model';

export interface MealPlanCommands {
  assign(params: { weekday: Weekday; recipeId: string }): void;
}

export const MEAL_PLAN_COMMANDS = new InjectionToken<MealPlanCommands>(
  'MEAL_PLAN_COMMANDS',
);
