import { Component, output } from '@angular/core';
import type { Weekday } from './meal-plan-store';

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
  selector: 'wm-weekday-picker',
  template: `
    @for (weekday of weekdays; track weekday) {
      <button type="button" (click)="select.emit(weekday)">
        {{ label(weekday) }}
      </button>
    }
    <button type="button" (click)="dismissed.emit()">Dismiss</button>
  `,
})
export class WeekdayPicker {
  // eslint-disable-next-line @angular-eslint/no-output-native -- design doc names this output `select`
  select = output<Weekday>();
  dismissed = output<void>();

  readonly weekdays = WEEKDAYS;

  label(weekday: Weekday): string {
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }
}
