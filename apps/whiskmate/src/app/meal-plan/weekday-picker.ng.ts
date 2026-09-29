import { Component, output } from '@angular/core';
import type { Weekday } from './meal-plan';

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
  selector: 'wm-weekday-picker',
  template: `@for (day of weekdays; track day.weekday) {
    <button type="button" (click)="select.emit(day.weekday)">
      {{ day.label }}
    </button>
  }`,
})
export class WeekdayPicker {
  /**
   * Emitted only when the user confirms a weekday.
   * Dismissing the picker does not emit and does not call `assign`.
   */
  // eslint-disable-next-line @angular-eslint/no-output-native -- name fixed by the design doc
  readonly select = output<Weekday>();

  protected readonly weekdays = WEEKDAYS;
}
