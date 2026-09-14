import { computed, inject, Service, signal } from '@angular/core';
import type { MealPlanSlots } from './meal-plan-slots';
import { createEmptyMealPlanSlots } from './meal-plan-slots';
import { MealPlanRepository } from './meal-plan-repository';
import type { Weekday } from './weekday';

@Service()
export class MealPlanStore {
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
