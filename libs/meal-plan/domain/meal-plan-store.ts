import { computed, inject, Service, signal } from '@angular/core';
import type { MealPlanCommands } from '@whiskmate/recipe/domain';
import { MealPlanRepository } from '@whiskmate/meal-plan/infra';
import {
  createEmptyMealPlanSlots,
  type MealPlanSlots,
} from '@whiskmate/meal-plan/model';
import type { Weekday } from '@whiskmate/shared/model';

@Service()
export class MealPlanStore implements MealPlanCommands {
  private _mealPlanRepository = inject(MealPlanRepository);
  private _slots = signal<MealPlanSlots>(createEmptyMealPlanSlots());

  slots = computed(() => this._slots());

  constructor() {
    void this._mealPlanRepository.load().then((slots) => {
      this._slots.set(slots);
    });
  }

  assign(params: { weekday: Weekday; recipeId: string }): void {
    this._slots.update((slots) => {
      const next = new Map(slots);
      next.set(params.weekday, params.recipeId);
      void this._mealPlanRepository.save(next);
      return next;
    });
  }

  clear(params: { weekday: Weekday }): void {
    this._slots.update((slots) => {
      const next = new Map(slots);
      next.set(params.weekday, null);
      void this._mealPlanRepository.save(next);
      return next;
    });
  }

  move(params: { from: Weekday; to: Weekday }): void {
    if (params.from === params.to) {
      return;
    }

    this._slots.update((slots) => {
      const next = new Map(slots);
      const fromRecipeId = next.get(params.from) ?? null;
      const toRecipeId = next.get(params.to) ?? null;
      next.set(params.from, toRecipeId);
      next.set(params.to, fromRecipeId);
      void this._mealPlanRepository.save(next);
      return next;
    });
  }
}
