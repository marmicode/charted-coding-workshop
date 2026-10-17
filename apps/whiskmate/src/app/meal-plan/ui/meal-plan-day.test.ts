import { TestBed } from '@angular/core/testing';
import { describe, it } from 'vitest';
import { MealPlanDay } from './meal-plan-day.ng';

describe(MealPlanDay.name, () => {
  it('shows the empty state', async () => {
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', null);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent ?? '';
    expect(text).toContain('Monday');
    expect(text.toLowerCase()).toContain('no recipe is planned');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('shows the recipe', async () => {
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', {
      name: 'Shakshuka',
      pictureUri: 'https://example.com/shakshuka.jpg',
    });
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent ?? '';
    const picture = fixture.nativeElement.querySelector('img');
    expect(text).toContain('Shakshuka');
    expect(picture?.getAttribute('src')).toBe(
      'https://example.com/shakshuka.jpg',
    );
  });

  it('emits remove', async () => {
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', {
      name: 'Shakshuka',
      pictureUri: 'https://example.com/shakshuka.jpg',
    });
    let emitted = 0;
    fixture.componentInstance.remove.subscribe(() => {
      emitted += 1;
    });
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button')?.click();
    await fixture.whenStable();

    expect(emitted).toBe(1);
  });
});
