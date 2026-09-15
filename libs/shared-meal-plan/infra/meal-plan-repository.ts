import { inject, Service } from '@angular/core';
import { LocalStorage } from '@whiskmate/shared/infra';
import {
  createEmptyMealPlanSlots,
  mealPlanSlotsToStored,
  storedToMealPlanSlots,
  type MealPlanSlots,
  type StoredMealPlanSlots,
} from '@whiskmate/shared-meal-plan/model';
import { WEEKDAYS_MONDAY_THROUGH_SUNDAY } from '@whiskmate/shared/model';

const MEAL_PLAN_STORAGE_KEY = 'whiskmate:meal-plan';

export interface MealPlanRepositoryDef {
  load(): Promise<MealPlanSlots>;
  save(slots: MealPlanSlots): Promise<void>;
}

@Service()
export class MealPlanRepository implements MealPlanRepositoryDef {
  private _localStorage = inject(LocalStorage);

  load(): Promise<MealPlanSlots> {
    return Promise.resolve(this._readSlots());
  }

  save(slots: MealPlanSlots): Promise<void> {
    this._localStorage.setItem(
      MEAL_PLAN_STORAGE_KEY,
      JSON.stringify(mealPlanSlotsToStored(slots)),
    );
    return Promise.resolve();
  }

  private _readSlots(): MealPlanSlots {
    const storedValue = this._localStorage.getItem(MEAL_PLAN_STORAGE_KEY);

    if (storedValue == null) {
      return createEmptyMealPlanSlots();
    }

    try {
      const parsed = JSON.parse(storedValue) as Partial<StoredMealPlanSlots>;
      const normalized = Object.fromEntries(
        WEEKDAYS_MONDAY_THROUGH_SUNDAY.map((weekday) => [
          weekday,
          parsed[weekday] ?? null,
        ]),
      ) as StoredMealPlanSlots;

      return storedToMealPlanSlots(normalized);
    } catch {
      return createEmptyMealPlanSlots();
    }
  }
}
