import { Component, output } from '@angular/core';
import type { Weekday } from './meal-plan';

/**
 * @deprecated 🚧 work in progress
 */
@Component({
  selector: 'wm-weekday-picker',
  template: `Weekday Picker - 🚧 work in progress`,
})
export class WeekdayPicker {
  /**
   * Emitted only when the user confirms a weekday.
   * Dismissing the picker does not emit and does not call `assign`.
   */
  // eslint-disable-next-line @angular-eslint/no-output-native -- name fixed by the design doc
  select = output<Weekday>();
}
