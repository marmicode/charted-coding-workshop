import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { recipeRouterHelper } from '../recipe/recipe.router-helper';
import { CurrentUser } from './user';

export const adminGuard: CanActivateFn = () => {
  const currentUser = inject(CurrentUser);
  const router = inject(Router);

  if (currentUser.isAdmin()) {
    return true;
  }

  return router.createUrlTree(recipeRouterHelper.search());
};
