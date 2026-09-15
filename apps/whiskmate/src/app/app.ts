import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { mealPlanRouterHelper } from '@whiskmate/meal-plan/feature';
import { recipeRouterHelper } from '@whiskmate/recipe/search-feature';
import { Navbar } from '@whiskmate/shared/ui';

@Component({
  imports: [Navbar, RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'wm-root',
  template: `<wm-navbar title="👨🏻‍🍳 Welcome to Whiskmate 🥘">
      <div class="actions" data-slot="actions">
        @for (link of links; track link.label) {
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
  links = [
    {
      label: 'SEARCH',
      route: recipeRouterHelper.search(),
    },
    {
      label: 'MEAL PLAN',
      route: mealPlanRouterHelper.mealPlan(),
    },
  ];
}
