import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { RECIPES } from '../recipe/recipe-data';
import { MealPlanDay } from './meal-plan-day.ng';

describe(MealPlanDay.name, () => {
  it('shows the empty state', async () => {
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', null);
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Monday');
    expect(text).toContain('No recipe is planned');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it.todo('shows the recipe', async () => {
    const shakshuka = RECIPES.find((recipe) => recipe.id === 'shakshuka')!;
    const fixture = TestBed.createComponent(MealPlanDay);
    fixture.componentRef.setInput('weekday', 'monday');
    fixture.componentRef.setInput('recipe', shakshuka);
    await fixture.whenStable();

    const picture = fixture.nativeElement.querySelector('img');

    expect(fixture.nativeElement.textContent).toContain('Shakshuka');
    expect(picture?.getAttribute('src')).toBe(shakshuka.pictureUri);
    expect(picture?.getAttribute('alt')).toBe(shakshuka.name);
  });

  it.todo('emits remove', () => {
    // Mount `MealPlanDay` with Shakshuka.
    // Trigger remove.
    // Assert `remove` emitted.
  });
});
