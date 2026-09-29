import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { MealPlanDay } from './meal-plan-day.ng';

describe(MealPlanDay.name, () => {
  it.todo('shows the empty state', async () => {
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', null);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Monday');
    expect(text).toContain('No recipe is planned');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it.todo('shows the recipe', () => {
    // Mount `MealPlanDay` with Shakshuka.
    // Assert the name "Shakshuka" and Shakshuka's picture.
  });

  it.todo('emits remove', () => {
    // Mount `MealPlanDay` with Shakshuka.
    // Trigger remove.
    // Assert `remove` emitted.
  });
});
