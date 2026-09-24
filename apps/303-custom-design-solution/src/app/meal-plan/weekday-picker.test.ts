import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import type { Weekday } from './meal-plan-store';
import { WeekdayPicker } from './weekday-picker.ng';

function buttonByLabel(
  root: ParentNode,
  label: string,
): HTMLButtonElement | undefined {
  return [...root.querySelectorAll('button')].find(
    (button) => button.textContent?.trim().toLowerCase() === label,
  );
}

describe(WeekdayPicker.name, () => {
  it('emits the confirmed weekday', async () => {
    const fixture = TestBed.createComponent(WeekdayPicker);
    let selected: Weekday | undefined;
    fixture.componentInstance.select.subscribe((weekday) => {
      selected = weekday;
    });
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'friday')?.click();
    await fixture.whenStable();

    expect(selected).toBe('friday');
  });

  it('does not emit when dismissed', async () => {
    const fixture = TestBed.createComponent(WeekdayPicker);
    let emitted = 0;
    fixture.componentInstance.select.subscribe(() => {
      emitted += 1;
    });
    await fixture.whenStable();

    buttonByLabel(fixture.nativeElement, 'dismiss')?.click();
    await fixture.whenStable();

    expect(emitted).toBe(0);
  });
});
