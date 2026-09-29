import { Component, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { Recipe } from '../recipe/recipe';
import { RecipeRepository } from '../recipe/recipe-repository';
import type { Weekday, WeekdayAssignments } from './meal-plan';
import { MealPlanStore } from './meal-plan-store';

const WEEKDAYS: { weekday: Weekday; label: string }[] = [
  { weekday: 'monday', label: 'Monday' },
  { weekday: 'tuesday', label: 'Tuesday' },
  { weekday: 'wednesday', label: 'Wednesday' },
  { weekday: 'thursday', label: 'Thursday' },
  { weekday: 'friday', label: 'Friday' },
  { weekday: 'saturday', label: 'Saturday' },
  { weekday: 'sunday', label: 'Sunday' },
];

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  selector: 'wm-meal-plan',
  template: `<ul>
    @for (day of weekdays; track day.weekday) {
      <li>
        <h2>{{ day.label }}</h2>
        @if (recipeFor(day.weekday); as recipe) {
          <p>{{ recipe.name }}</p>
          <img [src]="recipe.pictureUri" [alt]="recipe.name" />
          <button type="button" (click)="clearDay(day.weekday)">Remove</button>
        } @else {
          <p>No recipe is planned</p>
        }
      </li>
    }
  </ul>`,
})
export class MealPlan {
  private readonly _mealPlanStore = inject(MealPlanStore);
  private readonly _recipeRepository = inject(RecipeRepository);

  protected readonly weekdays = WEEKDAYS;

  private readonly recipes = resource({
    params: () => this._mealPlanStore.assignments(),
    loader: ({ params }) => this._loadRecipes(params),
  });

  protected recipeFor(weekday: Weekday): Recipe | undefined {
    return this.recipes.value()?.[weekday];
  }

  protected clearDay(weekday: Weekday): void {
    this._mealPlanStore.clear({ weekday });
  }

  private async _loadRecipes(
    assignments: WeekdayAssignments,
  ): Promise<Record<Weekday, Recipe | undefined>> {
    const recipes = {} as Record<Weekday, Recipe | undefined>;

    for (const day of WEEKDAYS) {
      const id = assignments[day.weekday];
      recipes[day.weekday] =
        id == null
          ? undefined
          : await firstValueFrom(this._recipeRepository.findById({ id }));
    }

    return recipes;
  }
}
