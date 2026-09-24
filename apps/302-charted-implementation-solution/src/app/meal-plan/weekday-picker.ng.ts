import { Component, output } from '@angular/core';
import type { Weekday } from './meal-plan-store';

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  selector: 'wm-weekday-picker',
  template: `Weekday Picker - 🚧 work in progress`,
})
export class WeekdayPicker {
  // eslint-disable-next-line @angular-eslint/no-output-native -- design doc names this output `select`
  select = output<Weekday>();
}
