import { Component, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import type { Recipe } from '../recipe/recipe';
import { RecipeRepository } from '../recipe/recipe-repository';
import type { Weekday, WeekdayAssignments } from './meal-plan';
import { MealPlanDay } from './meal-plan-day.ng';
import { MealPlanStore } from './meal-plan-store';

const WEEKDAYS: Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

@Component({
  selector: 'wm-meal-plan',
  imports: [MealPlanDay],
  template: `<ul>
    @for (weekday of weekdays; track weekday) {
      <li>
        <wm-meal-plan-day
          [weekday]="weekday"
          [recipe]="recipeFor(weekday) ?? null"
          (remove)="clearDay(weekday)"
        />
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

    for (const weekday of WEEKDAYS) {
      const id = assignments[weekday];
      recipes[weekday] =
        id == null
          ? undefined
          : await firstValueFrom(this._recipeRepository.findById({ id }));
    }

    return recipes;
  }
}
