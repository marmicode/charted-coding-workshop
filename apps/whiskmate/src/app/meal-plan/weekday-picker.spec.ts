import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import type { Weekday } from './meal-plan';
import { WeekdayPicker } from './weekday-picker.ng';

describe(WeekdayPicker.name, () => {
  it('emits the confirmed weekday', async () => {
    const fixture = TestBed.createComponent(WeekdayPicker);
    let selected: Weekday | undefined;
    fixture.componentInstance.select.subscribe((weekday) => {
      selected = weekday;
    });
    await fixture.whenStable();

    const friday = [...fixture.nativeElement.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'Friday',
    );
    friday?.click();

    expect(selected).toBe('friday');
  });

  it.todo('does not emit when dismissed', () => {
    // Mount `WeekdayPicker`.
    // Dismiss it without choosing a day.
    // Assert `select` did not emit.
  });
});
