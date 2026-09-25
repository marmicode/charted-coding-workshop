import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, map, of } from 'rxjs';
import type { Recipe } from '../recipe/recipe';
import { RecipeRepository } from '../recipe/recipe-repository';
import { MealPlanDay } from './meal-plan-day.ng';
import { MealPlanStore, type Weekday } from './meal-plan-store';

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
  template: `
    @for (day of days(); track day.weekday) {
      <wm-meal-plan-day
        [weekday]="day.weekday"
        [recipe]="day.recipe"
        (remove)="onRemove(day.weekday)"
      />
    }
  `,
})
export class MealPlan {
  private readonly _store = inject(MealPlanStore);
  private readonly _recipeRepository = inject(RecipeRepository);

  private readonly _resolvedDays = rxResource({
    params: () => this._store.assignments(),
    stream: ({ params }) =>
      forkJoin(
        WEEKDAYS.map((weekday) => {
          const recipeId = params[weekday];
          if (recipeId == null) {
            return of({ weekday, recipe: null as Recipe | null });
          }

          return this._recipeRepository.findById({ id: recipeId }).pipe(
            map((recipe) => ({
              weekday,
              recipe: recipe ?? null,
            })),
          );
        }),
      ),
  });

  days = computed(() => {
    if (this._resolvedDays.hasValue()) {
      return this._resolvedDays.value();
    }

    return WEEKDAYS.map((weekday) => ({
      weekday,
      recipe: null as Recipe | null,
    }));
  });

  onRemove(weekday: Weekday): void {
    this._store.clear({ weekday });
  }
}
