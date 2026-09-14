import { Route } from '@angular/router';
import { MealPlan } from './meal-plan/meal-plan.ng';
import { mealPlanRouterHelper } from './meal-plan/meal-plan.router-helper';
import { RecipeSearch } from './recipe/recipe-search.ng';
import { recipeRouterHelper } from './recipe/recipe.router-helper';

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
