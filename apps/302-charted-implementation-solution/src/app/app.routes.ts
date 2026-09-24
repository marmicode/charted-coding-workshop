import { Route } from '@angular/router';
import { Admin } from './admin/admin.ng';
import { adminRouterHelper } from './admin/admin.router-helper';
import { adminGuard } from './authz/admin.guard';
import { RecipeSearch } from './recipe/recipe-search.ng';
import { recipeRouterHelper } from './recipe/recipe.router-helper';

export const appRoutes: Route[] = [
  {
    path: recipeRouterHelper.SEARCH_PATH,
    component: RecipeSearch,
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
