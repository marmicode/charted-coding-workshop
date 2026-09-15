import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { MealPlanStore } from '@whiskmate/meal-plan/domain';
import { MEAL_PLAN_COMMANDS } from '@whiskmate/recipe/domain';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    { provide: MEAL_PLAN_COMMANDS, useExisting: MealPlanStore },
  ],
};
