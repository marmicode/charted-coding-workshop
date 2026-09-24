import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { adminRouterHelper } from './admin/admin.router-helper';
import { WIP_STORAGE_KEY } from './authz/wip.guard';
import { mealPlanRouterHelper } from './meal-plan/meal-plan.router-helper';
import { recipeRouterHelper } from './recipe/recipe.router-helper';
import { LocalStorage } from './shared/local-storage';
import { Navbar } from './shared/title.ng';

@Component({
  imports: [Navbar, RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'wm-root',
  template: `<wm-navbar title="👨🏻‍🍳 Welcome to Whiskmate 🥘">
      <div class="actions" data-slot="actions">
        @for (link of links(); track link.label) {
          <a [routerLink]="link.route" routerLinkActive="active">{{
            link.label
          }}</a>
        }
      </div>
    </wm-navbar>
    <router-outlet />`,
  styles: `
    a {
      color: white;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }

      &.active {
        font-style: italic;
        font-weight: bold;
      }
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin: 0 1em;
    }
  `,
})
export class App {
  private readonly _localStorage = inject(LocalStorage);

  links = computed(() => {
    const links = [
      {
        label: 'SEARCH',
        route: recipeRouterHelper.search(),
      },
    ];

    if (this._localStorage.getItem(WIP_STORAGE_KEY) != null) {
      links.push({
        label: 'MEAL PLAN',
        route: mealPlanRouterHelper.mealPlan(),
      });
    }

    links.push({
      label: 'ADMIN',
      route: adminRouterHelper.admin(),
    });

    return links;
  });
}
