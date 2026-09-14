import { Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import type { Weekday } from './weekday';
import { WEEKDAYS_MONDAY_THROUGH_SUNDAY, weekdayLabel } from './weekday';

@Component({
  selector: 'wm-weekday-picker',
  imports: [MatButton, MatMenu, MatMenuItem, MatMenuTrigger],
  template: `
    <button type="button" mat-button [matMenuTriggerFor]="weekdayMenu">
      <ng-content />
    </button>
    <mat-menu #weekdayMenu="matMenu">
      @for (weekday of selectableWeekdays(); track weekday) {
        <button
          type="button"
          mat-menu-item
          (click)="weekdaySelected.emit(weekday)"
        >
          {{ label(weekday) }}
        </button>
      }
    </mat-menu>
  `,
})
export class WeekdayPicker {
  exclude = input<Weekday | null>(null);
  weekdaySelected = output<Weekday>();

  selectableWeekdays = computed(() =>
    WEEKDAYS_MONDAY_THROUGH_SUNDAY.filter(
      (weekday) => weekday !== this.exclude(),
    ),
  );

  label = weekdayLabel;
}
