import { Route } from '@angular/router';
import { MealPlan, mealPlanRouterHelper } from '@whiskmate/meal-plan/feature';
import { RecipeSearch } from '@whiskmate/recipe/search-feature';
import { recipeRouterHelper } from '@whiskmate/recipe/search-feature';

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
