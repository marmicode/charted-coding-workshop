import { Route } from '@angular/router';
import { RecipeSearch } from './recipe/recipe-search.ng';
import { recipeRouterHelper } from './recipe/recipe.router-helper';

export const appRoutes: Route[] = [
  {
    path: recipeRouterHelper.SEARCH_PATH,
    component: RecipeSearch,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: recipeRouterHelper.SEARCH_PATH,
  },
];
