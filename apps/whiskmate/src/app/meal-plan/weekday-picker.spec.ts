import { describe, it } from 'vitest';
import { WeekdayPicker } from './weekday-picker.ng';

describe(WeekdayPicker.name, () => {
  it.todo('emits the confirmed weekday', () => {
    // Mount `WeekdayPicker`.
    // Confirm Friday.
    // Assert `select` emitted `'friday'`.
  });

  it.todo('does not emit when dismissed', () => {
    // Mount `WeekdayPicker`.
    // Dismiss it without choosing a day.
    // Assert `select` did not emit.
  });
});
