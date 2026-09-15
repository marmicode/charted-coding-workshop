import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  MEAL_PLAN_COMMANDS,
  MealPlanStore,
} from '@whiskmate/shared-meal-plan/domain';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    { provide: MEAL_PLAN_COMMANDS, useExisting: MealPlanStore },
  ],
};
