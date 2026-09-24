import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ClockAdapter {
  now(): Date {
    return new Date();
  }
}
