import type { Weekday } from '@whiskmate/shared/model';
import { WEEKDAYS_MONDAY_THROUGH_SUNDAY } from '@whiskmate/shared/model';

/** Recipe ids per weekday, not recipe snapshots. */
export type MealPlanSlots = Map<Weekday, string | null>;

export function createEmptyMealPlanSlots(): MealPlanSlots {
  return new Map(
    WEEKDAYS_MONDAY_THROUGH_SUNDAY.map((weekday) => [weekday, null]),
  );
}

export type StoredMealPlanSlots = Record<Weekday, string | null>;

export function mealPlanSlotsToStored(
  slots: MealPlanSlots,
): StoredMealPlanSlots {
  return Object.fromEntries(slots) as StoredMealPlanSlots;
}

export function storedToMealPlanSlots(
  stored: StoredMealPlanSlots,
): MealPlanSlots {
  const slots = createEmptyMealPlanSlots();
  for (const weekday of WEEKDAYS_MONDAY_THROUGH_SUNDAY) {
    slots.set(weekday, stored[weekday] ?? null);
  }
  return slots;
}
