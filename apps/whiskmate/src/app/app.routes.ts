import { Route } from '@angular/router';
import {
  MealPlan,
  mealPlanRouterHelper,
} from '@whiskmate/meal-plan/feature-meal-plan';
import {
  RecipeSearch,
  recipeRouterHelper,
} from '@whiskmate/recipe/feature-search';

export const appRoutes: Route[] = [
  {
    path: recipeRouterHelper.SEARCH_PATH,
    component: RecipeSearch,
  },
  {
    path: mealPlanRouterHelper.MEAL_PLAN_PATH,
    component: MealPlan,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: recipeRouterHelper.SEARCH_PATH,
  },
];
