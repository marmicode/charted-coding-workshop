import { Route } from '@angular/router';
import { MealPlan, mealPlanRouterHelper } from '@whiskmate/meal-plan/feature-meal-plan';
import { RecipeSearch, recipeRouterHelper } from '@whiskmate/recipe/feature-search';
import { Admin } from './admin/admin.ng';
import { adminRouterHelper } from './admin/admin.router-helper';
import { adminGuard } from './authz/admin.guard';

export const appRoutes: Route[] = [
  {
    path: recipeRouterHelper.SEARCH_PATH,
    component: RecipeSearch,
  },
  {
    path: mealPlanRouterHelper.PATH,
    component: MealPlan,
  },
  {
    path: adminRouterHelper.PATH,
    component: Admin,
    canActivate: [adminGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: recipeRouterHelper.SEARCH_PATH,
  },
];
